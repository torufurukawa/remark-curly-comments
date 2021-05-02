# remark-curly-comments
[**remark**][remark] plugin to support comments.

## Install

```sh
npm install remark-breaks
```

## Use

Suppose we have a Markdown text and script as follows:

```js
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'
import comments from 'remark-curly-comments'

const text = 'Hello, {#fix typo}world!'

const result = unified()
    .use(markdown)
    .use(comments)
    .use(remark2rehype)
    .use(html)
    .processSync(text)

console.log(result.toString())
```

Now, running the script yields:

```html
<p>Hello, <comment>fix typo</comment>world!</p>
```

## API

### `remark().use(comments)`

Plugin to add comments support.

## remark-react

If you use rehype-react and want to replace `<comment>` tag with your own component, pass `component` object to rehype-react transformer:

```js
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'
import html from 'rehype-stringify'
import comments from 'remark-curly-comments'

const content = unified()
  .use(markdown)
  .use(comments)
  .use(remark2rehype)
  .use(rehype2react, {
    createElement: React.createElement,
    components: {comment: Comment}
  })
  .processSync(content)
```

## License

MIT © Toru Furukawa
