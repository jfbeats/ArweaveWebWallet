importScripts("/precache-manifest.67ba6c9595863a1bded2adf1e0245ed6.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.setConfig({ debug: false })
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') { self.skipWaiting() }
})
