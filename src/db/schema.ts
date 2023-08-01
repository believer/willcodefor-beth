import { InferModel, relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable(
  'posts',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    body: text('body').notNull(),
    excerpt: text('excerpt').notNull(),
    slug: text('slug').notNull().unique(),
    longSlug: text('longSlug').notNull().unique(),
    series: text('series').default(sql`NULL`),
    published: integer('published', { mode: 'boolean' })
      .notNull()
      .default(false),
    tilId: integer('tilId', { mode: 'number' }),
    createdAt: text('createdAt')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updatedAt')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      tilIdIdx: index('til_id_idx').on(table.tilId),
      sludIdx: index('slug_idx').on(table.slug),
    }
  }
)

export const postsRelations = relations(posts, ({ many }) => ({
  views: many(postViews),
}))

export const postViews = sqliteTable('post_views', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  createdAt: text('createdAt')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
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
