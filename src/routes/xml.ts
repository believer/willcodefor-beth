import { desc, eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { db } from '../db'
import { Post, post } from '../db/schema'
import { md } from '../utils/markdown'

const metadata = {
  title: 'willcodefor.beer',
  url: 'https://willcodefor.beer/',
  description: 'Things I learn while browsing the web',
  author: {
    name: 'Rickard Natt och Dag',
    email: 'rickard@willcodefor.dev',
  },
} as const

const xml = () => (app: Elysia) =>
  app.derive((context) => ({
    xml(value: string) {
      return new Response(value, {
        headers: {
          ...context.set.headers,
          'Content-Type': 'application/xml',
        },
      })
    },
  }))

function generateFeed(
  feed: Pick<Post, 'title' | 'slug' | 'body' | 'updatedAt'>[]
) {
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <title>${metadata.title}</title>
    <subtitle>${metadata.description}</subtitle>
    <link href="${metadata.url}/feed.xml" rel="self"/>
    <link href="${metadata.url}"/>
    <updated>${feed.at(-1)?.updatedAt}</updated>
    <id>${metadata.url}</id>
    <author>
        <name>${metadata.author.name}</name>
        <email>${metadata.author.email}</email>
    </author>
    ${feed
      .map(
        (post) =>
          `<entry>
      <title>${post.title}</title>
      <link href="${metadata.url}posts/${post.slug}"/>
      <updated>${post.updatedAt}</updated>
      <id>${metadata.url}posts/${post.slug}</id>
      <content type="html">${md.render(post.body)}</content>
    </entry>`
      )
      .join('')}
</feed>`
}

function generateSitemap(posts: Pick<Post, 'slug' | 'updatedAt'>[]) {
  return `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${posts
      .map(
        (post) =>
          `<url>
      <loc>${metadata.url}${post.slug}</loc>
      <lastmod>${post.updatedAt}</lastmod>
    </url>`
      )
      .join('')}
</urlset>`
}

export const xmlRoutes = new Elysia()
  .use(xml())
  .get('/feed.xml', async ({ xml }) => {
    const data = await db
      .select({
        body: post.body,
        slug: post.slug,
        title: post.title,
        updatedAt: post.updatedAt,
      })
      .from(post)
      .orderBy(desc(post.id))
      .where(eq(post.published, true))

    const feed = generateFeed(data)

    return xml(feed)
  })
  .get('/sitemap.xml', async ({ xml }) => {
    const data = await db
      .select({
        slug: post.slug,
        updatedAt: post.updatedAt,
      })
      .from(post)
      .orderBy(desc(post.id))
      .where(eq(post.published, true))

    const sitemap = generateSitemap(data)

    return xml(sitemap)
  })
