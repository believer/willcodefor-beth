import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config()

export default {
  schema: './src/db/schema.ts',
  out: './src/db',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true, // Print out all SQL statements that are executed during push:pg update
  strict: true, // Ask for confirmation before executing push:pg update
} satisfies Config
