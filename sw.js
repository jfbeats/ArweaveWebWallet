if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return a[e]||(s=new Promise((async s=>{if("document"in self){const a=document.createElement("script");a.src=e,document.head.appendChild(a),a.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!a[e])throw new Error(`Module ${e} didn’t register its module`);return a[e]}))},s=(s,a)=>{Promise.all(s.map(e)).then((e=>a(1===e.length?e[0]:e)))},a={require:Promise.resolve(s)};self.define=(s,c,r)=>{a[s]||(a[s]=Promise.resolve().then((()=>{let a={};const d={uri:location.origin+s.slice(1)};return Promise.all(c.map((s=>{switch(s){case"exports":return a;case"module":return d;default:return e(s)}}))).then((e=>{const s=r(...e);return a.default||(a.default=s),a}))})))}}define("./sw.js",["./workbox-afb9f189"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/AddWallet.50ce7ea0.css",revision:"4b91a5c95e2e0ae55bf2247b570b5f03"},{url:"assets/AddWallet.9125fada.js",revision:"8cdf39d833155bf12f2b0c8a9ccea825"},{url:"assets/Connect.769c4795.js",revision:"e152acd7dee5336565cc37cb673b08e5"},{url:"assets/Connect.b9ca31e7.css",revision:"72bd3511b64e73c11ec9c753383ee135"},{url:"assets/Connector.036ba09b.css",revision:"5a394f0028ab35f106aedb1ddefb7f9c"},{url:"assets/Connector.cdf33324.js",revision:"27c6e9c5ec75d1c1110c221314a56474"},{url:"assets/EditWallet.2da03bd1.js",revision:"5b6a5bfa6157c513dbf91a25d0847ae6"},{url:"assets/EditWallet.4123f1f8.css",revision:"41ed02edc78cf1f9cd591ca0f273f18d"},{url:"assets/index.54ed5028.js",revision:"53e4d717e0351cec52c0af6395c62194"},{url:"assets/index.6ae7049e.css",revision:"d2bda1d57e311d374d83321107fc7fb0"},{url:"assets/Profile.a7ece652.css",revision:"d7dea7bf6d359253309ff1caef56c4ac"},{url:"assets/Profile.da824578.js",revision:"15cd7e475b29f94dae7afd9f3060fb3c"},{url:"assets/Settings.64129c8b.css",revision:"a2a4f06f98221d851adfeabdd6cbba4d"},{url:"assets/Settings.c180cd77.js",revision:"407aafc9d542226ad8394571277f54f7"},{url:"assets/Tx.41ca4708.js",revision:"c7c1d6420285cbf7bffcb03b26d2af83"},{url:"assets/Tx.a998db47.css",revision:"7fd6fdfab68c922978c9a637e962f459"},{url:"assets/vendor.035b7bf8.js",revision:"0e78ecd93fab9e4b95baf989640eda7c"},{url:"assets/WalletOptions.164d2b8f.js",revision:"d2456d41c76048f703645778add14a57"},{url:"assets/WalletOptions.1a3ddf66.css",revision:"62119631b99a895e14eec3ef552ba2c8"},{url:"assets/Welcome.222fe0dd.js",revision:"d112c48ffbbf303594145826c30b8d12"},{url:"assets/Welcome.6ad86669.css",revision:"495c19c25fd89e86ecef4825627f713a"},{url:"index.html",revision:"583afd2d176c23b5c89478441730f9b3"},{url:"arweave.svg",revision:"cbca2b1a1c623b628f07465d17215be3"},{url:"arweave-192.png",revision:"728bff6123ed447a1259944bb31bb24d"},{url:"arweave-512.png",revision:"c8d0678a51c5f220e6664ebf2c2e1222"},{url:"manifest.webmanifest",revision:"dfb5fe846d421c7aa523e92eb15dbea3"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
