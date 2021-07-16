importScripts("/precache-manifest.95e1894321a1f9d5725fe4e2f5f452e5.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.setConfig({ debug: true })
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') { 
		console.log('waiting skipped')
		self.skipWaiting() 
	}
})
