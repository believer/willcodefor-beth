import { InferModel, relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

export const postView = pgTable(
  'post_view',
  {
    id: integer('id').primaryKey().notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    postId: integer('post_id').default(0).notNull(),
    // User Agent Parser fields
    userAgent: text('user_agent').notNull(),
    browserName: text('browser_name'),
    browserVersion: text('browser_version'),
    engineName: text('engine_name'),
    engineVersion: text('engine_version'),
    osName: text('os_name'),
    osVersion: text('os_version'),
    deviceVendor: text('device_vendor'),
    deviceModel: text('device_model'),
    deviceType: text('device_type'),
    cpuArchitecture: text('cpu_architecture'),
    isBot: boolean('is_bot').default(false).notNull(),
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
    id: integer('id').primaryKey().notNull(),
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

export const postRelations = relations(post, ({ many }) => ({
  postViews: many(postView),
}))

export const postViewRelations = relations(postView, ({ one }) => ({
  postId: one(post, {
    fields: [postView.postId],
    references: [post.id],
  }),
}))

export type Post = InferModel<typeof post>
export type PostView = InferModel<typeof postView>
