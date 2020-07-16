# SVG Packer

Pack SVGs to Icon Fonts - **In Browser**!

> This was built for [Iconify Explorer](https://github.com/antfu/iconify-explorer), it allows you to choice from 6,000+ icons then pack what you want into iconfonts! Please do check it out :)

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
