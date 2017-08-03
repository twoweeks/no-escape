'use strict'

var WM = function() {
	this.tags = []
	this.bypassTags = []
	this.lists = []

	this.options = {
		makeLinks: false,
		bypass: true,
		greenquoting: true,
		makeEmbeds: false,
		makeLists: true,
		reduceNewlines: true
	}

	// this.clinks = {
	// 	exp: /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(?=\s+|<|$)/gi,
	// 	rep: "<a href='$1'>$1</a>"
	// }

	this.escapechars = [
		[/\'/g, '&#039;'],
		[/\"/g, '&quot;'],
		[/</g, '&lt;'],
		[/\>/g, '&gt;'],
		[/&/g, '&amp;'],
	]

	this.escRX = (exp => exp.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'))

	this.escHTML = function(string) {
		for (let i = this.escapechars.length - 1; i >= 0; i--) {
			string = string.replace(this.escapechars[i][0], this.escapechars[i][1])
		}
		return string
	}

	this.newTag = function(pattern, replace, inline) {
		if (typeof inline === "undefined") inline = false

		for (let i = 0; i <= 1; i++) { pattern[i] = this.escRX(this.escHTML(pattern[i])) }

		let
			capture = inline ? '((?:(?!<br(?: \/)?>).)*)' : '([\\s\\S]+?)',
			exp = new RegExp(pattern[0] + capture + pattern[1], 'mg')

		return { exp: exp, rep: replace[0] + '$1' + replace[1] }
	}

	this.apply = function(str) {
		let tag = {}

		//html escape
		str = this.escHTML(str)

		//Bypass
		if (this.options.bypass) {
			for (let i = this.bypassTags.length - 1; i >= 0; i--) {
				tag = this.bypassTags[i];
					str = str.replace(tag.exp, function(match, p1, offset, s) {
						let tagEscapeChars = [
							[/\*/mg,    '&#42;'],
							[/_/mg,     '&#95;'],
							[/\[/mg,    '&#91;'], [/\]/mg, '&#93;'],
							[/%/mg,     '&#37;'],
							[/\&gt;/g,  '&#62;'],
							[/~/g,      '&#126;'],
							[/\//mg,    '&#47;'], [/:/mg, '&#58;'], [/\./mg, '&#46;'],
							[/\#/mg,    '&#35;' /* MUST BE LAST */],
						], after

						for (let j = tagEscapeChars.length - 1; j >= 0; j--) {
							after = p1.replace(tagEscapeChars[j][0], tagEscapeChars[j][1]);
							// console.log('before: '+p1+', after: '+after)
							p1 = after
						}

						return tag.rep.split('$1')[0]+p1+tag.rep.split('$1')[1]
					})
			}
		}

		//>implying
		if (this.options.greenquoting) {
			//var result = "";
			str = str.replace(
				/^(?:\&gt;)([^\r\n]+)/mg,
				'<span class="green">\&gt;$1</span>'
			)
		}

		//lists
		if (this.options.makeLists) {
			for (let i = this.lists.length - 1; i >= 0; i--) {
				tag = this.lists[i]

				let
					xp = new RegExp('((?:(?:(?:^'+tag.exp+')(?:[^\\r\\n]+))(?:\\r|\\n?))+)', 'mg'),
					ixp = new RegExp('(?:'+tag.exp+')([^\\r\\n]+)', 'mg')

				str = str.replace(xp, function(match, p1, offset, s) {
					let p = p1, list = p.split('\n'), result=tag.rep[0]

					arr_iterate(list, function(elem) {
						result += elem.replace(ixp, "<li>$1</li>");
					})

					result += tag.rep[1]
					return(result)
				})
			}
		}

		str = str.replace(/(\r\n|\n\r|\r|\n)/mg,'<br>')

		if (this.options.reduceNewlines) { str = str.replace(/(<br \/>){2,}/mg, '<br><br>') }

		//apply formatting
		for (let i = this.tags.length - 1; i >= 0; i--) {
			tag = this.tags[i]
			str = str.replace(tag.exp, tag.rep)
		}

		//make links clickable
		// if (this.options.makeLinks) {
		// 	str = str.replace(this.clinks.exp, this.clinks.rep);
		// }

		return str
	}

	this.registerTags = function(tags, destination, inline) {
		let tag = [], result

		if (typeof inline === 'undefined') inline = false

		if (destination === 'lists') {
			for (let i = tags.length - 1; i >= 0; i--) {
				tag = tags[i]
				result = this.escRX(this.escHTML(tag[0]))
				this.lists.push({exp: result, rep: tag[1]})
			}
		} else {
			for (let i = tags.length - 1; i >= 0; i--) {
				tag = tags[i]
				result = this.newTag(tag[0], tag[1], inline)

				if (destination === 'bypass') {
					this.bypassTags.push(result)
				} else this.tags.push(result)
			}
		}
	}
}

var arr_iterate = ((array, callback) => {
	for (let i = 0; i < array.length; i++ ) { callback(array[i]) }
})

var headers = [
	[['######', '######'],  ['<h6>', '</h6>']],
	[['#####', '#####'],    ['<h5>', '</h5>']],
	[['####', '####'],      ['<h4>', '</h4>']],
	[['###', '###'],        ['<h3>', '</h3>']],
	[['##', '##'],          ['<h2>', '</h2>']]
]

var wmTags = [
	[['**','**'],      ['<b>', '</b>']],
	// [['__','__'],   ['<b>','</b>']],
	[['*','*'],        ['<i>', '</i>']],
	// [['_','_'],     ['<i>','</i>']]
]

var quoteTags = [
	[['[q]', '[/q]'],          ['<blockquote>', '</blockquote>']],
	[['[Q]', '[/Q]'],          ['<blockquote>', '</blockquote>']],
	[['[quote]', '[/quote]'],  ['<blockquote>', '</blockquote>']],
	[['[QUOTE]', '[/QUOTE]'],  ['<blockquote>', '</blockquote>']]
]

var kuTags = [
	[['[b]', '[/b]'],              ['<b>', '</b>']],
	[['[B]', '[/B]'],              ['<b>', '</b>']],
	[['[i]', '[/i]'],              ['<i>', '</i>']],
	[['[I]', '[/I]'],              ['<i>', '</i>']],
	[['[u]', '[/u]'],              ['<span style="text-decoration: underline">', '</span>']],
	[['[U]', '[/U]'],              ['<span style="text-decoration: underline">', '</span>']],
	[['[s]', '[/s]'],              ['<strike>', '</strike>']],
	[['[S]', '[/S]'],              ['<strike>', '</strike>']],
	[['~~', '~~'],                 ['<strike>', '</strike>']],
	[['%%', '%%'],                 ['<span class="spoiler">', '</span>']],
	[['[spoiler]', '[/spoiler]'],  ['<span class="spoiler">', '</span>']],
	[['[SPOILER]', '[/SPOILER]'],  ['<span class="spoiler">', '</span>']]
]

var twoTags = [
	[['[sub]', '[/sub]'],  ['<sub>', '</sub>']],
	[['[SUB]', '[/SUB]'],  ['<sub>', '</sub>']],
	[['[sup]', '[/sup]'],  ['<sup>', '</sup>']],
	[['[SUP]', '[/SUP]'],  ['<sup>', '</sup>']]
]

var
	one = 'c',
	three = 'j',
	two = 'o',
	five = 'm',
	four = 'a'

var creatorTag = [
	[['[creator]', '[/creator]'], [`делатели контента, ${one}${two}${three}${four}${five}.ru`, '']]
]

var myUlTags = [
	[['__', '__'],	['<span style="text-decoration: underline">', '</span>']]
]

var bypassTags = [
	[['[code]', '[/code]'],  ['<pre class="code">', '</pre>']],
	[['[CODE]', '[/CODE]'],  ['<pre class="code">', '</pre>']],
	[['`', '`'],             ['<pre class="inline code">', '</pre>']]
];

var lists = [
	["* ", ['<ul>', '</ul>']],
	["# ", ['<ol>', '</ol>']]
];

var wm = new WM()

wm.registerTags(creatorTag)
wm.registerTags(wmTags)
wm.registerTags(kuTags)
wm.registerTags(twoTags)
wm.registerTags(myUlTags)
wm.registerTags(headers)
wm.registerTags(quoteTags)
wm.registerTags(bypassTags, 'bypass')
wm.registerTags(lists, 'lists')
