'use strict'

if (window.self == window.top) { document.body.textContent = 'Так нельзя!' }

var $pK = { // parent Kamina
	make: parent.$make,
	create: parent.$create,
	ls: parent.$ls,
	lss: parent.$lss
}

document.addEventListener('DOMContentLoaded', () => {
	let links = document.querySelectorAll('span[data-link]')
	if (links) {
		Array.from(links).forEach(link => {
			let data = link.dataset
			if (data.linkRef == '') { delete data.linkRef }
			link.onclick = () => {
				location = `./${data.link}.html${(data.linkRef && data.linkRef !== '') ? '#' + data.linkRef : ''}`
			}
		})
	}
})
