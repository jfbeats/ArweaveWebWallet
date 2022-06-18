import { useChannel, useLock } from '@/functions/Channels'
import { isEncrypted, passwordDecrypt, passwordEncrypt } from '@/functions/Crypto'
import { computed } from 'vue'
import { JWKInterface } from 'arweave/web/lib/wallet'
import mitt from 'mitt'
import { getQueryManager } from '@/functions/AsyncData'
import { Wallet } from '@/providers/WalletProxy'
import { getWalletById } from '@/functions/Wallets'



const pwdTest = useChannel('pwdTest').state
const pwdTestLock = useLock(useChannel('pwdTestLock').state)
export const hasPassword = computed(() => pwdTest.value)
const WalletsData = useChannel('wallets', undefined, []).state



export async function testPassword (password?: string): Promise<void> {
	if (!pwdTest.value != !password) { throw 'Invalid password' }
	if (!pwdTest.value || !password) { return }
	const result = await passwordDecrypt(password, pwdTest.value)
	if (result !== 'valid') { throw 'Invalid password' }
}

export async function updateEncryption () {
	await pwdTestLock.lock()
	const password = await requestPassword({ reason: 'Password change' })
	const promises = WalletsData.value
	.filter(wallet => wallet.settings?.securityLevel && wallet.settings.securityLevel !== 'disabled')
	.filter(wallet => wallet.jwk && !isEncrypted(wallet.jwk))
	.map(async wallet => ({
		uuid: getWalletById(wallet.id)?.uuid,
		jwk: await passwordEncrypt(password, wallet.jwk)
	}))
	const wallets = await Promise.all(promises)
	wallets.forEach(wallet => WalletsData.value.find(data => data.uuid === wallet.uuid)!.jwk = wallet.jwk)
	pwdTestLock.unlock()
}

export async function setPassword (password: string, oldPassword?: string): Promise<void> {
	await pwdTestLock.lock()
	let wallets = [] as any[]
	if (pwdTest.value) {
		if (oldPassword) { await testPassword(oldPassword) }
		oldPassword ??= await requestPassword({ reason: 'Password change' })
		const promises = WalletsData.value
		.filter(wallet => wallet.jwk && isEncrypted(wallet.jwk))
		.map(async wallet => ({
			uuid: getWalletById(wallet.id)?.uuid,
			jwk: await passwordDecrypt(oldPassword!, wallet.jwk as any)
		}))
		wallets = await Promise.all(promises)
	}
	if (password) {
		const unencrypted = WalletsData.value
		.filter(wallet => wallet.jwk && !isEncrypted(wallet.jwk))
		.filter(wallet => wallet.settings?.securityLevel && wallet.settings.securityLevel !== 'disabled')
		.map(wallet => ({
			uuid: getWalletById(wallet.id)?.uuid,
			jwk: wallet.jwk
		}))
		wallets = [...wallets, ...unencrypted]
		const encryptedContent = await passwordEncrypt(password, 'valid')
		pwdTest.value = encryptedContent
		wallets = await Promise.all(wallets.map(async wallet => wallet.jwk = await passwordEncrypt(password, wallet.jwk)))
	} else {
		pwdTest.value = undefined // test proper handling by storage channel
	}
	wallets.forEach(wallet => WalletsData.value.find(data => data.uuid === wallet.uuid)!.jwk = wallet.jwk)
	pwdTestLock.unlock()
}



type PasswordRequest = {
	info: { reason: string }
	resolve: (arg: string) => void
}
export const emitter = mitt<{ password: PasswordRequest }>()
const privateCache = {} as { [uuid: string]: JWKInterface }



function getCache (uuid: string): JWKInterface | void {
	return privateCache[uuid]
}

async function setCache (uuid: string, password: string): Promise<JWKInterface> {
	let currentPrivateKey = undefined as undefined | JWKInterface
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

export async function requestPrivateKey (wallet: Wallet): Promise<JWKInterface> {
	let currentPrivateKey = undefined as undefined | JWKInterface
	const inCache = async () => {
		const cache = getCache(wallet.uuid)
		if (cache) { currentPrivateKey = cache; return true }
	}
	const password = await requestPassword({ reason: 'Decrypt wallet' }, inCache)
	if (!currentPrivateKey) { currentPrivateKey = await setCache(wallet.uuid, password) }
	return currentPrivateKey!
}

const requestPasswordQueue = [] as Function[]

const runQueue = getQueryManager({
	name: 'Password',
	query: async () => {
		while (requestPasswordQueue.length) {
			const item = requestPasswordQueue.splice(0, 1)[0]
			await item()
		}
	}
})

async function requestPassword (info: PasswordRequest['info'], invalidate?: () => Promise<any>) { // handle no password set
	return new Promise<string>(resolve => {
		const req = async () => {
			if (invalidate && await invalidate()) { return }
			emitter.emit('password', { info, resolve })
		}
		requestPasswordQueue.push(req)
		runQueue.query()
	})
}