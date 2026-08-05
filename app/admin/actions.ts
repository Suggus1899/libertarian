'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';
import { requireAdmin, destroySession } from '@/lib/auth';
import { translateArticleFields } from '@/lib/translate';

export async function logout() {
  await destroySession();
  redirect('/admin/login');
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function isContentEmpty(html: string) {
  const hasMedia = /<(img|iframe|video)\b/i.test(html);
  const hasText = html.replace(/<[^>]*>/g, '').trim().length > 0;
  return !hasMedia && !hasText;
}

export async function createArticle(_prevState: unknown, formData: FormData) {
  await requireAdmin();

  const title = formData.get('title') as string;
  const slugInput = formData.get('slug') as string;
  const locale = formData.get('locale') as string;
  const type = formData.get('type') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const author = formData.get('author') as string;
  const content = formData.get('content') as string;
  const featuredImage = (formData.get('featuredImage') as string) || null;
  const seoTitle = (formData.get('seoTitle') as string) || null;
  const seoDescription = (formData.get('seoDescription') as string) || null;
  const published = formData.get('published') === 'on';

  if (!title || !locale || !type || !category || !description || !author || isContentEmpty(content)) {
    return { error: 'Completa todos los campos obligatorios.' };
  }

  const slug = slugify(slugInput || title);

  try {
    await db.insert(articles).values({
      slug,
      locale: locale as 'es' | 'en',
      type: type as 'ensayo' | 'opinion',
      category,
      description,
      title,
      author,
      content,
      featuredImage,
      seoTitle,
      seoDescription,
      published,
    });
  } catch {
    return { error: 'Ya existe un artículo con ese slug en ese idioma. Elegí otro.' };
  }

  // Auto-translate to the other locale if published and no translation exists
  if (published) {
    await autoTranslateToOtherLocale(slug, locale as 'es' | 'en');
  }

  revalidatePath('/[locale]/ensayos', 'page');
  revalidatePath('/admin');
  redirect('/admin');
}

/**
 * If no translation exists in the other locale, auto-translate and insert.
 * Best-effort: silently fails if LibreTranslate is unavailable.
 */
async function autoTranslateToOtherLocale(slug: string, sourceLocale: 'es' | 'en') {
  const targetLocale = sourceLocale === 'es' ? 'en' : 'es';

  // Check if translation already exists
  const [existing] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.locale, targetLocale)));
  if (existing) return;

  // Fetch the source article
  const [source] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.locale, sourceLocale)));
  if (!source) return;

  try {
    const translated = await translateArticleFields(
      {
        title: source.title,
        description: source.description,
        category: source.category,
        content: source.content,
        author: source.author,
      },
      sourceLocale,
      targetLocale
    );

    await db.insert(articles).values({
      slug: source.slug,
      locale: targetLocale,
      type: source.type,
      category: translated.category,
      title: translated.title,
      description: translated.description,
      author: translated.author,
      content: translated.content,
      featuredImage: source.featuredImage,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      published: true,
    });
  } catch (err) {
    // Non-blocking: article is published in source locale, translation is best-effort
    console.error('[auto-translate] failed for slug:', slug, err);
  }
}

export async function updateArticle(id: number, _prevState: unknown, formData: FormData) {
  await requireAdmin();

  const title = formData.get('title') as string;
  const slugInput = formData.get('slug') as string;
  const locale = formData.get('locale') as string;
  const type = formData.get('type') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const author = formData.get('author') as string;
  const content = formData.get('content') as string;
  const featuredImage = (formData.get('featuredImage') as string) || null;
  const seoTitle = (formData.get('seoTitle') as string) || null;
  const seoDescription = (formData.get('seoDescription') as string) || null;
  const published = formData.get('published') === 'on';

  if (!title || !locale || !type || !category || !description || !author || isContentEmpty(content)) {
    return { error: 'Completa todos los campos obligatorios.' };
  }

  const slug = slugify(slugInput || title);

  try {
    await db
      .update(articles)
      .set({
        slug,
        locale: locale as 'es' | 'en',
        type: type as 'ensayo' | 'opinion',
        category,
        description,
        title,
        author,
        content,
        featuredImage,
        seoTitle,
        seoDescription,
        published,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id));
  } catch {
    return { error: 'Ya existe un artículo con ese slug en ese idioma. Elegí otro.' };
  }

  // Auto-translate to the other locale if published and no translation exists
  if (published) {
    await autoTranslateToOtherLocale(slug, locale as 'es' | 'en');
  }

  revalidatePath('/[locale]/ensayos', 'page');
  revalidatePath('/admin');
  redirect('/admin');
}

