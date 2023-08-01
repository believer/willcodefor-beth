import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import elements from '@kitajs/html'
import { Elysia } from 'elysia'
import Iteam from './components/iteam'
import indexRoute from './routes'
import postRoutes from './routes/posts'
import xmlRoutes from './routes/xml'
import staticRoutes from './routes/static'
import adminRoutes from './routes/admin'
import statsRoutes from './routes/stats'

const app = new Elysia()
  .use(html())
  .use(staticPlugin())
  // Home
  .use(indexRoute)
  // Post routes
  .use(postRoutes)
  // XML Feeds
  .use(xmlRoutes)
  // Admin
  .use(adminRoutes)
  // Stats
  .use(statsRoutes)
  // Iteam work
  .get('/iteam', ({ html }) => html(<Iteam />))
  // Static files
  .use(staticRoutes)
  // Capture anything that's not handled
  // This should only mean handling short links to posts
  .get('/:slug', ({ params, set }) => {
    set.redirect = `/posts/${params.slug}`
  })
  .listen(3000)

console.log(
  `Server running at http://${app.server?.hostname}:${app.server?.port}/`
)
