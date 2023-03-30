import Notification from '@/components/composed/Notification.vue'
import { getDB } from '@/store/IndexedDB'
import { createToast, withProps } from 'mosha-vue-toastify'
import { reactive, Ref, ref } from 'vue'
import { ICON } from '@/store/Theme'

export type NotificationData = Override<NotificationOptions, {
	title?: string
	onClose?: () => void
	actions?: Action[]
	ref?: Ref
}>
type Notify = string | NotificationData
const toastType = { log: 'success', warn: 'warning', error: 'danger', confirm: 'warning' } as const

const log = (notify: Notify, push?: boolean) => createNotification('log', notify, push)
const warn = (notify: Notify, push?: boolean) => createNotification('warn', notify, push)
const error = (notify: Notify, push?: boolean) => createNotification('error', notify, push)
const confirm = (notify: Notify, push?: boolean) => createNotification('confirm', notify, push)



function createNotification (type: keyof typeof toastType, notify: Notify, push?: boolean) {
	const data = (typeof notify === 'object') ? notify : { title: notify } as NotificationData
	const { title, ...options } = data
	options.timestamp ??= Date.now()
	options.badge ??= undefined
	options.icon ??= undefined
	options.data ??= {}
	options.data.type = type
	
	
	const isVisible = document.visibilityState === 'visible'
	const doNotification = window.Notification && Notification.permission === 'granted' && !isVisible && push
	
	let actions = data.actions ?? []
	if (type === 'confirm') {
		options.requireInteraction = true
	}
	let close = () => {}
	const promise = new Promise<boolean>(res => {
		actions = actions.map(a => {
			const run = () => { a.run && a.run?.(); res(true) }
			return { ...a, run }
		})
		if (type === 'confirm') { actions = [{ name: 'Accept', icon: ICON.y, run: () => res(true) }, { name: 'Cancel', icon: ICON.x, run: () => res(false) }, ...actions] }
		close = () => res(false)
	})
	const toastSettings = { title, description: options.body }
	const props: { data: NotificationData } = { data: { ...toastSettings, actions } }
	const toastContent = withProps(Notification, props)
	
	const notification = doNotification ? new Notification(title, options) : undefined
	const toast = !doNotification ? createToast(toastContent, {
		type: toastType[type],
		showIcon: true,
		onClose: () => { options.onClose?.(); close() },
		timeout: options.requireInteraction ? -1 : 5000
	}) : undefined
	
	notification?.addEventListener('close', () => { options.onClose?.(); close() })
	
	if (push) { pushNotification(data) }
	
	promise.then(() => { toast?.close(); notification?.close() })
	return { promise, close }
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



export const notify = { log, warn, error, confirm }

export const notificationPermission = ref(window.Notification?.permission)
navigator.permissions?.query?.({ name: 'notifications' }).then(status => status.addEventListener('change', () => notificationPermission.value = window.Notification.permission))

export async function requestNotificationPermission () {
	if (!window.Notification?.permission) { return }
	if (window.Notification.permission !== 'denied') { await Notification.requestPermission() }
	notificationPermission.value = window.Notification.permission
	return notificationPermission.value
}