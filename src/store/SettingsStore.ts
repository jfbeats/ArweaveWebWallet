import { useChannel } from '@/functions/Channels'



type CurrencyOption = { value: { currency: string, provider: string }, text: string }



export const options = {
	password: { invalidateCache: [
		{ value: 60000, text: 'After 1 minute' },
		{ value: 600000, text: 'After 10 minutes' },
		{ value: 3600000, text: 'After 1 hour' },
		{ value: 31536000000, text: 'When closing the app' },
	] },
}
const getAppSettings = () => ({
	password: { invalidateCache: options.password.invalidateCache[2].value },
	currencies: { state: [] as CurrencyOption[], timestamp: undefined },
})
export type AppSettingsInterface = ReturnType<typeof getAppSettings>
export const AppSettings = useChannel('appSettings', undefined, getAppSettings()).state
export const AppSettingsOptions = options

const init = getAppSettings()
Object.entries(init).forEach(([setting, value]) => (AppSettings.value as any)[setting] ??= value)