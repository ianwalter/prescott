const parser = require('./parser')
const fs = require('fs')
const { resolve } = require('path')

const template = fs.readFileSync(resolve(__dirname, './example.prs'), 'utf8')

console.log(parser.parse(template))
