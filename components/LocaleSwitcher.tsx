'use client';

import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function LocaleSwitcher() {
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as string) ?? 'es';

  function onChange(nextLocale: string) {
    // next-intl 4.13.4 returns the pathname WITH the locale prefix (e.g. "/en"
    // instead of "/"). Strip it so router.replace doesn't double-nest the
    // locale (e.g. "/es/en").
    const stripped = pathname.replace(new RegExp(`^/${currentLocale}`), '') || '/';
    router.replace(stripped as Parameters<typeof router.replace>[0], { locale: nextLocale });
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
