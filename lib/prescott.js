const { parse } = require('./parser')

function getValue (data, path) {
  let value
  for (const namespace of path.split('.')) {
    value = value ? value[namespace] : data[namespace]
  }
  return value
}

function appendOutput (output, tokens, data) {
  for (const token of tokens) {
    if (token.type === 'Text') {
      output += token.content
    } else if (token.type === 'Handlebars') {
      output += getValue(data, token.value)
    } else if (token.type === 'SelfClosingTag') {
      if (token.name === 'n') {
        output += '\n'
      }
    } else if (token.type === 'BalancedTag') {
      if (token.name === 'iterate') {
        //
        const over = token.attributes.find(a => a.name === 'over')
        let collection = getValue(data, over.value)
        if (collection instanceof Array) {
          collection = collection.map((v, i) => [i, v])
        } else if (collection instanceof Object) {
          collection = Object.entries(collection)
        } else if (collection instanceof Map) {
          collection = Array.from(collection)
        } else {
          // TODO throw error
        }

        //
        const key = token.attributes.find(a => a.name === 'key')
        const value = token.attributes.find(a => a.name === 'value')
        const last = token.attributes.find(a => a.name === 'last')
        let i = 1
        for (const [k, v] of collection) {
          const localData = Object.assign({}, data)
          if (key) {
            localData[key.value || 'key'] = k
          }
          if (value) {
            localData[value.value || 'value'] = v
          }
          if (last) {
            localData[last.value || 'last'] = i === collection.length
          }
          output = appendOutput(output, token.content, localData)
          i++
        }
      } else if (token.name === 'include') {
        const $if = token.attributes.find(a => a.name === 'if')
        const $unless = token.attributes.find(a => a.name === 'unless')
        const $ifPass = $if && $if.value && getValue(data, $if.value)
        const $unlessValue = $unless && $unless.value
        const $unlessPass = $unlessValue && !getValue(data, $unless.value)
        if ($ifPass || $unlessPass) {
          output = appendOutput(output, token.content, data)
        }
      } else if (token.name === 'else') {

      }
    }
  }

  return output
}

module.exports = {
  compile: template => {
    // Parse the given template using the Peg.js parser.
    const tokens = parse(template)

    return data => appendOutput('', tokens, data)
  }
}
