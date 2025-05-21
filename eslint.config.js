import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/dist/**',
    '**/node_modules/**',
    // dont change vite layout: pnpm create vite > Vanilla > TypesScript
    '**/playground/tsconfig.json',
    '**/__mocks__/**',
    '**/__fixtures__/**',
    '**/__generated__/**',
    '**/__playground__/**',
    './src/wasm.js',
  ],
}, {
  rules: {
    'no-restricted-globals': 'off',
  },
})
