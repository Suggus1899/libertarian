import { useTranslations } from 'next-intl';
import { FileText, Megaphone, Target, Search, GraduationCap } from 'lucide-react';
import { Button } from './Button';

export function ServicesList() {
  const t = useTranslations('services');

  const services = [
    { key: 'platforms', icon: FileText },
    { key: 'marketing', icon: Megaphone },
    { key: 'consulting', icon: Target },
    { key: 'research', icon: Search },
    { key: 'training', icon: GraduationCap },
  ] as const;

  return (
    <section className="bg-blanco px-6 py-16 lg:px-14">
      <div className="mx-auto max-w-6xl">
        {services.map(({ key, icon: Icon }) => (
          <article
            key={key}
            className="mb-5 grid items-start gap-8 border border-gris-brd p-10 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] md:grid-cols-[80px_1fr]"
          >
            <div className="flex h-20 w-20 items-center justify-center bg-negro text-blanco">
              <Icon className="h-9 w-9" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-display text-[1.2rem] font-extrabold uppercase tracking-[1.5px] text-negro">
                {t(`list.${key}.title`)}
              </h3>
              <p className="mt-2.5 text-[0.95rem] leading-[1.8] text-gris-med">
                {t(`list.${key}.description`)}
              </p>
              <div className="mt-5">
                <Button href="/contacto" className="py-2.5 text-xs">
                  {t('request')}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
