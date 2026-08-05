import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth';
import { TableOfContents } from '@/components/TableOfContents';
import { addHeadingIds } from '@/lib/heading-ids';

export default async function PreviewByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const articleId = Number(id);

  const [article] = await db.select().from(articles).where(eq(articles.id, articleId));
  if (!article) notFound();

  const dateStr = new Intl.DateTimeFormat(
    article.locale === 'es' ? 'es-ES' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  ).format(article.updatedAt ?? article.createdAt);

  return (
    <>
      <div className="border-b border-dorado bg-dorado/10 px-6 py-2 text-center text-xs font-semibold uppercase tracking-widest text-negro">
        Vista previa (desde DB) · {article.published ? 'Publicado' : 'Borrador'} · ID {article.id}
      </div>
      <article className="bg-blanco px-6 py-16 lg:px-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 border-b border-gris-brd pb-10">
            <span className="font-display text-[0.72rem] font-bold uppercase tracking-[2px] text-dorado">
              {article.category || 'Sin categoría'}
            </span>
            <h1 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-black leading-[1.15] text-negro">
              {article.title || 'Sin título'}
            </h1>
            <div className="mt-4 flex gap-4 text-sm text-gris-cla">
              <span>{dateStr}</span>
              <span>·</span>
              <span>{article.author || 'Sin autor'}</span>
            </div>
            {article.description && (
              <p className="mt-4 text-base text-gris-med">{article.description}</p>
            )}
          </div>
          {article.featuredImage && (
            <div className="relative mb-10 h-72 w-full overflow-hidden bg-gris-bg sm:h-96">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}
          <TableOfContents html={article.content} />
          <div
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-negro prose-p:text-gris-med prose-a:text-dorado"
            dangerouslySetInnerHTML={{ __html: addHeadingIds(article.content) }}
          />
        </div>
      </article>
    </>
  );
}
