import { getDB } from '@/store/IndexedDB'
import { getMethodMetadata, getWalletById, Wallets } from '@/functions/Wallets'
import { computed, reactive, Ref, watch } from 'vue'
import { awaitEffect } from '@/functions/AsyncData'
import { uuidV4 } from '@/functions/Utils'
import { useChannel } from '@/functions/Channels'
import { track } from '@/store/Telemetry'
import { findTransactions } from '@/functions/Transactions'
import { paywall } from '@/store/Cold'
import { notify } from '@/store/NotificationStore'

const errors = {
	rejected: { code: 0, message: 'Rejected' },
	// JsonRpc spec
	parse: { code: -32700, message: 'Parse error' },
	request: { code: -32600, message: 'Invalid request' },
	method: { code: -32601, message: 'Method not found' },
	params: { code: -32602, message: 'Invalid params' },
	internal: { code: -32603, message: 'Internal error' },
}
const getError = (error: keyof typeof errors, data?: object) => ({ error: { ...errors[error], data } })



export default class JsonRpc {
	callbacks
	state
	stateWallet
	permissions
	watchStop // todo collect scope instead

	constructor (callbacks: (message: any) => void, state: Ref<SharedState>) {
		this.callbacks = callbacks
		this.state = state || reactive({})
		this.state.value.messageQueue ??= []
		this.stateWallet = computed(() => Wallets.value.find(w => w.id === this.state.value.walletId))
		const permissionsChannel = useChannel('connectionSettings:', this.state.value.origin, {})
		this.permissions = computed(() => {
			const uuid = this.stateWallet.value?.uuid
			return permissionsChannel.state.value?.[uuid!]
		})
		this.watchStop = watch(() => [this.state.value.messageQueue, permissionsChannel.state.value], async () => {
			for (const messageEntry of this.state.value.messageQueue) {
				if (!messageEntry || messageEntry.fulfilled || messageEntry.processing) { continue }
				this.evalPermission(messageEntry)
				if (messageEntry.status === 'accepted' || messageEntry.status === 'allowed') { this.runMessage(messageEntry) }
				if (messageEntry.status === 'rejected') {
					messageEntry.fulfilled = true
					const id = messageEntry.id
					await this.updateMessage(messageEntry)
					if (id != null) { this.callbacks({ ...getError('rejected'), id }) }
				}
			}
		}, { deep: true })
	}
	
	destructor () { this.watchStop() }
	
	async pushMessage (message: unknown) {
		await awaitEffect(() => this.stateWallet.value || this.state.value.walletId === false)
		if (!this.isValidMessage(message)) { console.warn('invalid message', message); return }
		if (this.state.value.messageQueue.find(m => m.id === message.id)) { console.warn('message already exist', message); return }
		const uuid = uuidV4()
		const timestamp = Date.now()
		const storedMessage: StoredMessage = {
			uuid,
			origin: this.state.value.origin,
			sessionId: '' + message.id + this.state.value.origin + this.state.value.session,
			timestamp,
			status: undefined,
			fulfilled: false,
			method: message.method,
			params: message.params,
		}
		const messageEntry: MessageEntry = {
			uuid,
			id: message.id,
			timestamp,
			method: message.method,
			status: undefined,
			fulfilled: false,
			processing: false,
		}
		this.evalPermission(messageEntry)
		if (await this.storeMessage(storedMessage)) { this.state.value.messageQueue.push(messageEntry) }
		if (!messageEntry.status && message.id != null) { return true }
	}

	async runMessage (messageEntry: MessageEntry) {
		if (messageEntry.status !== 'accepted' && messageEntry.status !== 'allowed') { return }
		if (!this.stateWallet.value?.messageRunner) { return }
		if (messageEntry.processing) { return }
		messageEntry.processing = true
		const id = messageEntry.id
		try {
			if (paywall(this.stateWallet.value)) { notify.error('Vault must be enabled'); throw new Error('Vault must be enabled') }
			const message = await getMessage(messageEntry)
			if (!this.isValidMessage(message)) { throw new Error('message changed and is not valid anymore') }
			const runner = this.stateWallet.value?.messageRunner
			if (getMethodMetadata(this.stateWallet.value, message.method)?.skip) { return }
			const result = await (runner as any)[message.method!]?.(...(message.params || []))
			messageEntry.fulfilled = true
			await this.updateMessage(messageEntry)
			if (id != null) { this.callbacks({ result, id }) }
			track.event('Connector', { value: message.method })
		} catch (e) {
			// todo ledger transaction not removed on error
			messageEntry.status = 'error'
			console.error(e)
			await this.updateMessage(messageEntry)
			if (id != null) { this.callbacks({ ...getError('internal'), id }) }
		}
	}

	isValidMessage (message: any): message is Message {
		if (typeof message !== 'object') { return false }
		const { method, params, id } = message
		if (id != null && typeof id !== 'number' && typeof id !== 'string') { return false }
		if (typeof method !== 'string') { id != null && this.callbacks({ ...getError('request'), id }); return false }
		if (this.state.value.walletId === false) { id != null && this.callbacks({ ...getError('rejected'), id }); return false }
		if (!(this.stateWallet.value?.messageVerifier as any)[method]) { id != null && this.callbacks({ ...getError('method', { method }), id }); return false }
		if (!(this.stateWallet.value?.messageRunner as any)[method]) { id != null && this.callbacks({ ...getError('method', { method }), id }); return false }
		if (getMethodMetadata(this.stateWallet.value, method)?.unavailable) { id != null && this.callbacks({ ...getError('method', { method }), id }); return false }
		if (params != null && !Array.isArray(params)) { id != null && this.callbacks({ ...getError('params', { type: 'Params must be sent as an array', method, params }), id }); return false }
		if (!(this.stateWallet.value?.messageVerifier as any)[method](...(message.params || []))) { id != null && this.callbacks({ ...getError('params', { type: 'Type error', method, params }), id }); return false }
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
	
	private evalPermission (messageEntry: MessageEntry) {
		if (messageEntry.status != null) { return }
		const metadata = getMethodMetadata(this.stateWallet.value, messageEntry.method)
		const isAllowed = this.permissions.value?.[metadata?.name ?? messageEntry.method]
		const isPublic = metadata?.public
		if (isAllowed || isPublic) { messageEntry.status = 'allowed' }
	}
}



export async function getMessage (messageEntry: MessageEntry): Promise<StoredMessage> {
	const db = await getDB()
	const dbTx = db.transaction('messages', 'readonly')
	const store = dbTx.objectStore('messages')
	const storeRequest = store.get(messageEntry.uuid)
	return new Promise(resolve => storeRequest.onsuccess = () => resolve(storeRequest.result))
}



export async function getOwnerIdFromMessage (message?: MessageEntry | Message) {
	if (!message) { return }
	const stored = 'params' in message ? message : await getMessage(message as MessageEntry)
	const txMaybe = stored.params?.[0]
	if (!txMaybe) { return }
	return findTransactions([JSON.stringify(txMaybe)]).then(res => getWalletById(res?.[0]?.owner)?.id)
}