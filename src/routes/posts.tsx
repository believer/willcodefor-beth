import { html } from '@elysiajs/html'
import elements from '@kitajs/html'
import { and, desc, eq, like, or, sql } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { Post } from '../components/post'
import { Posts } from '../components/posts'
import { Series } from '../components/series'
import { db } from '../db'
import { postView, post } from '../db/schema'
import { BaseHtml } from '../components/layout'

export default function (app: Elysia) {
  return app.use(html()).group('/posts', (app) =>
    app
      .get(
        '',
        async ({ html, query }) => {
          const commonValues = {
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            slug: post.slug,
            title: post.title,
            id: post.id,
          }

          // TODO: Handle search and sort
          // Handle searches
          if (query.search) {
            const data = await db
              .select(commonValues)
              .from(post)
              .where(
                and(
                  or(
                    like(post.title, `%${query.search}%`),
                    like(post.body, `%${query.search}%`)
                  ),
                  eq(post.published, true)
                )
              )
              .orderBy(desc(post.id))

            return html(<Posts posts={data} search={query.search} />)
          }

          // Handled view sorting
          if (query.sort === 'views') {
            const data = await db
              .select({
                ...commonValues,
                views: sql<number>`COUNT(${postView.id}) as views`,
              })
              .from(post)
              .innerJoin(postView, eq(postView.postId, post.id))
              .groupBy(post.id)
              .orderBy(desc(sql`views`))
              .where(eq(post.published, true))

            return html(<Posts posts={data} sort="views" />)
          }

          // Handle date sorting
          let sortOrder = desc(post.id)

          if (query.sort === 'updatedAt') {
            sortOrder = desc(post.updatedAt)
          }

          const data = await db
            .select(commonValues)
            .from(post)
            .orderBy(sortOrder)
            .where(eq(post.published, true))

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
          const [foundPost] = await db
            .select({
              body: post.body,
              createdAt: post.createdAt,
              id: post.id,
              title: post.title,
              updatedAt: post.updatedAt,
              series: post.series,
              excerpt: post.excerpt,
            })
            .from(post)
            .where(
              or(eq(post.slug, params.slug), eq(post.longSlug, params.slug))
            )

          if (!foundPost) {
            return html(
              <BaseHtml>
                <div>
                  The post <strong>{params.slug}</strong> does not exist.{' '}
                  <a href="/posts">Go back to the posts page.</a>
                </div>
              </BaseHtml>
            )
          }

          return html(<Post {...foundPost} slug={params.slug} />)
        },
        { params: t.Object({ slug: t.String() }) }
      )
      .get(
        '/series/:series',
        async ({ html, params, query }) => {
          const series = await db
            .select({
              slug: post.slug,
              title: post.title,
            })
            .from(post)
            .where(
              and(eq(post.series, params.series), eq(post.published, true))
            )
            .orderBy(desc(post.id))

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
            await db.insert(postView).values({
              postId: params.id,
              userAgent: headers['user-agent'],
            })
          }

          // Get views
          const [stats] = await db
            .select({
              count: sql<number>`COUNT(*)`,
            })
            .from(postView)
            .where(eq(postView.postId, params.id))

          return html(<span>{stats.count}</span>)
        },
        { params: t.Object({ id: t.String() }) }
      )
      .get(
        '/next/:id',
        async ({ html, params }) => {
          const [nextPost] = await db
            .select({
              slug: post.slug,
              title: post.title,
            })
            .from(post)
            .where(and(eq(post.id, params.id + 1), eq(post.published, true)))

          if (!nextPost) {
            return <div />
          }

          return html(
            <li>
              ←{' '}
              <a
                href={`/posts/${nextPost.slug}`}
                hx-trigger="click, keyup[ctrlKey && key == 'n'] from:body"
              >
                {nextPost.title}
              </a>
            </li>
          )
        },
        {
          params: t.Object({ id: t.Numeric() }),
        }
      )
      .get(
        '/previous/:id',
        async ({ html, params }) => {
          const [previousPost] = await db
            .select({
              slug: post.slug,
              title: post.title,
            })
            .from(post)
            .where(and(eq(post.id, params.id - 1), eq(post.published, true)))

          if (!previousPost) {
            return <div />
          }

          return html(
            <li class="text-right">
              <a
                href={`/posts/${previousPost.slug}`}
                hx-trigger="click, keyup[ctrlKey && key == 'p'] from:body"
              >
                {previousPost.title}
              </a>{' '}
              →
            </li>
          )
        },
        {
          params: t.Object({ id: t.Numeric() }),
        }
      )
  )
}
