import { arweave } from '@/store/ArweaveStore'
// import {
// 	CacheableExecutorFactory,
// 	CacheableStateEvaluator,
// 	ContractDefinitionLoader,
// 	DebuggableExecutorFactory,
// 	EvalStateResult,
// 	HandlerExecutorFactory,
// 	LexicographicalInteractionsSorter,
// 	LoggerFactory,
// 	MemBlockHeightSwCache,
// 	MemCache,
// 	SmartWeave
// } from 'redstone-smartweave'
import { reactive } from 'vue'

const SmartweaveStore = reactive({
	contracts: {},
})

export default SmartweaveStore
