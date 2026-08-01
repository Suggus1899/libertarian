'use server';

import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  org: z.string().optional(),
  country: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function sendContactMessage(
  _prevState: unknown,
  formData: FormData,
) {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    org: formData.get('org'),
    country: formData.get('country'),
    service: formData.get('service'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'Invalid input';
    return { success: false, error: first };
  }

  const data = parsed.data;

  // TODO: wire real email provider (Resend / SendGrid / AWS SES / nodemailer).
  // For now we validate and log so the form is fully functional for testing.
  console.log('[contact]', data);

  return { success: true };
}
