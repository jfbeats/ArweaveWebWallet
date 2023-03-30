import { WalletProxy } from '@/providers/WalletProxy'
import ArweaveStore, { arweave, arweaveQuery, fetchPublicKey, queryAggregator } from '@/store/ArweaveStore'
import { ArweaveVerifier as ArweaveMessageVerifier } from 'arweave-wallet-connector'
import { Emitter, mix } from '@/functions/UtilsClass'
import { download } from '@/functions/File'
import { awaitEffect, getAsyncData } from '@/functions/AsyncData'
import { getDecryptionKey, getEncryptionKey, getSigningKey, getVerificationKey, pkcs8ToJwk } from '@/functions/Crypto'
import { manageUpload } from '@/functions/Transactions'
import Transaction from 'arweave/web/lib/transaction'
import { computed } from 'vue'
import axios from 'axios'
import { LOGO } from '@/store/Theme'
import type { ArweaveProviderInterface } from 'arweave-wallet-connector/lib/Arweave'
import type { SignatureOptions } from 'arweave/web/lib/crypto/crypto-interface'
import type { TransactionInterface } from 'arweave/web/lib/transaction'
import type { JWKInterface } from 'arweave/web/lib/wallet'
// @ts-ignore
import { getKeyPairFromMnemonic } from 'human-crypto-keys'
import { requestExport } from '@/functions/Export'
import { encode } from '@/functions/Encode'



const displayMetadata: DisplayMetadata = {
	name: 'Arweave address',
	icon: LOGO.arweave
}

const accountMetadata: AccountMetadata = {
	...displayMetadata,
	isAddress: (address, partial) => !partial ? !!address?.match(/^[a-z0-9_-]{43}$/i) : !!address?.match(/^[a-z0-9_-]{0,43}$/i)
}

const providerMetadata: ProviderMetadata = {
	...accountMetadata,
	id: 'arweave',
	isProviderFor: (walletData) => {
		if (walletData.data?.arweave) { return true }
		return !!walletData.jwk // test key type
	},
	addPassphrase: async (passphrase) => {
		let keyPair = await getKeyPairFromMnemonic(passphrase, { id: 'rsa', modulusLength: 4096 }, { privateKeyFormat: 'pkcs8-der' })
		const jwk = await pkcs8ToJwk(keyPair.privateKey) as JWKInterface
		return { jwk }
	},
	addKeyfile: async (keyfile) => {
		const data = keyfile != null && JSON.parse(keyfile) as JWKInterface
		const jwk = data || await arweave.wallets.generate()
		return { jwk }
	},
	addImportData: async (walletData, options) => {
		walletData ??= {}
		const key = options?.address ?? await arweave.wallets.jwkToAddress(walletData.jwk as any)
		walletData.data ??= {}
		walletData.data.arweave = { key }
		return walletData
	},
}



