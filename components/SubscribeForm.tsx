'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { subscribeNewsletter } from '@/app/[locale]/actions/subscribe';
import { Button } from './Button';

export function SubscribeForm() {
  const t = useTranslations('subscribePage');
  const [state, formAction, pending] = useActionState(subscribeNewsletter, null);

  return (
    <form action={formAction} className="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row">
      <label htmlFor="subscribe-email" className="sr-only">
        {t('label')}
      </label>
      <input
        id="subscribe-email"
        name="email"
        type="email"
        required
        placeholder={t('placeholder')}
        className="flex-1 border border-gris-brd bg-blanco px-4 py-3 text-sm text-negro outline-none transition focus:border-negro"
      />
      <Button type="submit" variant="primary" className="whitespace-nowrap" disabled={pending}>
        {pending ? '...' : t('submit')}
      </Button>
      {state?.success && (
        <p className="w-full text-center text-sm font-semibold text-dorado" aria-live="polite">
          {t('success')}
        </p>
      )}
      {state?.error && (
        <p className="w-full text-center text-sm font-semibold text-red-600" aria-live="assertive">
          {t(`errors.${state.error}`)}
        </p>
      )}
    </form>
  );
}
