if(!self.define){let s,e={};const l=(l,n)=>(l=new URL(l+".js",n).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(n,i)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let t={};const o=s=>l(s,r),u={module:{uri:r},exports:t,require:o};e[r]=Promise.all(n.map((s=>u[s]||o(s)))).then((s=>(i(...s),t)))}}define(["./workbox-3e4da89b"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"assets/AddWallet.5259ba88.js",revision:null},{url:"assets/AddWallet.c2a5d005.css",revision:null},{url:"assets/Connect.4ca43dda.css",revision:null},{url:"assets/Connect.831c0e57.js",revision:null},{url:"assets/Connector.036ba09b.css",revision:null},{url:"assets/Connector.ac21988e.js",revision:null},{url:"assets/EditWallet.246706cc.css",revision:null},{url:"assets/EditWallet.5c80e107.js",revision:null},{url:"assets/Explore.aff90be7.css",revision:null},{url:"assets/Explore.f160b7bf.js",revision:null},{url:"assets/index.2d9f4202.js",revision:null},{url:"assets/index.73403c1d.css",revision:null},{url:"assets/Profile.25b0bf5c.css",revision:null},{url:"assets/Profile.e6352aad.js",revision:null},{url:"assets/Settings.1975f8e9.js",revision:null},{url:"assets/Settings.9581707e.css",revision:null},{url:"assets/Tx.67c3afe0.js",revision:null},{url:"assets/Tx.947d99a2.css",revision:null},{url:"assets/vendor.e870763b.js",revision:null},{url:"assets/WalletOptions.682b1252.css",revision:null},{url:"assets/WalletOptions.fe804a91.js",revision:null},{url:"assets/Welcome.768f3dee.js",revision:null},{url:"assets/Welcome.b0da1a4e.css",revision:null},{url:"index.html",revision:"c37630cf5ffc552d52f26f0d529a58b9"},{url:"arweave.svg",revision:"cbca2b1a1c623b628f07465d17215be3"},{url:"arweave-192.png",revision:"728bff6123ed447a1259944bb31bb24d"},{url:"arweave-512.png",revision:"c8d0678a51c5f220e6664ebf2c2e1222"},{url:"manifest.webmanifest",revision:"dfb5fe846d421c7aa523e92eb15dbea3"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
//# sourceMappingURL=sw.js.map
