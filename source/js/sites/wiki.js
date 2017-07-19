'use strict'

document.addEventListener('DOMContentLoaded', () => {
	let unLinks = document.querySelectorAll('span[data-link="create-article"]')
	if (unLinks) {
		Array.from(unLinks).forEach(link => {
			link.setAttribute('title', 'Статьи на данную тему на портале "РосГосЗнания" пока нет. Хотите создать?')
		})
	}
})
