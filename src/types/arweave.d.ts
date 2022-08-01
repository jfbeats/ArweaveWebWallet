type ArTxParams = {
	target?: string
	quantity?: string
	ar?: string
	winston?: string
	reward?: string
	arReward?: string
	winstonReward?: string
	tags?: { name: string, value: string }[]
	data?: string | File
}

type ArDataItemParams = {
	data: Uint8Array | string
	tags?: { name: string, value: string }[]
	target?: string
	sign?: boolean
}