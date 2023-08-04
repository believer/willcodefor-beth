import html from '@elysiajs/html'
import elements from '@kitajs/html'
import { eq, gt, gte, sql } from 'drizzle-orm'
import Elysia, { t } from 'elysia'
import userAgentParser from 'ua-parser-js'
import { DataList } from '../components/datalist'
import { BaseHtml } from '../components/layout'
import PostList from '../components/postList'
import { db } from '../db'
import { postView, post } from '../db/schema'
import clsx from 'clsx'

const timeToSql = (time: string) => {
  switch (time) {
    case 'week':
      return sql`date_trunc('week', CURRENT_DATE)`
    case 'thirty-days':
      return sql`CURRENT_DATE - '30 days'::interval`
    case 'this-year':
      return sql`date_trunc('year', CURRENT_DATE)`
    case 'all-time':
      return sql`(SELECT min(${postView.createdAt}) from ${postView})`
    default:
      return sql`CURRENT_DATE`
  }
}

export default function (app: Elysia) {
  return app.use(html()).group('/stats', (app) =>
    app
      .get('', async ({ html, query }) => {
        return html(
          <BaseHtml noHeader>
            <div class="flex gap-4 mt-4 items-center justify-center">
              <a
                class={clsx(
                  'py-2 px-4 block bg-gray-800 rounded text-brandBlue-200 no-underline',
                  {
                    'bg-brandBlue-800': !query.time || query.time === 'today',
                  }
                )}
                href="/stats?time=today"
              >
                Today
              </a>
              <a
                class={clsx(
                  'py-2 px-4 block bg-gray-800 rounded text-brandBlue-200 no-underline',
                  {
                    'bg-brandBlue-800': query.time === 'week',
                  }
                )}
                href="/stats?time=week"
              >
                Week
              </a>
              <a
                class={clsx(
                  'py-2 px-4 block bg-gray-800 rounded text-brandBlue-200 no-underline',
                  {
                    'bg-brandBlue-800': query.time === 'thirty-days',
                  }
                )}
                href="/stats?time=thirty-days"
              >
                30 days
              </a>
              <a
                class={clsx(
                  'py-2 px-4 block bg-gray-800 rounded text-brandBlue-200 no-underline',
                  {
                    'bg-brandBlue-800': query.time === 'this-year',
                  }
                )}
                href="/stats?time=this-year"
              >
                This year
              </a>
              <a
                class={clsx(
                  'py-2 px-4 block bg-gray-800 rounded text-brandBlue-200 no-underline',
                  {
                    'bg-brandBlue-800': query.time === 'all-time',
                  }
                )}
                href="/stats?time=all-time"
              >
                All time
              </a>
            </div>
            <hr class="my-10" />
            <div class="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div class="flex flex-col items-center justify-center text-center text-8xl font-bold">
                <span
                  hx-trigger="load"
                  hx-get={`/stats/total-views?time=${query.time}`}
                >
                  0
                </span>
                <div class="mt-2 text-sm font-normal uppercase text-gray-600 dark:text-gray-700">
                  Total views
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
            <div
              class="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2"
              hx-get={`/stats/user-agent?time=${query.time}`}
              hx-trigger="load"
            />
          </BaseHtml>
        )
      })
      .get('/total-views', async ({ html, query }) => {
        const [{ totalViews }] = await db
          .select({
            totalViews: sql<number>`COUNT(id)`,
          })
          .from(postView)
          .where(gte(postView.createdAt, timeToSql(query.time)))

        return html(<div>{totalViews}</div>)
      })
      .get('/views-per-day', async ({ html }) => {
        const [{ viewsPerDay }] = await db
          .select({
            viewsPerDay: sql<number>`ROUND((COUNT(id) / (JULIANDAY(max("createdAt")) - JULIANDAY(min("createdAt")) + 1)), 2)`,
          })
          .from(postView)

        return html(<div>{viewsPerDay}</div>)
      })
      .get(
        '/most-viewed',
        async ({ html, query }) => {
          const page = query.page || 1
          const data = await db
            .select({
              views: sql<number>`COUNT(${postView.id}) as count`,
              title: post.title,
              slug: post.slug,
              createdAt: post.createdAt,
              id: post.id,
              updatedAt: post.updatedAt,
              tilId: post.tilId,
            })
            .from(postView)
            .innerJoin(post, eq(post.id, postView.postId))
            .groupBy(post.id)
            .orderBy(sql`count DESC`)
            .offset(10 * (page - 1))
            .limit(10)

          const postsWithViews = await db
            .select({
              postId: postView.postId,
            })
            .from(postView)
            .groupBy(postView.postId)

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
            views: sql<number>`COUNT(${postView.id}) as count`,
            title: post.title,
            slug: post.slug,
            createdAt: post.createdAt,
            id: post.id,
            updatedAt: post.updatedAt,
            tilId: post.tilId,
          })
          .from(postView)
          .innerJoin(post, eq(post.id, postView.postId))
          .where(gte(postView.createdAt, sql`CURRENT_DATE`))
          .groupBy(post.id)
          .orderBy(sql`count DESC`)

        return html(<PostList posts={data} sort="views" />)
      })
      .get('/user-agent', async ({ html, query }) => {
        const data = await db
          .select({
            userAgent: postView.userAgent,
          })
          .from(postView)
          .where(gt(postView.createdAt, timeToSql(query.time)))

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
