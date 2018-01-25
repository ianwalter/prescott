const { parse } = require('./parser')

module.exports = {
  compile: template => {
    // Parse the given template using the Peg.js parser.
    const parsedTemplate = parse(template)

    return data => {
      let output = ''

      for (const token of parsedTemplate) {
        if (token.type === 'Text') {
          output += token.content
        } else if (token.type === 'Handlebars') {
          output += data[token.value]
        } else if (token.type === 'SelfClosingTag') {
          if (token.name === 'n') {
            output += '\n'
          }
        } else if (token.type === 'BalancedTag') {
          if (token.name === 'iterate') {

          } else if (token.name === 'if') {

          } else if (token.name === 'else') {

          }
        }
      }

      return output
    }
  }
}
