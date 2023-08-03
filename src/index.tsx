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
  // Iteam work
  .get('/iteam', ({ html }) => html(<Iteam />))
  // Static files
  .use(staticRoutes)
  .get('/:slug', ({ params, set }) => {
    // Old post data contains resources that load from the root
    // which are now in /public. This checks for the resource
    // and returns it if it exists.
    const publicFile = Bun.file(`./public/${params.slug}`)

    if (publicFile.size > 0) {
      return publicFile
    }

    // This slug is a short link to a post, redirect to it
    set.redirect = `/posts/${params.slug}`
  })
  .listen(3000)

console.log(
  `Server running at http://${app.server?.hostname}:${app.server?.port}/`
)
