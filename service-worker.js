importScripts("/precache-manifest.d981f91c0f8d65ed7a51b0e9dd316b12.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.setConfig({ debug: true })
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') { 
		console.log('waiting skipped')
		self.skipWaiting() 
	}
})
