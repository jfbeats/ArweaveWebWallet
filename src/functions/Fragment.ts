import Secrets from 'secrets.js-jf'
import { getWordList } from '@/functions/Wallets'
import { notify } from '@/store/NotificationStore'
import { compact, isUuidV4 } from '@/functions/Utils'
import { base64ToHex, fromHex, hexToBase64, toHex } from '@/functions/Encode'



async function getMnemonicPadding (words = 12) {
	const lists = Object.values(await getWordList()).map(list => list.map(item => item.length))
	const maxWordLength = Math.max(...lists.flat())
	const spaces = words - 1
	return words * maxWordLength + spaces
}



type Fragment = ReturnType<typeof getFragment>
function getFragment (fragment: string, threshold?: string, uuid?: string) {
	type Parsed = readonly [header: string, data1bytesPerChar: string, thresholdNumber: string, setUuid?: string] & { push: (uuid: string) => void }
	const parseOriginal = (fragment: string): Parsed => {
		const splitPos = fragment.length - Secrets.extractShareComponents(fragment).data.length
		const data = hexToBase64(fragment.substring(splitPos))
		const parsed = [fragment.substring(0, splitPos), data, threshold!] as Parsed
		if (uuid) { parsed.push(uuid) }
		return parsed
	}
	const parseNew = (fragment: string | Parsed): Parsed => typeof fragment === 'string' ? JSON.parse(fragment) as Parsed : fragment
	const parsedToOriginal = (parsed: Parsed): string => parsed[0] + base64ToHex(parsed[1])
	const verify = (parsed: any): parsed is Parsed => {
		if (!Array.isArray(parsed) || parsed.length < 3 || parsed.length > 4) { return false }
		if (parsed[3] && !isUuidV4(parsed[3])) { return false }
		return parsed.every(el => typeof el as unknown === 'string')
	}
	const parsed = fragment[0] === '[' ? parseNew(fragment) : parseOriginal(fragment)
	if (!verify(parsed)) { throw 'invalid format' }
	const value = JSON.stringify(parsed)
	const original = parsedToOriginal(parsed)
	const { id } = Secrets.extractShareComponents(original)
	return { value, parsed, original, id,
		threshold: +parsed[2].split('/')[0],
		total: +parsed[2].split('/')[1],
		uuid: parsed[3],
	}
}



export async function findAndMergeFragments (files: any[]) {
	const fragments = [] as string[]
	for (const file of files) { try {
		fragments.push(getFragment(file).value)
	} catch (e) {} }
	try {
		return merge(fragments)
	} catch (e) { return }
}

export async function fragment (value: string, threshold: number, numShares: number, padLength: number): Promise<string[]> {
	const secret = toHex(value)
	return Secrets.share(secret, numShares, threshold, padLength)
		.map(fragment => getFragment(fragment, `${threshold}/${numShares}`).value)
}

export async function fragmentPassphrase (value: string, threshold: number, numShares: number) {
	const padLength = await getMnemonicPadding(value.split(' ').length)
	return fragment(value, threshold, numShares, padLength)
}

// todo deduplicate shards, detect multiple fragmented assets
async function merge (value: string[]): Promise<string> {
	const fragments = value.map(fragment => getFragment(fragment))
	const verifyThreshold = (fragments: Fragment[]) => !fragments.some(fragment => fragment.threshold > fragments.length)
	const step = (fragments: Fragment[], previousFragments?: Fragment[]): string => {
		const sets = {} as { [key: string]: Fragment[] }
		fragments.forEach(fragment => (sets[fragment.uuid ?? 0] ??= []).push(fragment))
		const results = compact(Object.values(sets).map(fragments => {
			if (!verifyThreshold(fragments)) { notify.warn('Fragments threshold not met'); return }
			return fromHex(Secrets.combine(fragments.map(s => s.original)))
		}))
		if (results.length > 1) { return step(results.map(result => getFragment(result)), fragments) }
		return results[0]
	}
	return step(fragments)
}

fragmentPassphrase('hello world hello world hello world hello world hello world hello world', 2, 3).then(res => {
	console.log(res)
	findAndMergeFragments(res).then(res => console.log(res))
})