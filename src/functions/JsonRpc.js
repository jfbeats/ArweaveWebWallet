import { reactive, watch } from 'vue'

const errors = {
	rejected: { code: 0, message: 'Rejected' },
	// JsonRpc spec
	parse: { code: -32700, message: 'Parse error' },
	request: { code: -32600, message: 'Invalid Request' },
	method: { code: -32601, message: 'Method not found' },
	params: { code: -32602, message: 'Invalid params' },
	internal: { code: -32603, message: 'Internal error' },
}
const getError = (error, data) => ({ error: { ...errors[error], data } })



export default class JsonRpc {
	procedures = {}
	callbacks
	messageQueue
	watchStop

	constructor(procedures, callbacks, reactiveArray) {
		this.messageQueue = reactiveArray || reactive([])
		this.callbacks = callbacks
		for (const method in procedures) {
			const { guard, procedure } = procedures[method]
			this.setProcedure(method, guard, procedure)
		}
		this.watchStop = watch(() => this.messageQueue, () => {
			for (const messageEntry of this.messageQueue) {
				if (!messageEntry || messageEntry.fulfilled) { continue }
				if (messageEntry.status === 'accepted') { this.runMessage(messageEntry) }
				if (messageEntry.status === 'rejected') {
					messageEntry.fulfilled = true
					const id = messageEntry.message.id
					this.callbacks({ ...getError('rejected'), id })
				}
			}
		}, { deep: true })
	}

	setProcedure (method, guard, procedure) {
		if (typeof method !== 'string') { throw 'method name must be a string' }
		if (typeof guard !== 'function') { throw 'guard must be a function' }
		if (typeof procedure !== 'function') { throw 'procedure must be a function' }
		this.procedures[method] = { guard, procedure }
	}

	pushMessage (message) {
		// verify id does not exist already
		// message should be duplicated in shared state, find out why it's not
		const id = message.id
		const messageEntry = { message, timestamp: Date.now(), status: null, fulfilled: false }
		if (!this.verifyMessage(messageEntry)) { return }
		this.messageQueue.push(messageEntry)
		return true
	}

	runMessage (messageEntry) {
		const { message, status } = messageEntry
		const id = messageEntry.message.id
		if (status !== 'accepted') { return }
		if (!this.verifyMessage(messageEntry)) { messageEntry.status = 'error'; messageEntry.fulfilled = true; return }
		try {
			const result = this.procedures[message.method](message.params)
			this.callbacks({ result, id })
			messageEntry.fulfilled = true
		} catch (e) {
			messageEntry.fulfilled = true
			messageEntry.status = 'error'
			console.error(e)
			this.callbacks({ ...getError('internal'), id })
		}
	}

	verifyMessage (messageEntry) {
		const { method, params, id } = messageEntry.message
		if (typeof method !== 'string') { this.callbacks({ ...getError('request'), id }); return }
		if (id != null && typeof id !== 'number' && typeof id !== 'string') { this.callbacks({ ...getError('request'), id }); return }
		if (!Object.keys(this.procedures).includes(method)) { this.callbacks({ ...getError('method'), id }); return }
		if (this.procedures[method].guard(params)) { this.callbacks({ ...getError('params'), id }); return }
		return true
	}

	destructor () { this.watchStop() }
}



export const getProcedures = (extendedGuards) => {
	const procedures = {
		signTransaction: {
			guard: (params) => {
				console.log(params)
				return typeof params !== 'object' 
				|| typeof params.tx !== 'object'
				|| params.tx.format !== 2 
				|| params.tx.owner && typeof params.tx.owner !== 'string'
			}, // todo finish guard
			procedure: (params) => ''
		},
	}
	for (const key in extendedGuards) {
		const baseGuard = procedures[key].guard
		procedures[key].guard = (params) => baseGuard(params) || extendedGuards[key](params)
	}
	return procedures
}