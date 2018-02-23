const { compile } = require('../lib/prescott')
const { readFileSync } = require('fs')
const { resolve } = require('path')

const fixture = file => resolve(__dirname, `fixtures/${file}`)

describe('Prescott', () => {
  test('can render the readme template correctly', () => {
    const main = readFileSync(fixture('readme.prs'), 'utf8')
    const install = readFileSync(fixture('install.prs'), 'utf8')
    const usage = readFileSync(fixture('usage.prs'), 'utf8')
    const output = readFileSync(fixture('readme.md'), 'utf8')
    const data = {
      name: 'Generates: Readme',
      shortName: 'generates-readme',
      description: 'Easier file generation/scaffolding/bootstrapping',
      sections: {
        install: {
          title: 'Installation',
          template: compile(install)
        },
        usage: {
          title: 'CLI Usage',
          template: compile(usage)
        }
      },
      year: 2018,
      author: {
        name: 'Ian Walter',
        url: 'https://iankwalter.com'
      }
    }
    const render = compile(main)
    expect(render(data)).toBe(output)
  })

  test('can render the gitignore template correctly', () => {
    const template = readFileSync(fixture('gitignore.prs'), 'utf8')
    const output = readFileSync(fixture('gitignore.txt'), 'utf8')
    const data = {
      sections: {
        os: {
          comment: 'OS-generated files',
          lines: ['.DS_Store']
        },
        deps: {
          comment: 'Application dependencies',
          lines: ['node_modules']
        }
      }
    }
    const render = compile(template)
    expect(render(data)).toBe(output)
  })
})
