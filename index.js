#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const deepmerge = require('deepmerge')

var argv = require('minimist')(process.argv.slice(2));

const dest = argv.d || argv.dest || '.vuepress/dist'

const cwd = path.resolve(dest)

if (!fs.existsSync(cwd)) {
  console.error('Built dir not found')
  process.exit(1)
}

const files = glob
  .sync('**/*.html', { cwd })
  .filter(f => f.indexOf('404.html') === -1)

let headers = []

for (let x = 0; x < files.length; x++) {
  const file = fs.readFileSync(`${cwd}/${files[x]}`)
  const regex = /<link.*rel=(?:'|")(preload|prefetch)(?:'|").*>/g
  const found = file.toString('utf-8').match(regex)

  if (!found) continue

  const lines = found[0].split('<link').filter(x => x)
  let values = []
  lines.forEach(line => {
    /*
     * we care about order
     * line.match(/rel=(?:'|")(.*)(?:'|")\shref=(?:'|")(.*)(?:'|")\sas=(?:'|")(.*)(?:'|")/)
     */

    const rel = line.match(/rel=(?:'|")(.*?)(?:'|")/)
    const type = line.match(/as=(?:'|")(.*?)(?:'|")/)
    const href = line.match(/href=(?:'|")(.*?)(?:'|")/)
    let value = `<${href[1]}>; rel=${rel[1]}`

    if (type) {
      value += `; as=${type[1]}`
    }

    values.push(value)
  })

  headers.push({
    path: '/' + files[x].replace(/index\.html$/, ''),
    header: values.join(', '),
  })
}

if (argv.netlify || argv.n) {
  console.log(`creating file: ${cwd}/_headers`)
  const netlifyHeader = headers.map(h => `${h.path}\n\tLink: ${h.header}`)
  fs.appendFileSync(cwd + '/_headers', '\n' + netlifyHeader.join('\n'))
}

const firebaseJsonFile = path.resolve('firebase.json')

if(argv.firebase || argv.f && fs.existsSync(firebaseJsonFile)) {
  console.log(`updating file: ${firebaseJsonFile}`)
  let firebaseJson = fs.readFileSync(firebaseJsonFile)
  firebaseJson = JSON.parse(firebaseJson.toString())

  const pushHeader = headers.map(h => {
    return {
      source: h.path,
      headers: [
        {
          key: 'Link',
          value: h.header,
        },
      ],
    }
  })

  firebaseJson = deepmerge(firebaseJson, { hosting: { headers: pushHeader } })

  fs.writeFileSync(firebaseJsonFile, JSON.stringify(firebaseJson, null, 2))
}
