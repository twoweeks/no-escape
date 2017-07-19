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

var random = ((min, max) => Math.floor(Math.random() * (max - min + 1)) + min)

var choseSite = (site => {
	let lss_key = 'choseSiteBtnIsClicked'
	if ($lss.get(lss_key) == '1') return;

	$lss.set(lss_key, '1')

	let
		currentSite = $lss.get('currentSite'),
		currentSiteBlock = $make.qs(`.game .game--site#${currentSite}`)

	if (currentSite && currentSiteBlock.classList.contains('active')) {
		currentSiteBlock.classList.remove('active')
	}

	let loadingTitles = ['Загрузка...', 'Прогон через DPI...', 'Проверка IP...']

	document.title = loadingTitles[random(0, (loadingTitles.length - 1))]

	$lss.set('currentSite', site)
	let newTitle = `${sitesList[site].title}${(sitesList[site].subtitle && sitesList[site].subtitle != '') ? ' – ' + sitesList[site].subtitle : ''}`

	setTimeout(() => {
		$make.qs(`.game .game--site#${site}`).classList.add('active')
		document.title = newTitle
		$lss.rm(lss_key)
	//}, random(2000, 5000))
	}, 0)
})
