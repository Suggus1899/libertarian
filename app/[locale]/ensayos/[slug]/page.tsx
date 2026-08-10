import { notFound } from 'next/navigation';
import { after } from 'next/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/PageHero';
import { TableOfContents } from '@/components/TableOfContents';
import { ShareButtons } from '@/components/ShareButtons';
import { ReadingProgress } from '@/components/ReadingProgress';
import { addHeadingIds } from '@/lib/heading-ids';
import { getEssays } from '@/lib/essays';
import { buildCanonical } from '@/lib/seo';
import { incrementViews } from '@/app/admin/actions';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const allEssays = await getEssays(locale);
  const essay = allEssays.find((e) => e.slug === slug) ?? null;

  if (!essay) {
    const t = await getTranslations({ locale });
    return { title: t('essaysPage.pageTitle'), description: t('metadata.description') };
  }

  const title = essay.seoTitle || essay.title;
  const description = essay.seoDescription || essay.description;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const ogImage = essay.featuredImage
    ? essay.featuredImage
    : `${siteUrl}/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent(essay.category)}`;

  return {
    title: essay.seoTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: buildCanonical(locale, `/ensayos/${slug}`) },
    openGraph: {
      title,
      description,
      type: 'article',
      url: buildCanonical(locale, `/ensayos/${slug}`),
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
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
  const allEssays = await getEssays(locale);
  const essay = allEssays.find((e) => e.slug === slug) ?? null;

  if (!essay) {
    notFound();
  }

  after(() => incrementViews(slug, locale).catch(() => {}));

  const related = allEssays
    .filter((e) => e.category === essay.category && e.slug !== slug)
    .slice(0, 3);

  const canonicalUrl = buildCanonical(locale, `/ensayos/${slug}`);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: essay.title,
    description: essay.description,
    author: { '@type': 'Person', name: essay.author },
    publisher: {
      '@type': 'Organization',
      name: 'Libertarian Forum',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/icon`,
      },
    },
    datePublished: essay.publishedAt?.toISOString(),
    dateModified: (essay.updatedAt ?? essay.publishedAt)?.toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    inLanguage: locale === 'es' ? 'es-ES' : 'en-US',
    articleSection: essay.category,
    ...(essay.featuredImage && { image: [essay.featuredImage] }),
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gris-cla">
              <span>{essay.date}</span>
              <span>·</span>
              <span>{essay.author}</span>
              <span>·</span>
              <span>{essay.readingTime} min {locale === 'en' ? 'read' : 'de lectura'}</span>
            </div>
          </div>
          {essay.featuredImage && (
            <div className="relative mb-10 h-72 w-full overflow-hidden bg-gris-bg sm:h-96">
              <Image
                src={essay.featuredImage}
                alt={essay.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmNWY1ZjMiLz48L3N2Zz4="
              />
            </div>
          )}
          <TableOfContents html={essay.contentHtml} />
          <div
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-negro prose-p:text-gris-med prose-a:text-dorado"
            // Content is authored exclusively by the site's single trusted admin via the
            // Tiptap editor (or hardcoded in messages/*.json), never by public visitors.
            dangerouslySetInnerHTML={{ __html: addHeadingIds(essay.contentHtml) }}
          />
          <div className="mt-12 border-t border-gris-brd pt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/ensayos" className="btn-p">
              ← {t('essays.cta')}
            </Link>
            <ShareButtons url={canonicalUrl} title={essay.title} />
          </div>

          {related.length > 0 && (
            <div className="mt-16 border-t border-gris-brd pt-10">
              <h2 className="mb-6 text-[0.65rem] font-semibold uppercase tracking-[3px] text-gris-cla">
                {locale === 'en' ? 'Related articles' : 'Artículos relacionados'}
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={{ pathname: '/ensayos/[slug]', params: { slug: r.slug } } as Parameters<typeof Link>[0]['href']}
                    className="group block border border-gris-brd p-5 transition hover:border-negro"
                  >
                    <span className="text-[0.6rem] font-bold uppercase tracking-[2px] text-dorado">{r.category}</span>
                    <h3 className="mt-2 text-sm font-semibold leading-[1.4] text-negro group-hover:text-dorado transition-colors">
                      {r.title}
                    </h3>
                    <p className="mt-1.5 text-[0.7rem] text-gris-cla">{r.author} · {r.readingTime} min</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
