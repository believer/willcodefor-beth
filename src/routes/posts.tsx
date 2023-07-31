import html from '@elysiajs/html'
import elements from '@kitajs/html'
import { desc, eq, like, or, sql } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { Post } from '../components/post'
import PostList from '../components/postList'
import { Posts } from '../components/posts'
import { db } from '../db'
import { postViews, posts } from '../db/schema'

export default function (app: Elysia) {
  return app.use(html()).group('/posts', (app) =>
    app
      .get(
        '',
        async ({ html, query }) => {
          if (query.sort === 'views') {
            const data = await db
              .select({
                createdAt: posts.createdAt,
                updatedAt: posts.updatedAt,
                slug: posts.slug,
                title: posts.title,
                tilId: posts.tilId,
                views: sql<number>`COUNT("post_views".id) as views`,
              })
              .from(posts)
              .innerJoin(postViews, eq(postViews.postId, posts.id))
              .groupBy(posts.id)
              .orderBy(desc(sql`views`))
              .all()

            return html(<Posts posts={data} sort="views" />)
          }

          let sortOrder = desc(posts.createdAt)

          if (query.sort === 'updatedAt') {
            sortOrder = desc(posts.updatedAt)
          }

          const data = await db
            .select({
              createdAt: posts.createdAt,
              updatedAt: posts.updatedAt,
              slug: posts.slug,
              title: posts.title,
              tilId: posts.tilId,
            })
            .from(posts)
            .orderBy(sortOrder)
            .all()

          return html(<Posts posts={data} sort={query.sort} />)
        },
        {
          query: t.Object({
            sort: t.Optional(
              t.Union([
                t.Literal('views'),
                t.Literal('updatedAt'),
                t.Literal('createdAt'),
              ])
            ),
          }),
        }
      )
      .post(
        '/search',
        async ({ html, body }) => {
          const data = await db
            .select({
              createdAt: posts.createdAt,
              updatedAt: posts.updatedAt,
              slug: posts.slug,
              title: posts.title,
              tilId: posts.tilId,
            })
            .from(posts)
            .where(
              or(
                like(posts.title, `%${body.search}%`),
                like(posts.body, `%${body.search}%`)
              )
            )
            .all()

          return html(<PostList posts={data} />)
        },
        {
          body: t.Object({
            search: t.String(),
          }),
        }
      )
      .get(
        '/:slug',
        async ({ html, params }) => {
          const post = await db
            .select({
              body: posts.body,
              createdAt: posts.createdAt,
              id: posts.id,
              tilId: posts.tilId,
              title: posts.title,
              updatedAt: posts.updatedAt,
            })
            .from(posts)
            .where(
              or(eq(posts.slug, params.slug), eq(posts.longSlug, params.slug))
            )
            .get()

          return html(<Post {...post} />)
        },
        { params: t.Object({ slug: t.String() }) }
      )
      .post(
        '/stats/:id',
        async ({ html, params, headers }) => {
          // Update views
          if (
            headers['user-agent'] &&
            !headers['user-agent'].includes('Googlebot')
          ) {
            await db
              .insert(postViews)
              .values({
                postId: Number(params.id),
                userAgent: headers['user-agent'],
              })
              .run()
          }

          // Get views
          const stats = await db
            .select({
              count: sql`COUNT(*)`,
            })
            .from(postViews)
            .where(eq(postViews.postId, Number(params.id)))
            .get()

          return html(<span>{stats.count}</span>)
        },
        { params: t.Object({ id: t.String() }) }
      )
      .get(
        '/next/:tilId',
        async ({ html, params }) => {
          const nextPost = await db
            .select({
              slug: posts.slug,
              title: posts.title,
            })
            .from(posts)
            .where(eq(posts.tilId, Number(params.tilId) + 1))
            .get()

          if (!nextPost) {
            return <div />
          }

          return html(
            <li>
              ← <a href={`/posts/${nextPost.slug}`}>{nextPost.title}</a>
            </li>
          )
        },
        {
          params: t.Object({ tilId: t.String() }),
        }
      )
      .get(
        '/previous/:tilId',
        async ({ html, params }) => {
          const previousPost = await db
            .select({
              slug: posts.slug,
              title: posts.title,
            })
            .from(posts)
            .where(eq(posts.tilId, Number(params.tilId) - 1))
            .get()

          if (!previousPost) {
            return <div />
          }

          return html(
            <li class="text-right">
              <a href={`/posts/${previousPost.slug}`}>{previousPost.title}</a> →
            </li>
          )
        },
        {
          params: t.Object({ tilId: t.String() }),
        }
      )
  )
}
