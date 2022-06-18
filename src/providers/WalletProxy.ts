import { uuidV4 } from '@/functions/Utils'
import { isEncrypted } from '@/functions/Crypto'
import { requestPrivateKey } from '@/functions/Password'
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
		get uuid () { return this.#wallet.uuid ??= uuidV4() }
		get data () { return this.#wallet.data ??= {} }
		get settings () { return this.#wallet.settings ??= {} }
		get hasPrivateKey () { return !!this.#wallet.jwk }
		get isEncrypted () { return this.#isEncrypted.value }
		async getPrivateKey (): Promise<JWKInterface> {
			if (!isEncrypted(this.#wallet.jwk!)) { return this.#wallet.jwk! }
			return requestPrivateKey(this as any)
		}
	}
}