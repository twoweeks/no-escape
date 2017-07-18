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
	let
		currentSite = $lss.get('currentSite'),
		currentSiteBlock = $make.qs(`.game .game--site[data-site='${currentSite}']`)

	if (currentSite && currentSiteBlock.classList.contains('active')) {
		currentSiteBlock.classList.remove('active')
	}

	$lss.set('currentSite', site)

	setTimeout(() => {
		$make.qs(`.game .game--site[data-site='${site}']`).classList.add('active')
	}, 0)
	//}, random(2000, 5000))
})
