import { getDB } from '@/store/IndexedDB'
import { Wallets } from '@/functions/Wallets'
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'
import { computed, reactive, watch } from 'vue'
import { awaitEffect } from '@/functions/AsyncData'

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
		this.watchStop = watch(() => this.state.messageQueue, async () => {
			for (const messageEntry of this.state.messageQueue) {
				if (!messageEntry || messageEntry.fulfilled) { continue }
				if (messageEntry.status === 'accepted') { this.runMessage(messageEntry) }
				if (messageEntry.status === 'rejected') {
					messageEntry.fulfilled = true
					const id = messageEntry.id
					await this.updateMessage(messageEntry)
					if (id != null) { this.callbacks({ ...getError('rejected'), id }) }
				}
			}
		}, { deep: true })
	}

	async pushMessage (message: unknown) {
		await awaitEffect(() => this.stateWallet.value)
		if (!this.isMessage(message)) { return }
		if (this.state.messageQueue.find(m => m.id === message.id)) { return true }
		const uuid = uuidv4() as string
		const storedMessage: StoredMessage = {
			uuid,
			origin: this.state.origin,
			sessionId: '' + message.id + this.state.origin + this.state.session,
			timestamp: Date.now(),
			status: undefined,
			fulfilled: false,
			method: message.method,
			params: message.params,
		}
		const messageEntry: MessageEntry = {
			uuid,
			id: message.id,
			status: undefined,
			fulfilled: false,
		}
		if (!await this.storeMessage(storedMessage)) { return true }
		this.state.messageQueue.push(messageEntry)
		return true
	}

	async runMessage (messageEntry: MessageEntry) {
		const id = messageEntry.id
		if (messageEntry.status !== 'accepted' || messageEntry.fulfilled) { return }
		try {
			const result = await this.stateWallet.value?.runMessage(await getMessage(messageEntry))
			if (result === undefined) { return }
			messageEntry.fulfilled = true
			await this.updateMessage(messageEntry)
			if (id != null) { this.callbacks({ result, id }) }
		} catch (e) {
			messageEntry.fulfilled = true
			messageEntry.status = 'error'
			console.error(e)
			await this.updateMessage(messageEntry)
			if (id != null) { this.callbacks({ ...getError('internal'), id }) }
		}
	}

	isMessage (message: any) : message is Message {
		if (typeof message !== 'object') { return false }
		const { method, params, id } = message
		if (id != null && typeof id !== 'number' && typeof id !== 'string') { return false }
		if (typeof method !== 'string') { id != null && this.callbacks({ ...getError('request'), id }); return false }
		if (!this.stateWallet.value?.verifyMessage(method)) { id != null && this.callbacks({ ...getError('method', method), id }); return false }
		if (params != null && !Array.isArray(params)) { id != null && this.callbacks({ ...getError('params', { type: 'Params must be sent as an array', method, params }), id }); return false }
		if (!this.stateWallet.value?.verifyMessage(message)) { id != null && this.callbacks({ ...getError('params', { type: 'Type error', method, params }), id }); return false }
		return true
	}
	
	private async storeMessage (storedMessage: StoredMessage) {
		return new Promise(async (resolve, reject) => {
			const db = await getDB()
			const dbTx = db.transaction('messages', 'readwrite')
			dbTx.onerror = (e) => reject(e.target)
			dbTx.oncomplete = () => resolve(true)
			const store = dbTx.objectStore('messages')
			const index = store.index('sessionId')
			const indexRequest = index.get(storedMessage.sessionId)
			indexRequest.onsuccess = () => {
				const message = indexRequest.result
				if (message) { resolve(false); return }
				store.add(storedMessage)
			}
		})
	}
	
	private async updateMessage (messageEntry: MessageEntry) {
		return new Promise<void>(async (resolve, reject) => {
			const db = await getDB()
			const dbTx = db.transaction('messages', 'readwrite')
			dbTx.onerror = (e) => reject(e.target)
			dbTx.oncomplete = () => resolve()
			const store = dbTx.objectStore('messages')
			const storeRequest = store.get(messageEntry.uuid)
			storeRequest.onsuccess = () => {
				const message = storeRequest.result
				if (!message) { reject(new Error('message not found')); return }
				message.status = messageEntry.status
				message.fulfilled = messageEntry.fulfilled
				store.put(message)
			}
		})
	}

	destructor () { this.watchStop() }
}



export async function getMessage (messageEntry: MessageEntry): Promise<StoredMessage> {
	const db = await getDB()
	const dbTx = db.transaction('messages', 'readonly')
	const store = dbTx.objectStore('messages')
	const storeRequest = store.get(messageEntry.uuid)
	return new Promise(resolve => storeRequest.onsuccess = () => resolve(storeRequest.result))
}