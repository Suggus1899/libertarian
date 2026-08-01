'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { sendContactMessage } from '@/app/[locale]/actions/contact';
import { Button } from './Button';

export function ContactForm() {
  const t = useTranslations('contactPage');
  const [state, formAction, pending] = useActionState(sendContactMessage, null);

  const fields = [
    { name: 'name', type: 'text', required: true },
    { name: 'org', type: 'text', required: false },
    { name: 'email', type: 'email', required: true },
    { name: 'country', type: 'text', required: false },
  ] as const;

  const serviceOptions = t.raw('serviceOptions') as string[];

  return (
    <form action={formAction} className="rounded-sm border border-border bg-gray-dark/40 p-8">
      <h3 className="text-2xl font-bold text-foreground">{t('formTitle')}</h3>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {fields.map(({ name, type, required }) => (
          <div key={name} className="space-y-2">
            <label
              htmlFor={name}
              className="text-xs font-bold uppercase tracking-widest text-foreground/70"
            >
              {t(`fields.${name}.label`)}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              required={required}
              placeholder={t(`fields.${name}.placeholder`)}
              className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-gold focus:outline-none"
            />
          </div>
        ))}

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor="service"
            className="text-xs font-bold uppercase tracking-widest text-foreground/70"
          >
            {t('fields.service.label')}
          </label>
          <select
            id="service"
            name="service"
            defaultValue=""
            className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none"
          >
            <option value="">{t('fields.service.placeholder')}</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor="message"
            className="text-xs font-bold uppercase tracking-widest text-foreground/70"
          >
            {t('fields.message.label')}
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder={t('fields.message.placeholder')}
            className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8">
        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          {pending ? '...' : t('submit')}
        </Button>
      </div>

      {state?.success && (
        <p className="mt-6 text-sm font-semibold text-gold">{t('success')}</p>
      )}
      {state?.error && (
        <p className="mt-6 text-sm font-semibold text-red-400">{state.error}</p>
      )}
    </form>
  );
}
