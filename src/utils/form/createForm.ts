import { createStore, reconcile, unwrap } from 'solid-js/store';
import { createSignal } from 'solid-js';
import type { FormController, FormControllerErrors, TransformOutput } from './types';
import { FormTransformError, triggerValidation } from './utils';

export const formInner = Symbol('form inner');

export function createForm<TInput extends object, TOutput=TInput>(options: {
	initialValues: TInput,
	transform?:    (values: TInput) => TransformOutput<TInput, TOutput>,
	onSubmit:      (values: TOutput) => void,
}): FormController<TInput, TOutput> {
	const [values, setValues] = createStore<any>(options.initialValues);
	const [errors, setErrors] = createStore<FormControllerErrors>();
	const [rootErrors, setRootErrors] = createSignal<readonly string[]>();

	const form: FormController<TInput, TOutput> = {
		values,
		setValues,
		submit(ev) {
			ev?.preventDefault();
			ev?.stopPropagation();
			form.submitted = true;
			const inner = form[formInner];
			inner.setErrors(reconcile({}));
			inner.setRootErrors(undefined);
			const parse = inner.checkTransform();
			let error = false;
			Object.entries(inner.validations).forEach(([key, validation]) => {
				if (!triggerValidation(form, key, validation)) error = true;
			});

			if (error || parse instanceof FormTransformError) return;
			options.onSubmit(parse);
		},
		[formInner]: {
			errors,
			rootErrors,
			setRootErrors,
			setErrors,
			validations: {},
			transform:   options.transform || returnFirst as any,
			checkTransform() {
				const parse = form[formInner].transform(unwrap(values));
				if (parse instanceof FormTransformError) {
					if (parse.nested) Object.entries(parse.nested).forEach(([key, errors]) => {
						setErrors(key, errors);
					});
					setRootErrors(parse.root);
				}
				return parse;
			},
		},
	};

	return form;
}

function returnFirst<T>(output: T): TransformOutput<T> {
	return output;
}
