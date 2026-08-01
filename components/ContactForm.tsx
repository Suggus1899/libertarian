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
    <form
      action={formAction}
      className="border border-gris-brd bg-gris-bg p-8 lg:p-12"
    >
      <h3 className="mb-7 font-display text-[1.6rem] font-bold text-negro">
        {t('formTitle')}
      </h3>

      <div className="grid gap-5 md:grid-cols-2">
        {fields.map(({ name, type, required }) => (
          <div key={name} className="flex flex-col gap-1.5">
            <label
              htmlFor={name}
              className="font-display text-[0.72rem] font-bold uppercase tracking-[2px] text-negro"
            >
              {t(`fields.${name}.label`)}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              required={required}
              placeholder={t(`fields.${name}.placeholder`)}
              className="border border-gris-brd bg-blanco px-4 py-3 font-sans text-[0.95rem] text-negro outline-none transition focus:border-negro"
            />
          </div>
        ))}

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label
            htmlFor="service"
            className="font-display text-[0.72rem] font-bold uppercase tracking-[2px] text-negro"
          >
            {t('fields.service.label')}
          </label>
          <select
            id="service"
            name="service"
            defaultValue=""
            className="border border-gris-brd bg-blanco px-4 py-3 font-sans text-[0.95rem] text-negro outline-none transition focus:border-negro"
          >
            <option value="">{t('fields.service.placeholder')}</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label
            htmlFor="message"
            className="font-display text-[0.72rem] font-bold uppercase tracking-[2px] text-negro"
          >
            {t('fields.message.label')}
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder={t('fields.message.placeholder')}
            className="min-h-[120px] resize-y border border-gris-brd bg-blanco px-4 py-3 font-sans text-[0.95rem] text-negro outline-none transition focus:border-negro"
          />
        </div>
      </div>

      <div className="mt-6">
        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          {pending ? t('sending') : t('submit')}
        </Button>
      </div>

      {state?.success && (
        <p
          className="mt-6 border border-dorado bg-dorado-p p-5 text-sm text-negro"
          aria-live="polite"
        >
          {t('success')}
        </p>
      )}
      {state?.error && (
        <p className="mt-6 text-sm font-semibold text-red-600" aria-live="assertive">
          {t(`errors.${state.error}`)}
        </p>
      )}
    </form>
  );
}
