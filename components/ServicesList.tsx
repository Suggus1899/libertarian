import { useTranslations } from 'next-intl';
import { FileText, Megaphone, Target, Search, GraduationCap } from 'lucide-react';
import { Button } from './Button';

export function ServicesList() {
  const t = useTranslations('services.list');

  const services = [
    { key: 'platforms', icon: FileText },
    { key: 'marketing', icon: Megaphone },
    { key: 'consulting', icon: Target },
    { key: 'research', icon: Search },
    { key: 'training', icon: GraduationCap },
  ] as const;

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ key, icon: Icon }) => (
            <article
              key={key}
              className="flex flex-col rounded-sm border border-border bg-gray-dark/40 p-8 transition hover:border-gold/40"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {t(`${key}.title`)}
                </h3>
              </div>
              <p className="mt-6 flex-1 text-sm leading-relaxed text-foreground/70">
                {t(`${key}.description`)}
              </p>
              <div className="mt-8">
                <Button href="/contacto" variant="outline" className="text-xs">
                  {t('request', { defaultValue: 'Solicitar →' })}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
