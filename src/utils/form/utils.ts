import type { FormController, PureValidation, Validation } from './types';
import * as v from 'valibot';
import { formInner } from '~/utils/form/createForm';

function asArray<T>(maybeArr: T | T[]): T[] {
	return Array.isArray(maybeArr) ? maybeArr : [maybeArr];
}

export class FormTransformError extends Error {
	root?:   readonly string[];
	nested?: Readonly<Record<string, string[]|undefined>>;

	constructor({ root, nested }: {
		root?:   readonly string[];
		nested?: Readonly<Record<string, string[]|undefined>>;
	}) {
		super('FormTransformError');
		this.root = root;
		this.nested = nested;
	}
}

export function triggerValidation(form: FormController<any>, key: string, validation: PureValidation | undefined): boolean {
	if (!validation) return true;
	const maybeErrors = validation();
	if (!maybeErrors) return true;
	const errors = asArray(maybeErrors).filter((it) => it && typeof it == 'string');
	if (!errors.length) return true;
	form[formInner].setErrors(key, errors);
	return false;
}

export function getRootError(form: FormController<any>): string|undefined {
	return form[formInner].rootErrors()?.[0];
}

export function parseValibotField<T extends v.BaseSchema<any, any, any>>(schema: T): Validation<v.InferInput<T>|undefined> {
	return (value) => {
		const parse = v.safeParse(schema, value);
		if (!parse.success) return v.flatten(parse.issues).root;
	};
}
