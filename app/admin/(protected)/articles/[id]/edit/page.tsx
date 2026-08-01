import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';
import { updateArticle } from '../../../../actions';
import { ArticleForm } from '../../ArticleForm';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articleId = Number(id);

  const [article] = await db.select().from(articles).where(eq(articles.id, articleId));

  if (!article) {
    notFound();
  }

  const boundAction = updateArticle.bind(null, articleId);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-[1px] text-negro">
        Editar artículo
      </h1>
      <ArticleForm action={boundAction} article={article} />
    </div>
  );
}
