'use server';

import { z } from 'zod';
import { checkRateLimit } from '@/lib/ratelimit';

const schema = z.object({
  email: z.string().email('invalidEmail'),
});

export async function subscribeNewsletter(
  _prevState: unknown,
  formData: FormData,
) {
  const { success: allowed } = await checkRateLimit('subscribe', 5, 3600);
  if (!allowed) {
    return { success: false, error: 'rateLimited' };
  }

  const parsed = schema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'invalidEmail' };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (apiKey) {
    try {
      await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: parsed.data.email,
          listIds: [parseInt(process.env.BREVO_LIST_ID ?? '1', 10)],
          updateEnabled: true,
        }),
      });
    } catch {
      return { success: false, error: 'sendFailed' };
    }
  }

  return { success: true };
}
