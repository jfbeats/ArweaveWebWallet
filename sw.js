if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const d=e||("document"in self?document.currentScript.src:"")||location.href;if(s[d])return;let r={};const n=e=>a(e,d),t={module:{uri:d},exports:r,require:n};s[d]=Promise.all(c.map((e=>t[e]||n(e)))).then((e=>(i(...e),r)))}}define(["./workbox-21445d85"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/AddWallet.791e90da.css",revision:"3ace531a62e574ecb14c55edef6345aa"},{url:"assets/AddWallet.95b0748e.js",revision:"6340e3fe2332dc247cc34276c7086098"},{url:"assets/Connect.94d7485e.js",revision:"5bb269246afe664875ecaf117b49208b"},{url:"assets/Connect.ea795ab9.css",revision:"3be6f02b9ce2e3585f7c66d55c540983"},{url:"assets/Connector.036ba09b.css",revision:"5a394f0028ab35f106aedb1ddefb7f9c"},{url:"assets/Connector.74da61dd.js",revision:"8d0d40ee39551b64d8643db4476d7fcd"},{url:"assets/EditWallet.246706cc.css",revision:"76ec6e426ea440ec6c54a1299594928b"},{url:"assets/EditWallet.b6c311a4.js",revision:"9ce8e81bafba2175bedce3bb7fe15d58"},{url:"assets/index.137cf8f5.js",revision:"530f6c33c446cdf570ba8a91b27fa0f2"},{url:"assets/index.6d376b35.css",revision:"dd8818212c1ecb8f93c76869cb0303dd"},{url:"assets/Profile.25b0bf5c.css",revision:"a53982ab33c03441468f800646471006"},{url:"assets/Profile.84b63b12.js",revision:"44d7ae1565720ece285c16509a68019b"},{url:"assets/Settings.4c152643.js",revision:"fe841cb1f67d134038a6af2eb5604532"},{url:"assets/Settings.f236df29.css",revision:"b79af4e0f620c08fb59c009693c5103a"},{url:"assets/Tx.b589d40b.css",revision:"f63afdd415dd69030c79e6c5d8b316a2"},{url:"assets/Tx.cdeaeaa9.js",revision:"a93531d0647a977954e8f51658d7ec89"},{url:"assets/vendor.a231a000.js",revision:"4a26749ac8e2c30543124ca771a3981d"},{url:"assets/WalletOptions.682b1252.css",revision:"0da43bdc858b3a405e601f0432ec45a2"},{url:"assets/WalletOptions.c74354fd.js",revision:"6d0d9ef5b61574aeec12b16c451242ef"},{url:"assets/Welcome.b0da1a4e.css",revision:"5c444f092429ccd47b56c40d41c863cd"},{url:"assets/Welcome.ce17b806.js",revision:"07a8d0bafdee030cfbe29a585a4c33a3"},{url:"index.html",revision:"edc9e69d719f5d0a5c72af5c02f48b0a"},{url:"arweave.svg",revision:"cbca2b1a1c623b628f07465d17215be3"},{url:"arweave-192.png",revision:"728bff6123ed447a1259944bb31bb24d"},{url:"arweave-512.png",revision:"c8d0678a51c5f220e6664ebf2c2e1222"},{url:"manifest.webmanifest",revision:"dfb5fe846d421c7aa523e92eb15dbea3"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
