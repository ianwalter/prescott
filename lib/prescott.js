const clone = require('clone')

const { parse } = require('./parser')

function appendOutput (output, tokens, data) {
  for (const token of tokens) {
    if (token.type === 'Text') {
      output += token.content
    } else if (token.type === 'Handlebars') {
      let value
      for (const namespace of token.value.split('.')) {
        if (value) {
          value = value[namespace]
        } else {
          value = data[namespace]
        }
      }
      output += value
    } else if (token.type === 'SelfClosingTag') {
      if (token.name === 'n') {
        output += '\n'
      }
    } else if (token.type === 'BalancedTag') {
      if (token.name === 'iterate') {
        //
        const over = token.attributes.find(a => a.name === 'over')
        let collection = data[over.value]
        if (collection instanceof Array) {
          collection = collection.map((v, i) => [i, v])
        } else if (collection instanceof Object) {
          collection = Object.entries(data[over])
        } else if (collection instanceof Map) {
          collection = Array.from(collection)
        } else {
          // TODO throw error
        }

        //
        const key = token.attributes.find(a => a.name === 'key')
        const value = token.attributes.find(a => a.name === 'value')
        for (const [i, v] of collection) {
          const localData = clone(data)
          if (key) {
            localData[key.value] = i
          }
          if (value) {
            localData[value.value] = v
          }
          output = appendOutput(output, token.content, localData)
        }
      } else if (token.name === 'if') {

      } else if (token.name === 'else') {

      }
    }
  }

  return output
}

module.exports = {
  parse,
  compile: template => {
    // Parse the given template using the Peg.js parser.
    const tokens = parse(template)

    return data => appendOutput('', tokens, data)
  }
}
