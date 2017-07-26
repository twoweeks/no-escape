'use strict'

document.addEventListener('DOMContentLoaded', () => {
	document.onkeydown = (event => {
		if (window.event) event.preventDefault()
	})

	window.onbeforeunload = (() => 'При закрытии/обновлении страницы все данные сбросятся.')
})
