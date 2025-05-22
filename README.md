# SVG Packer

Pack SVGs to Icon Fonts - **In Browser**!

> This was born from [Icônes](https://github.com/antfu-collective/icones), an icon explorer that allows you to choice from 6,000+ icons then pack what you want into iconfonts! Do check it out :)

### NPM

```bash
npm i svg-packer
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/svg-packer"></script>
```

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

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/antfu/svg-packer)

Add the following plugin to your `vite.config.ts` file

```js
// vite.config.ts
import { defineConfig } from 'vite'
import { SvgPackerVitePlugin } from 'svg-packer/vite'

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

## License

MIT License © 2020-PRESENT [Anthony Fu](https://github.com/antfu)
