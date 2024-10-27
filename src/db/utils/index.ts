import * as pg from 'drizzle-orm/pg-core';

export const id = pg.serial().primaryKey();