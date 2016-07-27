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

    let expanded = []
    text.split('\n').forEach( line => {
	if (!line.length) {
	    expanded.push('')
	    return
	}

	let r = []
	let chunks = line.split('\t')
	chunks.forEach( (chunk, idx) => {
	    if (!chunk.length) {
		r.push(sp(tab_width))
		return
	    }

	    if (idx === chunks.length - 1) {
		r.push(chunk)
		return
	    }

	    if (chunk.length === tab_width) {
		r.push(chunk)
		return
	    }

	    // a weird case
	    if (chunk.length === tab_width - 1) {
		r.push(chunk + sp(tab_width-chunk.length + tab_width))
		return
	    }

	    if (chunk.length < tab_width) {
		r.push(chunk + sp(tab_width-chunk.length))
		return
	    }

	    let re = new RegExp(`.{${tab_width}}`)
	    let peaces = chunk.split(re)
	    let last_peace = peaces[peaces.length-1]
	    let sp_count = last_peace.length === tab_width - 1 ?
		tab_width-last_peace.length + tab_width : // a weird case
		tab_width-last_peace.length
	    r.push(chunk + (last_peace.length ? sp(sp_count) : ''))
	})

	expanded.push(r.join(''))
    })

    return expanded.join('\n')
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
