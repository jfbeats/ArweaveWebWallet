export function loadWallets () {
	let wallets = []
	try { wallets = JSON.parse(localStorage.getItem('wallets')) }
	catch (e) { localStorage.removeItem('wallets') }
	try { 
		const order = JSON.parse(localStorage.getItem('walletsOrder')) 
		wallets.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
	} catch (e) { localStorage.removeItem('walletsOrder') }
	return wallets
}

export function saveWallets (wallets) {
	if (!wallets) { return }
	const walletsData = []
	for (const wallet of wallets) {
		walletsData.push((({ id, key, jwk, metaData }) => ({ id, key, jwk, metaData }))(wallet))
	}
	localStorage.setItem('wallets', JSON.stringify(walletsData))
}

export function saveWalletsOrder (wallets) {
	if (!wallets) { return }
	const walletsIds = []
	for (const wallet of wallets) {
		walletsIds.push(wallet.id)
	}
	localStorage.setItem('walletsOrder', JSON.stringify(walletsIds))
}