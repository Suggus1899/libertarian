import { pgTable, serial, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const articleTypeEnum = pgEnum('article_type', ['ensayo', 'opinion']);
export const articleLocaleEnum = pgEnum('article_locale', ['es', 'en']);

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  locale: articleLocaleEnum('locale').notNull(),
  type: articleTypeEnum('type').notNull().default('opinion'),
  category: text('category').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  author: text('author').notNull(),
  content: text('content').notNull(),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
