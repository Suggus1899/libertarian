import { useTranslations } from 'next-intl';
import { FileText, Megaphone, Target } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from './Button';

export function ServicesPreview() {
  const t = useTranslations('services');

  const services = [
    { key: 'platforms', icon: FileText },
    { key: 'marketing', icon: Megaphone },
    { key: 'consulting', icon: Target },
  ] as const;

  return (
    <section className="bg-blanco px-6 py-24 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="section-hdr text-center">
          <div className="eyebrow eyebrow-center">{t('eyebrow')}</div>
          <h2>
            {t.rich('h2', {
              em: (chunks) => <em className="italic text-dorado">{chunks}</em>,
            })}
          </h2>
          <p className="mx-auto">{t('description')}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {services.map(({ key, icon: Icon }) => (
            <Link
              key={key}
              href="/servicios"
              className="group relative block cursor-pointer overflow-hidden border border-gris-brd p-10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
            >
              <span className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-dorado transition-transform duration-500 group-hover:scale-x-100" />
              <span className="absolute right-4 top-2 font-display text-7xl font-black leading-none text-negro/[0.04]">
                {t(`list.${key}.num`)}
              </span>
              <div className="relative z-10 mb-5 text-[1.6rem]">
                <Icon className="h-8 w-8 text-negro" strokeWidth={1.5} />
              </div>
              <h3 className="relative z-10 font-display text-[1.05rem] font-extrabold uppercase tracking-[1.5px] text-negro">
                {t(`list.${key}.title`)}
              </h3>
              <p className="relative z-10 mt-3 text-[0.88rem] leading-[1.72] text-gris-med">
                {t(`list.${key}.description`)}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button href="/servicios" variant="outline">
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  );
}
