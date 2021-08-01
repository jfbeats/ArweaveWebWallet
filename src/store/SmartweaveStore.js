import { arweave } from '@/store/ArweaveStore'
import { smartweave, readContract } from 'smartweave'
import { reactive } from 'vue'

const SmartweaveStore = reactive({
	contracts: {},
})



export async function getContract (id) {
	SmartweaveStore.contracts[id] = await readContract(arweave, id)
	console.log(SmartweaveStore.contracts)
}

// Testing
if (process.env.NODE_ENV === 'development') {
	window.smartweave = smartweave
	getContract('5hpzk2vzh-QiyvYqnVuaUFWr8--HfhcfK6HIix-ldJQ')
}

export default SmartweaveStore
