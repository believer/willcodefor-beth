import { html as elysiaHtml } from '@elysiajs/html'
import elements from '@kitajs/html'
import { and, desc, eq, like, or, sql } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { Post } from '../components/post'
import { Posts } from '../components/posts'
import { db } from '../db'
import { postViews, posts, Post as PostType } from '../db/schema'
import { Series } from '../components/series'

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
                and(
                  or(
                    like(posts.title, `%${query.search}%`),
                    like(posts.body, `%${query.search}%`)
                  ),
                  eq(posts.published, true)
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
              .where(eq(posts.published, true))
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
            .where(eq(posts.published, true))
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
              series: posts.series,
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
      .get(
        '/series/:series',
        async ({ html, params, query }) => {
          const series = await db
            .select({
              slug: posts.slug,
              title: posts.title,
            })
            .from(posts)
            .where(
              and(eq(posts.series, params.series), eq(posts.published, true))
            )
            .orderBy(desc(posts.createdAt))
            .all()

          return html(
            <Series posts={series} series={params.series} title={query.title} />
          )
        },
        {
          params: t.Object({ series: t.String() }),
          query: t.Object({
            title: t.String(),
          }),
        }
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
            .where(
              and(eq(posts.tilId, params.tilId + 1), eq(posts.published, true))
            )
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
          params: t.Object({ tilId: t.Numeric() }),
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
            .where(
              and(eq(posts.tilId, params.tilId - 1), eq(posts.published, true))
            )
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
          params: t.Object({ tilId: t.Numeric() }),
        }
      )
  )
}
