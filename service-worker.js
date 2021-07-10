importScripts("/precache-manifest.5a85488a726a5ca7361987b008684151.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.setConfig({ debug: true })
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
