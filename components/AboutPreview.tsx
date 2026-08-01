import { useTranslations } from 'next-intl';
import { Button } from './Button';
import { GraduationCap, Flame, Landmark, Handshake } from 'lucide-react';

export function AboutPreview() {
  const t = useTranslations('about');

  const values = [
    { key: 'rigor', icon: GraduationCap },
    { key: 'freedom', icon: Flame },
    { key: 'state', icon: Landmark },
    { key: 'network', icon: Handshake },
  ] as const;

  return (
    <section className="bg-gris-bg px-6 py-24 lg:px-14">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <div className="eyebrow">{t('eyebrow')}</div>
          <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] font-black uppercase leading-[1.15] tracking-[1px] text-negro">
            {t.rich('h2', {
              em: (chunks) => <em className="italic text-dorado">{chunks}</em>,
            })}
          </h2>
          <div className="gold-rule" />
          <p className="mt-6 text-base leading-[1.85] text-gris-med">
            {t.rich('p1', {
              strong: (chunks) => <strong className="font-semibold text-negro">{chunks}</strong>,
            })}
          </p>
          <p className="mt-4 text-base leading-[1.85] text-gris-med">
            {t.rich('p2', {
              strong: (chunks) => <strong className="font-semibold text-negro">{chunks}</strong>,
            })}
          </p>
          <p className="mt-4 text-base leading-[1.85] text-gris-med">{t('p3')}</p>
          <div className="mt-8">
            <Button href="/nosotros">{t('cta')}</Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {values.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex items-start gap-5 border border-gris-brd bg-blanco p-6 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-negro text-blanco">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-display text-[0.95rem] font-extrabold uppercase tracking-[1.5px] text-negro">
                  {t(`values.${key}.title`)}
                </h4>
                <p className="mt-1.5 text-[0.88rem] leading-[1.65] text-gris-med">
                  {t(`values.${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
