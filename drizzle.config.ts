import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be present in envs');

export default defineConfig({
	dialect:       'postgresql',
	schema:        './src/db/schema/*',
	out:           './drizzle',
	casing:        'snake_case',
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});