import { uuidV4 } from '@/functions/Utils'
import { isEncrypted } from '@/functions/Crypto'
import { requestPrivateKey } from '@/functions/Password'
import InterfaceStore from '@/store/InterfaceStore'
import { computed, watch } from 'vue'
import { coldState } from '@/store/Cold'



export function WalletProxy <TBase extends ClassConstructor> (Base: TBase) {
	return class WalletProxy extends Base {
		#wallet: WalletDataInterface
		#isEncrypted = computed(() => isEncrypted(this.#wallet.jwk))
		constructor (...args: any[]) { super(...args)
			this.#wallet = args[0] as WalletDataInterface
			if (args[0].arweave) { this.data.arweave = args[0].arweave } // TODO remove - temporary conversion
			const stopColdWatch = watch(() => InterfaceStore.online, online => {
				const isExcluded = Object.entries(this.data).some(entry => entry[1].key && coldState.value?.excluded.includes(entry[1].key))
				if (isExcluded || online && this.hasPrivateKey) { this.state.hot = true }
			}, { immediate: true })
			;(this as any).on('destructor', () => { this.#isEncrypted.effect.stop(); stopColdWatch() })
		}
		get id () { return this.#wallet.id + '' }
		get uuid () { return this.#wallet.uuid ??= uuidV4() }
		get data () { return this.#wallet.data ??= {} }
		get state () { return this.#wallet.state ??= {} }
		get settings () { return this.#wallet.settings ??= {} }
		get hasPrivateKey () { return !!this.#wallet.jwk }
		get isEncrypted () { return this.#isEncrypted.value }
		async getPrivateKey (): Promise<PrivateKey> {
			if (!this.hasPrivateKey) { throw 'Private key unavailable' }
			if (!isEncrypted(this.#wallet.jwk!)) { return this.#wallet.jwk! }
			return requestPrivateKey(this as any)
		}
	}
}