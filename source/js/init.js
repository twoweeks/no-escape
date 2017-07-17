'use strict'

document.addEventListener('DOMContentLoaded', () => {
	let game = $make.qs('.game')

	for (let key in sitesContent) {
		if (sitesContent.hasOwnProperty(key)) {
			game.appendChild(sitesContent[key]())
		}
	}
})
