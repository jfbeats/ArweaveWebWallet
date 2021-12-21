let db: IDBDatabase

export async function getDB () {
	return new Promise<IDBDatabase>((resolve, reject) => {
		if (db) { return resolve(db) }
		const req = indexedDB.open('app', 3)
		req.onupgradeneeded = upgrade
		req.onsuccess = () => {
			db = req.result
			resolve(db)
		}
		req.onerror = () => reject(req.error)
	})
}



function upgrade (this: IDBOpenDBRequest, e: IDBVersionChangeEvent) {
	db = this.result
	const upgradeTransaction = this.transaction
	
	if (!db.objectStoreNames.contains('notifications')) {
		const notifications = db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true })
		notifications.createIndex('origin', 'origin', { unique: false })
	}
	
	let messages: IDBObjectStore | undefined
	if (!db.objectStoreNames.contains('messages')) {
		messages = db.createObjectStore('messages', { keyPath: 'uuid' })
	} else {
		messages = upgradeTransaction?.objectStore('messages')
	}
	if (messages) {
		setIndex(messages, 'origin', { unique: false })
		setIndex(messages, 'sessionId', { unique: false })
		setIndex(messages, 'timestamp', { unique: false })
	}
}



const setIndex = (store: IDBObjectStore, name: string, options: IDBIndexParameters) => {
	const index = store.indexNames.contains(name) ? store.index(name) : undefined
	const swap = index && (index.unique !== options.unique || index.multiEntry !== options.multiEntry)
	if (swap) { store.deleteIndex(name) }
	if (!index || swap) { store.createIndex(name, name, options) }
}