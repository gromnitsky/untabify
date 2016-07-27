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

    let sp = (count) => spaces(count, marker)

    return text.split('\n').map( line => {
	if (!line.length) return ''

	let chunks = line.split('\t')
	return chunks.map( (chunk, idx) => {
	    if (!chunk.length) return sp(tab_width)
	    if (idx === chunks.length - 1) return chunk
	    if (chunk.length === tab_width) return chunk

	    // a weird case
	    if (chunk.length === tab_width - 1)
		return (chunk + sp(tab_width-chunk.length + tab_width))

	    if (chunk.length < tab_width)
		return (chunk + sp(tab_width - chunk.length))

	    let re = new RegExp(`.{${tab_width}}`)
	    let peaces = chunk.split(re)
	    let last_peace = peaces[peaces.length-1]
	    let sp_count = last_peace.length === tab_width - 1 ?
		tab_width-last_peace.length + tab_width : // a weird case
		tab_width-last_peace.length
	    return (chunk + (last_peace.length ? sp(sp_count) : ''))
	}).join('')

    }).join('\n')
}

exports.untabify = untabify
exports.tabify = function() {
    throw new Error('not implemented')
}

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
    assert.equal('1234567         12345678        ',
		 untabify('1234567\t12345678\t'))
    assert.equal('123456781234567         1', untabify('123456781234567\t1'))

    assert.equal('12345678  \n12345678', untabify('12345678\t\n12345678', 2))
    assert.equal('12345678  \n\n12345678', untabify('12345678\t\n\n12345678', 2))

}
