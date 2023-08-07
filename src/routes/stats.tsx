import html from '@elysiajs/html'
import elements from '@kitajs/html'
import clsx from 'clsx'
import { and, eq, gt, gte, sql } from 'drizzle-orm'
import Elysia, { t } from 'elysia'
import { BaseHtml } from '../components/layout'
import PostList from '../components/postList'
import { db } from '../db'
import { post, postView } from '../db/schema'
import { parsePercent } from '../utils/intl'

const Time = {
  CUMULATIVE: 'cumulative',
  SINCE_START: 'since-start',
  THIRTY_DAYS: 'thirty-days',
  THIS_YEAR: 'this-year',
  TODAY: 'today',
  WEEK: 'week',
} as const

type ObjectValues<T> = T[keyof T]
type Time = ObjectValues<typeof Time>

const timeToSql = (time: Time) => {
  switch (time) {
    case Time.WEEK:
      return sql`date_trunc('week', CURRENT_DATE)`
    case Time.THIRTY_DAYS:
      return sql`CURRENT_DATE - '30 days'::interval`
    case Time.THIS_YEAR:
      return sql`date_trunc('year', CURRENT_DATE)`
    case Time.SINCE_START:
    case Time.CUMULATIVE:
      return sql`(SELECT min(${postView.createdAt}) from ${postView})`
    default:
      return sql`CURRENT_DATE`
  }
}

const TimeButton = ({
  children,
  isActive,
  time,
}: elements.PropsWithChildren<{ isActive: boolean; time: Time }>) => {
  return (
    <a
      class={clsx(
        'py-2 px-4 block rounded no-underline',
        isActive
          ? 'bg-tokyoNight-blue text-brandBlue-800'
          : 'bg-gray-800 text-brandBlue-200'
      )}
      href={`/stats?time=${time}`}
    >
      {children}
    </a>
  )
}

