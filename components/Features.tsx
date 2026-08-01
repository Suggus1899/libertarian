import { useTranslations } from 'next-intl';
import { BookOpen, Scale, Globe } from 'lucide-react';

export function Features() {
  const t = useTranslations('features');

  const items = [
    { key: 'research', icon: BookOpen },
    { key: 'debate', icon: Scale },
    { key: 'advice', icon: Globe },
  ] as const;

  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="group relative border-l-2 border-gold/30 bg-gray-dark/30 p-8 transition hover:border-gold"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gold/60">
                    {t(`${item.key}.num`)}
                  </span>
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground">
                  {t(`${item.key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                  {t(`${item.key}.description`)}
                </p>
                <div className="gold-rule mt-6" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
