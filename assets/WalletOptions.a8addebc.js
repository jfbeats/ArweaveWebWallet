import{_ as r,i as _,W as f,B as n,o as w,$ as u}from"./index.67ce41ff.js";import{I as m}from"./download.b65fa812.js";import{X as v,o as d,c as x,a as o,q as a,x as p,s as c,u as l,D as k,a6 as i}from"./vendor.5e7c49a5.js";const h={class:"wallet-options"},B={class:"left"},I={class:"profile-info"},W={class:"content"},C={class:"bottom flex-row"},y=i("Download"),D=i("Delete"),N=v({props:{wallet:null},setup(e){return(V,t)=>{var s;return d(),x("div",h,[o("div",B,[a(_,{class:"profile",address:e.wallet.key},null,8,["address"]),o("div",I,[a(f,{wallet:e.wallet},null,8,["wallet"])])]),o("div",W,[o("div",C,[e.wallet.download&&!((s=e.wallet.metadata.methods.download)==null?void 0:s.unavailable)?(d(),p(n,{key:0,icon:l(m),onClick:t[0]||(t[0]=()=>e.wallet.download())},{default:c(()=>[y]),_:1},8,["icon"])):k("",!0),a(n,{icon:l(w),onClick:t[1]||(t[1]=b=>l(u)(e.wallet))},{default:c(()=>[D]),_:1},8,["icon"])])])])}}});var $=r(N,[["__scopeId","data-v-73e8a64c"]]);export{$ as W};
//# sourceMappingURL=WalletOptions.a8addebc.js.map
