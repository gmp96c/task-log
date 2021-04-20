// module.exports = {
//   plugins: [
//     '@typescript-eslint',
//     'eslint-comments',
//     'jest',
//     'promise',
//     'unicorn',
//   ],
//   extends: [
//     'airbnb-typescript',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:eslint-comments/recommended',
//     'plugin:jest/recommended',
//     'plugin:promise/recommended',
//     'plugin:unicorn/recommended',
//     'prettier',
//     'prettier/react',
//     'prettier/@typescript-eslint',
//   ],
//   env: {
//     node: true,
//     browser: true,
//     jest: true,
//   },
//   rules: {
//     // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
//     'no-prototype-builtins': 'off',
//     // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
//     'import/prefer-default-export': 'off',
//     'import/no-default-export': 'error',
//     // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
//     'react/destructuring-assignment': 'off',
//     // No jsx extension: https://github.com/facebook/create-react-app/issues/87#issuecomment-234627904
//     'react/jsx-filename-extension': 0,
//     // Use function hoisting to improve code readability
//     'no-use-before-define': [
//       'error',
//       { functions: false, classes: true, variables: true },
//     ],
//     // Makes no sense to allow type inferrence for expression parameters, but require typing the response
//     '@typescript-eslint/explicit-function-return-type': [
//       'error',
//       { allowExpressions: true, allowTypedFunctionExpressions: true },
//     ],
//     '@typescript-eslint/no-use-before-define': [
//       'error',
//       {
//         functions: false,
//         classes: true,
//         variables: true,
//         typedefs: true,
//       },
//     ],
//     // Common abbreviations are known and readable
//     'unicorn/prevent-abbreviations': 'off',
//   },
// };
module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    jsx: true,
    sourceType: 'module',
    useJSXTextNode: true,
  },
  plugins: ['@typescript-eslint', 'import', 'jest', 'react', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'import/no-extraneous-dependencies': 0,
    'react/prop-types': [0],
    'react/jsx-filename-extension': 'off',
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
   ],
   'import/no-default-export':'off',
   'import/prefer-default-export':'off',
   'no-inner-declarations': 'off',
   'no-use-before-define': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
