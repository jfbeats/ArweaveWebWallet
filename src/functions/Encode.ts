import Arweave from 'arweave'
import Secrets from 'secrets.js-jf'



export function hexToBase64 (hexString: string): string {
	return btoa(hexString.match(/\w{2}/g)!.map(function (a) {
		return String.fromCharCode(parseInt(a, 16))
	}).join('')).replace(/=+$/, '')
}

export function base64ToHex (base64String: string): string {
	return atob(base64String).split('').map(function (c) {
		return ('0' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join('')
}

export function encode (text: string) {
	const encoder = new TextEncoder()
	return encoder.encode(text)
}

export function decode (buffer: BufferSource) {
	const decoder = new TextDecoder()
	return decoder.decode(buffer)
}

let RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
let RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV'
let CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function readChar (alphabet: string, char: string) {
	let idx = alphabet.indexOf(char)
	if (idx === -1) { throw new Error('Invalid character found: ' + char) }
	return idx
}

export function base32Decode (input: string, variant = 'RFC4648') {
	let alphabet
	switch (variant) {
		case 'RFC3548':
		case 'RFC4648': alphabet = RFC4648; input = input.replace(/=+$/, ''); break;
		case 'RFC4648-HEX': alphabet = RFC4648_HEX; input = input.replace(/=+$/, ''); break;
		case 'Crockford': alphabet = CROCKFORD; input = input.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1'); break;
		default: throw new Error('Unknown base32 variant: ' + variant);
	}
	let length = input.length; let bits = 0; let value = 0; let index = 0; let output = new Uint8Array((length * 5 / 8) | 0)
	for (let i = 0; i < length; i++) {
		value = (value << 5) | readChar(alphabet, input[i]); bits += 5;
		if (bits >= 8) { output[index++] = (value >>> (bits - 8)) & 255; bits -= 8 }
	}
	return output
}



const encodingMap = {
	buffer: { string: (b: Uint8Array) => new TextDecoder().decode(b),
		b64url: (b: Uint8Array) => Arweave.utils.bufferTob64Url(b),
		b64: (b: Uint8Array) => Arweave.utils.bufferTob64(b), },
	string: { buffer: (s: string) => new TextEncoder().encode(s),
		b64url: (s: string) => Arweave.utils.b64UrlToString(s),
		hex: (s: string) => Secrets.str2hex(s, 1) },
	b64url: { buffer: (s: string) => Arweave.utils.b64UrlToBuffer(s),
		string: (s: string) => Arweave.utils.b64UrlToString(s) },
	b64: { hex: (s: string) => base64ToHex(s) },
	b32: { buffer: (s: string) => base32Decode(s) },
	hex: { string: (s: string) => Secrets.hex2str(s, 1),
		b64: (s: string) => hexToBase64(s) },
} satisfies { [i: string]: { [o: string]: Function } }
type EncodingMap = typeof encodingMap
type Encoding = keyof EncodingMap
type EncodingType <T extends Encoding> = Parameters<EncodingMap[T][keyof EncodingMap[T]]>[0]

function shortestPath(start: Encoding, end: Encoding): Encoding[] | undefined {
    const queue: Encoding[][] = [[start]]; const visited = new Set<Encoding>()
    while (queue.length > 0) {
        const path = queue.shift()!; const node = path[path.length - 1]; if (node === end) { return path }; if (visited.has(node)) { continue }; visited.add(node)
		for (const neighbor in encodingMap[node]) { queue.push([...path, neighbor as Encoding]) }
    }
}

export function recode <I extends Encoding, O extends Encoding> (source: EncodingType<I>, sourceEncoding: I, encoding: O): EncodingType<O> {
	const path = shortestPath(sourceEncoding, encoding)
	if (!path) { throw new Error('encoding conversion failed') }
	if (source == undefined) { return }
	let current = source
	for (let i = 0; i < path?.length - 1; i++) {
		const [source, destination] = [path[i], path[i+1]] // @ts-ignore
		current = encodingMap[source][destination](current)
	}
	return current
}