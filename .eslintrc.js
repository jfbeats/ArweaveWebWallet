module.exports = {
	env: { browser: true, es2021: true },
	extends: ['plugin:vue/vue3-essential'],
	parserOptions: { ecmaVersion: 13, sourceType: 'module' },
	plugins: ['vue'],
	rules: {
		'indent': ['error', 'tab'],
		'quotes': ['error', 'single'],
		'semi': ['error', 'never'],
		'no-multi-spaces': ['error'],
		'block-spacing': ['error', 'always'],
		'object-curly-spacing': ['error', 'always'],
		'array-bracket-spacing': ['error', 'never'],
		'keyword-spacing': ['error', { before: true, after: true }],
		'space-before-function-paren': ['error', 'always'],
		'no-trailing-spaces': ['error', { skipBlankLines: true }],
	},
	overrides: [
		{ files: ['**/*.{ts,tsx}'], parser: '@typescript-eslint/parser' }
	]
}