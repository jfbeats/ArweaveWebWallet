import { Wallets } from '@/functions/Wallets'
import { useChannel } from '@/functions/Channels'
import { base32Decode } from '@/functions/Encoding'
import { arweave } from '@/store/ArweaveStore'



type AccountEvent = 'Account Create' | 'Account Import' | 'Account Watch' | 'Account Ledger'
type EventType = AccountEvent |
	'App Install' | 'App Update'
	| 'Fee' | 'Fee Paid' | 'Affiliate'
	| 'Connect' | 'Connect Localhost'
	| 'Connector'
	| 'Tx Data' | 'Tx Value' | 'Tx Value Data' | 'Tx Empty'
	| 'Error'
const eventRecords = useChannel('events', undefined, {}).state



function hook (_this: any, method: any, callback: any) {
	const orig = _this[method]
	return (...args: any[]) => {
		callback.apply(null, args)
		return orig.apply(_this, args)
	}
}

function doNotTrack () {
	const { doNotTrack, navigator, external } = window as any
	const msTrackProtection = 'msTrackingProtectionEnabled'
	const msTracking = () => external && msTrackProtection in external && external[msTrackProtection]()
	const dnt = doNotTrack || navigator.doNotTrack || navigator.msDoNotTrack || msTracking()
	return dnt == '1' || dnt === 'yes'
}

function testLocalhost (location = window.location) { return /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*:)*?:?0*1$/.test(location.hostname) || location.protocol === 'file:' }
export const isLocalhost = testLocalhost()

const isMain = location.hostname === 'arweave.app'
const isKnown = isMain || isLocalhost



function init () {
	const {
		screen: { width, height },
		navigator: { language },
		location: { hostname, pathname, search },
		localStorage,
		document,
		history,
	} = window
	
	const root = 'https://an.arweave.duckdns.org'
	const website = isMain ? '69deda3b-740e-49f8-aceb-f4bfa3455029'
		: isLocalhost ? '59437916-9c3e-4945-a25c-9a1ccdf520a9'
		: '8a399a1f-dbce-4ceb-b1d7-6882f50a55b9'
	const dnt = false
	
	const screen = `${width}x${height}`
	let currentUrl = isKnown ? `${pathname}${search}` : location.href
	let currentRef = document.referrer
	let cache: string
	
	const trackingDisabled = () => localStorage && localStorage.getItem('umami.disabled') || dnt && doNotTrack()
	const collect = async (type: string, payload: object) => {
		if (trackingDisabled()) { return }
		return fetch(`${root}/c`, {
			method: 'POST',
			body: JSON.stringify({ type, payload }),
			headers: Object.assign({ 'Content-Type': 'application/json' }, { ['x-umami-cache']: cache }),
		}).then(res => res.text()).then(text => (cache = text)).catch(() => {})
	}
	
	const getPayload = () => ({ website, hostname, screen, language, url: currentUrl })
	const view = () => collect('pageview', Object.assign(getPayload(), { referrer: currentRef }))
	const event = (event_name: EventType, value?: { [key: string]: any } | string) => {
		const event_data = typeof value === 'string' ? { value } : value
		if (event_name === 'Connect' && event_data) { try { event_data.value = extractId(event_data.value) } catch (e) {} }
		if (event_name === 'Connect' && event_data && testLocalhost(event_data.value)) { event_name = 'Connect Localhost' }
		collect('event', Object.assign(getPayload(), { event_name, event_data }))
	}
	
	const handlePush = (state: any, title: any, url: any) => {
		if (!url) { return }
		currentRef = currentUrl
		const newUrl = url.toString()
		currentUrl = newUrl.substring(0, 4) === 'http' && isKnown ? '/' + newUrl.split('/').splice(3).join('/') : newUrl
		if (currentUrl !== currentRef) { view() }
	}
	
	if (!trackingDisabled()) {
		history.pushState = hook(history, 'pushState', handlePush)
		history.replaceState = hook(history, 'replaceState', handlePush)
		const update = () => document.readyState === 'complete' && view()
		document.addEventListener('readystatechange', update, true)
		update()
	}
	
	let walletsLength: number
	setTimeout(() => walletsLength = Wallets.value.length)
	const account = (event_name: AccountEvent, options?: {}) => {
		if (!walletsLength && !eventRecords.value.firstAccount) {
			eventRecords.value.firstAccount = true
			options ??= {}
			;(options as any).first = true
		}
		event(event_name, options)
	}
	
	return { event, account }
}

export const track = init()



function extractId (url: string) {
	const urlObject = new URL(url)
	const id = urlObject.hostname.split('.').find(s => {
		const regex = /^([a-z2-7=]{52})+$/
		return regex.test(s)
	})
	if (!id) { throw '' }
	return arweave.utils.bufferTob64Url(base32Decode(id.toUpperCase()))
}