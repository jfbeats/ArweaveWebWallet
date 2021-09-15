async function deriveKey (password, salt) {
	const encoder = new TextEncoder()
	const keyMaterial = await window.crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		'PBKDF2',
		false,
		['deriveKey']
	)
	const derivedKey = await window.crypto.subtle.deriveKey(
		{ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256', },
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt']
	)
	return derivedKey
}

export async function passwordEncrypt (password, content) {
	const encoder = new TextEncoder()
	const salt = window.crypto.getRandomValues(new Uint8Array(16))
	const derivedKey = await deriveKey(password, salt)
	const iv = window.crypto.getRandomValues(new Uint8Array(12))
	const ciphertext = await window.crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv },
		derivedKey,
		encoder.encode(content)
	)
	return { ciphertext, salt, iv }
}

export async function passwordDecrypt (password, { ciphertext, salt, iv }) {
	const decoder = new TextDecoder()
	const derivedKey = await deriveKey(password, salt)
	return decoder.decode(
		await window.crypto.subtle.decrypt(
			{ name: 'AES-GCM', iv },
			derivedKey,
			ciphertext
		)
	)
}