'use client';

import { useLocale, useTranslations } from 'next-intl';

export function LocaleSwitcher() {
  const t = useTranslations('nav');
  const currentLocale = useLocale();

  function onChange(nextLocale: string) {
    // Read from URL at click time — avoids stale closure / hydration mismatch
    const path = window.location.pathname;
    const match = path.match(/^\/(es|en)(\/.*)?$/);
    const locale = match?.[1] ?? 'es';
    const rest = match?.[2] ?? '/';
    window.location.href =
      `/${nextLocale}${rest === '/' ? '' : rest}` + window.location.search;
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
