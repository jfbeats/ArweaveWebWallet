import { getDB } from '@/store/IndexedDB'
import { createToast } from 'mosha-vue-toastify'
import { reactive, ref } from 'vue'

type NotificationData = NotificationOptions & { title: string, onClose?: () => void }
type Notify = string | NotificationData
const toastType = { log: 'success', warn: 'warning', error: 'danger' } as const

const log = (notify: Notify, push?: boolean) => createNotification('log', notify, push)
const warn = (notify: Notify, push?: boolean) => createNotification('warn', notify, push)
const error = (notify: Notify, push?: boolean) => createNotification('error', notify, push)



async function createNotification (type: keyof typeof toastType, notify: Notify, push?: boolean) {
	const data = (typeof notify === 'object') ? notify : { title: notify } as NotificationData
	const { title, ...options } = data
	options.timestamp ??= Date.now()
	options.badge ??= undefined
	options.icon ??= undefined
	options.data ??= {}
	options.data.type = type
	
	const isVisible = document.visibilityState === 'visible'
	const doNotification = window.Notification && Notification.permission === 'granted' && !isVisible && push
	
	const notification = doNotification ? new Notification(title, options) : undefined
	const toast = !doNotification ? createToast({ title, description: options.body }, {
		type: toastType[type],
		showIcon: true,
		onClose: () => { notification?.close(); options.onClose?.() },
		timeout: options.requireInteraction ? -1 : 5000
	}) : undefined
	
	notification?.addEventListener('close', () => { toast?.close(); options.onClose?.() })
	
	if (push) { await pushNotification(data) }
}



async function pushNotification (notification: NotificationData) {
	const db = await getDB()
	return new Promise<void>(resolve => {
		const dbTx = db.transaction('notifications', 'readwrite')
		const store = dbTx.objectStore('notifications')
		store.put(notification)
		dbTx.oncomplete = () => resolve()
	})
}



function getManager (origin: string) { // use queryManager
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



export const notify = { log, warn, error }

export const notificationPermission = ref(window.Notification?.permission)
navigator.permissions?.query?.({ name: 'notifications' }).then(status => status.addEventListener('change', () => notificationPermission.value = window.Notification.permission))

export async function requestNotificationPermission () {
	if (!window.Notification?.permission) { return }
	if (window.Notification.permission !== 'denied') { await Notification.requestPermission() }
	notificationPermission.value = window.Notification.permission
	return notificationPermission.value
}