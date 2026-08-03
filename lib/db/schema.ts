import { pgTable, serial, text, boolean, integer, timestamp, pgEnum, unique } from 'drizzle-orm/pg-core';

export const articleTypeEnum = pgEnum('article_type', ['ensayo', 'opinion']);
export const articleLocaleEnum = pgEnum('article_locale', ['es', 'en']);

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull(),
  locale: articleLocaleEnum('locale').notNull(),
  type: articleTypeEnum('type').notNull().default('opinion'),
  category: text('category').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  author: text('author').notNull(),
  content: text('content').notNull(),
  featuredImage: text('featured_image'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  unique('articles_slug_locale_unique').on(t.slug, t.locale),
]);

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  filename: text('filename').notNull(),
  contentType: text('content_type').notNull(),
  size: integer('size').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Media = typeof media.$inferSelect;
