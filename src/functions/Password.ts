import { useChannel, useLock } from '@/functions/Channels'
import { isEncrypted, passwordDecrypt, passwordEncrypt } from '@/functions/Crypto'
import { getQueryManager } from '@/functions/AsyncData'
import { getWalletById } from '@/functions/Wallets'
import { AppSettings } from '@/store/SettingsStore'
import { notify } from '@/store/NotificationStore'
import { computed } from 'vue'
import mitt from 'mitt'



export type PasswordRequest = {
	reason: 'get' | 'update' | 'change' | 'match' | 'new'
	resolve: (arg: string) => void
	reject: (e?: string) => void
	match?: string
	wallet?: Wallet
}



const pwdTest = useChannel('pwdTest').state
const pwdTestLock = useLock(useChannel('pwdTestLock').state)
const WalletsData = useChannel('wallets', undefined, []).state
const requireEncryption = computed(() => WalletsData.value
	.filter(wallet => wallet.jwk && !isEncrypted(wallet.jwk) && wallet.settings?.securityLevel))
const requireDecryption = computed(() => WalletsData.value
	.filter(wallet => wallet.jwk && isEncrypted(wallet.jwk) && !wallet.settings?.securityLevel))
export const hasPassword = computed(() => pwdTest.value)
export const hasUpdate = computed(() => requireEncryption.value.length + requireDecryption.value.length)
export const hasNoTargetWallets = computed(() => hasPassword.value && !WalletsData.value.find(wallet => wallet.settings?.securityLevel))



export async function testPassword (password?: string): Promise<void> {
	if (!pwdTest.value != !password) { throw 'Invalid password' }
	if (!pwdTest.value || !password) { return }
	const result = await passwordDecrypt(password, pwdTest.value)
	if (result !== 'valid') { throw 'Invalid password' }
}

export async function updateEncryption () {
	await pwdTestLock.lock()
	try {
		const password = await requestPassword({ reason: 'update' })
		const wallets = await Promise.all([
			...requireEncryption.value.map(async wallet => ({
				uuid: getWalletById(wallet.id)?.uuid,
				jwk: await passwordEncrypt(password, wallet.jwk)
			})),
			...requireDecryption.value.map(async wallet => ({
				uuid: getWalletById(wallet.id)?.uuid,
				jwk: await passwordDecrypt(password, wallet.jwk as any)
			}))
		])
		wallets.forEach(wallet => WalletsData.value.find(data => data.uuid === wallet.uuid)!.jwk = wallet.jwk)
	} finally { pwdTestLock.unlock() }
}

export async function setPassword (password: string, askNew?: true): Promise<true> {
	await pwdTestLock.lock()
	try {
		let wallets = [] as { uuid: string, jwk: PrivateKey | EncryptedContent }[]
		if (pwdTest.value) {
			const oldPassword = await requestPassword({ reason: 'change', match: password })
			const promises = WalletsData.value
			.filter(wallet => wallet.jwk && isEncrypted(wallet.jwk))
			.map(async wallet => ({
				uuid: getWalletById(wallet.id)!.uuid,
				jwk: await passwordDecrypt(oldPassword!, wallet.jwk as any)
			}))
			wallets = await Promise.all(promises)
		}
		if (password || askNew) {
			if (password) { passwordValidation(password) }
			if (askNew) {
				password = await requestPassword({ reason: 'new' })
				passwordValidation(password)
			}
			else if (!pwdTest.value) { await requestPassword({ reason: 'match', match: password }) }
			const unencrypted = requireEncryption.value.map(wallet => ({
				uuid: getWalletById(wallet.id)!.uuid,
				jwk: wallet.jwk!
			}))
			wallets = [...wallets, ...unencrypted]
			await Promise.all(wallets.map(async wallet => wallet.jwk = await passwordEncrypt(password, wallet.jwk)))
			const encryptedContent = await passwordEncrypt(password, 'valid')
			pwdTest.value = encryptedContent
		} else {
			pwdTest.value = null
		}
		wallets.forEach(wallet => WalletsData.value.find(data => data.uuid === wallet.uuid)!.jwk = wallet.jwk)
	} finally { pwdTestLock.unlock() }
	return true
}

export const passwordValidationMessage = 'Password length must be at least 8 characters long'
export function passwordValidation (password: string) {
	if (password.length < 8) { notify.error(passwordValidationMessage); throw passwordValidationMessage }
}



