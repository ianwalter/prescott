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
    } else if (token.type === 'Mustache') {
      output += getValue(data, token.value) || ''
    } else if (token.type === 'BalancedTag') {
      if (token.name === 'iterate') {
        //
        const $over = token.attributes.find(a => a.name === 'over')
        let $list = getValue(data, $over.value)
        if ($list instanceof Array) {
          $list = $list.map((v, i) => [i, v])
        } else if ($list instanceof Object) {
          $list = Object.entries($list)
        } else if ($list instanceof Map) {
          $list = Array.from($list)
        } else {
          // TODO throw error
        }

        //
        const key = token.attributes.find(a => a.name === 'key')
        const value = token.attributes.find(a => a.name === 'value')
        const last = token.attributes.find(a => a.name === 'last')
        let i = 1
        for (const [k, v] of $list) {
          const $data = Object.assign({}, data)
          if (key) {
            $data[key.value || 'key'] = k
          }
          if (value) {
            $data[value.value || 'value'] = v
          }
          if (last) {
            $data[last.value || 'last'] = i === $list.length
          }
          output = appendOutput(output, token.content, $data)
          i++
        }
      } else if (token.name === 'include') {
        const $if = token.attributes.find(a => a.name === 'if')
        const $ifPass = $if && $if.value && getValue(data, $if.value)
        const $unless = token.attributes.find(a => a.name === 'unless')
        const $unlessValue = $unless && $unless.value
        const $unlessPass = $unlessValue && !getValue(data, $unless.value)
        if ($ifPass || $unlessPass) {
          output = appendOutput(output, token.content, data)
        }
      } else if (token.name === 'else') {

      }
    } else if (token.type === 'SelfClosingTag') {
      if (token.name === 'include') {
        const $template = token.attributes.find(a => a.name === 'template')
        const $templateValue = $template && $template.value
        const render = getValue(data, $templateValue)
        if ($templateValue && render instanceof Function) {
          output += render(data)
        }
      } else if (token.name === 'n') {
        output += '\n'
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
