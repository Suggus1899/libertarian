'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-blanco px-6 py-24 text-center">
      <span className="font-display text-[8rem] font-black leading-none text-gris-bg">
        {t('title')}
      </span>
      <h1 className="mt-6 font-display text-3xl font-black uppercase tracking-[1px] text-negro">
        {t('h1')}
      </h1>
      <p className="mt-4 max-w-md text-gris-med">{t('description')}</p>
      <div className="mt-8">
        <Link
          href="/"
          className="btn-p"
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
