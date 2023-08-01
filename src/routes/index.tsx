import elements from '@kitajs/html'
import { desc, eq } from 'drizzle-orm'
import Elysia from 'elysia'
import { Home } from '../components/home'
import { db } from '../db'
import { posts } from '../db/schema'
import html from '@elysiajs/html'

export default function (app: Elysia) {
  return app.use(html()).get('/', async ({ html }) => {
    const latestPosts = await db
      .select({
        createdAt: posts.createdAt,
        slug: posts.slug,
        tilId: posts.tilId,
        title: posts.title,
      })
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .where(eq(posts.published, true))
      .limit(5)
      .all()

    return html(<Home latestPosts={latestPosts} />)
  })
}
