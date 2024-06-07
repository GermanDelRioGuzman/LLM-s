import globals from "globals";
import pluginJs from "@eslint/js";

const config = {
  extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
  },
  plugins: [
      '@typescript-eslint',
  ],
  rules: {
      // tus reglas personalizadas
  },
};

export default [
  {
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    ...pluginJs.configs.recommended,
    ...config
  }
];