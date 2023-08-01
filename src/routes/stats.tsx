import html from '@elysiajs/html'
import elements from '@kitajs/html'
import { eq, gt, sql } from 'drizzle-orm'
import Elysia, { t } from 'elysia'
import { BaseHtml } from '../components/layout'
import PostList from '../components/postList'
import { db } from '../db'
import { postViews, posts } from '../db/schema'

export default function (app: Elysia) {
  return app.use(html()).group('/stats', (app) =>
    app
      .get(
        '',
        async ({ html, query }) => {
          return html(
            <BaseHtml noHeader>
              <div class="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div class="flex flex-col items-center justify-center text-center text-8xl font-bold">
                  <span hx-trigger="load" hx-get="/stats/total-views">
                    0
                  </span>
                  <div class="mt-2 text-sm font-normal uppercase text-gray-600 dark:text-gray-700">
                    Total views
                  </div>
                </div>
                <div class="flex flex-col items-center justify-center text-center text-8xl font-bold">
                  <span hx-trigger="load" hx-get="/stats/views-per-day">
                    0
                  </span>
                  <div class="mt-2 text-sm font-normal uppercase text-gray-600 dark:text-gray-700">
                    Views per day (average)
                  </div>
                </div>
              </div>
              <div class="mb-10">
                <h3 class="mb-4 font-semibold uppercase text-gray-500">
                  Most viewed
                </h3>
                <div
                  hx-trigger="load"
                  hx-get="/stats/most-viewed"
                  id="most-viewed"
                  hx-swap="outerHTML"
                />
              </div>
              <div class="mb-10">
                <h3 class="mb-4 font-semibold uppercase text-gray-500">
                  Most viewed today
                </h3>
                <div
                  hx-trigger="load"
                  hx-get="/stats/most-viewed-today"
                  hx-swap="outerHTML"
                />
              </div>
            </BaseHtml>
          )
        },
        {
          query: t.Object({
            page: t.Optional(t.Numeric()),
          }),
        }
      )
      .get('/total-views', async ({ html }) => {
        const { totalViews } = await db
          .select({
            totalViews: sql<number>`COUNT(*)`,
          })
          .from(postViews)
          .get()

        return html(<div>{totalViews}</div>)
      })
      .get('/views-per-day', async ({ html }) => {
        const { viewsPerDay } = await db
          .select({
            viewsPerDay: sql<number>`ROUND((COUNT(id) / (JULIANDAY(max("createdAt")) - JULIANDAY(min("createdAt")) + 1)), 2)`,
          })
          .from(postViews)
          .get()

        return html(<div>{viewsPerDay}</div>)
      })
      .get(
        '/most-viewed',
        async ({ html, query }) => {
          const page = query.page || 1
          const data = await db
            .select({
              views: sql<number>`COUNT(${postViews.id}) as count`,
              title: posts.title,
              slug: posts.slug,
              createdAt: posts.createdAt,
              tilId: posts.tilId,
              updatedAt: posts.updatedAt,
            })
            .from(postViews)
            .innerJoin(posts, eq(posts.id, postViews.postId))
            .groupBy(posts.id)
            .orderBy(sql`count DESC`)
            .limit(10 * page)
            .all()

          const postsWithViews = await db
            .select({
              postId: postViews.postId,
            })
            .from(postViews)
            .groupBy(postViews.postId)
            .all()

          const hasMore = postsWithViews.length > 10 * page

          return html(
            <div id="most-viewed">
              <PostList posts={data} sort="views" />
              <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {postsWithViews.length} posts with views
              </div>

              {hasMore ? (
                <div class="mt-8 flex justify-center">
                  <button
                    class="hover: rounded border border-gray-500 bg-gray-200 bg-opacity-25 px-4 py-2 text-center text-xs font-bold uppercase text-gray-500 no-underline transition-colors hover:border-brandBlue-500 hover:bg-brandBlue-300 hover:bg-opacity-25 hover:text-brandBlue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:dark:border-brandBlue-700 hover:dark:bg-brandBlue-500 hover:dark:text-brandBlue-100"
                    hx-get={`/stats/most-viewed?page=${page + 1}`}
                    hx-target="#most-viewed"
                  >
                    Load more
                  </button>
                </div>
              ) : null}
            </div>
          )
        },
        {
          query: t.Object({
            page: t.Optional(t.Numeric()),
          }),
        }
      )
      .get('/most-viewed-today', async ({ html }) => {
        const data = await db
          .select({
            views: sql<number>`COUNT(${postViews.id}) as count`,
            title: posts.title,
            slug: posts.slug,
            createdAt: posts.createdAt,
            tilId: posts.tilId,
            updatedAt: posts.updatedAt,
          })
          .from(postViews)
          .innerJoin(posts, eq(posts.id, postViews.postId))
          .where(gt(postViews.createdAt, sql`DATE('now', 'start of day')`))
          .groupBy(posts.id)
          .orderBy(sql`count DESC`)
          .all()

        return html(<PostList posts={data} sort="views" />)
      })
  )
}
