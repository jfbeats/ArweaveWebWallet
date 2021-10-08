importScripts("precache-manifest.f5df9f7f5e041d0d1b8fed0d7fd7d756.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.setConfig({ debug: false })
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') { self.skipWaiting() }
})
