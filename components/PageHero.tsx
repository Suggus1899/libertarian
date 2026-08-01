import { useTranslations } from 'next-intl';

interface PageHeroProps {
  eyebrowKey: string;
  titleKey: string;
  introKey: string;
}

export function PageHero({ eyebrowKey, titleKey, introKey }: PageHeroProps) {
  const t = useTranslations();

  return (
    <div className="relative overflow-hidden bg-gray-dark pt-32 pb-16 md:pt-48 md:pb-24">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="eyebrow">{t(eyebrowKey)}</div>
        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
          {t.rich(titleKey, {
            br: () => <br />,
            em: (chunks) => <em className="text-gold not-italic">{chunks}</em>,
          })}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/80">
          {t(introKey)}
        </p>
      </div>
    </div>
  );
}
