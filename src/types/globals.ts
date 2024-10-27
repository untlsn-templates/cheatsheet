import type * as S from 'solid-js';


declare global {
	type JSXElement = S.JSX.Element;
	type FunctionType = (...args: any[]) => any;
}

export {};
