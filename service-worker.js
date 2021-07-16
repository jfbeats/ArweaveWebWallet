importScripts("/precache-manifest.825db108db8280da8af5ebd7b43dc1a8.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.setConfig({ debug: true })
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') { self.skipWaiting() }
})
