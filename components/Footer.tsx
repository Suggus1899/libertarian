import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border bg-gray-dark">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="text-lg font-bold">Libertarian Forum</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/70">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-foreground/70 hover:text-gold">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-foreground/70 hover:text-gold">
                  {t('nav.nosotros')}
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-foreground/70 hover:text-gold">
                  {t('nav.servicios')}
                </Link>
              </li>
              <li>
                <Link href="/ensayos" className="text-foreground/70 hover:text-gold">
                  {t('nav.ensayos')}
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-foreground/70 hover:text-gold">
                  {t('nav.contacto')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <a
                  href="mailto:info@libertarianforum.org"
                  className="hover:text-gold"
                >
                  info@libertarianforum.org
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-foreground/50 md:flex-row">
          <span>{t('footer.copy')}</span>
          <span>{t('footer.motto')}</span>
        </div>
      </div>
    </footer>
  );
}
