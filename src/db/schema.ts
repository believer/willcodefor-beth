import type { InferModel } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

export const postView = pgTable(
  'post_view',
  {
    id: serial('id').primaryKey().notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    userAgent: text('user_agent').notNull(),
    postId: integer('post_id')
      .default(0)
      .notNull()
      .references(() => post.id),
  },
  (table) => {
    return {
      postIdIdx: index('post_view_post_id_idx').on(table.postId),
    }
  }
)

export const post = pgTable(
  'post',
  {
    title: text('title').notNull(),
    body: text('body').notNull(),
    excerpt: text('excerpt').notNull(),
    slug: text('slug').notNull(),
    series: text('series'),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    id: serial('id').primaryKey().notNull(),
    longSlug: text('long_slug').notNull(),
    published: boolean('published').default(false).notNull(),
  },
  (table) => {
    return {
      postSlugUnique: unique('post_slug_unique').on(table.slug),
      postLongSlugUnique: unique('post_long_slug_unique').on(table.longSlug),
    }
  }
)

export type Post = InferModel<typeof post>
export type PostView = InferModel<typeof postView>