export class ArweaveAccount extends Emitter implements Account {
	constructor (private init: string | WalletDataInterface) {
		super()
		const received = arweaveQuery(computed(() => (this.key ? { recipients: [this.key] } : undefined)))
		const sent = arweaveQuery(computed(() => (this.key ? { owners: [this.key] } : undefined)))
		const all = queryAggregator([received, sent])
		this.queries = [
			{ query: all, name: 'All', color: 'var(--orange)' }, // todo name and color in metadata object
			{ query: received, name: 'Received', color: 'var(--green)' },
			{ query: sent, name: 'Sent', color: 'var(--red)' },
		]
		received.list.emitter.on('add', () => this.queryBalance.getState(true))
		sent.list.emitter.on('add', () => this.queryBalance.getState(true))
		this.on('destructor', () => this.queryBalance.stop())
	}
	static get metadata () { return accountMetadata }
	get metadata () { return accountMetadata }
	#key = computed(() => typeof this.init === 'string' ? this.init : this.init.data?.arweave?.key)
	queryBalance = getAsyncData({
		name: 'balance',
		awaitEffect: () => this.key,
		query: async () => arweave.ar.winstonToAr(await arweave.wallets.getBalance(this.key!)),
		seconds: 600,
	})
	get key () { return this.#key.value }
	get balance () { return this.queryBalance.state.value }
	queries
}



export class ArweaveProvider extends mix(ArweaveAccount).with(WalletProxy) implements Provider {
	constructor (init: WalletDataInterface) {
		super(init)
		if (!this.data.arweave?.key && this.hasPrivateKey) { ArweaveProvider.metadata.addImportData(init) }
		if (!this.data.arweave?.publicKey) { this.getPublicKey().catch(() => {}) }
		this.messageVerifier = new ArweaveMessageVerifier()
		this.messageRunner = new ArweaveMessageRunner(this)
	}
	static get metadata () { return providerMetadata }
	get metadata (): InstanceMetadata<ArweaveProvider> {
		return {
			...ArweaveProvider.metadata,
			name: this.hasPrivateKey ? 'Arweave wallet' : ArweaveProvider.metadata.name,
			methods: {
				download: { unavailable: !this.hasPrivateKey },
				signTransaction: { userIntent: !this.hasPrivateKey },
				createDataItem: { unavailable: !this.hasPrivateKey },
				createBundle: { unavailable: !this.hasPrivateKey },
				sign: { unavailable: !this.hasPrivateKey },
				decrypt: { unavailable: !this.hasPrivateKey },
				getPublicKey: { public: true },
			}
		}
	}
	messageVerifier: ArweaveMessageVerifier
	messageRunner: ArweaveMessageRunner
	async signTransaction (tx: Transaction, options?: SignatureOptions) {
		// todo test balance
		const verifyTarget = tx.quantity && +tx.quantity > 0 && tx.target
		const targetVerificationFailure = verifyTarget && arweaveQuery({ ids: [tx.target] }).fetchQuery.query().catch(() => {}).then(res => res && res.length > 0)
		const owner = await this.getPublicKey().catch(() => {})
		if (owner && tx.owner && tx.owner !== owner) { throw 'Wrong owner' }
		if (!tx.owner && owner) { tx.setOwner(owner) }
		if (!this.hasPrivateKey) { return requestExport({ tx }) }
		await arweave.transactions.sign(tx, await this.getPrivateKey(), options)
		if (await targetVerificationFailure) { throw 'The target is a transaction hash, not an account' }
		return tx
	}
	async createDataItem (item: ArDataItemParams) {
		const { createData, signers } = await import('@/../scripts/arbundles')
		const { data, tags, target } = item
		const sk = await this.getPrivateKey()
		const signer = new signers.ArweaveSigner(sk)
		const anchor = arweave.utils.bufferTob64(crypto.getRandomValues(new Uint8Array(32))).slice(0, 32)
		const dataItem = createData(data, signer, { tags, target, anchor })
		await dataItem.sign(signer)
		return dataItem
	}
	async createBundle (items: Awaited<ReturnType<typeof this.createDataItem>>[]) {
		const { bundleAndSignData, signers } = await import('@/../scripts/arbundles')
		const sk = await this.getPrivateKey()
		const signer = new signers.ArweaveSigner(sk)
		return bundleAndSignData(items, signer)
	}
	async sign (data: BufferSource, options?: Parameters<ArweaveProviderInterface['signMessage']>[1]) {
		const signingKey = await getSigningKey(await this.getPrivateKey() as JsonWebKey, options?.hashAlgorithm)
		const signed = await window.crypto.subtle.sign({ name: 'RSA-PSS', saltLength: 32 }, signingKey, data)
		return new Uint8Array(signed)
	}
	async decrypt (data: BufferSource, options: Parameters<ArweaveProviderInterface['decrypt']>[1]) {
		const decryptionKey = await getDecryptionKey(await this.getPrivateKey() as JsonWebKey)
		const decrypted = await window.crypto.subtle.decrypt(options, decryptionKey, data)
		return new Uint8Array(decrypted)
	}
	async getPublicKey () {
		if (this.data.arweave?.publicKey) { return this.data.arweave.publicKey }
		let result = undefined as string | undefined
		if (this.hasPrivateKey && !this.isEncrypted) { result ||= (await this.getPrivateKey()).n }
		await awaitEffect(() => this.key);
		result ||= await fetchPublicKey(this.key!)
		if (this.hasPrivateKey) { result ||= (await this.getPrivateKey()).n }
		if (!result) { throw 'Failed to get public key' }
		if (this.data.arweave) { this.data.arweave.publicKey = result }
		return result
	}
	async download () {
		await awaitEffect(() => this.key)
		download(this.key!, JSON.stringify(await this.getPrivateKey()))
	}
}



export class ArweaveMessageRunner implements MessageRunner<ArweaveProviderInterface, ArweaveProvider> {
	constructor (private wallet: ArweaveProvider) { }
	get methodMap () { return {
		signTransaction: 'signTransaction',
		signDataItem: 'createDataItem',
		signMessage: 'sign',
		dispatch: {
			metadata: { or: ['signTransaction', 'createDataItem'] },
			permission: { name: 'signTransaction' }
		},
		getPublicKey: 'getPublicKey',
		decrypt: 'decrypt',
		encrypt: { public: true },
		verifyMessage: { public: true },
		getArweaveConfig: {},
		privateHash: { unavailable: !this.wallet.hasPrivateKey },
	} as const }
	async signTransaction (tx: Parameters<ArweaveProviderInterface['signTransaction']>[0], options?: Parameters<ArweaveProviderInterface['signTransaction']>[1]) {
		const txObject = new Transaction(tx as TransactionInterface)
		// const fee = await getFeeRange()
		// if (fee.default?.gt(txObject.reward)) { txObject.reward = fee.default.toString() }
		await this.wallet.signTransaction(txObject)
		return {
			id: txObject.id,
			owner: txObject.owner,
			tags: txObject.tags,
			signature: txObject.signature,
			reward: txObject.reward
		}
	}
	async signDataItem (tx: Parameters<ArweaveProviderInterface['signDataItem']>[0]) {
		return this.wallet.createDataItem(tx as any).then(item => item.getRaw())
	}
	async signMessage (message: ArrayBufferView, options: Parameters<ArweaveProviderInterface['signMessage']>[1]) {
		const hash = await window.crypto.subtle.digest(options.hashAlgorithm, message)
		return this.wallet.sign(hash, options) // hashed a second time with the same algo in the sign function
	}
	async verifyMessage (message: ArrayBufferView, signature: ArrayBufferView, publicKey: string, options: Parameters<ArweaveProviderInterface['verifyMessage']>[3]) {
		const hash = await window.crypto.subtle.digest(options.hashAlgorithm, message)
		const verificationKey = await getVerificationKey(publicKey)
		return window.crypto.subtle.verify({ name: 'RSA-PSS' }, verificationKey, signature, hash)
	}
	async dispatch (tx: Parameters<ArweaveProviderInterface['signTransaction']>[0], options?: Parameters<ArweaveProviderInterface['signTransaction']>[1]) {
		// todo do not store large data in indexeddb
		const txObject = new Transaction(tx as TransactionInterface)
		let dispatchResult: Awaited<ReturnType<ArweaveProviderInterface['dispatch']>> | undefined
		if (!txObject.quantity || txObject.quantity === '0') {
			try {
				const data = txObject.get('data', { decode: true, string: false })
				const tags = txObject.tags.map(tag => ({
					name: tag.get('name', { decode: true, string: true }),
					value: tag.get('value', { decode: true, string: true })
				}))
				const target = txObject.target
				const bundleTx = await this.wallet.createDataItem({ data, tags, target })
				const res = await axios.post(ArweaveStore.bundlerURL + 'tx', bundleTx.getRaw(), {
					headers: { 'Content-Type': 'application/octet-stream' },
					maxBodyLength: Infinity,
				})
				if (res.status >= 200 && res.status < 300) { dispatchResult = { id: bundleTx.id, type: 'BUNDLED' } }
			} catch (e) { console.error(e) }
		}
		if (dispatchResult) { return dispatchResult }
		try {
			// todo set fees
			await this.wallet.signTransaction(txObject)
			manageUpload(txObject)
			dispatchResult = { id: txObject.id, type: 'BASE' }
		} catch (e) { console.error(e) }
		if (dispatchResult) { return dispatchResult }
		throw 'error'
	}
	async getPublicKey () {
		const publicKey = await this.wallet.getPublicKey()
		if (!publicKey) { throw 'key missing' }
		return publicKey
	}
	async encrypt (message: ArrayBufferView, publicKey: string, options: Parameters<ArweaveProviderInterface['encrypt']>[2]) {
		const encryptionKey = await getEncryptionKey(publicKey)
		return window.crypto.subtle.encrypt(options, encryptionKey, message)
	}
	async decrypt (message: ArrayBufferView, options: Parameters<ArweaveProviderInterface['decrypt']>[1]) {
		return this.wallet.decrypt(message, options)
	}
	async getArweaveConfig () {
		const config = arweave.getConfig().api
		return { protocol: config.protocol, host: config.host, port: config.port }
	}
	async privateHash (message: ArrayBufferView, options: Parameters<ArweaveProviderInterface['privateHash']>[1]) {
		const sk = (await this.wallet.getPrivateKey()).d
		if (!sk) { throw 'key missing' }
		const hash = await window.crypto.subtle.digest(options.hashAlgorithm, arweave.utils.concatBuffers([message.buffer, encode(sk)]))
		return new Uint8Array(hash)
	}
}