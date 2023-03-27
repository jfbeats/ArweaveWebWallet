import { useRegisterSW } from 'virtual:pwa-register/vue'
import { reactive } from 'vue'
import { track } from '@/store/Telemetry'
import { prepare } from '@/store/Cold'



interface BeforeInstallPromptEvent extends Event {
	readonly platforms: Array<string>
	readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>
	prompt(): Promise<void>
}



export const PWA = reactive({
	registration: new Promise<ServiceWorkerRegistration | undefined>(res => useRegisterSW({
		onRegisteredSW: (swScriptUrl, registration) => res(registration)
	})),
	install,
	installPrompt: undefined as undefined | BeforeInstallPromptEvent,
	installState: undefined as undefined | 'available' | 'installed',
	installed: undefined as undefined | any[],
})



async function install () {
	await prepare(true)
	if (!PWA.installPrompt) { throw 'Install unavailable' }
	PWA.installPrompt.prompt()
	const { outcome } = await PWA.installPrompt.userChoice
	if (outcome !== 'accepted') { return }
	PWA.installState = 'installed'
	track.event('App Install')
}



window.addEventListener('beforeinstallprompt', e => {
	e.preventDefault()
	PWA.installPrompt = e as BeforeInstallPromptEvent
	PWA.installState = 'available'
})

// @ts-ignore
navigator.getInstalledRelatedApps?.()?.then(apps => { PWA.installed = apps; apps.length && console.log(apps) }).catch(() => {})
PWA.registration.then(r => setInterval(() => r?.update(), 60 * 60 * 1000))