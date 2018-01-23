Content = (Comment / BalancedTag / SelfClosingTag / Handlebars / Text)*

ws = [ \n\t]* { return '' }

Handlebars = "{{" ws chars:[a-zA-Z0-9_\.\[\]\'\"]+ ws "}}" {
  return {
    type: 'Handlebars',
    value: chars.join('')
  }
}

Comment = "<!--" c:(!"-->" c:. { return c })* "-->" {
  return {
    type: 'Comment',
    content: c.join('')
  }
}

BalancedTag = startTag:StartTag content:Content endTag:EndTag {
  if (startTag.name != endTag) {
    throw new Error('Expected </' + startTag.name + '> but </' + endTag + '> found.')
  }

  return {
    type: 'BalancedTag',
    name: startTag.name,
    attributes: startTag.attributes,
    content,
    offset: startTag.offset
  }
}

SelfClosingTag = "<" name:TagName attributes:Attributes* "/>" {
  return {
    type: 'SelfClosingTag',
    name: name,
    attributes: attributes
  }
}

StartTag = "<" name:TagName attributes:Attributes* ">" "\n"? {
  return {
    name,
    attributes,
    offset: location().start.offset
  }
}

EndTag = "</" name:TagName ">" "\n"? { return name }

Attributes = " " attributes:Attribute* { return attributes }

Attribute = (ValuedAttribute / ValuelessAttribute)

ValuedAttribute = name:AttributeName "=" value:AttributeValue {
  return {
    name: name,
    value: value
  }
}

ValuelessAttribute = name:AttributeName {
  return {
    name: name,
    value: null
  }
}

AttributeName = chars:[a-zA-Z0-9\-]+ { return chars.join('') }
AttributeValue = (QuotedAttributeValue / UnquotedAttributeValue)

QuotedAttributeValue = value:QuotedString { return value }

UnquotedAttributeValue = value:decimalDigit* { return value.join('') }

TagName = "n" / "iterate" / "if" / "else" / "escape"

Text = chars:(!Handlebars !StartTag !EndTag .) {
  return {
    type: 'Text',
    content: chars.join('')
  }
}

decimalDigit = [0-9]

QuotedString = quoteStart:('"'/"'") chars:[a-zA-Z0-9://\.-]+ quoteEnd:('"'/"'") {
  if (quoteStart != quoteEnd) {
    throw new Error('Unmatched quote; Expected ' + quoteStart + ' but ' + quoteEnd + ' found.')
  }
  return chars.join('')
}
