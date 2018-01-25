const { compile } = require('../lib/prescott')
const { readFileSync } = require('fs')
const { resolve } = require('path')

const template = readFileSync(resolve(__dirname, 'fixtures/readme.prs'), 'utf8')
const readme = readFileSync(resolve(__dirname, 'fixtures/readme.md'), 'utf8')

describe('Prescott', () => {
  test('can render a readme template correctly', () => {
    const data = {
      name: 'Generates',
      description: 'Easier file generation/scaffolding/bootstrapping',
      badges: [
        {
          key: 'npm',
          description: 'Npm page',
          image: 'https://img.shields.io/npm/v/generates.svg',
          url: 'https://www.npmjs.com/package/generates'
        },
        {
          key: 'build',
          description: 'Build status',
          image: 'https://circleci.com/ianwalter/generates.svg',
          url: 'https://circleci.com/ianwalter/generates'
        }
      ],
      year: 2018,
      author: {
        name: 'Ian Walter',
        url: 'https://iankwalter.com'
      }
    }
    const render = compile(template)
    expect(render(data)).toBe(readme)
  })
})
