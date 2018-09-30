# Vuepress Plugin Server Push

Server push links generator for vuepress.

## Install

```sh
npm add vuepress-plugin-server-push
```

## Usage

### Vuepress 1.x

```ts
// .vuepress/config.js
const path = require('path')

module.exports = {
  plugins: [
    ['server-push', {
      firebase: path.resolve('../firebase.json')
      netlify: '_headers' // only file name
    }]
  ]
}
```

### Vuepress 0.x

- Generate netlify `_headers` file

```sh
vuepress-server-push dist --netlify
```

- Generate firebase server push headers link to `firebase.json`

```sh
vuepress-server-push dist --firebase
```

- Using postbuild script

```ts
{
  scripts: {
    build: "vuepress build docs -d dist",
    postbuild: "vuepress-server-push dist --netlify",
  }
}
```

## Related
[Sitemap Generator](https://github.com/ekoeryanto/vuepress-plugin-sitemap)
