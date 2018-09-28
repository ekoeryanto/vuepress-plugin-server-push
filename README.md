# Netlify Plugin Server Push

Server push links generator for vuepress.

## Install

```sh
npm add vuepress-plugin-server-push
```

## Usage

### Generate server push link to netlify `_headers`
```sh
vuepress-server-push -d dist --netlify
```

### Generate firebase server push headers link to `firebase.json`

```sh
vuepress-server-push -d dist --firebase
```

### Using postbuild script

```ts
{
  scripts: {
    build: "vuepress build docs -d dist",
    postbuild: "vuepress-server-push -d dist --netlify",
  }
}
```

## Related
[Sitemap Generator](https://github.com/ekoeryanto/vuepress-plugin-sitemap)
