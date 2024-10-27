import { onCleanup } from 'solid-js';
import type { FormController, Validation } from './types';
import { triggerValidation } from './utils';
import { formInner } from './createForm';
import type { StoreSetter } from 'solid-js/store';

export type BaseField<T> = Readonly<{
	onChange:   (value: T) => void;
	value:      T
	errors:     string[] | undefined
	error:      string | undefined
	validate:   () => boolean
	validation: () => any
}>;

export type LooseBaseField<T> = BaseField<T> | BaseField<T | undefined>;

export function createBaseField<T extends object, K extends (keyof T) & string>(options: {
	form:        FormController<T, any>,
	name:        K,
	validation?: Validation<T[K]>,
}): BaseField<T[K]> {
	const validation = () => options.validation?.(options.form.values[options.name]);
	if (validation) options.form[formInner].validations[options.name] = validation;
	onCleanup(() => {
		delete options.form[formInner].validations[options.name];
	});
	const validate = () => {
		const success = triggerValidation(options.form, options.name, validation);
		if (success) options.form[formInner].setErrors(options.name, []);
		return success;
	};

	const res: BaseField<T[K]> = {
		validation,
		validate,
		onChange: (value) => {
			(options.form as any).setValues(options.name, value);
			if (!options.form.submitted) return;
			validate();
			options.form[formInner].checkTransform();
		},
		get value() {
			return options.form.values[options.name];
		},
		get errors(): string[] | undefined {
			return options.form[formInner].errors?.[options.name];
		},
		get error(): string | undefined {
			return res.errors?.[0];
		},
	};
	return res;
}

type KeyOf<T> = Extract<keyof T, string | number>;
type Path<T> = T extends (infer R)[]
	? `${number}` | `${number}.${Path<R>}`
	: T extends object
		? { [K in KeyOf<T>]: `${K}` | `${K}.${Path<T[K]>}` }[KeyOf<T>]
		: never;

type PathValue<TObject, TPath extends string> = TObject extends (infer R)[]
	? TPath extends `${number}`
		? R
		: TPath extends `${number}.${infer TRest}`
			? PathValue<R, TRest>
			: never
	: TPath extends keyof TObject
		? TObject[TPath]
		: TPath extends `${infer K}.${infer TRest}`
			? K extends keyof TObject
				? PathValue<TObject[K], TRest>
				: never
			: never;

export function createPathField<T extends object, K extends Path<T>>(options: {
	form:        FormController<T, any>,
	name:        K,
	validation?: Validation<PathValue<T, K>>,
}): BaseField<PathValue<T, K>> {
	const value = () => {
		return options.name.split('.').reduce((acc: any, cur) => acc[cur], options.form.values);
	};
	const validation = () => {
		return options.validation?.(value());
	};
	if (validation) {
		options.form[formInner].validations[options.name] = validation;
	}
	onCleanup(() => {
		delete options.form[formInner].validations[options.name];
	});
	const validate = () => {
		const success = triggerValidation(options.form, options.name, validation);
		if (success) options.form[formInner].setErrors(options.name, []);
		return success;
	};

	const res: BaseField<PathValue<T, K>> = {
		validation,
		validate,
		onChange: (value) => {
			(options.form as any).setValues(...options.name.split('.'), value);
			if (!options.form.submitted) return;
			validate();
			options.form[formInner].checkTransform();
		},
		get value() {
			return value();
		},
		get errors(): string[] | undefined {
			return options.form[formInner].errors?.[options.name];
		},
		get error(): string | undefined {
			return res.errors?.[0];
		},
	};
	return res;
}

type CreateRegistry<T extends object> = <K extends (keyof T) & string>(
	name: K,
	validation?: Validation<T[K]>,
) => BaseField<T[K]>;

export function createRegistry<T extends object>(form: FormController<T>): CreateRegistry<T> {
	return (name, validation) => createBaseField({ form, name, validation });
}
