import { Linter } from 'eslint';

/** @type {Linter.Config} */
export default {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'airbnb-base',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': 'error',
        'no-console': 'off',
    },
};
