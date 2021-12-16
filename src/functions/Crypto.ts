type EncryptedContent = {
	ciphertext: Uint8Array
	salt: Uint8Array
	iv: Uint8Array
}

async function deriveKey (password: string, salt: Uint8Array) {
	const keyMaterial = await window.crypto.subtle.importKey(
		'raw',
		encode(password),
		'PBKDF2',
		false,
		['deriveKey']
	)
	const derivedKey = await window.crypto.subtle.deriveKey(
		{ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt']
	)
	return derivedKey
}

export async function passwordEncrypt (password: string, content: string): Promise<EncryptedContent> {
	const salt = window.crypto.getRandomValues(new Uint8Array(16))
	const derivedKey = await deriveKey(password, salt)
	const iv = window.crypto.getRandomValues(new Uint8Array(12))
	const ciphertext = await window.crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv },
		derivedKey,
		encode(content)
	)
	return { ciphertext, salt, iv }
}

export async function passwordDecrypt (password: string, encrypted: EncryptedContent): Promise<string> {
	const { ciphertext, salt, iv } = encrypted
	const derivedKey = await deriveKey(password, salt)
	const encoded = await window.crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv },
		derivedKey,
		ciphertext
	)
	return decode(encoded)
}

export async function pkcs8ToJwk (key: Uint8Array) {
	const imported = await window.crypto.subtle.importKey(
		'pkcs8',
		key,
		{ name: 'RSA-PSS', hash: 'SHA-256' },
		true,
		['sign']
	)
	const jwk = await window.crypto.subtle.exportKey('jwk', imported)
	delete jwk.key_ops
	delete jwk.alg
	return jwk
}

export async function getSigningKey (key: JsonWebKey) {
	const jwk = { ...key }
	delete jwk.key_ops
	delete jwk.alg
	return window.crypto.subtle.importKey(
		'jwk',
		jwk,
		{ name: 'RSA-PSS', hash: 'SHA-256', },
		false,
		['sign']
	)
}

export async function getDecryptionKey (key: JsonWebKey) {
	const jwk = { ...key }
	delete jwk.key_ops
	delete jwk.alg
	return window.crypto.subtle.importKey(
		'jwk',
		jwk,
		{ name: 'RSA-OAEP', hash: 'SHA-256', },
		false,
		['decrypt']
	)
}



export function encode (text: string) {
	const encoder = new TextEncoder()
	return encoder.encode(text)
}

export function decode (buffer: BufferSource) {
	const decoder = new TextDecoder()
	return decoder.decode(buffer)
}