import { SHA256 } from 'jshashes'

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

export function addressToColor (address) {
	const hash = new SHA256
	const addressHash = hash.hex(address)
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