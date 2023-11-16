module.exports = {
  'env': {
    'es2023': true,
    'node': true
  },
  'parser': '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    'indent': [
      'error',
      2,
      { SwitchCase: 1 }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
}
