import { html as elysiaHtml } from '@elysiajs/html'
import elements from '@kitajs/html'
import { desc, eq, like, or, sql } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { Post } from '../components/post'
import { Posts } from '../components/posts'
import { db } from '../db'
import { postViews, posts } from '../db/schema'

export default function (app: Elysia) {
  return app.use(elysiaHtml()).group('/posts', (app) =>
    app
      .get(
        '',
        async ({ html, query }) => {
          const commonValues = {
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            slug: posts.slug,
            title: posts.title,
            tilId: posts.tilId,
          }

          // TODO: Handle search and sort
          // Handle searches
          if (query.search) {
            const data = await db
              .select(commonValues)
              .from(posts)
              .where(
                or(
                  like(posts.title, `%${query.search}%`),
                  like(posts.body, `%${query.search}%`)
                )
              )
              .orderBy(desc(posts.createdAt))
              .all()

            return html(<Posts posts={data} search={query.search} />)
          }

          // Handled view sorting
          if (query.sort === 'views') {
            const data = await db
              .select({
                ...commonValues,
                views: sql<number>`COUNT("post_views".id) as views`,
              })
              .from(posts)
              .innerJoin(postViews, eq(postViews.postId, posts.id))
              .groupBy(posts.id)
              .orderBy(desc(sql`views`))
              .all()

            return html(<Posts posts={data} sort="views" />)
          }

          // Handle date sorting
          let sortOrder = desc(posts.createdAt)

          if (query.sort === 'updatedAt') {
            sortOrder = desc(posts.updatedAt)
          }

          const data = await db
            .select(commonValues)
            .from(posts)
            .orderBy(sortOrder)
            .all()

          return html(<Posts posts={data} sort={query.sort} />)
        },
        {
          query: t.Object({
            search: t.Optional(t.String()),
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
          const isProduction = process.env.NODE_ENV === 'production'
          const isGoogleBot = headers['user-agent']?.includes('Googlebot')

          // Update views
          if (isProduction && headers['user-agent'] && !isGoogleBot) {
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
        { params: t.Object({ id: t.Numeric() }) }
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
