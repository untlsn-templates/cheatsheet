import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import solid from 'eslint-plugin-solid';
import react from 'eslint-plugin-react';
import stylistic from '@stylistic/eslint-plugin';
import * as tsParser from '@typescript-eslint/parser';

const defaultConfig = 	{
	rules: {
		'prefer-const':                                      1,
		'space-infix-ops':                                   1,
		'no-console':                                        [1, { allow: ['warn', 'error'] }],
		'@typescript-eslint/no-unused-vars':                 1,
		'@typescript-eslint/method-signature-style':         1,
		'@typescript-eslint/no-explicit-any':                0,
		'@typescript-eslint/no-non-null-assertion':          0,
		'@typescript-eslint/ban-ts-comment':                 0,
		'@typescript-eslint/consistent-type-imports':        1,
		'@typescript-eslint/explicit-module-boundary-types': 1,
	},
};

const solidConfig = 	{
	languageOptions: {
		parser:        tsParser,
		parserOptions: {
			project: 'tsconfig.json',
		},
	},
	...solid.configs['flat/recommended'],
	plugins: { react, ...solid.configs['flat/recommended'].plugins },
	rules:   {
		'react/button-has-type':         [1, { reset: true }],
		'solid/no-react-specific-props': 1,
		...solid.configs['flat/recommended'].rules,
	},
};

const stylisticConfig = {
	plugins: { '@stylistic': stylistic },
	rules:   {
		'@stylistic/semi':                         [1, 'always'],
		'@stylistic/no-multiple-empty-lines':      [1, { max: 2, maxEOF: 0 }],
		'@stylistic/arrow-parens':                 [1, 'always'],
		'@stylistic/indent':                       [1, 'tab', { SwitchCase: 1 }],
		'@stylistic/comma-dangle':                 [1, 'always-multiline'],
		'@stylistic/quote-props':                  [1, 'as-needed'],
		'@stylistic/object-curly-spacing':         [1, 'always'],
		'@stylistic/object-curly-newline':         [1, { multiline: true, consistent: true }],
		'@stylistic/no-trailing-spaces':           1,
		'@stylistic/quotes':                       [1, 'single'],
		'@stylistic/key-spacing':                  [1, { align: 'value' }],
		'@stylistic/space-before-blocks':          1,
		'@stylistic/comma-spacing':                1,
		'@stylistic/jsx-max-props-per-line':       [1, { maximum: 1, when: 'multiline' }],
		'@stylistic/jsx-closing-bracket-location': 1,
		'@stylistic/jsx-indent':                   [1, 'tab'],
		'@stylistic/jsx-first-prop-new-line':      1,
		'@stylistic/jsx-tag-spacing':              1,
		'@stylistic/jsx-quotes':                   1,
	},
};

export default tsEslint.config(
	eslint.configs.recommended,
	...tsEslint.configs.recommended,
	solidConfig,
	stylisticConfig,
	defaultConfig,
);
