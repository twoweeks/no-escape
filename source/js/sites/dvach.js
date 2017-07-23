'use strict'

var $action = {
	thread: (options => {
		if (!options) options = {}
		if (Object.keys(options).length == 0) return

		let $lss = $pK.lss

		let
			text = options['text'],
			name = options['name'] != '' ? options['name'] : 'Аноним',
			subject = options['subj'] != '' ? options['subj'] : text.split(' ').slice(0,3).join(' ').substr(0, 15) + '...'

		if (!$pK.lss.get('counter')) { $pK.lss.set('counter', '0') }
		let num = Number($pK.lss.get('counter'))

		if (name.split('#')[1]) {
			let split = name.split('#')
			name = `${split[0]}<span class="trip">!${md5(split[2], 'majoc').substr(1, 10)}</span>`
		}

		let
			threadElem = $create.elem('div', '', 'thread'),
			threadElemTop = $create.elem('div', '', 'thread--top'),
			threadElemContent = $create.elem('div', '', 'thread--content')

		threadElemTop.innerHTML = `<b>${subject}</b> ${name} туду_здесь_дата №${num}`

		threadElemContent.innerHTML = wm.apply(text)

		threadElem.appendChild(threadElemTop)
		threadElem.appendChild(threadElemContent)

		$pK.lss.set('counter', ++num)

		return threadElem
	})
}

document.addEventListener('DOMContentLoaded', () => {
	let
		actionBtns = $make.qs('span[data-link-action]', ['a']),
		bodyData = document.body.dataset

	if (actionBtns) {
		Array.from(actionBtns).forEach(btn => {
			btn.onclick = (() => {
				switch (btn.dataset.linkAction) {
					case 'showB':
						bodyData.show = 'board'; break
					case 'showIndex':
						bodyData.show = 'index'; break
				}
			})
		})
	}

	$make.qs('.create-thread form').onsubmit = (e => {
		e.preventDefault()
		let
			data = new FormData(e.target),
			text = data.get('text'),
			name = data.get('name'),
			subj = data.get('subj')

		let files = e.target.querySelector('input[name="img"]').files

		console.log(files)

		if (files.length != 0) {
			let reader = new FileReader()
		}

		$make.qs('.threads').appendChild($action.thread({
			name: name,
			subj: subj,
			text: text
		}))
	})
})
