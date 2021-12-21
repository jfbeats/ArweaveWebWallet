let db: IDBDatabase

export async function getDB () {
	return new Promise<IDBDatabase>((resolve, reject) => {
		if (db) { return resolve(db) }
		const req = indexedDB.open('app', 1)
		req.onupgradeneeded = () => {
			db = req.result
			if (!db.objectStoreNames.contains('notifications')) {
				const notifications = db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true })
				notifications.createIndex('origin', 'origin', { unique: false })
			}
			if (!db.objectStoreNames.contains('messages')) {
				const messages = db.createObjectStore('messages', { keyPath: 'uuid' })
				messages.createIndex('origin', 'origin', { unique: false })
				messages.createIndex('timestamp', 'timestamp', { unique: false })
			}
		}
		req.onsuccess = () => {
			db = req.result
			resolve(db)
		}
		req.onerror = () => reject(req.error)
	})
}