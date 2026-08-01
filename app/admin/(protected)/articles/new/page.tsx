import { createArticle } from '../../../actions';
import { ArticleForm } from '../ArticleForm';

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-black uppercase tracking-[1px] text-negro">
        Nuevo artículo
      </h1>
      <ArticleForm action={createArticle} />
    </div>
  );
}
