importScripts("/precache-manifest.130928a20df3a6c1f8e9c9fdf36e1cc6.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.setConfig({ debug: false })
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') { self.skipWaiting() }
})
