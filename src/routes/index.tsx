import { and, desc, eq, like } from 'drizzle-orm'
import { Home } from '../components/home'
import { db } from '../db'
import { post } from '../db/schema'
import { CommandMenu, CommandMenuSearch } from '../components/CommandMenu'
import type { C } from '../types'

export const indexRoute = async (c: C<'/'>) => {
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

  return c.html(<Home latestPosts={latestPosts} />)
}

export const commandMenuRoute = async (c: C<'/command-menu'>) => {
  const data = await db
    .select({
      slug: post.slug,
      title: post.title,
    })
    .from(post)
    .orderBy(desc(post.id))
    .where(eq(post.published, true))
    .limit(5)

  return c.html(<CommandMenu data={data} />)
}

export const commandMenuSearchRoute = async (c: C<'/command-menu/search'>) => {
  const query = c.req.query()
  const data = await db
    .select({
      slug: post.slug,
      title: post.title,
    })
    .from(post)
    .orderBy(desc(post.id))
    .where(and(eq(post.published, true), like(post.title, `%${query.search}%`)))
    .limit(5)

  return c.html(<CommandMenuSearch data={data} />)
}
