import { useTranslations } from 'next-intl';
import { Button } from './Button';

export function EssaysList() {
  const t = useTranslations('essays');
  const items = t.raw('items');

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {items.map(
            (
              item: { category: string; title: string; description: string },
              index: number,
            ) => (
              <article
                key={item.title}
                className="flex flex-col overflow-hidden rounded-sm border border-border bg-gray-dark/40 transition hover:border-gold/40"
              >
                <div
                  className={`h-1 ${index % 2 === 0 ? 'bg-gold' : 'bg-foreground'}`}
                />
                <div className="flex flex-1 flex-col p-8">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      index % 2 === 0 ? 'text-gold' : 'text-foreground'
                    }`}
                  >
                    {item.category}
                  </span>
                  <h3 className="mt-4 text-xl font-bold leading-snug text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/70">
                    {item.description}
                  </p>
                  <div className="mt-6 text-xs font-bold uppercase tracking-widest text-foreground/40">
                    {t('meta')}
                  </div>
                </div>
              </article>
            ),
          )}
        </div>

        <div className="mt-16 rounded-sm border border-border bg-gray-dark/30 p-12 text-center">
          <div className="eyebrow justify-center">{t('soon.eyebrow')}</div>
          <h3 className="mt-4 text-2xl font-bold text-foreground">
            {t('soon.title')}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-foreground/70">
            {t('soon.description')}
          </p>
          <div className="mt-8">
            <Button href="/contacto">{t('soon.cta')}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
