#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const spg = require('server-push-generator')

const transform = require('./transformer')

const args = process.argv.slice(2);

let dest = args.find(a => !a.startsWith('-'))

dest = path.resolve(dest)

if (!fs.existsSync(dest)) {
  console.error('Build dir not found')
  process.exit(1)
}

const isFirebase = args.some(a => a === '-f' || a === '--firebase')

spg({ cwd: dest, ignore: ['404.html'] })
  .then(headers => {
    // default to netlify headers
    if (isFirebase) {
      const firebaseJsonFile = path.resolve('firebase.json')
      console.log('updating firebase config file');
      transform.firebase(headers, firebaseJsonFile)
      console.log(`updated: ${firebaseJsonFile}`);
    } else {
      const targeFile = path.resolve(dest, '_headers')
      console.log('creating netlify headers file');
      transform.netlify(headers, targeFile)
      console.log(`created: ${targeFile}`);
    }
  })
