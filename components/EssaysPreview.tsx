import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from './Button';

export function EssaysPreview() {
  const t = useTranslations('essays');
  const items = t.raw('items').slice(0, 3);

  return (
    <section className="bg-gray-dark py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="eyebrow justify-center">{t('eyebrow')}</div>
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold leading-tight md:text-4xl">
            {t.rich('h2', {
              em: (chunks) => <em className="text-gold not-italic">{chunks}</em>,
            })}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
            {t('description')}
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map((item: { category: string; title: string; description: string }, index: number) => (
            <Link
              key={item.title}
              href="/ensayos"
              className="group relative flex flex-col overflow-hidden rounded-sm border border-border bg-background transition hover:border-gold/40"
            >
              <div
                className={`h-1 ${index % 2 === 0 ? 'bg-gold' : 'bg-foreground'}`}
              />
              <div className="flex flex-1 flex-col p-6">
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    index % 2 === 0 ? 'text-gold' : 'text-foreground'
                  }`}
                >
                  {item.category}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-snug text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/70">
                  {item.description}
                </p>
                <div className="mt-6 text-xs font-bold uppercase tracking-widest text-foreground/40">
                  Libertarian Forum
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button href="/ensayos">{t('cta')}</Button>
        </div>
      </div>
    </section>
  );
}
