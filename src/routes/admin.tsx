import { html } from '@elysiajs/html'
import Elysia, { t } from 'elysia'
import elements from '@kitajs/html'
import { db } from '../db'
import { posts } from '../db/schema'
import { eq } from 'drizzle-orm'
import { BaseHtml } from '../components/layout'
import { md } from '../utils/markdown'
import { formatDateTime } from '../utils/intl'

export default function (app: Elysia) {
  return app.group(
    '/admin',
    {
      beforeHandle: ({ set, request: { headers } }) => {
        const basicAuth = headers.get('authorization')?.split(' ')[1] ?? ''
        const [username, password] = Buffer.from(basicAuth, 'base64')
          .toString()
          .split(':')

        const isBadCredentials =
          username !== process.env.ADMIN_USERNAME ||
          password !== process.env.ADMIN_PASSWORD

        if (!headers.get('authorization') || isBadCredentials) {
          set.status = 401
          set.headers['WWW-Authenticate'] = 'Basic realm="Secure Area"'

          return 'Unauthorized'
        }
      },
    },
    (app) =>
      app
        .use(html())
        .get('', async ({ html }) => {
          const allPosts = await db
            .select({
              title: posts.title,
              slug: posts.slug,
            })
            .from(posts)
            .all()

          return html(
            <BaseHtml noHeader>
              <h1>Admin</h1>
              <ul>
                {allPosts.map((post) => (
                  <li>
                    <a href={`/admin/${post.slug}`}>{post.title}</a>
                  </li>
                ))}
              </ul>
            </BaseHtml>
          )
        })
        .get('/:slug', async ({ html, params }) => {
          const post = await db
            .select({
              title: posts.title,
              slug: posts.slug,
              body: posts.body,
              updatedAt: posts.updatedAt,
            })
            .from(posts)
            .where(eq(posts.slug, params.slug))
            .get()

          return html(
            <BaseHtml noHeader highlight>
              <div class="my-12">
                <div class="flex items-center justify-between">
                  <a href="/admin">← Back</a>
                  <span class="text-gray-500 dark:text-gray-600">
                    Last updated:{' '}
                    <span id="update-time">
                      {formatDateTime(post.updatedAt, 'medium')}
                    </span>
                  </span>
                </div>
                <form
                  hx-post={`/admin/${post.slug}`}
                  hx-trigger="every 30s"
                  hx-target="#update-time"
                >
                  <input
                    class="mt-8 mb-4 block w-full rounded-sm border bg-transparent p-2 text-2xl ring-blue-700 focus:outline-none focus:ring-2 dark:border-gray-800 dark:ring-offset-gray-900"
                    type="text"
                    name="title"
                    value={post.title}
                  />
                  <div class="grid grid-cols-2 gap-10">
                    <textarea
                      class="rounded-sm border bg-transparent p-4 ring-blue-700 ring-offset-4 focus:outline-none focus:ring-2 dark:border-gray-800 dark:ring-offset-gray-900"
                      name="body"
                    >
                      {post.body}
                    </textarea>
                    <div class="prose dark:prose-invert dark:prose-dark">
                      {md.render(post.body)}
                    </div>
                  </div>
                  <input type="text" name="slug" value={post.slug} />
                </form>
              </div>
            </BaseHtml>
          )
        })
        .post(
          '/:slug',
          async ({ body }) => {
            await db
              .update(posts)
              .set({
                title: body.title,
                body: body.body,
                updatedAt: new Date().toISOString(),
              })
              .where(eq(posts.slug, body.slug))
              .run()

            return new Intl.DateTimeFormat('sv-SE', {
              dateStyle: 'short',
              timeStyle: 'medium',
            }).format(new Date())
          },
          {
            body: t.Object({
              slug: t.String(),
              title: t.String(),
              body: t.String(),
            }),
          }
        )
  )
}
