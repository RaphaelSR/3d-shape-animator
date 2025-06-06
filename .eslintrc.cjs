module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'react/no-unknown-property': [
      'error',
      { 
        ignore: [
          'args',
          'position',
          'rotation',
          'scale',
          'intensity',
          'color',
          'metalness',
          'roughness',
          'castShadow',
          'receiveShadow',
          'shadow-mapSize-width',
          'shadow-mapSize-height',
          'shadow-camera-far',
          'shadow-camera-left',
          'shadow-camera-right',
          'shadow-camera-top',
          'shadow-camera-bottom',
        ],
      },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
