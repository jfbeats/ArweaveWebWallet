import { uuidV4 } from '@/functions/Utils'
import { isEncrypted, passwordDecrypt, passwordEncrypt } from '@/functions/Crypto'
import { JWKInterface } from 'arweave/web/lib/wallet'
import { computed } from 'vue'



export type Wallet = Provider & MixinType<typeof WalletProxy>



export function WalletProxy <TBase extends ClassConstructor> (Base: TBase) {
	return class WalletProxy extends Base {
		#wallet: WalletDataInterface
		#isEncrypted = computed(() => isEncrypted(this.#wallet.jwk))
		constructor (...args: any[]) { super(...args)
			this.#wallet = args[0] as WalletDataInterface
			if (args[0].arweave) { this.data.arweave = args[0].arweave } // TODO remove - temporary conversion
			;(this as any).on('destructor', () => this.#isEncrypted.effect.stop())
		}
		get id () { return this.#wallet.id + '' }
		get uuid () { this.#wallet.uuid ??= uuidV4(); return this.#wallet.uuid! }
		get data () { this.#wallet.data ??= {}; return this.#wallet.data }
		get hasPrivateKey () { return !!this.#wallet.jwk }
		get isEncrypted () { return this.#isEncrypted.value }
		async getPrivateKey (): Promise<JWKInterface> {
			if (!isEncrypted(this.#wallet.jwk!)) { return this.#wallet.jwk! }
			return passwordDecrypt('pass', this.#wallet.jwk)
		}
		async encryptPrivateKey (password: string) { this.#wallet.jwk = await passwordEncrypt(password, this.#wallet.jwk) }
		async decryptPrivateKey (password: string) { this.#wallet.jwk = await passwordDecrypt(password, this.#wallet.jwk as any) }
	}
}