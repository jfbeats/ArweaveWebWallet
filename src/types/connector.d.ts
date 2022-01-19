type Status = 'accepted' | 'rejected' | 'error' | undefined

type Message = {
	id?: number
	method: string
	params?: unknown[]
}

type StoredMessage = Omit<Message, 'id'> & {
	uuid: string
	origin: string
	sessionId: string
	timestamp: number
	status: Status
	fulfilled: boolean
}

type MessageEntry = {
	uuid: string
	id?: number
	status: Status
	fulfilled: boolean
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

type ConnectionSettings = { [uuid: string]: { [method: string]: boolean } } | undefined