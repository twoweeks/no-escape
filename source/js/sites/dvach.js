'use strict'

var getTime = (timestamp => {
	let
		a =     new Date(timestamp * 1000),
		days =  ['Вск', 'Пнд', 'Втр', 'Срд', 'Чтв', 'Птн', 'Суб']

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
			text =     options['text'],
			name =     options['name'] != '' ? options['name'] : 'Аноним',
			subject =  options['subj'] != '' ? options['subj'] : text.split(' ').slice(0, 3).join(' ').substr(0, 15) + (text.length > 15 ? '...' : ''),
			date =     options['date'] != '' ? options['date'] : getTime(new Date() / 1000)

		if (!$pK.lss.get('counter')) { $pK.lss.set('counter', '0') }
		let num = Number($pK.lss.get('counter'))

		if (name.split('#')[1]) {
			let split = name.split('#')
			name = `${split[0]}<span class="trip">!${md5(split[2], 'majoc').substr(1, 10)}</span>`
		}

		let
			befK =    document.createTextNode('['),
			afterK =  document.createTextNode(']')

		let
			threadElem =         $create.elem('div', '', 'thread'),
			threadElemTop =      $create.elem('div', '', 'thread__top'),
			threadElemTopShow =  $create.elem('span', '', 'thread__top--show'),
			threadElemContent =  $create.elem('div', '', 'thread__content'),
			threadElemPosts =    $create.elem('div', '', 'thread__posts')

		threadElem.dataset.threadNum = num
		threadElem.dataset.threadPosts = 1
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
		threadElem.appendChild(threadElemPosts)

		$pK.lss.set('counter', ++num)

		$make.qs('.board .create-thread details').open = false

		return threadElem
	}),
	post: (options => {
		if (!options) options = {}
		if (Object.keys(options).length == 0) return

		let
			text = options['text'],
			name = options['name'] != '' ? options['name'] : 'Аноним',
			date = options['date'] != '' ? options['date'] : getTime(new Date() / 1000)

		if (!$pK.lss.get('counter')) { $pK.lss.set('counter', '0') }
		let num = Number($pK.lss.get('counter'))

		if (name.split('#')[1]) {
			let split = name.split('#')
			name = `${split[0]}<span class="trip">!${md5(split[2], 'majoc').substr(1, 10)}</span>`
		}

		let postNumITT = $make.qs(`.thread[data-thread-num="${options['num']}"]`).dataset.threadPosts

		console.log(postNumITT)

		let
			befK =    document.createTextNode('['),
			afterK =  document.createTextNode(']')

		let
			postElem =         $create.elem('div', '', 'post'),
			postElemTop =      $create.elem('div', '', 'thread__top'),
			postElemContent =  $create.elem('div', '', 'thread__content')

		postElem.id = `post-${num}`

		postElemTop.innerHTML = `${name} <i>${getTime(new Date() / 1000)}</i> №${num} &ndash; ${++postNumITT}`

		postElemContent.innerHTML = wm.apply(text)

		postElem.appendChild(postElemTop)
		postElem.appendChild(postElemContent)

		$pK.lss.set('counter', ++num)
		$make.qs(`.thread[data-thread-num="${options['num']}"]`).dataset.threadPosts = postNumITT

		return postElem
	}),
	showThread: (num => {
		let body = document.body

		if (body.dataset.show == 'thread') {
			delete body.dataset.threadNum
			body.dataset.show = 'board'
			$make.qs('.thread.oneWhichShow').classList.remove('oneWhichShow')
			$make.qs('.board .reply details').open = false
		} else {
			body.dataset.threadNum = num
			body.dataset.show = 'thread'
			$make.qs(`.thread[data-thread-num="${num}"]`).classList.add('oneWhichShow')
			$make.qs('.board .create-thread details').open = false
		}
	}),
	showBoard: (() => {
		let body = document.body

		if (!body.dataset.threadNum || body.dataset.threadNum == '' || body.dataset.show == 'board') return;

		delete body.dataset.threadNum
		body.dataset.show = 'board'
		$make.qs('.thread.oneWhichShow').classList.remove('oneWhichShow')
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

	$make.qs('.board header h2 span').onclick = (() => $action.showBoard())

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

	$make.qs('.reply form').onsubmit = (e => {
		e.preventDefault()

		let body = document.body

		if (!body.dataset.threadNum || body.dataset.threadNum == '') return;

		let
			data = new FormData(e.target),
			num = body.dataset.threadNum,
			name = data.get('name'),
			text = data.get('text')

		$make.qs('.thread.oneWhichShow .thread__posts').appendChild($action.post({
			num: num,
			name: name,
			text: text
		}), $make.qs('.threads').firstChild)

		e.target.querySelector('*[name="text"]').value = ''
	})
})
