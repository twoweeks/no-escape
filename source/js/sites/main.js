'use strict'

document.addEventListener('DOMContentLoaded', () => {
	let
		sitesContaner = $create.elem('div', '', 'main--sites'),
		sites = parent.window.sitesList

	Object.keys(sites).forEach(site => {
		if (site == 'main' || sites[site].hidden == true) { return }

		let
			siteC = $create.elem('div', '', 'site-container'),
			siteShot = $create.elem('div', '', 'site-container--shot'),
			siteName = $create.elem('div', '', 'site-container--name')

		if (sites[site].shot && sites[site].shot != '') { siteShot.style.backgroundImage = `url('/assets/img/site_shots/${sites[site].shot}')` }

		siteName.textContent = sites[site].title

		siteC.onclick = (() => { parent.window.choseSite(site) })

		siteC.appendChild(siteShot)
		siteC.appendChild(siteName)

		siteC.dataset.site = site

		sitesContaner.appendChild(siteC)
	})

	$make.qs('main .main--sites').appendChild(sitesContaner)
})
