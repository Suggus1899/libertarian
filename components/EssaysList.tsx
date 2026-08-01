import { useTranslations } from 'next-intl';
import { Button } from './Button';

export function EssaysList() {
  const t = useTranslations('essays');
  const items = t.raw('items');

  return (
    <section className="bg-blanco px-6 py-16 lg:px-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-2">
          {items.map(
            (
              item: { category: string; title: string; description: string },
            ) => (
              <article
                key={item.title}
                className="cursor-pointer overflow-hidden border border-gris-brd transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
              >
                <div className="border-b border-gris-brd bg-gris-bg p-8">
                  <span className="font-display text-[0.68rem] font-bold uppercase tracking-[2.5px] text-dorado">
                    {item.category}
                  </span>
                  <h3 className="mt-2.5 font-display text-[1.25rem] font-bold leading-[1.35] text-negro">
                    {item.title}
                  </h3>
                </div>
                <div className="p-8">
                  <p className="text-[0.9rem] leading-[1.72] text-gris-med">
                    {item.description}
                  </p>
                  <div className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[1px] text-gris-cla">
                    {t('meta')}
                  </div>
                </div>
              </article>
            ),
          )}
        </div>

        <div className="mt-16 rounded-sm border border-gris-brd bg-gris-bg p-12 text-center">
          <div className="eyebrow eyebrow-center">{t('soon.eyebrow')}</div>
          <h3 className="mt-4 font-display text-2xl font-bold text-negro">
            {t('soon.title')}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-gris-med">
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
