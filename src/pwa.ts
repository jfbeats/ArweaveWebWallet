import { useRegisterSW } from 'virtual:pwa-register/vue'
import { reactive } from 'vue'



interface BeforeInstallPromptEvent extends Event {
	readonly platforms: Array<string>
	readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>
	prompt(): Promise<void>
}



export const PWA = reactive({
	registration: new Promise(resolve => useRegisterSW({ onRegistered (r) { resolve(r) } })),
	install,
	installPrompt: undefined as undefined | BeforeInstallPromptEvent,
	installState: undefined as undefined | 'available' | 'installed',
	installed: undefined as undefined | any[],
})



async function install () {
	if (!PWA.installPrompt) { throw 'Install unavailable' }
	PWA.installPrompt.prompt()
	const { outcome } = await PWA.installPrompt.userChoice
	if (outcome === 'accepted') { PWA.installState = 'installed' }
}



window.addEventListener('beforeinstallprompt', e => {
	e.preventDefault()
	PWA.installPrompt = e as BeforeInstallPromptEvent
	PWA.installState = 'available'
})

// @ts-ignore
navigator.getInstalledRelatedApps?.()?.then(apps => { PWA.installed = apps; console.log(apps) })