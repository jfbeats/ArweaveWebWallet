type EncryptedContent = {
	ciphertext: string
	iv: string
	derivationSettings: DerivationSettings
}

type DerivationSettings = {
	salt: string
	importAlgorithm: Parameters<typeof window.crypto.subtle.importKey>[2]
	derivationAlgorithm: Pbkdf2Params
	derivedKeyAlgorithm: AesKeyGenParams
}