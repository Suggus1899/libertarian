'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';
import { requireAdmin, destroySession } from '@/lib/auth';

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
  const published = formData.get('published') === 'on';

  if (!title || !locale || !type || !category || !description || !author || !content) {
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
      published,
    });
  } catch {
    return { error: 'Ya existe un artículo con ese slug. Elegí otro.' };
  }

  revalidatePath('/[locale]/ensayos', 'page');
  revalidatePath('/admin');
  redirect('/admin');
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
  const published = formData.get('published') === 'on';

  if (!title || !locale || !type || !category || !description || !author || !content) {
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
        published,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id));
  } catch {
    return { error: 'Ya existe un artículo con ese slug. Elegí otro.' };
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
