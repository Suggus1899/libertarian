'use client';

import { useTranslations } from 'next-intl';

export function SkipLink() {
  const t = useTranslations('a11y');

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-dorado focus:px-4 focus:py-2 focus:text-negro focus:font-bold"
    >
      {t('skipToContent')}
    </a>
  );
}
