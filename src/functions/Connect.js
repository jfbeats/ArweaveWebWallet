import { ref } from 'vue'

export const connectedWallet = ref(null)

export async function connect (walletAddress) {
	postMessage({
		method: 'connect',
		params: { address: walletAddress },
	})
	connectedWallet.value = walletAddress
}

export async function disconnect () {
	postMessage({
		method: 'disconnect',
	})
	connectedWallet.value = null
}

export async function postMessage (message) {
	const openerOrigin = new URLSearchParams(window.location.hash.slice(1)).get('origin')
	window.opener.postMessage({ jsonrpc: '2.0', ...message }, openerOrigin)
}