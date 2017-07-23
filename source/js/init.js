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
		whatToEmbed.setAttribute('id', site)

		game.appendChild(whatToEmbed)
	})

	let
		panel = $make.qs('.panel'),
		panelSites = $create.elem('ul', '', 'panel--sites-list')

	Object.keys(sites).forEach(site => {
		if (sites[site].hidden) { return }
		let siteLi = $create.elem('li', sites[site].title)
		siteLi.onclick = (() => choseSite(site))
		panelSites.appendChild(siteLi)
	})

	panel.appendChild(panelSites)

	choseSite('board')
	let main_sites = $make.qs('.game .main .main--sites .site-container', ['a'])
	Array.from(main_sites).forEach(site => {
		site.onclick = (() => choseSite(site.dataset.site))
	})
})
