'use strict';

var $lss = {
	get: (item) => sessionStorage.getItem(item),
	set: (item, value) => sessionStorage.setItem(item, value),
	rm: (item) => sessionStorage.removeItem(item),
	test: function() {
		let test = 'lss_test'
		try {
			this.set(test, test)
			this.rm(test)
			return true
		} catch (e) { return false }
	}
}

var m = 'c'

var random = ((min, max) => Math.floor(Math.random() * (max - min + 1)) + min)

var choseSite = (site => {
	let lss_key = 'choseSiteBtnIsClicked'
	if ($lss.get(lss_key) == '1') return;

	$lss.set(lss_key, '1')

	let loadingTitles = ['Загрузка...', 'Прогон через СОРМ...', 'Проверка IP...', 'Поиск записи в реестре...']

	document.title = loadingTitles[random(0, (loadingTitles.length - 1))]

	let
		currentSite = $lss.get('currentSite'),
		currentSiteBlock = $make.qs(`.game .game--site#${currentSite}`)

	if (currentSite && currentSiteBlock.classList.contains('active')) {
		currentSiteBlock.classList.remove('active')
	}

	let
		panelLi = $make.qs(`.panel li[data-site="${site}"]`),
		panelLiCurrent = $make.qs(`.panel li[data-site="${currentSite}"]`)

	if (currentSite && panelLiCurrent.classList.contains('active')) {
		panelLiCurrent.classList.remove('active')
	}

	if (panelLi.classList.contains('hidden')) {
		panelLi.classList.remove('hidden')
	}

	if (sitesList[site].logo && sitesList[site].logo != '') {
		let link = $make.qs('link[rel*="icon"]') || $create.elem('link')
		link.setAttribute('rel', 'shortcut icon')
		link.setAttribute('href', sitesList[site].logo)
		$make.qs('head').appendChild(link)
	} else {
		let link = $make.qs('link[rel*="icon"]')
		if (link) link.remove()
	}

	$lss.set('currentSite', site)
	let newTitle = `${sitesList[site].title}${(sitesList[site].subtitle && sitesList[site].subtitle != '') ? ' – ' + sitesList[site].subtitle : ''}`

	setTimeout(() => {
		$make.qs(`.game .game--site#${site}`).classList.add('active')
		panelLi.classList.add('active')
		document.title = newTitle
		$lss.rm(lss_key)
	//}, random(2000, 5000))
	}, 0)
})

var a = 'o'
