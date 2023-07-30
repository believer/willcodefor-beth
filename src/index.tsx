import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import { desc, eq, like, or, sql } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import * as elements from '@kitajs/html'
import { Home } from './components/home'
import { Post } from './components/post'
import { Posts } from './components/posts'
import { db } from './db'
import { postViews, posts } from './db/schema'
import { md } from './utils/markdown'
import PostList from './components/postList'
import Iteam from './components/iteam'
import { generateFeed, generateSitemap } from './xml'

const app = new Elysia()
  .use(html())
  .use(staticPlugin())
  .get('/', async ({ html }) => {
    const latestPosts = await db
      .select({
        createdAt: posts.createdAt,
        slug: posts.slug,
        tilId: posts.tilId,
        title: posts.title,
      })
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(5)
      .all()

    return html(<Home latestPosts={latestPosts} />)
  })
  .group('/posts', (app) =>
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
      .get(
        '/stats/:id',
        async ({ html, params }) => {
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
      .post(
        '/:id/edit',
        async ({ html, params }) => {
          const post = await db
            .select({
              body: posts.body,
            })
            .from(posts)
            .where(eq(posts.id, Number(params.id)))
            .get()

          if (!post) {
            return html(<div />)
          }

          return html(
            <form hx-post={`/posts/${params.id}/update`} hx-swap="outerHTML">
              <textarea
                name="body"
                class="w-full bg-transparent p-4 dark:text-white border rounded text-slate-900 h-96"
              >
                {post.body}
              </textarea>
              <button>Update</button>
            </form>
          )
        },
        {
          params: t.Object({ id: t.String() }),
        }
      )
      .post(
        '/:id/update',
        async ({ html, params, body }) => {
          const post = await db
            .update(posts)
            .set({ body: body.body })
            .where(eq(posts.id, Number(params.id)))
            .returning({ body: posts.body })
            .get()

          return html(
            <div id="body">
              {md.render(post.body ?? '')}
              <button hx-post={`/posts/${params.id}/edit`} hx-target="#body">
                Edit
              </button>
            </div>
          )
        },
        {
          body: t.Object({ body: t.String() }),
          params: t.Object({ id: t.String() }),
        }
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
  .get('/feed.xml', async () => {
    const data = await db
      .select({
        body: posts.body,
        slug: posts.slug,
        title: posts.title,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .where(eq(posts.published, true))
      .all()

    const feed = generateFeed(data)

    return new Response(feed, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  })
  .get('/sitemap.xml', async () => {
    const data = await db
      .select({
        slug: posts.slug,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .where(eq(posts.published, true))
      .all()

    const sitemap = generateSitemap(data)

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  })
  .get('/iteam', ({ html }) => html(<Iteam />))

// Styles
app
  .get('/styles.css', () => Bun.file('./tailwind-gen/styles.css'))
  .get('/tokyonight.css', () => Bun.file('./src/tokyonight.css'))
  .get('/favicon.ico', () => Bun.file('./public/favicon.ico'))

// Capture anything that's not handled
// This should only mean handling short links to posts
app
  .get('/:slug', ({ params, set }) => {
    set.redirect = `/posts/${params.slug}`
  })
  .listen(3000)

console.log(
  `Server running at http://${app.server?.hostname}:${app.server?.port}/`
)
