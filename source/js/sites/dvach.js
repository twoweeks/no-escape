'use strict'

var getTime = (timestamp => {
	let
		a = new Date(timestamp * 1000),
		days = ['Вск', 'Пнд', 'Втр', 'Срд', 'Чтв', 'Птн', 'Суб']

	let
		year =   a.getFullYear().toString().substr(-2),
		month =  (a.getMonth() >= 10) ? a.getMonth() : `0${a.getMonth()}`,
		date =   (a.getDate() >= 10) ? a.getDate() : `0${a.getDate()}`,
		hour =   (a.getHours() >= 10) ? a.getHours() : `0${a.getHours()}`,
		min =    (a.getMinutes() >= 10) ? a.getMinutes() : `0${a.getMinutes()}`,
		sec =    (a.getSeconds() >= 10) ? a.getSeconds() : `0${a.getSeconds()}`

	return `${date}/${month}/${year} ${days[a.getDay()]} ${hour}:${min}:${sec}`
})

var $action = {
	thread: (options => {
		if (!options) options = {}
		if (Object.keys(options).length == 0) return

		let
			text = options['text'],
			name = options['name'] != '' ? options['name'] : 'Аноним',
			subject = options['subj'] != '' ? options['subj'] : text.split(' ').slice(0,3).join(' ').substr(0, 15) + '...',
			date = options['date'] != '' ? options['date'] : getTime(new Date() / 1000)

		if (!$pK.lss.get('counter')) { $pK.lss.set('counter', '0') }
		let num = Number($pK.lss.get('counter'))

		if (name.split('#')[1]) {
			let split = name.split('#')
			name = `${split[0]}<span class="trip">!${md5(split[2], 'majoc').substr(1, 10)}</span>`
		}

		let
			befK = document.createTextNode('['),
			afterK = document.createTextNode(']')

		let
			threadElem = $create.elem('div', '', 'thread'),
			threadElemTop = $create.elem('div', '', 'thread__top'),
			threadElemTopShow = $create.elem('span', '', 'thread__top--show'),
			threadElemContent = $create.elem('div', '', 'thread__content')

		threadElem.dataset.threadNum = num
		threadElemTopShow.dataset.linkAction = ''
		threadElemTopShow.onclick = ((e) => {
			$action.showThread(threadElem.dataset.threadNum)
		})

		threadElemTop.innerHTML = `<b>${subject}</b> ${name} <i>${getTime(new Date() / 1000)}</i> №${num} [`
		threadElemTop.appendChild(threadElemTopShow)
		threadElemTop.appendChild(afterK)

		threadElemContent.innerHTML = wm.apply(text)

		threadElem.appendChild(threadElemTop)
		threadElem.appendChild(threadElemContent)

		$pK.lss.set('counter', ++num)

		return threadElem
	}),
	showThread: (num => {
		let
			threads = $make.qs('.threads').classList,
			thread = $make.qs(`.thread[data-thread-num="${num}"]`).classList

		if (threads.contains('showOnlyOne')) {
			threads.remove('showOnlyOne')
			thread.remove('oneWhichShow')
		} else {
		thread.add('oneWhichShow')
			threads.add('showOnlyOne')
			thread.add('oneWhichShow')
		}
	}),
	post: (options => {

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
					case '':
					default:
						return;
				}
			})
		})
	}

	$make.qs('.create-thread form').onsubmit = (e => {
		e.preventDefault()
		let
			data = new FormData(e.target),
			name = data.get('name'),
			subj = data.get('subj'),
			text = data.get('text')

		$make.qs('.threads').insertBefore($action.thread({
			name: name,
			subj: subj,
			text: text
		}), $make.qs('.threads').firstChild)

		e.target.querySelector('*[name="subj"]').value = ''
		e.target.querySelector('*[name="text"]').value = ''
	})
})
