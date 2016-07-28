# untabify

Convert all tabs in a string to multiple spaces & vice versa,
preserving columns.

	npm install untabify

## Why?

Suppose you have a string

	.»      ..»     ...»    »       ....»   .....»  ......» ............»   .

(`»` here represents a beginning of a tab char)

Its real length is 42. But if you print that string via
`console.log()`, it consumes 73 columns in the xterm terminal.

There are [several](http://stackoverflow.com/questions/8315134)
[questios](http://stackoverflow.com/questions/12248360) on SO like
"How to determine the printed length of a string with tab characters
expanded?" but no useful answers.

Well, the answer is obvious if we have `untabify()` function.

## Examples

~~~
let untabify = require('untabify').untabify

let t1 = '.\t..\t...\t\t....\t.....\t......\t............\t.'
console.log(t1)
console.log(t1.length)
console.log(untabify(t1))
console.log(untabify(t1).length)
console.log(untabify(t1, 8, '»'))
~~~

which prints:

~~~
.       ..      ...             ....    .....   ......  ............    .
42
.       ..      ...             ....    .....   ......  ............    .
73
.»      ..»     ...»    »       ....»   .....»  ......» ............»   .
~~~

There is also `tabify()` as well. It works not like unexpand(1), but
more like Emacs `tabify` function, i.e. it tries to preserve the
visual formatting.

~~~
let assert = require('assert')
let tabify = require('untabify').tabify

assert.equal('      1\t1\t2', tabify('      1 1       2'))
~~~

## Where are the tests?

In the end of `index.js` file.

## License

MIT.
