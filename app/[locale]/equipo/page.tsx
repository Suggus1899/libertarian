import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Users } from 'lucide-react';
import { buildAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t('teamPage.pageTitle'),
    description: t('metadata.description'),
    alternates: buildAlternates('/equipo'),
  };
}

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const members = t.raw('team') as Array<{ name: string; role: string; bio: string }>;

  return (
    <>
      <PageHero
        eyebrowKey="teamPage.eyebrow"
        titleKey="teamPage.h1"
        introKey="teamPage.intro"
        bgText="TEAM"
      />
      <div className="gold-divider" />
      <section className="bg-blanco px-6 py-16 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            {members.map((member) => (
              <article
                key={member.name}
                className="flex gap-6 border border-gris-brd bg-gris-bg p-6 sm:p-8 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
              >
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center bg-negro text-blanco">
                  <Users className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-negro">
                    {member.name}
                  </h3>
                  <span className="mt-1 inline-block font-display text-[0.72rem] font-bold uppercase tracking-[2px] text-dorado">
                    {member.role}
                  </span>
                  <p className="mt-3 text-sm leading-[1.75] text-gris-med">
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