export default function (app: Elysia) {
  return app.use(html()).group('/stats', (app) =>
    app
      .get(
        '',
        async ({ html, query }) => {
          return html(
            <BaseHtml
              noHeader
              meta={
                <script
                  src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"
                  integrity="sha512-TW5s0IT/IppJtu76UbysrBH9Hy/5X41OTAbQuffZFU6lQ1rdcLHzpU5BzVvr/YFykoiMYZVWlr/PX1mDcfM9Qg=="
                  crossorigin="anonymous"
                  referrerpolicy="no-referrer"
                ></script>
              }
            >
              <div class="flex gap-4 mt-4 items-center justify-center">
                <TimeButton
                  isActive={!query.time || query.time === Time.TODAY}
                  time={Time.TODAY}
                >
                  Today
                </TimeButton>
                <TimeButton
                  isActive={query.time === Time.WEEK}
                  time={Time.WEEK}
                >
                  Week
                </TimeButton>
                <TimeButton
                  isActive={query.time === Time.THIRTY_DAYS}
                  time={Time.THIRTY_DAYS}
                >
                  30 days
                </TimeButton>
                <TimeButton
                  isActive={query.time === Time.THIS_YEAR}
                  time={Time.THIS_YEAR}
                >
                  This year
                </TimeButton>
                <TimeButton
                  isActive={query.time === Time.SINCE_START}
                  time={Time.SINCE_START}
                >
                  Since start
                </TimeButton>
                <TimeButton
                  isActive={query.time === Time.CUMULATIVE}
                  time={Time.CUMULATIVE}
                >
                  Cumulative
                </TimeButton>
              </div>
              <hr class="my-10" />
              <div class="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2 items-start">
                <div class="text-center text-8xl font-bold space-y-8">
                  <div>
                    <div
                      hx-trigger="load"
                      hx-get={`/stats/total-views?time=${query.time}`}
                    >
                      <span class="text-gray-500 font-thin tabular-nums">
                        -----
                      </span>
                    </div>
                    <div class="mt-2 text-sm font-normal uppercase text-gray-600 dark:text-gray-700">
                      Total views
                    </div>
                  </div>
                  <div>
                    <div
                      hx-swap="outerHTML"
                      hx-trigger="load"
                      hx-get="/stats/average-views"
                    >
                      <span class="text-gray-500 font-thin tabular-nums">
                        -----
                      </span>
                    </div>
                    <div class="mt-2 text-sm font-normal uppercase text-gray-600 dark:text-gray-700">
                      Views per day (average)
                    </div>
                  </div>
                </div>
                <div
                  class="mb-10"
                  hx-get={`/stats/user-agent?time=${query.time}`}
                  hx-trigger="load"
                />
              </div>
              <div
                hx-trigger="load"
                hx-get={`/stats/chart?time=${query.time}`}
                class="mb-10"
              >
                <div class="h-[400px]" />
              </div>
              <div class="mb-10">
                <h3 class="mb-4 font-semibold uppercase text-gray-500">
                  Most viewed
                </h3>
                <div
                  hx-trigger="load"
                  hx-get="/stats/most-viewed"
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
            time: t.Optional(t.String()),
          }),
        }
      )
      .get(
        '/total-views',
        async ({ query }) => {
          const [{ totalViews }] = await db
            .select({
              totalViews: sql<number>`COUNT(id)`,
            })
            .from(postView)
            .where(
              and(
                gte(postView.createdAt, timeToSql(query.time as Time)),
                eq(postView.isBot, false)
              )
            )

          return totalViews
        },
        {
          query: t.Object({
            time: t.Optional(t.String()),
          }),
        }
      )
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
            .where(eq(postView.isBot, false))
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
            <PostList posts={data} sort="views" hasMore={hasMore} page={page} />
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
          .where(
            and(
              gte(postView.createdAt, sql`CURRENT_DATE`),
              eq(postView.isBot, false)
            )
          )
          .groupBy(post.id)
          .orderBy(sql`count DESC`)

        return html(<PostList posts={data} sort="views" />)
      })
      .get(
        '/user-agent',
        async ({ html, query }) => {
          const data = await db
            .select({
              browserName: postView.browserName,
              osName: postView.osName,
              count: sql<number>`COUNT(*)::int`,
              percent: sql<number>`COUNT(*) / SUM(COUNT(*)) OVER()`.as(
                'percent'
              ),
            })
            .from(postView)
            .where(
              and(
                gt(postView.createdAt, timeToSql(query.time as Time)),
                eq(postView.isBot, false)
              )
            )
            .groupBy(postView.browserName, postView.osName)
            .orderBy(sql`count DESC`)

          const lessThanOnePercent = data
            .filter(({ percent }) => percent < 0.01)
            .reduce((acc, { count }) => acc + count, 0)

          return html(
            <div>
              <h3 class="mb-2 font-semibold uppercase text-gray-500">
                User agents
              </h3>
              <ul class="space-y-1">
                {data
                  .filter(({ percent }) => percent >= 0.01)
                  .map(({ browserName, count, percent, osName }) => (
                    <li class="grid grid-cols-[auto_1fr_1fr_52px] items-center gap-2">
                      <span class="flex-1">{browserName}</span>
                      <span class="text-gray-500 text-sm">{osName}</span>
                      <span class="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        {count}
                      </span>
                      <span class="text-right font-mono text-xs tabular-nums text-gray-400 dark:text-gray-600">
                        ({parsePercent(percent)})
                      </span>
                    </li>
                  ))}
              </ul>
              <div class="mt-2 text-xs text-gray-700 text-right">
                User agents with less than 1% of total are omitted (
                {lessThanOnePercent} views) <br />
                Also,{' '}
                <span
                  hx-trigger="load"
                  hx-get="/stats/user-agent/bots"
                  hx-swap="outerHTML"
                >
                  ---
                </span>{' '}
                bots are not included.
              </div>
            </div>
          )
        },
        {
          query: t.Object({
            time: t.Optional(t.String()),
          }),
        }
      )
      .get('/user-agent/bots', async () => {
        const data = await db
          .select({
            id: postView.id,
          })
          .from(postView)
          .where(eq(postView.isBot, true))

        return data.length
      })
      .get('/chart', async ({ html, query }) => {
        let chartQuery = sql`WITH days AS (
  SELECT generate_series(CURRENT_DATE, CURRENT_DATE + '1 day'::INTERVAL, '1 hour') AS hour
)

SELECT
	days.hour as date,
  to_char(days.hour, 'HH24:MI') as label,
  count(pv.id)::int as count,
  pv.is_bot as "isBot"
FROM days
LEFT JOIN post_view AS pv ON DATE_TRUNC('hour', created_at) = days.hour
LEFT JOIN post AS p ON p.id = pv.post_id
GROUP BY 1, pv.is_bot
ORDER BY 1 ASC`

        if (query.time === 'week') {
          chartQuery = sql`WITH days AS (
  SELECT generate_series(date_trunc('week', current_date), date_trunc('week', current_date) + '6 days'::INTERVAL, '1 day')::DATE as day
)

SELECT
	days.day as date,
  to_char(days.day, 'Mon DD') as label,
  count(pv.id)::int as count,
  pv.is_bot as "isBot"
FROM days
LEFT JOIN post_view AS pv ON DATE_TRUNC('day', created_at) = days.day
GROUP BY 1, pv.is_bot
ORDER BY 1 ASC`
        }

        if (query.time === 'thirty-days') {
          chartQuery = sql`
        WITH days AS (
          SELECT generate_series(CURRENT_DATE - '30 days'::INTERVAL, CURRENT_DATE, '1 day')::DATE AS day
        )

        SELECT
        	days.day as date,
          to_char(days.day, 'Mon DD') as label,
          count(pv.id)::int as count,
          pv.is_bot as "isBot"
        FROM days
        LEFT JOIN post_view AS pv ON DATE_TRUNC('day', created_at) = days.day
        WHERE pv.is_bot = false
GROUP BY 1, pv.is_bot
        ORDER BY 1 ASC`
        }

        if (query.time === 'this-year') {
          chartQuery = sql`
          WITH months AS (
	SELECT (DATE_TRUNC('year', NOW()) + (INTERVAL '1' MONTH * GENERATE_SERIES(0,11)))::DATE AS MONTH
)

SELECT
  months.month as date,
	to_char(months.month, 'Mon') as label,
  COUNT(pv.id)::int as count,
  pv.is_bot as "isBot"
FROM
	months
	LEFT JOIN post_view AS pv ON DATE_TRUNC('month', created_at) = months.month
GROUP BY 1, pv.is_bot
ORDER BY 1 ASC`
        }

        if (query.time === 'since-start') {
          chartQuery = sql`
          WITH months AS (
	SELECT generate_series((SELECT min(created_at) FROM post_view), CURRENT_DATE, '1 month')::DATE as month
)
SELECT
	months.month AS DATE,
	TO_CHAR(months.month, 'Mon YY') AS LABEL,
	COUNT(pv.id)::INT as count
FROM
	months
	LEFT JOIN post_view AS pv ON DATE_TRUNC('month', created_at) = date_trunc('month', months.month)
WHERE pv.is_bot = false
GROUP BY 1
ORDER BY 1 ASC`
        }

        if (query.time === 'cumulative') {
          chartQuery = sql`
          with data as (
  select
    date_trunc('day', created_at) as day,
    count(1)::int
  from post_view WHERE is_bot = false group by 1
)

select
  day::DATE as date,
	to_char(day, 'Mon DD') as label,
  sum(count) over (order by day asc rows between unbounded preceding and current row)::int as count
from data`
        }

        const chart: {
          date: Date
          label: string
          count: number
          isBot?: boolean
        }[] = await db.execute(chartQuery)

        const gridColor = '#1e293b'
        const config = {
          type: query.time === 'cumulative' ? 'line' : 'bar',
          data: {
            labels: chart.map((h) => h.label),
            datasets: [
              {
                label: '',
                data: chart.filter(({ isBot }) => !isBot).map((h) => h.count),
                backgroundColor: '#65bcff',
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: {
                  color: gridColor,
                },
              },
              y: {
                grid: {
                  color: gridColor,
                },
              },
            },
          },
        }

        return html(
          <div class="relative w-[900px]">
            <canvas id="daily-views" />
            <script>
              {`var config = ${JSON.stringify(config)}
 new Chart('daily-views', config)`}
            </script>
          </div>
        )
      })
      .get('/average-views', async ({ html }) => {
        const [{ viewsPerDay }] = await db
          .select({
            viewsPerDay: sql`ROUND((COUNT(id) / (max(${postView.createdAt})::DATE - min(${postView.createdAt})::DATE + 1)::NUMERIC), 2)`,
          })
          .from(postView)
          .where(eq(postView.isBot, false))

        return html(<div>{viewsPerDay}</div>)
      })
  )
}
