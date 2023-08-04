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
    // til_id is updated by a trigger that sets the value
    // to the current max + 1. This is because the id column
    // can have gaps in the sequence.
    tilId: integer('til_id').default(0).notNull(),
  },
  (table) => {
    return {
      postSlugUnique: unique('post_slug_unique').on(table.slug),
      postLongSlugUnique: unique('post_long_slug_unique').on(table.longSlug),
      postTilIdUnique: unique('post_til_id_unique').on(table.tilId),
    }
  }
)

export type Post = InferModel<typeof post>
export type PostView = InferModel<typeof postView>
