'use strict'

var $K = {
	before: () => document.createTextNode('['),
	after: () => document.createTextNode(']'),
	space: () => document.createTextNode(' '),
	br: () => $create.elem('br')
}

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

		if (!$pK.lss.get('counter')) { $pK.lss.set('counter', '1') }
		let num = Number($pK.lss.get('counter'))

		if (name.split('#')[1]) {
			let split = name.split('#')
			name = `${split[0]}<span class="trip">!${md5(split[2], 'majoc').substr(1, 10)}</span>`
		}

		let
			threadElem =         $create.elem('div', '', 'thread'),
			threadElemTop =      $create.elem('div', '', 'thread__top'),
			threadElemTopShow =  $create.elem('span', '', 'thread__top--show'),
			threadElemContent =  $create.elem('div', '', 'thread__content'),
			threadElemPosts =    $create.elem('div', '', 'thread__posts'),
			threadElemRefs =       $create.elem('div', '', 'thread__replies')

		switch (options['type']) {
			case 'admin':
				threadElemTop.classList.add('post-type--admin'); break
			case 'mod':
				threadElemTop.classList.add('post-type--mod'); break
		}

		threadElem.id = `post-${num}`
		threadElem.dataset.threadNum = num
		threadElem.dataset.threadPosts = 1
		threadElemTopShow.dataset.linkAction = ''
		threadElemTopShow.onclick = (() => {
			$action.showThread(threadElem.dataset.threadNum)
		})

		let
			replyElem = $create.elem('span', '', 'thread__top--reply'),
			replyElemPh = $create.elem('span', 'Ответить')

		replyElemPh.dataset.linkAction = ''
		replyElemPh.onclick = ((e) => {
			$action.reply(threadElem.dataset.threadNum)
		})

		replyElem.innerHTML = ' ['
		replyElem.appendChild(replyElemPh)
		replyElem.appendChild($K.after())

		threadElemTop.innerHTML = `<b>${subject}</b> <span class="nickname">${name}</span> <i>${getTime(new Date() / 1000)}</i> №${num} [`
		threadElemTop.appendChild(threadElemTopShow)
		threadElemTop.appendChild($K.after())
		threadElemTop.appendChild(replyElem)

		threadElemContent.innerHTML = wm.apply(text)

		threadElem.appendChild(threadElemTop)
		threadElem.appendChild(threadElemContent)
		threadElem.appendChild(threadElemRefs)
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

		let
			postElem =         $create.elem('div', '', 'post'),
			postElemTop =      $create.elem('div', '', 'thread__top'),
			postElemContent =  $create.elem('div', '', 'thread__content'),
			postElemRefs =     $create.elem('div', '', 'thread__replies')

		postElem.id = `post-${num}`
		postElem.dataset.postNum = num

		let
			replyElem = $create.elem('span', '', 'thread__top--reply'),
			replyElemPh = $create.elem('span', 'Ответить')

		replyElemPh.dataset.linkAction = ''
		replyElemPh.onclick = ((e) => {
			$action.reply(postElem.dataset.postNum)
		})

		replyElem.innerHTML = ' ['
		replyElem.appendChild(replyElemPh)
		replyElem.appendChild($K.after())

		postElemTop.innerHTML = `${name} <i>${getTime(new Date() / 1000)}</i> №${num} &ndash; ${++postNumITT}`
		postElemTop.appendChild(replyElem)

		if (options['reply'] && options['reply'] != '') {
			let
				postReplyLink = $create.elem('span', `${options['reply']}`, 'post-reply-link'),
				haveNoIdea = $make.qs(`#post-${options['reply']} .thread__replies`),
				postWhichReplied = $create.elem('span', `${num}`, 'thread__replies--reply')

			postReplyLink.dataset.linkAction = ''
			postReplyLink.dataset.linkReplyTo = options['reply']

			postWhichReplied.dataset.linkAction = ''
			postWhichReplied.dataset.linkTo = num

			postWhichReplied.onclick = (e => {
				if (document.body.dataset.show = 'thread') $make.qs(`#post-${e.target.dataset.linkTo}`).scrollIntoView(true)
			})

			postReplyLink.onclick = (e => {
				if (document.body.dataset.show = 'thread') $make.qs(`#post-${e.target.dataset.linkReplyTo}`).scrollIntoView(true)
			})

			postElemContent.appendChild(postReplyLink)
			postElemContent.appendChild($K.br())

			haveNoIdea.appendChild(postWhichReplied)
			haveNoIdea.appendChild($K.space())
		}

		let postElemContentSpan = $create.elem('span', wm.apply(text))
		postElemContent.appendChild(postElemContentSpan)

		postElem.appendChild(postElemTop)
		postElem.appendChild(postElemContent)
		postElem.appendChild(postElemRefs)

		$pK.lss.set('counter', ++num)
		$make.qs(`.thread[data-thread-num="${options['num']}"]`).dataset.threadPosts = postNumITT

		return postElem
	}),
	showThread: (num => {
		let
			body = document.body,
			replyFormC = $make.qs('.reply')

		if (replyFormC.classList.contains('isReplyTo')) {
			replyFormC.classList.remove('isReplyTo')
			delete replyFormC.querySelector('form .reply-to').dataset.replyTo
		}

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
	}),
	reply: (num => {
		let
			replyForm = $make.qs('.reply'),
			replyFromDe = replyForm.querySelector('details'),
			replyFromDeNum = replyFromDe.querySelector('.reply-to')

		replyForm.scrollIntoView(true)

		replyForm.classList.add('isReplyTo')
		replyFromDe.open = true
		replyFromDeNum.dataset.replyTo = num
	})
}

