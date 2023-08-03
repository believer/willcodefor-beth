// import { drizzle } from 'drizzle-orm/libsql'
// import { createClient } from '@libsql/client'
// import * as schema from './schema'
//
// const client = createClient({
//   url: process.env.DATABASE_URL!,
//   authToken: process.env.DATABASE_AUTH_TOKEN,
// })
//
// export const db = drizzle(client, { schema, logger: true })

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL!)

export const db = drizzle(client)
