import Elysia from 'elysia'

export default function (app: Elysia) {
  return (
    app
      // Static files
      .get('/robots.txt', () => Bun.file('./public/robots.txt'))
      .get('/humans.txt', () => Bun.file('./public/humans.txt'))
  )
}
