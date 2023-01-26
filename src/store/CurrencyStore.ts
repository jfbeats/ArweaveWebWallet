import { useChannel } from '@/functions/Channels'
import { getAsyncData } from '@/functions/AsyncData'
import axios from 'axios'
import { computed, reactive, Ref, toRef, watch } from 'vue'
import { AppSettings } from '@/store/SettingsStore'


export const currency = getConversion()

function getConversion () {
	const settings = useChannel('currency', undefined, { currency: 'USD', provider: 'redstone' }).state.value
	const currentPrice = getAsyncData({
		name: 'conversion rate',
		existingState: toRef(settings, 'rate'),
		timestamp: toRef(settings, 'timestamp'),
		query: async () => {
			const currency = settings.currency
			const provider = settings.provider
			if (provider === 'redstone') {
				if (currency === 'USD') {
					const result = await axios.get('https://api.redstone.finance/prices/?symbols=AR&provider=redstone')
					return result.data['AR'].value
				} else {
					const result = await axios.get('https://api.redstone.finance/prices/?symbols=AR,' + currency + '&provider=redstone')
					return result.data['AR'].value / result.data[currency!].value
				}
			}
		},
		seconds: 600,
	}).state
	watch(() => [settings.currency, settings.provider], () => settings.rate = undefined)
	const symbol = computed(() => new Intl.NumberFormat([...navigator.languages], { style: 'currency', currency: settings.currency }).format(0).replace(/[\w\d\.\,\s]/g, '') || '$')
	return { currentPrice, settings, symbol }
}

export const { state: redstoneOptions } = getAsyncData({
	name: 'currency options list',
	existingState: toRef(AppSettings.value.currencies, 'state'),
	timestamp: toRef(AppSettings.value.currencies, 'timestamp'),
	query: async () => {
		type currencyOptions = { value: { currency: string, provider: string }, text: string }[]
		const options = [] as currencyOptions
		const res = (await axios.get('https://api.redstone.finance/configs/tokens')).data
		const message = ' Redstone Finance'
		options.push({ value: { currency: 'USD', provider: 'redstone' }, text: 'USD' + message })
		for (const key in res) {
			try { new Intl.NumberFormat([...navigator.languages], { style: 'currency', currency: key }) } catch (e) { continue }
			if (res[key].tags?.includes('currencies')) { options.push({ value: { currency: key, provider: 'redstone' }, text: key + message }) }
		}
		return options
	},
	seconds: 86400,
})

