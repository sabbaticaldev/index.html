module.exports = {
  env: {
    es2021: true,
    browser: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  overrides: [
    {
      files: ["*.test.js"],
      env: {
        jest: true,
      },
    },
    {
      files: ["server/**/*.js", "services/**/*.js"],
      env: {
        node: true,
        browser: false,
      },
    },
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["simple-import-sort", "prettier"],
  rules: {
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-multi-spaces": ["error"],
    "no-trailing-spaces": ["error"],
    "object-curly-spacing": ["error", "always"],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "comma-dangle": ["error", "always-multiline"],
    "eol-last": ["error", "always"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "space-infix-ops": ["error", { int32Hint: false }],
    "space-before-blocks": ["error", "always"],
    "key-spacing": ["error", { beforeColon: false, afterColon: true }],
    "keyword-spacing": ["error", { before: true, after: true }],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
