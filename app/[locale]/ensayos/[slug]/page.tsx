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
    return { title: t('essaysPage.pageTitle'), description: t('metadata.description') };
  }

  const title = essay.seoTitle || essay.title;
  const description = essay.seoDescription || essay.description;

  // When the essay has a featured image, we set a full `openGraph`/`twitter`
  // object with that image and `type: 'article'`.
  //
  // When it doesn't, we omit `openGraph` entirely so the parent [locale]
  // layout's file-based opengraph-image.tsx is inherited as the preview image.
  // Defining `openGraph` without `images` would still override the file-based
  // convention, leaving the share preview with no image at all.
  //
  // Trade-off: without a featured image, `og:type` falls back to `website`
  // (from the layout) instead of `article`. This is acceptable — the preview
  // image is more important for CTR than the OG type, and admin-authored
  // essays are expected to have a featured image anyway.
  if (essay.featuredImage) {
    return {
      title: essay.seoTitle ? { absolute: title } : title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        images: [essay.featuredImage],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [essay.featuredImage],
      },
    };
  }

  return {
    title: essay.seoTitle ? { absolute: title } : title,
    description,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
  // No cross-locale `alternates.languages` here: admin-authored essays/opinion
  // pieces don't generally have a matching translation at the same slug in
  // the other locale, so we avoid sending Google an incorrect hreflang link.
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
