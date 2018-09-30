const fs = require('fs')
const globby = require('globby')

module.exports = ({ dest }) => {
  return globby('**/*.html', { cwd: dest, ignore: ['404.html'] })
    .then(files => {
      const headers = []

      for (let x = 0; x < files.length; x++) {
        const file = fs.readFileSync(`${dest}/${files[x]}`, 'utf-8')
        const regex = /<link.*rel=(?:'|")(preload|prefetch)(?:'|").*>/g
        const found = file.match(regex)

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

      return headers
    })
}