document.addEventListener('DOMContentLoaded', () => {
	let
		actionBtns = $make.qs('span[data-link-action]', ['a']),
		bodyData = document.body.dataset

	if (actionBtns) {
		Array.from(actionBtns).forEach(btn => {
			btn.onclick = ((e) => {
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

	$make.qs('.threads').insertBefore($action.thread({
		name: '## MOD ##',
		type: 'mod',
		subj: 'Объявление',
		text: '###Здравствуйте!###В данный момент проводятся технические работы, и все сайты Сети недоступны. Кроме нас. Поэтому сегодня ожидается небывалый наплыв пользователей!\n\nНа нашей уютной имиджборде Вы можете пообщаться друг с другом, а также потестировать функционал. При возникновении неполадок Вы можете отправить письмо на эмэйл cheyscooler@mail.ru, администрация постарается ответить как можно быстрее.\n\nВозможность постинга картинок сейчас отключена из-за слишком высокой нагрузки на сервер, но мы работаем над этим.\n\nПриятного времяпрепровождения, надеемся, Вам у нас понравится! Не забывайте, что здесь сидят все Ваши одноклассники.'
	}), $make.qs('.threads').firstChild)

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

	/*
	 * @TODO Сделать так, чтобы когда отписали в треде, он поднимался наверх (бамп)
	 * @TODO Сделать скрытие и сажу
	 */

	$make.qs('.reply form').onsubmit = (e => {
		e.preventDefault()

		let
			body = document.body,
			thisFormParC = $make.qs('.reply').classList

		if (!body.dataset.threadNum || body.dataset.threadNum == '') return;

		let
			data = new FormData(e.target),
			num = body.dataset.threadNum,
			name = data.get('name'),
			text = data.get('text')

		let postData = {
			num: num,
			name: name,
			text: text
		}

		if (thisFormParC.contains('isReplyTo')) {
			postData['reply'] = e.target.querySelector('.reply-to').dataset.replyTo
		}

		$make.qs('.thread.oneWhichShow .thread__posts').appendChild($action.post(postData), $make.qs('.threads').firstChild)

		if (thisFormParC.contains('isReplyTo')) {
			thisFormParC.remove('isReplyTo')
 			delete e.target.querySelector('.reply-to').dataset.replyTo
		}

		$make.qs('.reply').scrollIntoView(false)

		e.target.querySelector('*[name="text"]').value = ''
	})
})