export const emitter = mitt<{ password: PasswordRequest }>()
const privateCache = {} as { [uuid: string]: { privateKey: PrivateKey, timestamp: number, wallet: WalletDataInterface } | undefined }



function invalidateMaybe (uuid: string) {
	const entry = privateCache[uuid]
	if (!entry) { return }
	if (
		Date.now() - entry.timestamp > AppSettings.value.password.invalidateCache
		|| entry.wallet.settings?.securityLevel === 'always' && Date.now() - entry.timestamp > 1000
	) { delete privateCache[uuid]; return true }
}

function invalidateAllMaybe () { Object.keys(privateCache).forEach(uuid => invalidateMaybe(uuid)) }
setInterval(invalidateAllMaybe, 60000)

function getCache (uuid: string): PrivateKey | void {
	const entry = privateCache[uuid]
	if (!entry) { return }
	if (invalidateMaybe(uuid)) { return }
	entry.timestamp = Date.now()
	return entry.privateKey
}

async function setCache (uuid: string, password: string): Promise<PrivateKey | undefined> {
	let currentPrivateKey = undefined as undefined | PrivateKey
	const result = WalletsData.value
	.filter(wallet => isEncrypted(wallet.jwk))
	.filter(wallet => getWalletById(wallet.id)!.uuid === uuid || wallet.settings?.securityLevel !== 'always')
	.map(async wallet => {
		const privateKey = await passwordDecrypt(password, wallet.jwk as any)
		const walletObject = getWalletById(wallet.id)
		if (!walletObject) { throw 'wallet no longer accessible' }
		if (walletObject.uuid === uuid) { currentPrivateKey = privateKey }
		privateCache[walletObject.uuid] = { privateKey, timestamp: Date.now(), wallet }
	})
	await Promise.all(result)
	setTimeout(invalidateAllMaybe, 2000)
	return currentPrivateKey
}

export async function requestPrivateKey (wallet: Wallet): Promise<PrivateKey> {
	let skPromiseControls: { resolve: (arg: PrivateKey) => void, reject: PasswordRequest['reject'] }
	const skPromise = new Promise<PrivateKey>((resolve, reject) => skPromiseControls = { resolve, reject })
	let passwordPromiseControls: { resolve: PasswordRequest['resolve'], reject: PasswordRequest['reject'] }
	const passwordPromise = new Promise<string>((resolve, reject) => passwordPromiseControls = { resolve, reject })
	passwordPromise.catch(e => skPromiseControls.reject(e))
	const inCache = async () => {
		const cache = getCache(wallet.uuid)
		if (cache) { skPromiseControls.resolve(cache); return true }
	}
	const query = async () => {
		if (await inCache()) { return passwordPromiseControls.resolve('') }
		emitter.emit('password', { reason: 'get', wallet, ...passwordPromiseControls })
		const password = await passwordPromise
		const currentPrivateKey = await setCache(wallet.uuid, password)
		if (!currentPrivateKey) { return skPromiseControls.reject('unable to get private key') }
		skPromiseControls.resolve(currentPrivateKey)
	}
	requestPasswordQueue.push({ query, ...passwordPromiseControls! })
	runQueue.query()
	return skPromise
}

let requestPasswordQueue = [] as { query: Function, resolve: Function, reject: Function }[]

const runQueue = getQueryManager({
	name: 'Password',
	query: async () => {
		while (requestPasswordQueue.length) {
			const item = requestPasswordQueue.splice(0, 1)[0]
			try { await item.query() } catch (e) {
				const queue = requestPasswordQueue
				requestPasswordQueue = []
				queue.forEach(r => r.reject())
			}
		}
	}
})

async function requestPassword (request: Omit<PasswordRequest, 'resolve' | 'reject'>, invalidate?: () => Promise<any>) {
	let controls: { resolve: PasswordRequest['resolve'], reject: PasswordRequest['reject'] }
	const promise = new Promise<string>((resolve, reject) => controls = { resolve, reject })
	const query = async () => {
		if (invalidate && await invalidate()) { return controls.resolve('') }
		emitter.emit('password', { ...request , ...controls })
		await promise
	}
	requestPasswordQueue.push({ query, ...controls! })
	runQueue.query()
	return promise
}