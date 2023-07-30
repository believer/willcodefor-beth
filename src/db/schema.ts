import { InferModel, relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable('posts', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  body: text('body').notNull(),
  excerpt: text('excerpt').notNull(),
  slug: text('slug').notNull().unique(),
  longSlug: text('longSlug').notNull().unique(),
  series: text('series'),
  published: integer('published', { mode: 'boolean' }).notNull().default(false),
  tilId: integer('tilId', { mode: 'number' }),
  createdAt: text('createdAt').notNull().default('now()'),
  updatedAt: text('updatedAt').notNull().default('now()'),
})

export const postsRelations = relations(posts, ({ many }) => ({
  views: many(postViews),
}))

export const postViews = sqliteTable('post_views', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  createdAt: text('createdAt').notNull().default('now()'),
  userAgent: text('userAgent').notNull(),
  postId: integer('postId'),
})

export const postViewsRelations = relations(postViews, ({ one }) => ({
  post: one(posts, {
    fields: [postViews.postId],
    references: [posts.id],
  }),
}))

export type Post = InferModel<typeof posts>
export type PostView = InferModel<typeof postViews>
