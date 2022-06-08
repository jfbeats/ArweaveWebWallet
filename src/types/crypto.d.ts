type EncryptedContent = {
	ciphertext: string
	derivationSettings: DerivationSettings
}

type DerivationSettings = {
	iv: string
	salt: string
	importAlgorithm: Parameters<typeof window.crypto.subtle.importKey>[2]
	derivationAlgorithm: Pbkdf2Params
	derivedKeyAlgorithm: AesKeyGenParams
}