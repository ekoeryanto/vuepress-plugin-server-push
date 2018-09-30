#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const crawl = require('./crawler')
const transform = require('./transformer')

const args = process.argv.slice(2);

let dest = args.find(a => !a.startsWith('-'))

dest = path.resolve(dest)

if (!fs.existsSync(dest)) {
  console.error('Build dir not found')
  process.exit(1)
}

const isNetlify = args.find(a => a === '-n' || a === '--netlify')

crawl({ dest })
  .then(headers => {
    // default to netlify headers
    if (isNetlify) {
      const targeFile = path.resolve(dest, '_headers')
      console.log('creating netlify headers file');
      transform.netlify(headers, targeFile)
      console.log(`created: ${targeFile}`);
    } else {
      const firebaseJsonFile = path.resolve('firebase.json')
      console.log('updating firebase config file');
      transform.firebase(headers, firebaseJsonFile)
      console.log(`updated: ${firebaseJsonFile}`);
    }
  })
