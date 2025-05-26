# SVG Packer

Pack SVGs to Icon Fonts - **In Browser**!

> This was born from [Icônes](https://github.com/antfu-collective/icones), an icon explorer that allows you to choice from 6,000+ icons then pack what you want into iconfonts! Do check it out :)

### NPM

```bash
npm i svg-packer
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/svg-packer@1.0"></script>
```

### Playground

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/antfu/svg-packer)

> [!NOTE]
> The Vitest tests won't work in StackBlitz, the Vite playground will be started.

## Usage

Packing:

```js
const result = await SvgPacker({
  fontName: 'My Awesome Font',
  fileName: 'awesome-font',
  cssPrefix: 'af',
  icons: [{
    name: 'add',
    svg: '...svg content'
  }, {
    name: 'pencil',
    svg: '...svg content'
  }]
})

// Download zip with all files
save(result.zip.url)
save(result.zip.blob)

// Download individual font files
save(result.files.svg.url) // svg font
save(result.files.ttf.url)
save(result.files.woff.url)
save(result.files.woff2.url)
save(result.files.css.url)
save(result.files.demoHTML.url)
```

Use:

```html
<link rel="stylesheet" href="./awesome-font.css">

<!-- Use the icon! -->
<i class="af pencil"></i>
```

## Vite

From version `v1.0.0` you can use `svg-packer` with Vite:

Add the following plugin to your `vite.config.ts` file

```js
// vite.config.ts
import { SvgPackerVitePlugin } from 'svg-packer/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [SvgPackerVitePlugin()],
})
```

then in your logic use static or dynamic import:

```ts
import { SvgPacker } from 'svg-packer'

const result = await SvgPacker({ /* options */ })
// Download zip with all files
save(result.zip.url)
save(result.zip.blob)

// Download individual font files
save(result.files.svg.url) // svg font
save(result.files.ttf.url)
save(result.files.woff.url)
save(result.files.woff2.url)
save(result.files.css.url)
save(result.files.demoHTML.url)
```

## Running tests in your local environment

We're using [Vitest](https://vitest.dev) for testing the library, you can run the following tests in your local environment using the following scripts from the root folder:
- `test:node`: run ESM test in Node in watch mode ([esm.test.ts](./test/esm.test.ts))
- `test:node:run`: run ESM test in Node without the watch mode ([esm.test.ts](./test/esm.test.ts))
- `test:node:ui`: run ESM test in Node in watch mode with Vitest UI reporter ([esm.test.ts](./test/esm.test.ts))
- `test:browser`: run IIFE test in the browser in watch mode using Vitest Browser mode with Playwright ([iife.browser.ts](./test/iife.browser.ts))
- `test:browser:headless`: run IIFE test in the browser using Vitest Browser mode with Playwright with the headless mode ([iife.browser.ts](./test/iife.browser.ts))
- `test:browser:preview`: run IIFE test in the browser in watch mode using Vitest Browser mode with your default browser ([iife.browser.ts](./test/iife.browser.ts))
- `test:playground`: run ESM test with Vite in the browser in watch mode using Vitest Browser mode with Playwright ([vite.test.ts](./playground/test/vite.test.ts))
- `test:playground:headless`: run ESM test with Vite in the browser using Vitest Browser mode with Playwright with the headless mode ([vite.test.ts](./playground/test/vite.test.ts))
- `test`: run ESM test in Node in watch mode ([esm.test.ts](./test/esm.test.ts)) and IIFE test in the browser in watch mode using Vitest Browser mode with your default browser ([iife.browser.ts](./test/iife.browser.ts))
- `test:headless`: run ESM test in Node without the watch mode ([esm.test.ts](./test/esm.test.ts)), IIFE test in the browser using Vitest Browser mode with Playwright with the headless mode ([iife.browser.ts](./test/iife.browser.ts)) and ESM test with Vite in the browser using Vitest Browser mode with Playwright with the headless mode ([vite.test.ts](./playground/test/vite.test.ts))

The `test:ci` should be used only in CI environments, it will run the same tests in `test:headless`.

## License

MIT License © 2020-PRESENT [Anthony Fu](https://github.com/antfu)
