import { reactive } from 'vue'

let db

async function getDB () {
	return new Promise((resolve, reject) => {
		if (db) { return resolve(db) }
		const req = indexedDB.open('notifications', 1)
		req.onupgradeneeded = () => {
			db = req.result
			if (!db.objectStoreNames.contains('notifications')) {
				const notifications = db.createObjectStore('notifications', { keypath: 'id', autoIncrement: true })
				notifications.createIndex('origin', 'origin', { unique: false })
			}
		}
		req.onsuccess = () => {
			db = req.result
			resolve(db)
		}
		req.onerror = () => reject(req.error)
	})
}

async function push (notification) {
	await getDB()
	notification.timestamp ??= Date.now()
	return new Promise(resolve => {
		const tx = db.transaction('notifications', 'readwrite')
		const store = tx.objectStore('notifications')
		store.put(notification)
		tx.oncomplete = () => resolve()
	})
}

function getManager (origin) {
	const manager = {
		notifications: reactive([]),
		completed: false,
		async fetch () {
			if (this.completed) { return }
			await getDB()
			const tx = db.transaction('notifications', 'readonly')
			const dbNotifications = tx.objectStore('notifications')
			const index = dbNotifications.index('origin')
			let i = 0
			index.openCursor(origin, 'prev').onsuccess = (e) => {
				const cursor = e.target.result
				if (!cursor) { this.completed = true; return }
				const pk = this.notifications[this.notifications.length - 1]?.pk
				console.log(pk)
				if (pk !== null && pk - 1 < cursor.primaryKey) {
					cursor.continuePrimaryKey(origin, pk - 1)
					return
				}
				this.notifications.push({ ...cursor.value, pk: cursor.primaryKey })
				if (++i < 1) { cursor.continue() }
			}
		},
	}
	return manager
}

const NotificationStore = { push, getManager }
window.NotificationStore = NotificationStore

export default NotificationStore