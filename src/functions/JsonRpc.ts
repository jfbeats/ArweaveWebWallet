import { reactive, watch } from 'vue'

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
	procedures = {}
	callbacks
	state
	watchStop

	constructor (procedures: Procedures, callbacks: (message: any) => void, state: ConnectorState) {
		this.state = state || reactive({})
		this.state.messageQueue ??= []

		this.callbacks = callbacks
		this.procedures = procedures
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

	pushMessage (message: Message) {
		const id = message.id
		const messageEntry = { message, timestamp: Date.now(), fulfilled: false }
		if (!this.verifyMessage(messageEntry)) { return }
		for (const m of this.state.messageQueue) { if (m.message.id === id) { return true } }
		this.state.messageQueue.push(messageEntry)
		return true
	}

	runMessage (messageEntry: MessageEntry) {
		const { message, status } = messageEntry
		const id = messageEntry.message.id
		if (status !== 'accepted') { return }
		if (!this.verifyMessage(messageEntry)) { messageEntry.status = 'error'; messageEntry.fulfilled = true; return }
		try {
			const result = this.procedures[message.method].run(message.params)
			if (id != null) { this.callbacks({ result, id }) }
			messageEntry.fulfilled = true
		} catch (e) {
			messageEntry.fulfilled = true
			messageEntry.status = 'error'
			console.error(e)
			if (id != null) { this.callbacks({ ...getError('internal'), id }) }
		}
	}

	verifyMessage (messageEntry: MessageEntry) {
		const { method, params, id } = messageEntry.message
		if (id != null && typeof id !== 'number' && typeof id !== 'string') { return }
		if (typeof method !== 'string') { id != null && this.callbacks({ ...getError('request'), id }); return }
		if (!Object.keys(this.procedures).includes(method)) { id != null && this.callbacks({ ...getError('method'), id }); return }
		if (this.procedures[method].guard(params)) { id != null && this.callbacks({ ...getError('params'), id }); return }
		return true
	}

	destructor () { this.watchStop() }
}


// install typescript is and remove this
export const getProcedures = (extendedGuards: Procedures) => {
	const procedures = {
		signTransaction: {
			guard: (params) => {
				return typeof params !== 'object'
				|| typeof params.tx !== 'object'
				|| params.tx.format !== 2
				|| params.tx.owner && typeof params.tx.owner !== 'string'
			}, // todo finish guard
			run: (params) => ''
		},
	}
	for (const key in extendedGuards) {
		const baseGuard = procedures[key].guard
		procedures[key].guard = (params) => baseGuard(params) || extendedGuards[key](params)
	}
	return procedures
}