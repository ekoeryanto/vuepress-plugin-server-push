const fs = require('fs')

module.exports.netlify = (headers, headersFile) => {
  const netlifyHeader = headers.map(h => `${h.path}\n\tLink: ${h.header}`)
  fs.appendFileSync(headersFile, '\n' + netlifyHeader.join('\n'))
}

module.exports.firebase = (headers, firebaseJsonFile) => {
  const deepmerge = require('deepmerge')
  let firebaseJson = {}

  if (fs.existsSync(firebaseJsonFile)) {
    firebaseJson = fs.readFileSync(firebaseJsonFile, 'utf-8')
    firebaseJson = JSON.parse(firebaseJson)
  }

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
