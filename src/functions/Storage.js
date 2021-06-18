function loadWallets () {
	let wallets = []
	if (localStorage.getItem('wallets')) {
		try { wallets = JSON.parse(localStorage.getItem('wallets')) }
		catch (e) { localStorage.removeItem('wallets') }
	}
	return wallets
}

function saveWallets (wallets) {
	localStorage.setItem('wallets', wallets)
}

export { loadWallets, saveWallets }