import Elysia from 'elysia'

export const staticRoutes = new Elysia()
  // Static files
  .get('/robots.txt', () => Bun.file('./public/robots.txt'))
  .get('/humans.txt', () => Bun.file('./public/humans.txt'))
