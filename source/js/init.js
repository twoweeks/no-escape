'use strict'

document.addEventListener('DOMContentLoaded', () => {
	sessionStorage.clear()

	let
		game = $make.qs('.game'),
		sites = sitesList

	Object.keys(sites).forEach(site => {
		let whatToEmbed = ''
		if (sites[site].iframe && sites[site].iframe != '') {
			whatToEmbed = $create.elem('iframe')
			whatToEmbed.setAttribute('src', `iframes/${sites[site].iframe}`)
		} else {
			whatToEmbed = sitesContent[site]().cloneNode('true')
		}

		whatToEmbed.classList.add('game--site')
		whatToEmbed.setAttribute('id', site)

		game.appendChild(whatToEmbed)
	})

	let
		panel = $make.qs('.panel'),
		panelSites = $create.elem('ul', '', 'panel__sites-list')

	Object.keys(sites).forEach(site => {
		if (sites[site].hidden) { return }
		let siteLi = $create.elem('li', sites[site].title)

		if (site != 'main') siteLi.classList.add('hidden')

		siteLi.dataset.site = site
		siteLi.onclick = (() => choseSite(site))
		panelSites.appendChild(siteLi)
	})

	let playerCont = $create.elem('div', '', 'panel__anonfm')

	panel.appendChild(panelSites)

	if (navigator.onLine) {
		let player = $create.elem('audio', '', 'anon-fm')
		player.setAttribute('src', 'http://anon.fm:8000/radio')
		player.setAttribute('controls', '')
		player.setAttribute('controlsList', 'nodownload')
		player.setAttribute('preload', 'none')
		player.setAttribute('volume', '0.5')

		playerCont.appendChild($create.elem('p', 'Радио <q>Мир</q>'))
		playerCont.appendChild(player)
		panel.appendChild(playerCont)
	}

	choseSite('board')
	let main_sites = $make.qs('.game .main .main--sites .site-container', ['a'])
	Array.from(main_sites).forEach(site => {
		site.onclick = (() => choseSite(site.dataset.site))
	})
})
