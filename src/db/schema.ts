import { InferModel } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const postViews = pgTable(
  'PostView',
  {
    id: serial('id').primaryKey().notNull(),
    createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    postId: integer('post_id')
      .default(0)
      .notNull()
      .references(() => posts.id),
    userAgent: text('userAgent').notNull(),
  },
  (table) => {
    return {
      postIdIdx: index('PostView_postId_idx').on(table.postId),
    }
  }
)

export const posts = pgTable(
  'Post',
  {
    title: text('title').notNull(),
    body: text('body').notNull(),
    excerpt: text('excerpt').notNull(),
    slug: text('slug').notNull(),
    series: text('series'),
    createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    })
      .defaultNow()
      .notNull(),
    id: serial('id').primaryKey().notNull(),
    language: text('language').default('en').notNull(),
    longSlug: text('longSlug').notNull(),
    published: boolean('published').default(false).notNull(),
  },
  (table) => {
    return {
      slugUnique: unique('slug_unique').on(table.slug),
      longslugUnique: unique('longslug_unique').on(table.longSlug),
    }
  }
)

export const tag = pgTable(
  'Tag',
  {
    id: serial('id').primaryKey().notNull(),
    createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
    name: text('name').notNull(),
  },
  (table) => {
    return {
      nameKey: uniqueIndex('Tag_name_key').on(table.name),
    }
  }
)

export const postTag = pgTable(
  'Post_Tag',
  {
    id: serial('id').primaryKey().notNull(),
    postId: text('post_id').notNull(),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tag.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
  },
  (table) => {
    return {
      postIdIdx: index('Post_Tag_post_id_idx').on(table.postId),
      tagIdIdx: index('Post_Tag_tag_id_idx').on(table.tagId),
    }
  }
)

export type Post = InferModel<typeof posts>
export type PostViews = InferModel<typeof postViews>
export type Tag = InferModel<typeof postTag>
