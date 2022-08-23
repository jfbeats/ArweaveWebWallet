let RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
let RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV'
let CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function readChar (alphabet: string, char: string) {
	let idx = alphabet.indexOf(char)
	
	if (idx === -1) {
		throw new Error('Invalid character found: ' + char)
	}
	
	return idx
}

export function base32Decode (input: string, variant = 'RFC4648') {
	let alphabet
	
	switch (variant) {
	case 'RFC3548':
	case 'RFC4648':
		alphabet = RFC4648
		input = input.replace(/=+$/, '')
		break
	case 'RFC4648-HEX':
		alphabet = RFC4648_HEX
		input = input.replace(/=+$/, '')
		break
	case 'Crockford':
		alphabet = CROCKFORD
		input = input.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')
		break
	default:
		throw new Error('Unknown base32 variant: ' + variant)
	}
	
	let length = input.length
	
	let bits = 0
	let value = 0
	
	let index = 0
	let output = new Uint8Array((length * 5 / 8) | 0)
	
	for (let i = 0; i < length; i++) {
		value = (value << 5) | readChar(alphabet, input[i])
		bits += 5
		
		if (bits >= 8) {
			output[index++] = (value >>> (bits - 8)) & 255
			bits -= 8
		}
	}
	
	return output
}