export async function deleteArticle(id: number) {
  await requireAdmin();
  await db.delete(articles).where(eq(articles.id, id));
  revalidatePath('/[locale]/ensayos', 'page');
  revalidatePath('/admin');
}

/**
 * Auto-save a draft to the DB without publishing. Creates a new unpublished
 * article if `id` is undefined, or updates the existing one in-place.
 * Returns the article id so the client can keep saving to the same row.
 */
export async function saveDraft(
  id: number | undefined,
  data: {
    title: string;
    slug: string;
    locale: string;
    type: string;
    category: string;
    description: string;
    author: string;
    content: string;
    featuredImage: string;
    seoTitle: string;
    seoDescription: string;
  }
): Promise<{ id: number; error?: string }> {
  await requireAdmin();

  const slug = slugify(data.slug || data.title || 'borrador');

  const values = {
    slug,
    locale: (data.locale || 'es') as 'es' | 'en',
    type: (data.type || 'opinion') as 'ensayo' | 'opinion',
    category: data.category || 'Sin categoría',
    title: data.title || 'Sin título',
    description: data.description || '',
    author: data.author || '',
    content: data.content || '<p></p>',
    featuredImage: data.featuredImage || null,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    published: false,
    updatedAt: new Date(),
  };

  try {
    if (id) {
      await db.update(articles).set(values).where(eq(articles.id, id));
      return { id };
    }

    const [row] = await db.insert(articles).values(values).returning({ id: articles.id });
    return { id: row.id };
  } catch {
    return { id: id ?? 0, error: 'Error al guardar borrador.' };
  }
}

/**
 * Translates an article to the other locale and saves it as a new DB row.
 * If a translation with the same slug already exists in the target locale,
 * it updates that row instead of creating a duplicate.
 *
 * Returns { success, error, targetLocale, targetId }
 */
export async function translateArticle(
  id: number
): Promise<{ success?: boolean; error?: string; targetLocale?: string; targetId?: number }> {
  await requireAdmin();

  // Fetch the source article
  const [source] = await db.select().from(articles).where(eq(articles.id, id));
  if (!source) {
    return { error: 'Artículo no encontrado.' };
  }

  const targetLocale = source.locale === 'es' ? 'en' : 'es';

  // Check if a translation already exists
  const [existing] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, source.slug), eq(articles.locale, targetLocale)));

  try {
    const translated = await translateArticleFields(
      {
        title: source.title,
        description: source.description,
        category: source.category,
        content: source.content,
        author: source.author,
      },
      source.locale,
      targetLocale
    );

    if (existing) {
      // Update existing translation
      await db
        .update(articles)
        .set({
          title: translated.title,
          description: translated.description,
          category: translated.category,
          content: translated.content,
          type: source.type,
          published: source.published,
          featuredImage: source.featuredImage,
          updatedAt: new Date(),
        })
        .where(eq(articles.id, existing.id));

      revalidatePath('/[locale]/ensayos', 'page');
      revalidatePath('/admin');
      return { success: true, targetLocale, targetId: existing.id };
    } else {
      // Create new translation
      const [inserted] = await db
        .insert(articles)
        .values({
          slug: source.slug,
          locale: targetLocale,
          type: source.type,
          category: translated.category,
          title: translated.title,
          description: translated.description,
          author: translated.author,
          content: translated.content,
          featuredImage: source.featuredImage,
          seoTitle: source.seoTitle,
          seoDescription: source.seoDescription,
          published: source.published,
        })
        .returning({ id: articles.id });

      revalidatePath('/[locale]/ensayos', 'page');
      revalidatePath('/admin');
      return { success: true, targetLocale, targetId: inserted.id };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    return { error: `Error al traducir: ${msg}` };
  }
}
