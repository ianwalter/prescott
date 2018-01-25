const { parse } = require('../src/parser')
const { readFileSync } = require('fs')
const { resolve } = require('path')

const template = readFileSync(resolve(__dirname, 'fixtures/readme.prs'), 'utf8')
const output = parse(template)

describe('Parser', () => {
  test('parses a Handlebars type correctly', () => {
    const handlebars = output.filter(t => t.type === 'Handlebars')[0]
    expect(handlebars.value).toBe('name')
  })

  test('parses a iterate Tag correctly', () => {
    const iterate = output.filter(t => t.name === 'iterate')[0]
    expect(iterate.attributes).toContainEqual({ name: 'over', value: 'badges' })
    expect(iterate.attributes).toContainEqual({ name: 'value', value: 'badge' })
    expect(iterate.content.length).toBeGreaterThan(0)
  })
})
