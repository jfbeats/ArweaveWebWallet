export const Analytics = {}

if (!window.origin.includes('localhost')) {
	const tag = document.createElement('script')
	tag.async = true
	tag.defer = true
	tag.setAttribute('data-website-id', '69deda3b-740e-49f8-aceb-f4bfa3455029')
	tag.src = 'https://analytics.arweave.duckdns.org/umami.js'
	document.head.appendChild(tag)
}