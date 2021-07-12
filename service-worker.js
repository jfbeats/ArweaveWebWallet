importScripts("/precache-manifest.aca7d22b7984a35ec5c1fd4a54c634f8.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.setConfig({ debug: true })
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
