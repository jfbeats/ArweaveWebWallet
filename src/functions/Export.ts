import Transaction from 'arweave/web/lib/transaction'
import { focusWindow, RPC } from '@/functions/Connect'
import router from '@/router'
import { ExportEntry, ExportRequest, findTransactions, manageUpload } from '@/functions/Transactions'
import { notify } from '@/store/NotificationStore'
import InterfaceStore from '@/store/InterfaceStore'
import { computed, ref, shallowRef, toRaw } from 'vue'
import { awaitEffect } from '@/functions/AsyncData'
import { ArweaveProvider } from '@/providers/Arweave'



const pending = ref([] as ExportRequest[])
export const exportRequest = computed(() => pending.value[0] as ExportRequest | undefined)



export async function requestExport (obj: { tx?: AnyTransaction, compressed?: any, entry?: ExportEntry }) {
	let controls: { resolve: ExportRequest['resolve'], reject: ExportRequest['reject'] }
	const promise = new Promise<Transaction>((resolve, reject) => controls = { resolve, reject })
	const newEntry: ExportEntry | undefined = obj.tx && obj.entry && { ...obj.entry, tx: obj.tx }
	const entry = newEntry ?? obj.entry ?? (await findTransactions(obj.tx))?.[0]
	if (entry == undefined) { throw 'Error exporting' }
	const request = { entry, compressed: obj.compressed, promise, ...controls! }
	pending.value.push(request)
	request.promise.finally(() => pending.value = pending.value.filter(el => toRaw(el) !== request))
	focusWindow()
	return promise
}

export async function requestImport (entries: ExportEntry[]) {
	const matches = entries.map(e => ({
		import: e,
		export: pending.value.find(p => p.entry.equals(e.tx))
	}))
	if (matches.find(e => !e.import.isSigned && e.export)) { const e = 'The returned transaction is not signed'; notify.error(e); throw e }
	matches.forEach(match => {
		match.import.init().then(tx => match.export?.resolve(tx))
	})
	const imports = matches.filter(match => !match.export?.resolve).map(m => m.import)
	const signed = imports.filter(m => m.isSigned)
	const unsigned = imports.filter(m => !m.isSigned)
	if (signed.length) {
		notify.confirm('Upload signed transactions?').promise.then(v => v && signed.forEach(({ tx, provider }) => manageUpload(tx as any)))
	}
	if (unsigned.length) {
		unsigned.map(({ tx: txIn, provider, init }) => init().then(tx => RPC.arweave.signTransaction(tx).then(async tx => {
			const entry = (await findTransactions(tx))?.[0]
			const compressed = provider.compress(txIn, tx)
			if (!InterfaceStore.online) { return requestExport({ tx, entry, compressed }) } // todo public key vs address
			manageUpload(tx as any)
		})))
		router.push({ name: 'Connect' })
	}
}



export const relayRequest = shallowRef(undefined as undefined | { wallet: Wallet, walletData: Partial<WalletDataInterface> })

export async function requestRelay (wallet: Wallet) {
	if (wallet instanceof ArweaveProvider) {
		await Promise.all([wallet.getPublicKey(), awaitEffect(() => wallet.key)])
		const { data } = wallet
		return relayRequest.value = { wallet, walletData: { data } }
	}
	throw 'Relay not supported for specific provider'
}