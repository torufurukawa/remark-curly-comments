const visit = require('unist-util-visit')
const is = require('unist-util-is')

const BEGIN = '{#'
const END = '}'
const REGEX = new RegExp(`(${BEGIN}.*?${END})`)

module.exports = function attacher() {
  return transform

  function transform(tree, file) {
    visit(tree, hasComment, visitor)
  }
}

function hasComment(node) {
  return (is(node, 'text') && REGEX.test(node.value))
}

function visitor(node, index, parent) {
  const texts = node.value.split(REGEX)
    .filter(text => text.length > 0)  // remove empty string

  const newNodes = texts.map((text) => {
    if (REGEX.test(text)) {
      return {
        type: 'comment',
        data: { hName: 'comment' },
        children: [
          {
            type: 'text',
            value: text
              .replace(BEGIN, '')
              .replace(END, '')
          }
        ]
      }
    } else {
      return { type: 'text', value: text }
    }
  })
  parent.children.splice(index, 1, ...newNodes)
}
