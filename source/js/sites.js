'use strict'

var sitesList = {
	main: {
		title: 'РосКомКоннект',
		shot: ''
	},
	wiki: {
		title: 'РосГосЗнания',
		shot: ''
	},
	board: {
		title: 'Двач',
		shot: ''
	},
	kremlin: {
		title: 'Сайт президента',
		shot: ''
	}
}

var sitesContent = {
	main: () => {
		let
			container = $create.elem('div', '', 'main'),
			header = $create.elem('header'),
			main = $create.elem('main'),
			footer = $create.elem('footer')

		header.innerHTML = '<h1>РосКомКоннект</h1><h2>Государственный провайдер</h2>'

		main.innerHTML = '<p>Приветствуем вас в Интернете!</p>'
		main.innerHTML += '<p>Список сайтов:</p>'

		for (let site in sitesList) {
			if (sitesList.hasOwnProperty(site)) {
				let siteC = $create.elem('div', '', 'site-container')

				siteC.innerHTML = sitesList[site].title

				siteC.onclick = (() => choseSite(site))
				main.appendChild(siteC)
			}
		}

		container.appendChild(header)
		container.appendChild(main)
		container.appendChild(footer)
		return container
	}
}
