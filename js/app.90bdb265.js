(function(e){function t(t){for(var a,c,i=t[0],l=t[1],s=t[2],u=0,d=[];u<i.length;u++)c=i[u],Object.prototype.hasOwnProperty.call(r,c)&&r[c]&&d.push(r[c][0]),r[c]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a]);p&&p(t);while(d.length)d.shift()();return o.push.apply(o,s||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],a=!0,c=1;c<n.length;c++){var i=n[c];0!==r[i]&&(a=!1)}a&&(o.splice(t--,1),e=l(l.s=n[0]))}return e}var a={},c={app:0},r={app:0},o=[];function i(e){return l.p+"js/"+({}[e]||e)+"."+{"chunk-2d2311c8":"eafb2723","chunk-4c6f028e":"b51b4539","chunk-d82ba440":"ea9e01b1"}[e]+".js"}function l(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,l),n.l=!0,n.exports}l.e=function(e){var t=[],n={"chunk-4c6f028e":1,"chunk-d82ba440":1};c[e]?t.push(c[e]):0!==c[e]&&n[e]&&t.push(c[e]=new Promise((function(t,n){for(var a="css/"+({}[e]||e)+"."+{"chunk-2d2311c8":"31d6cfe0","chunk-4c6f028e":"9ed2d77d","chunk-d82ba440":"ed770908"}[e]+".css",r=l.p+a,o=document.getElementsByTagName("link"),i=0;i<o.length;i++){var s=o[i],u=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(u===a||u===r))return t()}var d=document.getElementsByTagName("style");for(i=0;i<d.length;i++){s=d[i],u=s.getAttribute("data-href");if(u===a||u===r)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var a=t&&t.target&&t.target.src||r,o=new Error("Loading CSS chunk "+e+" failed.\n("+a+")");o.code="CSS_CHUNK_LOAD_FAILED",o.request=a,delete c[e],p.parentNode.removeChild(p),n(o)},p.href=r;var b=document.getElementsByTagName("head")[0];b.appendChild(p)})).then((function(){c[e]=0})));var a=r[e];if(0!==a)if(a)t.push(a[2]);else{var o=new Promise((function(t,n){a=r[e]=[t,n]}));t.push(a[2]=o);var s,u=document.createElement("script");u.charset="utf-8",u.timeout=120,l.nc&&u.setAttribute("nonce",l.nc),u.src=i(e);var d=new Error;s=function(t){u.onerror=u.onload=null,clearTimeout(p);var n=r[e];if(0!==n){if(n){var a=t&&("load"===t.type?"missing":t.type),c=t&&t.target&&t.target.src;d.message="Loading chunk "+e+" failed.\n("+a+": "+c+")",d.name="ChunkLoadError",d.type=a,d.request=c,n[1](d)}r[e]=void 0}};var p=setTimeout((function(){s({type:"timeout",target:u})}),12e4);u.onerror=u.onload=s,document.head.appendChild(u)}return Promise.all(t)},l.m=e,l.c=a,l.d=function(e,t,n){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(l.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)l.d(n,a,function(t){return e[t]}.bind(null,a));return n},l.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="/ArweaveWebWallet/",l.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],u=s.push.bind(s);s.push=t,s=s.slice();for(var d=0;d<s.length;d++)t(s[d]);var p=u;o.push([3,"chunk-vendors"]),n()})({0:function(e,t){},"06ad":function(e,t,n){},"0969":function(e,t,n){"use strict";n("5163")},1:function(e,t){},10:function(e,t){},1689:function(e,t,n){},2:function(e,t){},"27b3":function(e,t,n){"use strict";n("90a5")},"2b35":function(e,t,n){e.exports=n.p+"img/cloud.652ec408.svg"},"2efa":function(e,t,n){},3:function(e,t,n){e.exports=n("56d7")},"319a":function(e,t,n){"use strict";var a=n("2909"),c=n("1da1"),r=(n("d81d"),n("7db0"),n("ac1f"),n("841c"),n("96cf"),n("95dc")),o=n.n(r),i=n("a6c5"),l=n.n(i),s=n("bc3a"),u=n.n(s),d=n("7a23"),p=o.a.init({host:"arweave.net",port:443,protocol:"https"}),b=new l.a(p),f=Object(d["reactive"])({arweave:p,currentWallet:null,wallets:[{id:0,key:"TId0Wix2KFl1gArtAT6Do1CbWU_0wneGvS5X9BfW5PE",balance:null,queries:{},queriesStatus:{}},{id:1,key:"Bf3pWqxD1qwwF2fcE9bPNyQp_5TSlAYPJ3JNMgJSj4c",balance:null,queries:{},queriesStatus:{}},{id:2,key:"vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw",balance:null,queries:{},queriesStatus:{}}],currency:{limestone:null},pushWallet:function(e){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(Object.assign(e,{queries:{},queriesStatus:{}}),e.key||!e.jwk){n.next=5;break}return n.next=4,p.wallets.jwkToAddress(e.jwk);case 4:e.key=n.sent;case 5:if(!t.getWalletByKey(e.key)){n.next=7;break}return n.abrupt("return",t.getWalletByKey(e.key));case 7:return e.id||(e.id=t.getNewId()),t.wallets.push(e),n.abrupt("return",e);case 10:case"end":return n.stop()}}),n)})))()},getNewId:function(){for(var e=0;e<=this.wallets.length;e++)if(-1===this.wallets.map((function(e){return e.id})).indexOf(e))return e},getWalletById:function(e){return this.wallets.find((function(t){return t.id==e}))},getWalletByKey:function(e){return this.wallets.find((function(t){return t.key==e}))},setCurrentWallet:function(e){this.currentWallet=e,this.updateWalletBalance(e),console.log("Current wallet set to ",e)},updateWalletBalance:function(e){return Object(c["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,p.wallets.getBalance(e.key);case 2:return n=t.sent,e.balance=p.ar.winstonToAr(n),console.log("Wallet balance ",e.balance),t.abrupt("return",e.balance);case 6:case"end":return t.stop()}}),t)})))()},fetchTransactions:function(e,t){return Object(c["a"])(regeneratorRuntime.mark((function n(){var c,r,o,i,l,s;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(e&&(null===(c=e.queriesStatus[t])||void 0===c||!c.completed)){n.next=2;break}return n.abrupt("return");case 2:if(o={received:function(){return b.search().to(e.key)},sent:function(){return b.search().from(e.key)}},!(e.queries[t]&&e.queries[t].length>0)){n.next=11;break}return l=e.queries[t].length-1,s=e.queries[t][l].cursor,n.next=8,o[t]().cursor(s).find();case 8:i=n.sent,n.next=15;break;case 11:return e.queries[t]=[],n.next=14,o[t]().find();case 14:i=n.sent;case 15:return i.length<10&&(e.queriesStatus[t]||(e.queriesStatus[t]={}),e.queriesStatus[t].completed=!0),(r=e.queries[t]).push.apply(r,Object(a["a"])(i)),n.abrupt("return",e.queries[t]);case 18:case"end":return n.stop()}}),n)})))()},updateConversionRate:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,u.a.get("https://api.limestone.finance/prices?symbol=AR&provider=limestone");case 2:return n=t.sent,e.currency.limestone=n.data[0].value,console.log("Conversion Rate",e.currency.limestone),t.abrupt("return",e.currency.limestone);case 6:case"end":return t.stop()}}),t)})))()}});f.wallets.length>0&&(f.currentWallet=f.wallets[0]),f.updateConversionRate(),setInterval((function(){f.updateConversionRate()}),6e5),t["a"]=f},"32e0":function(e,t,n){"use strict";n("35b4")},"35b4":function(e,t,n){},"3d27":function(e,t,n){e.exports=n.p+"img/cloud_circle.544d3c92.svg"},"3f0a":function(e,t,n){"use strict";var a=n("7a23"),c=Object(a["withScopeId"])("data-v-fd9740ec");Object(a["pushScopeId"])("data-v-fd9740ec");var r={class:"address-container ellipsis"},o={class:"address-tx ellipsis"};Object(a["popScopeId"])();var i=c((function(e,t,n,c,i,l){return Object(a["openBlock"])(),Object(a["createBlock"])("div",r,[Object(a["createVNode"])("span",o,[Object(a["createVNode"])("strong",null,[Object(a["renderSlot"])(e.$slots,"default",{},void 0,!0)]),Object(a["createTextVNode"])(" "+Object(a["toDisplayString"])(n.address),1)])])})),l={props:["address"]};n("94c1");l.render=i,l.__scopeId="data-v-fd9740ec";t["a"]=l},4:function(e,t){},4498:function(e,t,n){},"449b":function(e,t,n){},"4cff":function(e,t,n){"use strict";n("06ad")},5:function(e,t){},5163:function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("7a23"),c=(n("a15b"),n("fb6a"),n("ac1f"),n("1276"),Object(a["withScopeId"])("data-v-49e4ef14")),r=c((function(e,t,n,r,o,i){var l=Object(a["resolveComponent"])("Toolbar"),s=Object(a["resolveComponent"])("router-view");return Object(a["openBlock"])(),Object(a["createBlock"])(a["Fragment"],null,[Object(a["createVNode"])(l,{class:["toolbar",{verticalLayout:r.verticalLayout}],onDrop:Object(a["withModifiers"])(i.droppedFiles,["prevent"]),onDragover:t[1]||(t[1]=Object(a["withModifiers"])((function(){}),["prevent"]))},null,8,["class","onDrop"]),Object(a["createVNode"])(s,{class:"router",onDrop:Object(a["withModifiers"])(i.droppedFiles,["prevent"]),onDragover:t[2]||(t[2]=Object(a["withModifiers"])((function(){}),["prevent"]))},{default:c((function(t){var n=t.Component,r=t.route;return[Object(a["createVNode"])(a["Transition"],{name:r.meta.mainTransitionName,mode:"out-in"},{default:c((function(){return[(Object(a["openBlock"])(),Object(a["createBlock"])(Object(a["resolveDynamicComponent"])(n),{key:e.$route.path.split("/").slice(0,3).join("")}))]})),_:2},1032,["name"])]})),_:1},8,["onDrop"])],64)})),o=n("b85c"),i=n("1da1"),l=(n("96cf"),n("c740"),n("d81d"),n("4de4"),n("d3b7"),n("3ca3"),n("ddb0"),n("5530")),s=n("69de"),u=n.n(s),d=n("9174"),p=n.n(d),b=Object(a["withScopeId"])("data-v-6ce058f7");Object(a["pushScopeId"])("data-v-6ce058f7");var f={id:"nav"},v={class:"controls"},j=Object(a["createVNode"])("img",{class:"small",src:u.a},null,-1),O=Object(a["createVNode"])("img",{class:"small",src:p.a},null,-1);Object(a["popScopeId"])();var m=b((function(e,t,n,c,r,o){var i=Object(a["resolveComponent"])("AddressIcon"),s=Object(a["resolveComponent"])("router-link"),u=Object(a["resolveComponent"])("SlickItem"),d=Object(a["resolveComponent"])("SlickList");return Object(a["openBlock"])(),Object(a["createBlock"])("nav",f,[Object(a["createVNode"])(d,{class:"wallets",axis:c.axis,lockAxis:c.axis,list:c.ArweaveStore.wallets,"onUpdate:list":t[1]||(t[1]=function(e){return c.ArweaveStore.wallets=e}),pressDelay:200,helperClass:"dragging"},{default:b((function(){return[(Object(a["openBlock"])(!0),Object(a["createBlock"])(a["Fragment"],null,Object(a["renderList"])(c.ArweaveStore.wallets,(function(t,n){return Object(a["openBlock"])(),Object(a["createBlock"])(u,{index:n,key:t.key,draggable:"false",class:"drag-container"},{default:b((function(){return[Object(a["createVNode"])(s,{class:["icon wallet",{active:t.id==e.$route.params.walletId,verticalLayout:c.verticalLayout}],to:{name:o.navTo,params:{walletId:t.id},query:Object(l["a"])({},e.$route.query)},draggable:"false"},{default:b((function(){return[Object(a["createVNode"])(i,{class:"profile",address:t.key,draggable:"false"},null,8,["address"])]})),_:2},1032,["to","class"])]})),_:2},1032,["index"])})),128))]})),_:1},8,["axis","lockAxis","list"]),Object(a["createVNode"])("div",v,[Object(a["createVNode"])("div",{class:"icon control",onClick:t[2]||(t[2]=function(e){return o.createWallet()})},[j]),Object(a["createVNode"])(s,{class:["icon control",{verticalLayout:c.verticalLayout}],to:"/settings"},{default:b((function(){return[O]})),_:1},8,["class"])])])})),h=(n("b0c0"),n("cff5")),w=n("11b0"),g=n("319a"),k=Object(a["reactive"])({windowWidth:window.innerWidth,windowVisible:!document.hidden,breakpoints:{}}),y=function(){k.windowWidth=window.innerWidth,k.breakpoints={verticalLayout:k.windowWidth<600,verticalContent:k.windowWidth<1100}};y(),window.addEventListener("resize",y),document.addEventListener("visibilitychange",(function(){return k.windowVisible=!document.hidden})),Object(a["watch"])((function(){return k.breakpoints.verticalLayout}),(function(e){e?document.getElementById("app").classList.add("verticalLayout"):document.getElementById("app").classList.remove("verticalLayout")}),{immediate:!0});var x=k;n("99af"),n("afe4"),n("4fa5");n("5234");function I(e){return B.apply(this,arguments)}function B(){return B=Object(i["a"])(regeneratorRuntime.mark((function e(t){var n,a,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(e.t0=t,e.t0){e.next=5;break}return e.next=4,g["a"].arweave.wallets.generate();case 4:e.t0=e.sent;case 5:return n=e.t0,e.next=8,g["a"].arweave.wallets.jwkToAddress(n);case 8:return a=e.sent,t||S(a,JSON.stringify(n)),c={key:a,jwk:n},e.abrupt("return",g["a"].pushWallet(c));case 12:case"end":return e.stop()}}),e)}))),B.apply(this,arguments)}function S(e,t){var n=document.createElement("a");n.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),n.setAttribute("download",e),n.style.display="none",document.body.appendChild(n),n.click(),document.body.removeChild(n)}var N={name:"Toolbar",components:{AddressIcon:h["a"],SlickList:w["SlickList"],SlickItem:w["SlickItem"]},setup:function(){var e=Object(a["computed"])((function(){return x.breakpoints.verticalLayout})),t=Object(a["computed"])((function(){return x.breakpoints.verticalLayout?"x":"y"}));return{ArweaveStore:g["a"],verticalLayout:e,axis:t}},methods:{createWallet:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,I();case 2:n=t.sent,e.$router.push({name:"EditWallet",query:{wallet:n.id}});case 4:case"end":return t.stop()}}),t)})))()}},computed:{navTo:function(){var e;return"Wallet"===(null===(e=this.$route.matched[0])||void 0===e?void 0:e.name)?null:"Tx"}}};n("8d79");N.render=m,N.__scopeId="data-v-6ce058f7";var V=N,C=n("6c02"),L=n("a1e9"),_=n("5c40"),T={components:{Toolbar:V},setup:function(){var e=Object(L["m"])(null),t=Object(_["n"])((function(){return x.breakpoints.verticalLayout})),n=Object(C["d"])();return n.afterEach((function(e,a){var c=n.options.routes,r=c.findIndex((function(t){return t.path===e.path})),o=c.findIndex((function(e){return e.path===a.path}));r===o&&e.params.walletId&&a.params.walletId&&(r=g["a"].wallets.findIndex((function(t){return t.id==e.params.walletId})),o=g["a"].wallets.findIndex((function(e){return e.id==a.params.walletId}))),e.meta.mainTransitionName=t.value?r<o?"slide-right":"slide-left":r<o?"slide-down":"slide-up"})),{toolbar:e,verticalLayout:t}},methods:{droppedFiles:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function n(){var a,c,r,i,l,s;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:a=[],c=Object(o["a"])(e.dataTransfer.files),n.prev=2,c.s();case 4:if((r=c.n()).done){n.next=16;break}return i=r.value,n.t0=I,n.t1=JSON,n.next=10,i.text();case 10:n.t2=n.sent,n.t3=n.t1.parse.call(n.t1,n.t2),l=(0,n.t0)(n.t3),a.push(l);case 14:n.next=4;break;case 16:n.next=21;break;case 18:n.prev=18,n.t4=n["catch"](2),c.e(n.t4);case 21:return n.prev=21,c.f(),n.finish(21);case 24:return n.next=26,Promise.all(a);case 26:s=n.sent.filter((function(e){return null!==e})).map((function(e){return e.id})),s.length>0&&t.$router.push({name:"EditWallet",query:{wallet:s}});case 28:case"end":return n.stop()}}),n,null,[[2,18,21,24]])})))()}}};n("27b3"),n("0969");T.render=r,T.__scopeId="data-v-49e4ef14";var A=T,q=Object(a["withScopeId"])("data-v-222b99bc");Object(a["pushScopeId"])("data-v-222b99bc");var W={class:"container"},D={key:0,class:"wallet"},M={class:"wallet-info"},R={class:"actions"};Object(a["popScopeId"])();var E=q((function(e,t,n,c,r,o){var i=Object(a["resolveComponent"])("Balance"),s=Object(a["resolveComponent"])("Action"),u=Object(a["resolveComponent"])("router-view");return Object(a["openBlock"])(),Object(a["createBlock"])("div",W,[n.wallet?(Object(a["openBlock"])(),Object(a["createBlock"])("div",D,[Object(a["createVNode"])("div",M,[Object(a["createVNode"])(i,{wallet:n.wallet},null,8,["wallet"]),Object(a["createVNode"])("div",R,[(Object(a["openBlock"])(!0),Object(a["createBlock"])(a["Fragment"],null,Object(a["renderList"])(c.actions,(function(t){return Object(a["openBlock"])(),Object(a["createBlock"])(s,{key:t.name,to:{name:t.name,query:Object(l["a"])({},e.$route.query)},img:t.img},{default:q((function(){return[Object(a["createTextVNode"])(Object(a["toDisplayString"])(t.text),1)]})),_:2},1032,["to","img"])})),128))])]),Object(a["createVNode"])(u,{class:"wallet-view"},{default:q((function(e){var t=e.Component,n=e.route;return[Object(a["createVNode"])(a["Transition"],{name:n.meta.subTransitionName,mode:"out-in"},{default:q((function(){return[(Object(a["openBlock"])(),Object(a["createBlock"])(Object(a["resolveDynamicComponent"])(t)))]})),_:2},1032,["name"])]})),_:1})])):Object(a["createCommentVNode"])("",!0)])})),z=Object(a["withScopeId"])("data-v-bece570c");Object(a["pushScopeId"])("data-v-bece570c");var P={class:"balance"},F={class:"amounts"},$=Object(a["createVNode"])("br",null,null,-1),H={class:"info"};Object(a["popScopeId"])();var J=z((function(e,t,n,c,r,o){var i=Object(a["resolveComponent"])("Ar"),l=Object(a["resolveComponent"])("LocaleCurrency"),s=Object(a["resolveComponent"])("Address");return Object(a["openBlock"])(),Object(a["createBlock"])("div",P,[Object(a["createVNode"])("div",F,[Object(a["createVNode"])(i,{class:"ar",ar:n.wallet.balance},null,8,["ar"]),$,Object(a["createVNode"])(l,{class:"currency",ar:n.wallet.balance},null,8,["ar"])]),Object(a["createVNode"])("div",H,[Object(a["createVNode"])(s,{address:n.wallet.key},null,8,["address"])])])})),Q=n("3f0a"),U=Object(a["withScopeId"])("data-v-4c6f871e");Object(a["pushScopeId"])("data-v-4c6f871e");var K={class:"ar"},X=Object(a["createVNode"])("span",{class:"symbol"},"AR",-1);Object(a["popScopeId"])();var Y=U((function(e,t,n,c,r,o){return Object(a["openBlock"])(),Object(a["createBlock"])("span",K,[Object(a["createTextVNode"])(Object(a["toDisplayString"])(o.amountRounded)+" ",1),X])})),Z={props:["ar"],computed:{amountRounded:function(){if(!this.ar)return null;var e=3;return+(Math.round(this.ar+"e+"+e)+"e-"+e)}}};n("32e0");Z.render=Y,Z.__scopeId="data-v-4c6f871e";var G=Z,ee=Object(a["withScopeId"])("data-v-1aa6efcb");Object(a["pushScopeId"])("data-v-1aa6efcb");var te={class:"locale-currency"},ne=Object(a["createVNode"])("span",{class:"symbol"},"USD",-1);Object(a["popScopeId"])();var ae=ee((function(e,t,n,c,r,o){return Object(a["openBlock"])(),Object(a["createBlock"])("span",te,[Object(a["renderSlot"])(e.$slots,"default",{},void 0,!0),Object(a["createTextVNode"])(" "+Object(a["toDisplayString"])(o.converted)+" ",1),ne])})),ce=(n("b680"),{props:["ar"],computed:{converted:function(){if(this.ar&&g["a"].currency.limestone){var e=g["a"].currency.limestone*this.ar;return e.toFixed(2)}}}});n("4cff");ce.render=ae,ce.__scopeId="data-v-1aa6efcb";var re=ce,oe={components:{Address:Q["a"],Ar:G,LocaleCurrency:re},props:["wallet"]};n("c410");oe.render=J,oe.__scopeId="data-v-bece570c";var ie=oe,le=Object(a["withScopeId"])("data-v-7fc02649");Object(a["pushScopeId"])("data-v-7fc02649");var se={class:"text"};Object(a["popScopeId"])();var ue=le((function(e,t,n,c,r,o){var i=Object(a["resolveComponent"])("router-link");return Object(a["openBlock"])(),Object(a["createBlock"])(i,{class:"action"},{default:le((function(){return[Object(a["createVNode"])("img",{class:"img",src:n.img},null,8,["src"]),Object(a["createVNode"])("span",se,[Object(a["renderSlot"])(e.$slots,"default",{},void 0,!0)])]})),_:3})})),de={props:["img"]};n("6205");de.render=ue,de.__scopeId="data-v-7fc02649";var pe=de,be={name:"Wallet",components:{Balance:ie,Action:pe},props:["wallet"],setup:function(){var e=[{name:"Send",img:n("d4f0"),text:"Send"},{name:"Tx",img:n("b008"),text:"Transactions"},{name:"Tokens",img:n("3d27"),text:"Tokens"}],t=Object(C["d"])();return t.afterEach((function(t,n){var a=e.findIndex((function(e){return e.name===t.name})),c=e.findIndex((function(e){return e.name===n.name}));t.meta.subTransitionName=a<c?"slide-down":"slide-up"})),{ArweaveStore:g["a"],actions:e}},watch:{wallet:{handler:function(e){e?g["a"].setCurrentWallet(e):g["a"].setCurrentWallet(g["a"].wallets[0])},immediate:!0}}};n("a850");be.render=E,be.__scopeId="data-v-222b99bc";var fe=be,ve=Object(a["withScopeId"])("data-v-2cec2f4e");Object(a["pushScopeId"])("data-v-2cec2f4e");var je={class:"txs"},Oe={ref:"bottom",class:"bottom"};Object(a["popScopeId"])();var me=ve((function(e,t,n,c,r,o){var i=Object(a["resolveComponent"])("Tabs"),l=Object(a["resolveComponent"])("TxCard");return Object(a["openBlock"])(),Object(a["createBlock"])("div",je,[Object(a["createVNode"])(i,{query:"view",tabs:c.tabs},null,8,["tabs"]),Object(a["createVNode"])(a["Transition"],{name:c.transitionName,mode:"out-in"},{default:ve((function(){return[(Object(a["openBlock"])(),Object(a["createBlock"])("div",{class:"list",key:c.selectedQuery},[(Object(a["openBlock"])(!0),Object(a["createBlock"])(a["Fragment"],null,Object(a["renderList"])(c.txs,(function(e){return Object(a["openBlock"])(),Object(a["createBlock"])(l,{key:e.id,class:"tx",tx:e},null,8,["tx"])})),128))]))]})),_:1},8,["name"]),Object(a["withDirectives"])(Object(a["createVNode"])("div",Oe,null,512),[[a["vShow"],!c.loading&&!c.completedQuery]])])})),he=n("2b35"),we=n.n(he),ge=Object(a["withScopeId"])("data-v-5a379935");Object(a["pushScopeId"])("data-v-5a379935");var ke={class:"tx-card"},ye={class:"left"},xe={key:0},Ie=Object(a["createTextVNode"])("  "),Be=Object(a["createTextVNode"])("|"),Se={key:1},Ne={class:"small"},Ve={class:"right"},Ce={class:"right-content"},Le={class:"right-text"},_e={key:1,class:"ellipsis"},Te=Object(a["createTextVNode"])("  "),Ae=Object(a["createTextVNode"])("|"),qe={class:"small ellipsis"},We=Object(a["createVNode"])("div",{class:"margin"},null,-1),De=Object(a["createVNode"])("div",null,"Info here",-1),Me={key:1,class:"cloud"},Re=Object(a["createVNode"])("img",{class:"file-type no-select",src:we.a,draggable:"false"},null,-1);Object(a["popScopeId"])();var Ee=ge((function(e,t,n,c,r,o){var i=Object(a["resolveComponent"])("TxIcon"),l=Object(a["resolveComponent"])("Ar"),s=Object(a["resolveComponent"])("LocaleCurrency"),u=Object(a["resolveComponent"])("Address"),d=Object(a["resolveComponent"])("AddressIcon"),p=Object(a["resolveComponent"])("MoreInfo");return Object(a["openBlock"])(),Object(a["createBlock"])("div",ke,[Object(a["createVNode"])("div",ye,[Object(a["createVNode"])(i,{class:"tx-icon",direction:o.direction,isValue:o.isValue,isData:o.isData,isLoading:o.isLoading},null,8,["direction","isValue","isData","isLoading"]),Object(a["createVNode"])("div",null,[o.isValue?(Object(a["openBlock"])(),Object(a["createBlock"])("div",xe,[Object(a["createVNode"])(l,{class:"ar",ar:o.value},null,8,["ar"]),Ie,Object(a["createVNode"])(s,{class:"small",ar:o.value},{default:ge((function(){return[Be]})),_:1},8,["ar"])])):(Object(a["openBlock"])(),Object(a["createBlock"])("div",Se,Object(a["toDisplayString"])(o.dataType||"Data"),1)),Object(a["createVNode"])("div",Ne,Object(a["toDisplayString"])(o.context),1)])]),Object(a["createVNode"])("div",Ve,[Object(a["createVNode"])("div",Ce,[Object(a["createVNode"])("div",Le,[o.relativeAddress?(Object(a["openBlock"])(),Object(a["createBlock"])(u,{key:0,class:"address",address:o.relativeAddress},null,8,["address"])):(Object(a["openBlock"])(),Object(a["createBlock"])("div",_e,[Object(a["createVNode"])(l,{ar:n.tx.node.fee.ar},null,8,["ar"]),Te,Object(a["createVNode"])(s,{class:"small",ar:n.tx.node.fee.ar},{default:ge((function(){return[Ae]})),_:1},8,["ar"])])),Object(a["createVNode"])("div",qe,Object(a["toDisplayString"])(o.date+" "+o.time),1)]),We]),o.relativeAddress?(Object(a["openBlock"])(),Object(a["createBlock"])(p,{key:o.relativeAddress},{icon:ge((function(){return[Object(a["createVNode"])(d,{address:o.relativeAddress},null,8,["address"])]})),content:ge((function(){return[De]})),_:1})):(Object(a["openBlock"])(),Object(a["createBlock"])("span",Me,[Re]))])])})),ze=Object(a["withScopeId"])("data-v-6fc2a612");Object(a["pushScopeId"])("data-v-6fc2a612");var Pe={key:0,class:"tx-fill",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Fe=Object(a["createVNode"])("rect",{x:"0",y:"0",width:"24",height:"24",style:{fill:"none","fill-rule":"nonzero"}},null,-1),$e=Object(a["createVNode"])("g",{transform:"matrix(6.12323e-17,1,-1,6.12323e-17,24,0)"},[Object(a["createVNode"])("path",{d:"M16.01,11L4,11L4,13L16.01,13L16.01,16L20,12L16.01,8L16.01,11Z",style:{"fill-rule":"nonzero"}})],-1),He={key:1,class:"tx-fill",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Je=Object(a["createVNode"])("rect",{x:"0",y:"0",width:"24",height:"24",style:{fill:"none","fill-rule":"nonzero"}},null,-1),Qe=Object(a["createVNode"])("g",{transform:"matrix(6.12323e-17,-1,1,6.12323e-17,0,24)"},[Object(a["createVNode"])("path",{d:"M16.01,11L4,11L4,13L16.01,13L16.01,16L20,12L16.01,8L16.01,11Z",style:{"fill-rule":"nonzero"}})],-1),Ue={key:2,class:"tx-fill",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Ke=Object(a["createVNode"])("path",{d:"M0 0h24v24H0V0z",fill:"none"},null,-1),Xe=Object(a["createVNode"])("path",{d:"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zm-5.55-8h-2.9v3H8l4 4 4-4h-2.55z"},null,-1),Ye={key:3,class:"tx-fill",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Ze=Object(a["createVNode"])("path",{d:"M0 0h24v24H0V0z",fill:"none"},null,-1),Ge=Object(a["createVNode"])("path",{d:"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z"},null,-1),et={key:4,class:"tx-fill",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},tt=Object(a["createVNode"])("g",null,[Object(a["createVNode"])("rect",{fill:"none",height:"24",width:"24"}),Object(a["createVNode"])("path",{d:"M12,4c4.41,0,8,3.59,8,8s-3.59,8-8,8s-8-3.59-8-8S7.59,4,12,4 M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10 c5.52,0,10-4.48,10-10C22,6.48,17.52,2,12,2L12,2z M13,12l0-4h-2l0,4H8l4,4l4-4H13z"})],-1),nt={key:5,class:"tx-fill",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},at=Object(a["createVNode"])("g",null,[Object(a["createVNode"])("rect",{fill:"none",height:"24",width:"24"}),Object(a["createVNode"])("path",{d:"M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20 M12,22c5.52,0,10-4.48,10-10c0-5.52-4.48-10-10-10 C6.48,2,2,6.48,2,12C2,17.52,6.48,22,12,22L12,22z M11,12l0,4h2l0-4h3l-4-4l-4,4H11z"})],-1),ct={key:0,class:"loader"};Object(a["popScopeId"])();var rt=ze((function(e,t,n,c,r,o){return Object(a["openBlock"])(),Object(a["createBlock"])("div",{class:["tx-icon",{isLoading:n.isLoading}],style:o.styleObject},["in"!==n.direction||n.isData?"out"!==n.direction||n.isData?"in"!==n.direction||n.isValue?"out"!==n.direction||n.isValue?"in"===n.direction?(Object(a["openBlock"])(),Object(a["createBlock"])("svg",et,[tt])):"out"===n.direction?(Object(a["openBlock"])(),Object(a["createBlock"])("svg",nt,[at])):Object(a["createCommentVNode"])("",!0):(Object(a["openBlock"])(),Object(a["createBlock"])("svg",Ye,[Ze,Ge])):(Object(a["openBlock"])(),Object(a["createBlock"])("svg",Ue,[Ke,Xe])):(Object(a["openBlock"])(),Object(a["createBlock"])("svg",He,[Je,Qe])):(Object(a["openBlock"])(),Object(a["createBlock"])("svg",Pe,[Fe,$e])),Object(a["createVNode"])(a["Transition"],{name:"fade"},{default:ze((function(){return[n.isLoading?(Object(a["openBlock"])(),Object(a["createBlock"])("div",ct)):Object(a["createCommentVNode"])("",!0)]})),_:1})],6)})),ot={props:["direction","isValue","isData","isLoading"],computed:{styleObject:function(){var e=this.isData&&!this.isValue?"#d08770":"in"===this.direction?"#a3be8c":"#bf616a";return{"--color":e}}}};n("7673");ot.render=rt,ot.__scopeId="data-v-6fc2a612";var it=ot,lt=Object(a["withScopeId"])("data-v-7fc2f706");Object(a["pushScopeId"])("data-v-7fc2f706");var st={class:"header"};Object(a["popScopeId"])();var ut=lt((function(e,t,n,c,r,o){return Object(a["openBlock"])(),Object(a["createBlock"])("div",{class:["wrapper",{expand:r.expand}],onClick:t[2]||(t[2]=function(e){return r.expand=!r.expand})},[Object(a["createVNode"])("div",st,[Object(a["renderSlot"])(e.$slots,"icon",{},void 0,!0)]),Object(a["createVNode"])(a["Transition"],{name:"fade"},{default:lt((function(){return[r.expand?(Object(a["openBlock"])(),Object(a["createBlock"])("div",{key:0,class:"content",onClick:t[1]||(t[1]=Object(a["withModifiers"])((function(){}),["stop"]))},[Object(a["renderSlot"])(e.$slots,"content",{},void 0,!0)])):Object(a["createCommentVNode"])("",!0)]})),_:3})],2)})),dt={data:function(){return{expand:!1}}};n("7db4");dt.render=ut,dt.__scopeId="data-v-7fc2f706";var pt=dt,bt={components:{Address:Q["a"],Ar:G,TxIcon:it,AddressIcon:h["a"],LocaleCurrency:re,MoreInfo:pt},props:["tx"],computed:{date:function(){return this.isLoading?"pending":new Date(1e3*this.tx.node.block.timestamp).toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})},time:function(){return this.isLoading?"":new Date(1e3*this.tx.node.block.timestamp).toLocaleTimeString()},direction:function(){if(!g["a"].currentWallet)return null;var e=g["a"].currentWallet.key;return e===this.tx.node.recipient?"in":e===this.tx.node.owner.address?"out":null},isData:function(){return"0"!==this.tx.node.data.size},isValue:function(){return"0"!==this.tx.node.quantity.winston},isLoading:function(){return!this.tx.node.block},relativeAddress:function(){return"in"===this.direction?this.tx.node.owner.address:"out"===this.direction?this.tx.node.recipient:null},value:function(){return this.tx.node.quantity.ar},dataType:function(){var e=this.tx.node.data.type;if(e)return e.split("/").join(" ")},dataInfo:function(){var e,t=Object(o["a"])(this.tx.node.tags);try{for(t.s();!(e=t.n()).done;){var n=e.value;if("Service"==n.name)return n.value}}catch(u){t.e(u)}finally{t.f()}var a,c=Object(o["a"])(this.tx.node.tags);try{for(c.s();!(a=c.n()).done;){var r=a.value;if("App-Name"==r.name)return r.value}}catch(u){c.e(u)}finally{c.f()}var i,l=Object(o["a"])(this.tx.node.tags);try{for(l.s();!(i=l.n()).done;){var s=i.value;if("User-Agent"==s.name)return s.value.split("/")[0]}}catch(u){l.e(u)}finally{l.f()}},context:function(){return this.isValue&&this.isData?this.dataInfo||this.dataType||"Payment | Data":this.isValue?this.dataInfo||this.dataType||"Payment":this.isData?this.dataInfo||"Data":void 0}}};n("f8d0");bt.render=Ee,bt.__scopeId="data-v-5a379935";var ft=bt,vt=n("ade3"),jt=Object(a["withScopeId"])("data-v-3cff2d79");Object(a["pushScopeId"])("data-v-3cff2d79");var Ot={class:"tabs"};Object(a["popScopeId"])();var mt=jt((function(e,t,n,c,r,o){var i=Object(a["resolveComponent"])("router-link");return Object(a["openBlock"])(),Object(a["createBlock"])("div",Ot,[(Object(a["openBlock"])(!0),Object(a["createBlock"])(a["Fragment"],null,Object(a["renderList"])(n.tabs,(function(t){return Object(a["openBlock"])(),Object(a["createBlock"])(i,{class:["tab",{active:o.isActive(t)}],key:t.name,to:{query:Object(l["a"])(Object(l["a"])({},e.$route.query),{},Object(vt["a"])({},n.query,t.name.toLowerCase()))},style:{"--color":t.color},replace:""},{default:jt((function(){return[Object(a["createTextVNode"])(Object(a["toDisplayString"])(t.name),1)]})),_:2},1032,["to","style","class"])})),128))])})),ht={props:["query","tabs"],methods:{isActive:function(e){var t=this.$route.query[this.query];return t?t===e.name.toLowerCase():0===this.tabs.indexOf(e)}}};n("d692");ht.render=mt,ht.__scopeId="data-v-3cff2d79";var wt=ht,gt={components:{TxCard:ft,Tabs:wt},props:["wallet"],setup:function(e){var t=Object(L["m"])(!1),n=Object(L["m"])(null),a=Object(C["c"])(),c=Object(_["n"])((function(){return a.query.view||"received"})),r=Object(_["n"])((function(){var t;return(null===(t=e.wallet)||void 0===t?void 0:t.queries[c.value])||[]})),o=Object(_["n"])((function(){var t,n,a;return null===(t=e.wallet)||void 0===t||null===(n=t.queriesStatus)||void 0===n||null===(a=n[c.value])||void 0===a?void 0:a.completed})),l=function(){var n=Object(i["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(!t.value){n.next=2;break}return n.abrupt("return");case 2:return console.log("Queried",c.value),t.value=!0,n.next=6,g["a"].fetchTransactions(e.wallet,c.value);case 6:setTimeout((function(){return t.value=!1}),500);case 7:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();Object(_["Ob"])((function(){return a.query}),(function(){t.value=!0,setTimeout((function(){return t.value=!1}))}));var s=new IntersectionObserver((function(e){!0===e[0].isIntersecting&&l()}),{threshold:[0]});Object(_["X"])((function(){s.observe(n.value)})),Object(_["T"])((function(){s.unobserve(n.value)}));var u=[{name:"Received",color:"#a3be8c"},{name:"Sent",color:"#bf616a"}],d=Object(L["m"])(null);return Object(_["Ob"])((function(){return c.value}),(function(e,t){var n=u.findIndex((function(t){return t.name.toLowerCase()===e})),a=u.findIndex((function(e){return e.name.toLowerCase()===t}));d.value=n<a?"slide-right":"slide-left"})),{loading:t,txs:r,completedQuery:o,bottom:n,selectedQuery:c,transitionName:d,tabs:u}}};n("a1e1");gt.render=me,gt.__scopeId="data-v-2cec2f4e";var kt=gt,yt=Object(a["withScopeId"])("data-v-9bb93bc2");Object(a["pushScopeId"])("data-v-9bb93bc2");var xt={class:"send"};Object(a["popScopeId"])();var It=yt((function(e,t,n,c,r,o){var i=Object(a["resolveComponent"])("Input");return Object(a["openBlock"])(),Object(a["createBlock"])("div",xt,[Object(a["createVNode"])(i)])})),Bt=Object(a["withScopeId"])("data-v-2c37e984");Object(a["pushScopeId"])("data-v-2c37e984");var St={class:"input"},Nt=Object(a["createVNode"])("img",{class:"icon",src:"arweaveLogo.svg"},null,-1),Vt=Object(a["createVNode"])("input",{class:"text",placeholder:""},null,-1);Object(a["popScopeId"])();var Ct=Bt((function(e,t,n,c,r,o){return Object(a["openBlock"])(),Object(a["createBlock"])("div",St,[Nt,Vt])})),Lt={};n("8ad0");Lt.render=Ct,Lt.__scopeId="data-v-2c37e984";var _t=Lt,Tt={components:{Input:_t}};n("ccb6");Tt.render=It,Tt.__scopeId="data-v-9bb93bc2";var At=Tt,qt=Object(a["withScopeId"])("data-v-61bf760e"),Wt=qt((function(e,t,n,c,r,o){return Object(a["openBlock"])(),Object(a["createBlock"])("div",null," tokens ")})),Dt={};Dt.render=Wt,Dt.__scopeId="data-v-61bf760e";var Mt=Dt,Rt=[{name:"Wallet",path:"/wallet/:walletId(\\d+)",component:fe,props:function(e){return{wallet:g["a"].getWalletById(e.params.walletId)}},children:[{name:"Tx",path:"tx",component:kt,props:function(e){return{wallet:g["a"].getWalletById(e.params.walletId)}}},{name:"Send",path:"send",component:At},{name:"Tokens",path:"tokens",component:Mt}],beforeEnter:function(e,t){return 0==g["a"].wallets.length?{name:"Welcome"}:e.params.walletId?void 0:{name:"Wallet",params:{walletId:g["a"].wallets[0].id}}}},{path:"/edit",name:"EditWallet",component:function(){return n.e("chunk-4c6f028e").then(n.bind(null,"1d18"))}},{path:"/settings",name:"Settings",component:function(){return n.e("chunk-d82ba440").then(n.bind(null,"26d3"))}},{path:"/welcome",name:"Welcome",component:function(){return n.e("chunk-2d2311c8").then(n.bind(null,"eec5"))}},{path:"/:pathMatch(.*)*",redirect:{name:"Tx",params:{walletId:g["a"].wallets[0].id}}}],Et=Object(C["a"])({history:Object(C["b"])(),routes:Rt}),zt=Et,Pt=(n("2efa"),Object(a["createApp"])(A));Pt.use(zt,w["plugin"]),Pt.mount("#app")},6:function(e,t){},6205:function(e,t,n){"use strict";n("86f9")},"69de":function(e,t,n){e.exports=n.p+"img/add_box.d7eb1418.svg"},"6f65":function(e,t,n){},"6f83":function(e,t,n){},7:function(e,t){},7673:function(e,t,n){"use strict";n("9f96")},"7db4":function(e,t,n){"use strict";n("8420")},8:function(e,t){},8420:function(e,t,n){},"86f9":function(e,t,n){},"8ad0":function(e,t,n){"use strict";n("4498")},"8d79":function(e,t,n){"use strict";n("1689")},9:function(e,t){},"90a5":function(e,t,n){},9174:function(e,t,n){e.exports=n.p+"img/settings.96ab7675.svg"},"94c1":function(e,t,n){"use strict";n("6f83")},"9acf":function(e,t,n){},"9f96":function(e,t,n){},a1e1:function(e,t,n){"use strict";n("a438")},a438:function(e,t,n){},a850:function(e,t,n){"use strict";n("b011")},b008:function(e,t,n){e.exports=n.p+"img/swap.4c056fd5.svg"},b011:function(e,t,n){},c410:function(e,t,n){"use strict";n("9acf")},ccb6:function(e,t,n){"use strict";n("6f65")},cff5:function(e,t,n){"use strict";var a=n("7a23"),c=Object(a["withScopeId"])("data-v-2f7a9a84");Object(a["pushScopeId"])("data-v-2f7a9a84");var r={class:"address-icon"};Object(a["popScopeId"])();var o=c((function(e,t,n,c,o,i){return Object(a["openBlock"])(),Object(a["createBlock"])("div",r,[Object(a["createVNode"])("img",{class:"identicon",src:o.identicon,alt:"wallet logo",draggable:"false"},null,8,["src"]),o.url?(Object(a["openBlock"])(),Object(a["createBlock"])("img",{key:0,class:"image",src:o.url,alt:"wallet profile picture",draggable:"false"},null,8,["src"])):Object(a["createCommentVNode"])("",!0)])})),i=n("1da1"),l=(n("96cf"),n("d3b7"),n("25f0"),n("ba5f"),n("319a"),n("36f3")),s=n.n(l),u=n("81b4"),d={props:["address"],data:function(){return{url:null,identicon:null,test:!1}},watch:{address:{handler:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){var n,a,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:n={background:[0,0,0,0],brightness:.6,saturation:.25,margin:0,format:"svg"},a=new u["SHA256"],c=new s.a(a.hex(t),n).toString(),this.identicon="data:image/svg+xml;base64,"+c;case 4:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),immediate:!0}}};n("d26b");d.render=o,d.__scopeId="data-v-2f7a9a84";t["a"]=d},d26b:function(e,t,n){"use strict";n("d3df")},d3df:function(e,t,n){},d4f0:function(e,t,n){e.exports=n.p+"img/north_east.1b2f7a11.svg"},d692:function(e,t,n){"use strict";n("449b")},f8d0:function(e,t,n){"use strict";n("fb68")},fb68:function(e,t,n){}});
//# sourceMappingURL=app.90bdb265.js.map