'use strict'

/*
 * Нет времени писать более красивый код
 */

var
	random = parent.window.random,
	currentDay = new Date().getDate(),
	data = JSON.parse($pK.lss.get('cats'))

if (!$pK.lss.get('cats') || Number(data.day) != currentDay) {
	let currentCat = random(1, 5)

	let newData = {
		day: currentDay,
		cat: currentCat
	}

	$pK.lss.set('cats', JSON.stringify(newData))
	data = JSON.parse($pK.lss.get('cats'))
}

let img = $create.elem('img')
img.setAttribute('src', `/assets/img/cats/${data.cat}.jpg`)

$make.qs('.cat').appendChild(img)
