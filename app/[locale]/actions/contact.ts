'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/ratelimit';

const schema = z.object({
  name: z.string().min(2, 'nameRequired'),
  email: z.string().email('invalidEmail'),
  org: z.string().optional(),
  country: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, 'messageTooShort'),
});

export async function sendContactMessage(
  _prevState: unknown,
  formData: FormData,
) {
  const { success: allowed } = await checkRateLimit('contact', 3, 3600);
  if (!allowed) {
    return { success: false, error: 'rateLimited' };
  }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    org: formData.get('org'),
    country: formData.get('country'),
    service: formData.get('service'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'invalidInput';
    return { success: false, error: first };
  }

  const data = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (apiKey && from && to) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        subject: `Nuevo contacto desde Libertarian Forum: ${data.name}`,
        text: [
          `Nombre: ${data.name}`,
          `Email: ${data.email}`,
          `Organización: ${data.org || 'No especificada'}`,
          `País: ${data.country || 'No especificado'}`,
          `Servicio de interés: ${data.service || 'No especificado'}`,
          '',
          'Mensaje:',
          data.message,
        ].join('\n'),
      });
    } catch {
      return { success: false, error: 'sendFailed' };
    }
  } else {
    // Fallback for local development / missing env vars.
    console.log('[contact] Missing email config. Data:', data);
  }

  return { success: true };
}
