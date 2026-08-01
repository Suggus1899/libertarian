'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-negro px-6 py-14 lg:px-14">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <div className="mb-4 text-xl font-black uppercase tracking-tight text-blanco">
            {t('nav.brand')}
          </div>
          <p className="max-w-sm text-[0.85rem] leading-[1.75] text-white/40">
            {t('footer.tagline')}
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-display text-[0.72rem] font-bold uppercase tracking-[3px] text-dorado">
            {t('footer.navigation')}
          </h4>
          <ul className="space-y-2 text-[0.85rem]">
            <li>
              <Link href="/" className="block text-white/45 transition hover:text-blanco">
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link href="/nosotros" className="block text-white/45 transition hover:text-blanco">
                {t('nav.nosotros')}
              </Link>
            </li>
            <li>
              <Link href="/servicios" className="block text-white/45 transition hover:text-blanco">
                {t('nav.servicios')}
              </Link>
            </li>
            <li>
              <Link href="/ensayos" className="block text-white/45 transition hover:text-blanco">
                {t('nav.ensayos')}
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="block text-white/45 transition hover:text-blanco">
                {t('nav.contacto')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-[0.72rem] font-bold uppercase tracking-[3px] text-dorado">
            {t('footer.contact')}
          </h4>
          <ul className="space-y-2 text-[0.85rem] text-white/45">
            <li>
              <a href="mailto:info@libertarianforum.org" className="transition hover:text-blanco">
                info@libertarianforum.org
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-blanco">
                {t('footer.social.instagram')}
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-blanco">
                {t('footer.social.twitter')}
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-blanco">
                {t('footer.social.linkedin')}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-[0.75rem] text-white/25 md:flex-row">
        <span>{t('footer.copy')}</span>
        <span>{t('footer.motto')}</span>
      </div>
    </footer>
  );
}
