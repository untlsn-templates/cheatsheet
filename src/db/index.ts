import { drizzle } from 'drizzle-orm/postgres-js';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be present in envs');

export const db = drizzle({
	connection: process.env.DATABASE_URL,
	casing:     'snake_case',
});

export default db;

export * as table from './schema';
