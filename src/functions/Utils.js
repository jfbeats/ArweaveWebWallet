export function debounce (fun, timeout = 500) {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => { fun.apply(this, args) }, timeout)
	}
}

export function humanFileSize (size) {
	if (size == 0) { return '0 B' }
	var i = Math.floor(Math.log(size) / Math.log(1024));
	return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

export function base64UrlToHex (str) {
	let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
	const pad = base64.length % 4
	if (pad) { base64 += new Array(5 - pad).join('=') }
	const raw = atob(base64)
	let result = ''
	for (let i = 0; i < raw.length; i++) {
		const hex = raw.charCodeAt(i).toString(16)
		result += (hex.length === 2 ? hex : '0' + hex)
	}
	return result
}

export function addressHashToColor (addressHash) {
	const colors = hsl2rgb(parseInt(addressHash.substr(-7), 16) / 0xfffffff, 0.25, 0.6)
	return colors.map(Math.round)
}

function hsl2rgb (h, s, b) {
	h *= 6
	s = [b += s *= b < .5 ? b : 1 - b, b - h % 1 * s * 2, b -= s *= 2, b, b + h % 1 * s, b + s]
	return [s[~~h % 6] * 255, s[(h | 16) % 6] * 255, s[(h | 8) % 6] * 255]
}

export function download (filename, text) {
	var element = document.createElement('a')
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
	element.setAttribute('download', filename)
	element.style.display = 'none'
	document.body.appendChild(element)
	element.click()
	document.body.removeChild(element)
}

export function unpackTags (tags) {
	const result = {}
	for (const { name, value } of tags) {
		if (typeof result[name] === 'string') { result[name] = [result[name]] }
		if (Array.isArray(result[name])) { result[name].push(value) }
		else { result[name] = value }
	}
	return result
}