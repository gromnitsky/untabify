'use strict';

let spaces = function(count, marker = '') {
    if (count < 1) return ''
    if (marker.length > 1) marker = ''
    if (marker) count--
    return marker + ' '.repeat(count)
}

let untabify = function(text, tab_width = 8, marker = '') {
    if (!text) return ''
    if (tab_width < 2) tab_width = 2

    return text.split('\n').map( line => {
	let offset = 0
	return line.replace(/\t/g, (_, idx) => {
	    let max = tab_width - (idx + offset) % tab_width
	    offset += max - 1
	    return spaces(tab_width, marker).slice(0, max)
	})

    }).join('\n')
}

// according to the tests of unexpand(1), a single trailing space
// should "not be converted to a tab, when before a field starting
// with non blanks", so maybe we should adhere to that too in the
// future if somebody will complain.
let tabify = function(text, tab_width = 8) {
    if (!text) return ''
    if (tab_width < 2) tab_width = 2

    let re = new RegExp(`.{1,${tab_width}}`, 'g')

    return untabify(text).split('\n').map( line => {
	return line.match(re).map( chunk => {
	    return chunk.replace(/\s+$/, '\t')
	}).join('')
    }).join('\n')
}

exports.untabify = untabify
exports.tabify = tabify

// tests
if (__filename === process.argv[1]) {
    let assert = require('assert')

    let t1 = '.\t..\t...\t\t....\t.....\t......\t............\t.'

    assert.equal(`.       ..      ...             ....    .....   ......  ............    .`, untabify(t1))

    console.log(t1)
    console.log(t1.length)
    console.log(untabify(t1))
    console.log(untabify(t1).length)
    console.log(untabify(t1, 8, '»'))
    console.log(untabify(t1, 8, '»').length)

    assert.equal('', untabify(''))
    assert.equal('', untabify(null))
    assert.equal('1234567890', untabify('1234567890', 2))

    assert.equal('12345678', untabify('12345678'))
    assert.equal('12345678  ', untabify('12345678\t', 2))
    assert.equal('12345678        ', untabify('12345678\t'))
    assert.equal('1234567 12345678        ',
			 untabify('1234567\t12345678\t'))
    assert.equal('123456781234567 1', untabify('123456781234567\t1'))

    assert.equal('12345678  \n12345678', untabify('12345678\t\n12345678', 2))
    assert.equal('12345678  \n\n12345678', untabify('12345678\t\n\n12345678', 2))

    assert.equal('1\t', tabify('1       '))
    assert.equal('      1\t1\t2', tabify('      1 1       2'))
    assert.equal('\t1\t\t\t\t\t\t\t\t\t2\t3',
		 tabify('        1\t\t\t\t\t\t\t\t\t2       3'))
    assert.equal(t1, tabify(untabify(t1)))
}
