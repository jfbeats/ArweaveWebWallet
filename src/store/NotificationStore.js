import { reactive } from 'vue'
import { getDB } from '@/store/IndexedDB'

async function push (notification) {
	const db = await getDB()
	notification.timestamp ??= Date.now()
	return new Promise(resolve => {
		const dbTx = db.transaction('notifications', 'readwrite')
		const store = dbTx.objectStore('notifications')
		store.put(notification)
		dbTx.oncomplete = () => resolve()
	})
}

function getManager (origin) {
	const manager = {
		notifications: reactive([]),
		completed: false,
		async fetch () {
			if (this.completed) { return }
			const db = await getDB()
			const dbTx = db.transaction('notifications', 'readonly')
			const store = dbTx.objectStore('notifications')
			const index = store.index('origin')
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