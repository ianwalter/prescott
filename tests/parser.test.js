const { parse } = require('../src/parser')
const { readFileSync } = require('fs')
const { resolve } = require('path')

const template = readFileSync(resolve(__dirname, 'fixtures/readme.prs'), 'utf8')
const output = parse(template)

describe('Parser', () => {
  test('parses a Handlebars type correctly', () => {
    const handlebars = output.find(t => t.type === 'Handlebars')
    expect(handlebars.value).toBe('name')
  })

  test('parses a iterate Tag correctly', () => {
    const iterate = output.find(t => t.name === 'iterate')
    expect(iterate.attributes).toContainEqual({ name: 'over', value: 'badges' })
    expect(iterate.attributes).toContainEqual({ name: 'value', value: 'badge' })
    expect(iterate.content.length).toBeGreaterThan(0)
  })
})
