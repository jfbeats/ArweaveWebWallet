export function debounce (fun, timeout = 500) {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => { fun.apply(this, args) }, timeout)
	}
}

export function humanFileSize (size) {
	if (size == 0) { return '0 B'}
	var i = Math.floor(Math.log(size) / Math.log(1024));
	return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}