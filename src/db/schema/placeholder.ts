import * as pg from 'drizzle-orm/pg-core';
import { id } from '~/db/utils';

export const placeholder = pg.pgTable('placeholder', {
	id,
});