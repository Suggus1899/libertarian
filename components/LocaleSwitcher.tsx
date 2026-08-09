'use client';

import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

export function LocaleSwitcher() {
  const t = useTranslations('nav');
  const currentLocale = useLocale();

  function onChange(nextLocale: string) {
    const withoutLocale =
      window.location.pathname.replace(new RegExp(`^/${currentLocale}`), '') || '/';
    window.location.href =
      `/${nextLocale}${withoutLocale === '/' ? '' : withoutLocale}` +
      window.location.search;
  }

  return (
    <div className="flex items-center">
      <label htmlFor="locale-switch" className="sr-only">
        {t('selectLanguage')}
      </label>
      <select
        id="locale-switch"
        value={currentLocale}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gris-brd bg-blanco px-2 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[1.5px] text-negro outline-none transition focus:border-negro"
      >
        <option value="es">{t('lang.es')}</option>
        <option value="en">{t('lang.en')}</option>
      </select>
    </div>
  );
}
