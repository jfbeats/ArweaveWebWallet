import { useChannel, useLock } from '@/functions/Channels'
import { isEncrypted, passwordDecrypt, passwordEncrypt } from '@/functions/Crypto'
import { computed } from 'vue'
import mitt from 'mitt'
import { getQueryManager } from '@/functions/AsyncData'
import { getWalletById } from '@/functions/Wallets'



export type PasswordRequest = {
	reason: 'get' | 'update' | 'change' | 'match'
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

export async function setPassword (password: string): Promise<true> {
	await pwdTestLock.lock()
	try {
		let wallets = [] as any[]
		if (pwdTest.value) {
			const oldPassword = await requestPassword({ reason: 'change', match: password })
			const promises = WalletsData.value
			.filter(wallet => wallet.jwk && isEncrypted(wallet.jwk))
			.map(async wallet => ({
				uuid: getWalletById(wallet.id)?.uuid,
				jwk: await passwordDecrypt(oldPassword!, wallet.jwk as any)
			}))
			wallets = await Promise.all(promises)
		}
		if (password) {
			if (!pwdTest.value) { await requestPassword({ reason: 'match', match: password }) }
			const unencrypted = requireEncryption.value.map(wallet => ({
				uuid: getWalletById(wallet.id)?.uuid,
				jwk: wallet.jwk
			}))
			wallets = [...wallets, ...unencrypted]
			wallets = await Promise.all(wallets.map(async wallet => wallet.jwk = await passwordEncrypt(password, wallet.jwk)))
			const encryptedContent = await passwordEncrypt(password, 'valid')
			pwdTest.value = encryptedContent
		} else {
			pwdTest.value = null
		}
		wallets.forEach(wallet => WalletsData.value.find(data => data.uuid === wallet.uuid)!.jwk = wallet.jwk)
	} finally { pwdTestLock.unlock() }
	return true
}



export const emitter = mitt<{ password: PasswordRequest }>()
const privateCache = {} as { [uuid: string]: PrivateKey }



function getCache (uuid: string): PrivateKey | void {
	return privateCache[uuid]
}

async function setCache (uuid: string, password: string): Promise<PrivateKey> {
	let currentPrivateKey = undefined as undefined | PrivateKey
	const result = WalletsData.value
	.filter(wallet => isEncrypted(wallet.jwk))
	.filter(wallet => wallet.uuid === uuid || wallet.settings?.securityLevel !== 'always') // todo settings
	.map(async wallet => {
		const privateKey = await passwordDecrypt(password, wallet.jwk as any)
		if (wallet.settings?.securityLevel !== 'always') { privateCache[uuid] = privateKey } // todo cache invalidation
		if (wallet.uuid === uuid) { currentPrivateKey = privateKey }
	})
	await Promise.all(result)
	return currentPrivateKey!
}

export async function requestPrivateKey (wallet: Wallet): Promise<PrivateKey> {
	let currentPrivateKey = undefined as undefined | PrivateKey
	const inCache = async () => {
		const cache = getCache(wallet.uuid)
		if (cache) { currentPrivateKey = cache; return true }
	}
	const password = await requestPassword({ reason: 'get', wallet }, inCache)
	if (!currentPrivateKey) { currentPrivateKey = await setCache(wallet.uuid, password) }
	return currentPrivateKey!
}

const requestPasswordQueue = [] as Function[]

const runQueue = getQueryManager({
	name: 'Password',
	query: async () => {
		while (requestPasswordQueue.length) {
			const item = requestPasswordQueue.splice(0, 1)[0]
			try { await item() } catch (e) {}
		}
	}
})

async function requestPassword (request: Omit<PasswordRequest, 'resolve' | 'reject'>, invalidate?: () => Promise<any>) {
	let controls: { resolve: PasswordRequest['resolve'], reject: PasswordRequest['reject']}
	const promise = new Promise<string>((resolve, reject) => controls = { resolve, reject })
	const query = async () => {
		if (invalidate && await invalidate()) { return }
		emitter.emit('password', { ...request , ...controls })
		await promise
	}
	requestPasswordQueue.push(query)
	runQueue.query()
	return promise
}