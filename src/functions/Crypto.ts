export function isEncrypted (val: any): val is EncryptedContent { return Array.isArray(val.ciphertext) && typeof val.derivationSettings === 'object' }

function getDerivationSettings (): DerivationSettings {
	const iv = window.crypto.getRandomValues(new Uint8Array(12))
	const salt = window.crypto.getRandomValues(new Uint8Array(16))
	return {
		iv: Array.from(iv),
		salt: Array.from(salt),
		importAlgorithm: 'PBKDF2',
		derivationAlgorithm: { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
		derivedKeyAlgorithm: { name: 'AES-GCM', length: 256 },
	}
}

async function deriveKey (password: string, derivationSettings: DerivationSettings) {
	derivationSettings.derivationAlgorithm.salt = new Uint8Array(derivationSettings.salt)
	const keyMaterial = await window.crypto.subtle.importKey('raw', encode(password), derivationSettings.importAlgorithm, false, ['deriveKey'])
	return window.crypto.subtle.deriveKey(derivationSettings.derivationAlgorithm, keyMaterial, derivationSettings.derivedKeyAlgorithm, false, ['encrypt', 'decrypt'])
}

export async function passwordEncrypt (password: string, content: any): Promise<EncryptedContent> {
	if (isEncrypted(content)) { throw 'content is already encrypted' }
	const derivationSettings = getDerivationSettings()
	const derivedKey = await deriveKey(password, derivationSettings)
	const ciphertext = await window.crypto.subtle.encrypt({ name: derivationSettings.derivedKeyAlgorithm.name, iv: new Uint8Array(derivationSettings.iv) }, derivedKey, encode(JSON.stringify(content))) as Uint8Array
	return { ciphertext: Array.from(new Uint8Array(ciphertext)), derivationSettings }
}

export async function passwordDecrypt (password: string, encrypted: EncryptedContent): Promise<any> {
	if (!isEncrypted(encrypted)) { throw 'content is already decrypted' }
	const { ciphertext, derivationSettings } = encrypted
	const derivedKey = await deriveKey(password, derivationSettings)
	const encoded = await window.crypto.subtle.decrypt({ name: derivationSettings.derivedKeyAlgorithm.name, iv: new Uint8Array(derivationSettings.iv) }, derivedKey, new Uint8Array(ciphertext))
	return JSON.parse(decode(encoded))
}



export async function pkcs8ToJwk (key: Uint8Array) {
	const imported = await window.crypto.subtle.importKey('pkcs8', key, { name: 'RSA-PSS', hash: 'SHA-256' }, true, ['sign'])
	const jwk = await window.crypto.subtle.exportKey('jwk', imported)
	delete jwk.key_ops
	delete jwk.alg
	return jwk
}

export async function getSigningKey (key: JsonWebKey) {
	const jwk = { ...key }
	delete jwk.key_ops
	delete jwk.alg
	return window.crypto.subtle.importKey('jwk', jwk, { name: 'RSA-PSS', hash: 'SHA-256' }, false, ['sign'])
}

export async function getDecryptionKey (key: JsonWebKey) {
	const jwk = { ...key }
	delete jwk.key_ops
	delete jwk.alg
	return window.crypto.subtle.importKey('jwk', jwk, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt'])
}



export function encode (text: string) {
	const encoder = new TextEncoder()
	return encoder.encode(text)
}

export function decode (buffer: BufferSource) {
	const decoder = new TextDecoder()
	return decoder.decode(buffer)
}