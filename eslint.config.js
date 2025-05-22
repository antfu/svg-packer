import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/dist/**',
    '**/node_modules/**',
    // dont change vite layout: pnpm create vite > Vanilla > TypesScript
    '**/playground/tsconfig.json',
    './src/wasm.js',
  ],
}, {
  rules: {
    'no-restricted-globals': 'off',
  },
})
