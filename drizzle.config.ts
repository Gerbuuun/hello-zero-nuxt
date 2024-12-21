import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  strict: true,
  verbose: true,
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://user:password@localhost:5430/zstart',
  },
  schema: './database.ts',
})
