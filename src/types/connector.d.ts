type Procedure = {
	guard: (params: unknown) => boolean
	run: (params: unknown) => unknown
}

type Procedures = { [key: string]: Procedure }

type Message = {
	id?: number
	method?: string
	params?: unknown
} // todo verify type

type MessageEntry = {
	message: Message
	status?: 'accepted' | 'rejected' | 'error' | undefined
	fulfilled: boolean
	timestamp: number
}

type InstanceState = {
	origin?: string
	session?: string
	type?: 'popup' | 'iframe' | 'client'
}

type ConnectorState = {
	origin: string
	session?: string
	messageQueue: MessageEntry[]
	timestamp: number
	appInfo?: { name?: string, logo?: string}
	walletId?: string | false
	link?: boolean
}