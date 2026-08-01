import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/PageHero';
import { getEssayBySlug } from '@/lib/essays';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const essay = await getEssayBySlug(locale, slug);

  if (!essay) {
    return { title: t('metadata.title'), description: t('metadata.description') };
  }

  const title = essay.seoTitle || `${t('metadata.title')} — ${essay.title}`;
  const description = essay.seoDescription || essay.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: essay.featuredImage ? [essay.featuredImage] : undefined,
    },
  };
}

export default async function EssayDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const essay = await getEssayBySlug(locale, slug);

  if (!essay) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrowKey="essaysPage.eyebrow"
        titleKey="essaysPage.h1"
        introKey="essaysPage.intro"
        bgText="ESSAY"
      />
      <div className="gold-divider" />
      <article className="bg-blanco px-6 py-16 lg:px-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 border-b border-gris-brd pb-10">
            <span className="font-display text-[0.72rem] font-bold uppercase tracking-[2px] text-dorado">
              {essay.category}
            </span>
            <h1 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-black leading-[1.15] text-negro">
              {essay.title}
            </h1>
            <div className="mt-4 flex gap-4 text-sm text-gris-cla">
              <span>{essay.date}</span>
              <span>·</span>
              <span>{essay.author}</span>
            </div>
          </div>
          {essay.featuredImage && (
            <div className="relative mb-10 h-72 w-full overflow-hidden bg-gris-bg sm:h-96">
              <Image src={essay.featuredImage} alt="" fill unoptimized className="object-cover" />
            </div>
          )}
          <div
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-negro prose-p:text-gris-med prose-a:text-dorado"
            // Content is authored exclusively by the site's single trusted admin via the
            // Tiptap editor (or hardcoded in messages/*.json), never by public visitors.
            dangerouslySetInnerHTML={{ __html: essay.contentHtml }}
          />
          <div className="mt-12 border-t border-gris-brd pt-10">
            <Link href="/ensayos" className="btn-p">
              ← {t('essays.cta')}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
