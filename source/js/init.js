'use strict'

document.addEventListener('DOMContentLoaded', () => {
	let
		game = $make.qs('.game'),
		sites = sitesList

	Object.keys(sites).forEach(site => {
		let whatToEmbed = ''
		if (sites[site].iframe && sites[site].iframe != '') {
			whatToEmbed = $create.elem('iframe')
			whatToEmbed.setAttribute('src', `/iframes/${sites[site].iframe}`)
		} else {
			whatToEmbed = sitesContent[site]().cloneNode('true')
		}

		whatToEmbed.classList.add('game--site')
		whatToEmbed.dataset.site = site

		game.appendChild(whatToEmbed)
	})

	choseSite('wiki')
	let main_sites = $make.qs('.game .main .main--sites .site-container', ['a'])
	Array.from(main_sites).forEach(site => {
		site.onclick = (() => choseSite(site.dataset.site))
	})
})
