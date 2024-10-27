import type { SetStoreFunction } from 'solid-js/store';
import type { Setter } from 'solid-js';
import type { Accessor } from 'solid-js';
import type { FormTransformError } from './utils';
import type { formInner } from '~/utils/form/createForm';

export type PureValidation = () => any;
export type Validation<T=any> = (value?: T) => any;


export type FormControllerErrors<T = Record<string, unknown>> = Record<keyof T & string | string, string[]|undefined>;

export type TransformOutput<T, R=T> = R | FormTransformError;

type FormControllerInner<TInput extends object, TOutput=TInput> = {
	setErrors:      SetStoreFunction<FormControllerErrors>,
	setRootErrors:  Setter<readonly string[]|undefined>,
	validations:    Record<string, PureValidation|undefined>,
	transform:      (values: TInput) => TransformOutput<TInput, TOutput>,
	checkTransform: () => TransformOutput<TInput, TOutput>,
	errors:         FormControllerErrors,
	rootErrors:     Accessor<readonly string[]|undefined>,
};


export type FormController<TInput extends object, TOutput=TInput> = {
	values:      TInput,
	setValues:   SetStoreFunction<TInput>,
	submitted?:  boolean
	submit:      (ev?: Event) => void
	[formInner]: FormControllerInner<TInput, TOutput>
};
