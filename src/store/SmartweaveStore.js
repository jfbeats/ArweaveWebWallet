import { arweave } from '@/store/ArweaveStore'
import { readContract } from 'smartweave'
import { reactive } from 'vue'

const SmartweaveStore = reactive({
	contracts: {},
})


export async function getContract (id) {
	SmartweaveStore.contracts[id] = await readContract(arweave, id)
	console.log(SmartweaveStore.contracts)
}

getContract('5hpzk2vzh-QiyvYqnVuaUFWr8--HfhcfK6HIix-ldJQ')

export default SmartweaveStore
