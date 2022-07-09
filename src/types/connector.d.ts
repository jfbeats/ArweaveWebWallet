type Status = 'accepted' | 'allowed' | 'rejected' | 'error' | undefined

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

type MessageEntry = Omit<Message, 'params'> & {
	uuid: string
	status: Status
	fulfilled: boolean
	processing: boolean
}

type InstanceState = {
	origin?: string
	session?: string
	type?: 'extension' | 'ws' | 'popup' | 'iframe' | 'client'
}

type ConnectorState = {
	origin: string
	session?: string
	messageQueue: MessageEntry[]
	timestamp: number
	appInfo?: { name?: string, logo?: string}
	walletId?: string | false
	link?: boolean
	links: { [keys in NonNullable<InstanceState['type']>]?: any }
	connected?: boolean
}

type ConnectionSettings = { [uuid: string]: { [method: string]: boolean } } | undefined