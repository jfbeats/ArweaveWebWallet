import { arweave } from '@/store/ArweaveStore'
import { smartweave } from 'smartweave'
import { reactive } from 'vue'

const SmartweaveStore = reactive({
	contracts: {},
})



export async function getContract (id) {
	SmartweaveStore.contracts[id] = await smartweave.readContract(arweave, id)
	console.log(SmartweaveStore.contracts)
}

// Testing
if (import.meta.env.DEV) {
	window.smartweave = smartweave
	window.SmartweaveStore = SmartweaveStore
	// getContract('5hpzk2vzh-QiyvYqnVuaUFWr8--HfhcfK6HIix-ldJQ')
}

export default SmartweaveStore
