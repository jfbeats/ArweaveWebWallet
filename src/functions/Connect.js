const origin = new URLSearchParams(window.location.hash.slice(1)).get('origin')
const instance = origin + Math.random().toString().slice(2)
const requestChannel = 'connector:' + instance
const responseChannel = 'connectorResult:' + instance
const messageQueue = []
let connectedWallet = null

export function connect (walletAddress) {
	postMessage({ method: 'connect', params: { address: walletAddress } })
	connectedWallet = walletAddress
}

export function disconnect () {
	postMessage({ method: 'disconnect' })
	connectedWallet = null
}

export function postMessage (message) {
	window.parent.postMessage({ jsonrpc: '2.0', ...message }, origin)
}

async function processMessage () {
	if (!messageQueue.length || localStorage.getItem(requestChannel)) { return }
	const message = messageQueue[0]
	let action = null // check if message can be processed right away
	action ??= await broadcastMessage(message)
	const response = { id: message.data.id }
	if (action === 'accepted') {
		// process request
	}
	if (action === 'rejected') { response.error = 'rejected' }
	postMessage(response)
	messageQueue.splice(0, 1)
	localStorage.removeItem(responseChannel)
	localStorage.removeItem(requestChannel)
	processMessage()
}

async function broadcastMessage (message) {
	localStorage.setItem(requestChannel, JSON.stringify(message))
	await new Promise(resolve => setTimeout(() => resolve(), 500))
	if (!localStorage.getItem(responseChannel)) {
		const popup = window.open(window.location.href, '_blank', 'location,resizable,scrollbars,width=360,height=600')
		if (!popup) { } // popup blocked
	}
	return new Promise(resolve => {
		const userActionListener = (e) => {
			if (!e.newValue || e.key !== responseChannel) { return }
			if (e.newValue === 'accepted' || e.newValue === 'rejected') { 
				resolve(e.newValue)
				window.removeEventListener('storage', userActionListener)
			}
		}
		window.addEventListener('storage', userActionListener)
	})
}





export function launchConnector () {
	window.addEventListener('message', (e) => {
		if (e.source !== window.parent || e.origin !== origin) { return }
		if (![].includes(e.data.method)) { postMessage({ error: 'Unsupported method', id: e.data.id }) }
		const message = { instance, state: null, data: e.data }
		messageQueue.push(message)
		processMessage()
	})
}



export function launchClient () {

}