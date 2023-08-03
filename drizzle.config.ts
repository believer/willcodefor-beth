import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config()

export default {
  schema: './src/db/schema.ts',
  out: './src/db',
  // driver: 'turso',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
    // authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
} satisfies Config
