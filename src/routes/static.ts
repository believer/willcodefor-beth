import Elysia from 'elysia'

export function getFile(
  fileName: string,
  { maxAge }: { maxAge?: number } = {}
) {
  const isProduction = process.env.NODE_ENV === 'production'

  return new Response(Bun.file(fileName), {
    headers:
      maxAge && isProduction
        ? {
            'Cache-Control': `max-age=${maxAge}`,
          }
        : {},
  })
}

export default function (app: Elysia) {
  return (
    app
      // Styles
      .get('/styles.css', () =>
        getFile('./tailwind-gen/styles.css', { maxAge: 3600 })
      )
      .get('/tokyonight.css', () =>
        getFile('./src/tokyonight.css', { maxAge: 31536000 })
      )
      // Static files
      .get('/robots.txt', () => Bun.file('./public/robots.txt'))
      .get('/humans.txt', () => Bun.file('./public/humans.txt'))
      .get('/public/htmx.min.js', () =>
        getFile('./public/htmx.min.js', { maxAge: 86400 })
      )
      .get('/favicon.ico', () =>
        getFile('./public/favicon.ico', { maxAge: 31536000 })
      )
  )
}
