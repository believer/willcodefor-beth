import html from '@elysiajs/html'
import elements from '@kitajs/html'
import { eq, gt, gte, sql } from 'drizzle-orm'
import Elysia, { t } from 'elysia'
import userAgentParser from 'ua-parser-js'
import { DataList } from '../components/datalist'
import { BaseHtml } from '../components/layout'
import PostList from '../components/postList'
import { db } from '../db'
import { postViews, posts } from '../db/schema'

export default function (app: Elysia) {
  return app.use(html()).group('/stats', (app) =>
    app
      .get('', async ({ html }) => {
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
            </div>
            <div
              class="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2"
              hx-get="/stats/user-agent"
              hx-trigger="load"
            />
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
      })
      .get('/total-views', async ({ html }) => {
        const [{ totalViews }] = await db
          .select({
            totalViews: sql<number>`COUNT(id)`,
          })
          .from(postViews)

        return html(<div>{totalViews}</div>)
      })
      .get('/views-per-day', async ({ html }) => {
        const [{ viewsPerDay }] = await db
          .select({
            viewsPerDay: sql<number>`ROUND((COUNT(id) / (JULIANDAY(max("createdAt")) - JULIANDAY(min("createdAt")) + 1)), 2)`,
          })
          .from(postViews)

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
              id: posts.id,
              updatedAt: posts.updatedAt,
            })
            .from(postViews)
            .innerJoin(posts, eq(posts.id, postViews.postId))
            .groupBy(posts.id)
            .orderBy(sql`count DESC`)
            .offset(10 * (page - 1))
            .limit(10)

          const postsWithViews = await db
            .select({
              postId: postViews.postId,
            })
            .from(postViews)
            .groupBy(postViews.postId)

          const hasMore = postsWithViews.length > 10 * page

          return html(
            <div id="most-viewed">
              <PostList
                posts={data}
                sort="views"
                hasMore={hasMore}
                page={page}
              />
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
            id: posts.id,
            updatedAt: posts.updatedAt,
          })
          .from(postViews)
          .innerJoin(posts, eq(posts.id, postViews.postId))
          .where(gte(postViews.createdAt, sql`CURRENT_DATE`))
          .groupBy(posts.id)
          .orderBy(sql`count DESC`)

        return html(<PostList posts={data} sort="views" />)
      })
      .get('/user-agent', async ({ html }) => {
        const data = await db
          .select({
            userAgent: postViews.userAgent,
          })
          .from(postViews)
          .where(gt(postViews.createdAt, sql`CURRENT_DATE`))

        let os: Record<string, number> = {}
        let browser: Record<string, number> = {}

        for (const { userAgent } of data) {
          const parsed = userAgentParser(userAgent)

          if (parsed.os.name) {
            if (!os[parsed.os.name]) {
              os[parsed.os.name] = 0
            }

            os[parsed.os.name]++
          }

          if (parsed.browser.name) {
            if (!browser[parsed.browser.name]) {
              browser[parsed.browser.name] = 0
            }

            browser[parsed.browser.name]++
          }
        }

        const sortedOs = Object.fromEntries(
          Object.entries(os).sort((a, b) => b[1] - a[1])
        )

        const sortedBrowser = Object.fromEntries(
          Object.entries(browser).sort((a, b) => b[1] - a[1])
        )

        return html(
          <>
            <DataList data={sortedOs} title="Operating Systems" />
            <DataList data={sortedBrowser} title="Browsers" />
          </>
        )
      })
  )
}
