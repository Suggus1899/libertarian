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

  // TODO: store email in a mailing list provider (e.g. Mailchimp, Buttondown, ConvertKit)
  console.log('[subscribe]', parsed.data.email);

  return { success: true };
}
