'use strict'

var sitesList = {
	main: {
		title: 'РосГосКоннект',
		subtitle: 'государтвенный провайдер',
		logo: ''
	},
	temple: {
		title: 'Террор Темпл',
		hidden: true
	},
	wiki: {
		title: 'РосГосЗнания',
		subtitle: 'большая энциклопедия обо всём',
		iframe: 'wiki/index.html',
		shot: 'sss.png',
		logo: ''
	},
	kremlin: {
		title: 'Президент',
		iframe: 'kremlin/index.html',
		shot: '',
		logo: ''
	},
	news: {
		title: 'РИП "Новости"',
		iframe: 'news/index.html',
		shot: '',
		logo: ''
	},
	board: {
		title: 'Двачат',
		shot: '',
		logo: ''
	},
	ok: {
		title: 'РосГосКлассники',
		iframe: 'ok/index.html',
		shot: '',
		logo: ''
	},
	cats: {
		title: 'Кошки и котики',
		iframe: 'cats/index.html',
		shot: '',
		logo: ''
	}
}

var sitesContent = {
	main: () => {
		let
			container = $create.elem('div', '', 'main'),
			header = $create.elem('header'),
			main = $create.elem('main'),
			footer = $create.elem('footer')

		container.textContent = ''

		header.innerHTML = '<h1>РосГосКоннект</h1><h2>Государственный провайдер</h2>'

		main.innerHTML = $create.elem('p', 'Приветствуем вас в Интернете!', 'main--headline', ['html'])
		main.innerHTML += $create.elem('p', 'Список доступных сайтов:', 'main--subline', ['html'])

		let
			sitesContaner = $create.elem('div', '', 'main--sites'),
			sites = sitesList

		Object.keys(sites).forEach(site => {
			if (site == 'main' || sites[site].hidden == true) { return }

			let
				siteC = $create.elem('div', '', 'site-container'),
				siteShot = $create.elem('div', '', 'site-container--shot'),
				siteName = $create.elem('div', '', 'site-container--name')

			if (sites[site].shot && sites[site].shot != '') { siteShot.style.backgroundImage = `url('/assets/img/site_shots/${sites[site].shot}')` }

			siteName.textContent = sites[site].title

			siteC.appendChild(siteShot)
			siteC.appendChild(siteName)

			siteC.dataset.site = site

			sitesContaner.appendChild(siteC)
		})

		main.appendChild(sitesContaner)

		footer.innerHTML = '<p>РосГосКоннект &ndash; государственный провайдер.</p><p>Лучший, потому что единственный.</p>'

		container.appendChild(header)
		container.appendChild(main)
		container.appendChild(footer)
		return container
	},
	board: () => {
		let s = $create.elem('div')
		return s
	},
	temple: () => {
		let s = $create.elem('div')
		return s
	}
}
