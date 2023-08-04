import html from '@elysiajs/html'
import elements from '@kitajs/html'
import { and, desc, eq, like, sql } from 'drizzle-orm'
import Elysia from 'elysia'
import { Home } from '../components/home'
import { db } from '../db'
import { post } from '../db/schema'

export default function (app: Elysia) {
  return app
    .use(html())
    .get('/', async ({ html }) => {
      const latestPosts = await db
        .select({
          createdAt: post.createdAt,
          id: post.id,
          slug: post.slug,
          title: post.title,
          tilId: post.tilId,
        })
        .from(post)
        .orderBy(desc(post.id))
        .where(eq(post.published, true))
        .limit(5)

      return html(<Home latestPosts={latestPosts} />)
    })
    .group('/command-menu', (app) =>
      app
        .get('/open', async ({ html }) => {
          const data = await db
            .select({
              slug: post.slug,
              title: post.title,
            })
            .from(post)
            .orderBy(desc(post.id))
            .where(eq(post.published, true))
            .limit(5)

          return html(
            <>
              <div
                id="command-menu"
                class="bg-tokyoNight-bg/30 fixed inset-0 flex justify-center items-center"
                hx-get="/command-menu/close"
                hx-trigger="keyup[ctrlKey && key == 'k'] from:body, keyup[key == 'Escape'] from:body"
                hx-swap="outerHTML"
              >
                <div class="w-[80dvw] md:w-[60dvw] lg:w-[40dvw] rounded shadow-lg bg-tokyoNight-dark p-6 border-gray-800">
                  <input
                    autofocus="true"
                    type="text"
                    name="search"
                    class="mb-4 block w-full rounded-sm border bg-transparent p-2 ring-blue-700 focus:outline-none focus:ring-2 dark:border-gray-800 dark:ring-offset-gray-900"
                    placeholder="Search"
                    hx-trigger="keyup changed delay:300ms"
                    hx-get="/command-menu/search"
                    hx-target="#command-menu-posts"
                    hx-swap="innerHTML"
                  />
                  <div>
                    <ul id="command-menu-posts">
                      {data.map((post, i) => (
                        <li class="flex justify-between items-center focus-within:bg-gray-800 p-2 -mx-2 rounded-sm">
                          <a
                            class="focus:outline-none"
                            href={`/posts/${post.slug}`}
                            hx-trigger={`click, keyup[ctrlKey && key == ${
                              i + 1
                            }] from:body`}
                          >
                            {post.title}
                          </a>
                          <div class="text-xs text-gray-700">
                            (ctrl + {i + 1})
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )
        })
        .get('/search', async ({ html, query }) => {
          const data = await db
            .select({
              slug: post.slug,
              title: post.title,
            })
            .from(post)
            .orderBy(desc(post.id))
            .where(
              and(
                eq(post.published, true),
                like(post.title, `%${query.search}%`)
              )
            )
            .limit(5)

          return html(
            <>
              {data.map((post, i) => (
                <li class="flex justify-between items-center focus-within:bg-gray-800 p-2 -mx-2 rounded-sm">
                  <a
                    class="focus:outline-none"
                    href={`/posts/${post.slug}`}
                    hx-trigger={`click, keyup[ctrlKey && key == ${
                      i + 1
                    }] from:body`}
                  >
                    {post.title}
                  </a>
                  <div class="text-xs text-gray-700">(ctrl + {i + 1})</div>
                </li>
              ))}
            </>
          )
        })
        .get('/close', async ({ html }) => {
          return html(
            <div
              hx-get="/command-menu/open"
              hx-trigger="keyup[ctrlKey && key == 'k'] from:body"
              hx-swap="outerHTML"
            />
          )
        })
    )
}
