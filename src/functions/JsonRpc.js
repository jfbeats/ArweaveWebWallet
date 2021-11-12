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
	messageQueue
	watchStop

	constructor(procedures, reactiveArray) {
		this.messageQueue = reactiveArray || reactive([])
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
					messageEntry.callback(getError('rejected'))
				}
			}
		})
	}

	setProcedure (method, guard, procedure) {
		if (typeof method !== 'string') { throw 'method name must be a string' }
		if (typeof guard !== 'function') { throw 'guard must be a function' }
		if (typeof procedure !== 'function') { throw 'procedure must be a function' }
		this.procedures[method] = { guard, procedure }
	}

	pushMessage (message, resultCallback) {
		const id = message.id
		const callback = (id != null) ? (msg) => resultCallback({ ...msg, id }) : (() => { })
		const messageEntry = { message, callback, status: null, fulfilled: false }
		if (!this.verifyMessage(messageEntry)) { return }
		this.messageQueue.push(messageEntry)
		return true
	}

	runMessage (messageEntry) {
		const { message, callback, status } = messageEntry
		if (status !== 'accepted') { return }
		if (!this.verifyMessage(message, callback)) { messageEntry.status = 'error'; messageEntry.fulfilled = true; return }
		try {
			const result = this.procedures[message.method](message.params)
			callback({ result })
			messageEntry.fulfilled = true
		} catch (e) {
			messageEntry.fulfilled = true
			messageEntry.status = 'error'
			console.error(e)
			callback(getError('internal'))
		}
	}

	verifyMessage (messageEntry) {
		const { method, params, id } = messageEntry.message
		const callback = messageEntry.callback
		if (typeof method !== 'string') { callback(getError('request')); return }
		if (id != null && typeof id !== 'number' && typeof id !== 'string') { callback(getError('request')); return }
		if (!Object.keys(this.procedures).includes(method)) { callback(getError('method')); return }
		if (this.procedures[method].guard(params)) { callback(getError('params')); return }
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