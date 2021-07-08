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
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'off',
        'no-inner-declarations': 'off',
        'no-use-before-define': 'off',
        'no-underscore-dangle': 'off',
        'jsx-a11y/control-has-associated-label': 0,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
