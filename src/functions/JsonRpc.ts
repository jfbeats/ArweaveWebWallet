import { computed, reactive, watch } from 'vue'
import { Wallets } from '@/functions/Wallets'

const errors = {
	rejected: { code: 0, message: 'Rejected' },
	// JsonRpc spec
	parse: { code: -32700, message: 'Parse error' },
	request: { code: -32600, message: 'Invalid request' },
	method: { code: -32601, message: 'Method not found' },
	params: { code: -32602, message: 'Invalid params' },
	internal: { code: -32603, message: 'Internal error' },
}
const getError = (error: keyof typeof errors, data?: any) => ({ error: { ...errors[error], data } })



export default class JsonRpc {
	callbacks
	state
	stateWallet
	watchStop

	constructor (callbacks: (message: any) => void, state: ConnectorState) {
		this.callbacks = callbacks
		this.state = state || reactive({})
		this.state.messageQueue ??= []
		this.stateWallet = computed(() => Wallets.value.find(w => w.id === this.state.walletId))
		this.watchStop = watch(() => this.state.messageQueue, () => {
			for (const messageEntry of this.state.messageQueue) {
				if (!messageEntry || messageEntry.fulfilled) { continue }
				if (messageEntry.status === 'accepted') { this.runMessage(messageEntry) }
				if (messageEntry.status === 'rejected') {
					messageEntry.fulfilled = true
					const id = messageEntry.message.id
					if (id != null) { this.callbacks({ ...getError('rejected'), id }) }
				}
			}
		}, { deep: true })
	}

	pushMessage (message: unknown) {
		if (!this.isMessage(message)) { return }
		for (const m of this.state.messageQueue) { if (m.message.id === message.id) { return true } }
		const messageEntry = { message, timestamp: Date.now(), fulfilled: false }
		this.state.messageQueue.push(messageEntry)
		return true
	}

	async runMessage (messageEntry: MessageEntry) {
		const { message, status } = messageEntry
		const id = messageEntry.message.id
		if (status !== 'accepted') { return }
		try {
			const result = await this.stateWallet.value?.runMessage(message)
			messageEntry.fulfilled = true
			if (id != null) { this.callbacks({ result, id }) }
		} catch (e) {
			messageEntry.fulfilled = true
			messageEntry.status = 'error'
			console.error(e)
			if (id != null) { this.callbacks({ ...getError('internal'), id }) }
		}
	}

	isMessage (message: any) : message is Message {
		if (typeof message !== 'object') { return false }
		const { method, params, id } = message
		if (id != null && typeof id !== 'number' && typeof id !== 'string') { return false}
		if (typeof method !== 'string') { id != null && this.callbacks({ ...getError('request'), id }); return false }
		if (!this.stateWallet.value?.verifyMessage(method)) { id != null && this.callbacks({ ...getError('method'), id }); return false }
		if (params != null && !Array.isArray(params)) { id != null && this.callbacks({ ...getError('params'), id }); return false }
		if (!this.stateWallet.value?.verifyMessage(message)) { id != null && this.callbacks({ ...getError('params'), id }); return false }
		return true
	}

	destructor () { this.watchStop() }
}