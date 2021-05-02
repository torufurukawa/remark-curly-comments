const unified = require('unified')
const markdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const rehype2react = require('rehype-react')
const React = require('react')
const html = require('rehype-stringify')
const comments = require('./index.js')
const test = require('ava')
// const removePosition = await import('unist-util-remove-position')

const proc = unified().use(markdown).use(comments).use(remark2rehype).use(html)

test('plain text', (t) => {
  const input = 'foo bar'
  const expexted = '<p>foo bar</p>'
  const result = proc.processSync(input).toString()
  t.is(result, expexted)
})

test('comment in html', (t) => {
  const input = 'foo {#bar}'
  const expexted = '<p>foo <comment>bar</comment></p>'
  const result = proc.processSync(input).toString()
  t.is(result, expexted)
})

test('html example', (t) => {
  const input = 'Hello, {#fix typo}world!'
  const expected = '<p>Hello, <comment>fix typo</comment>world!</p>'
  const result = unified()
    .use(markdown)
    .use(comments)
    .use(remark2rehype)
    .use(html)
    .processSync(input)
    .toString()

  t.is(result, expected)
})

test('react example', (t) => {
  const input = 'Hello, {#fix typo}world!'
  unified()
    .use(markdown)
    .use(comments)
    .use(remark2rehype)
    .use(rehype2react, { createElement: React.createElement })
    .processSync(input)
  // just checking no error
  t.pass()
})

// test transforming
const specs = [
  {
    input: [textNode('foo {#bar}')],
    expected: [textNode('foo '), commentNode('bar')]
  },
  {
    input: [textNode('{#foo} bar')],
    expected: [commentNode('foo'), textNode(' bar')]
  },
  {
    input: [textNode('foo {#bar} baz')],
    expected: [textNode('foo '), commentNode('bar'), textNode(' baz')]
  },
  {
    input: [textNode('hello {#foo} bar {#baz} xyzzy')],
    expected: [
      textNode('hello '),
      commentNode('foo'),
      textNode(' bar '),
      commentNode('baz'),
      textNode(' xyzzy')
    ]
  },
]
specs.map((spec) => {
  const title = spec.input.reduce(
    (result, val) => result += val.value || ' ',
    ''
  )
  test(title, macro, spec.input, spec.expected)

  async function macro(t, input, expected) {
    const remove = (await import('unist-util-remove-position')).removePosition
    const inputTree = generateTree(input)
    const expectedTree = generateTree(expected)
    const resultTree = unified().use(comments).runSync(inputTree)
    remove(resultTree, true)
    t.deepEqual(
      resultTree,
      expectedTree
    )

    function generateTree(nodes) {
      return {
        type: 'root',
        children: [{ type: 'paragraph', children: nodes }]
      }
    }
  }
})

// utilities

function textNode(value) {
  return { type: 'text', value: value }
}

function commentNode(value) {
  return {
    type: 'comment',
    data: { hName: 'comment' },
    children: [textNode(value)]
  }
}
