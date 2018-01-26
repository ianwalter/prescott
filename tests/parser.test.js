const { parse } = require('../lib/parser')
const { readFileSync } = require('fs')
const { resolve } = require('path')

const readme = readFileSync(resolve(__dirname, 'fixtures/readme.prs'), 'utf8')
const parsedReadme = parse(readme)
const gitignorePath = resolve(__dirname, 'fixtures/gitignore.prs')
const parsedGitignore = parse(readFileSync(gitignorePath, 'utf8'))
const byIsIterate = t => t.name === 'iterate'
const gitignoreIterate = parsedGitignore.find(byIsIterate)

describe('Parser', () => {
  test('parses a Handlebars type correctly', () => {
    const handlebars = parsedReadme.find(t => t.type === 'Handlebars')
    expect(handlebars.value).toBe('name')
  })

  test('parses a iterate Tag correctly', () => {
    const readmeIterate = parsedReadme.find(byIsIterate)
    const over = { name: 'over', value: 'badges' }
    const value = { name: 'value', value: 'badge' }
    expect(readmeIterate.attributes).toContainEqual(over)
    expect(readmeIterate.attributes).toContainEqual(value)
    expect(readmeIterate.content.length).toBeGreaterThan(0)

    const last = { name: 'last', value: null }
    expect(gitignoreIterate.attributes).toContainEqual(last)
  })

  test('parses include Tag with unless condition', () => {
    const include = gitignoreIterate.content.find(t => t.name === 'include')
    expect(include.attributes).toContainEqual({ name: 'unless', value: 'last' })
    expect(include.content.length).toBeGreaterThan(0)
  })
})
