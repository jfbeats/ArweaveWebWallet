import{_ as k,m as I,W as $,B as u,s as C,a8 as B,p as v,H as b,a9 as h,aa as A,o as S}from"./index.dfeb5663.js";import{I as V}from"./download.a85a3369.js";import{d as W,o as a,a as c,e as s,g as d,j as p,h as m,u as t,W as r,V as f,a1 as D,c as y,t as N,F as g,f as O,a3 as Z,a4 as j}from"./vendor.cc129a20.js";const z={class:"wallet-options flex-column"},F={class:"left"},U={class:"profile-info"},q={class:"content"},E={class:"bottom flex-row"},H=f("Download"),L=f("Delete"),M=W({props:{wallet:null},setup(e){return(_,l)=>(a(),c("div",z,[s("div",F,[d(I,{class:"profile",address:e.wallet.key},null,8,["address"]),s("div",U,[d($,{wallet:e.wallet},null,8,["wallet"])])]),s("div",q,[s("div",E,[e.wallet.download&&!e.wallet.metadata.methods.download?.unavailable?(a(),p(u,{key:0,icon:t(V),onClick:l[0]||(l[0]=()=>e.wallet.download())},{default:m(()=>[H]),_:1},8,["icon"])):r("",!0),d(u,{icon:t(C),onClick:l[1]||(l[1]=w=>t(B)(e.wallet))},{default:m(()=>[L]),_:1},8,["icon"])])])]))}});var R=k(M,[["__scopeId","data-v-3951ea78"]]);const T={viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},X=s("path",{d:"M24 24.6c.433 0 .792-.142 1.075-.425.283-.283.425-.642.425-1.075v-7.35c0-.433-.142-.792-.425-1.075-.283-.283-.642-.425-1.075-.425-.433 0-.792.142-1.075.425-.283.283-.425.642-.425 1.075v7.35c0 .433.142.792.425 1.075.283.283.642.425 1.075.425Zm0 6.7c.467 0 .867-.167 1.2-.5.333-.333.5-.733.5-1.2 0-.467-.167-.867-.5-1.2a1.637 1.637 0 0 0-1.2-.5c-.467 0-.867.167-1.2.5-.333.333-.5.733-.5 1.2 0 .467.167.867.5 1.2.333.333.733.5 1.2.5Zm0 12.55c-.133 0-.258-.008-.375-.025a1.912 1.912 0 0 1-.325-.075c-4.467-1.333-8.133-4.075-11-8.225C9.433 31.375 8 26.817 8 21.85v-9.8c0-.633.183-1.208.55-1.725A3.166 3.166 0 0 1 9.95 9.2l13-4.85c.367-.133.717-.2 1.05-.2.333 0 .683.067 1.05.2l13 4.85a3.166 3.166 0 0 1 1.4 1.125c.367.517.55 1.092.55 1.725v9.8c0 4.967-1.433 9.525-4.3 13.675s-6.533 6.892-11 8.225l-.7.1Zm0-3c3.833-1.267 6.958-3.658 9.375-7.175S37 26.217 37 21.85v-9.8l-13-4.9-13 4.9v9.8c0 4.367 1.208 8.308 3.625 11.825 2.417 3.517 5.542 5.908 9.375 7.175Z",style:{"fill-rule":"nonzero"},transform:"translate(-5.018 -5.018) scale(1.20907)"},null,-1),G=[X];function J(e,_){return a(),c("svg",T,G)}var K={render:J};const x=e=>(Z("data-v-10548572"),e=e(),j(),e),P={class:"flex-row",style:{"justify-content":"space-between","align-items":"baseline"}},Q={key:0,class:"update-message"},Y=x(()=>s("span",null," Update encryption",-1)),ee={class:"flex-column"},te=f("Connect"),se=x(()=>s("div",null,null,-1)),ae=W({setup(e){const _=D(),l=y(()=>{const o=_.query.wallet;if(!o)return v.value;const i=Array.isArray(o)?o:[o];return v.value.filter(n=>i.includes(n.id+""))}),w=y(()=>["popup","iframe","ws"].includes(b.value.type)&&!h.value.walletId);return(o,i)=>(a(),c("div",null,[s("div",P,[s("h2",null,"Wallet"+N(t(l).length>1?"s":""),1),t(A)?(a(),c("div",Q,[d(S,{icon:t(K),style:{"vertical-align":"text-top"}},null,8,["icon"]),Y])):r("",!0)]),s("div",ee,[(a(!0),c(g,null,O(t(l),n=>(a(),c(g,{key:n.id},[d(R,{wallet:n},null,8,["wallet"]),t(w)?(a(),p(u,{key:0,onClick:()=>t(h).walletId=n.id},{default:m(()=>[te]),_:2},1032,["onClick"])):r("",!0),se],64))),128))]),t(v).length?r("",!0):(a(),p(u,{key:0,style:{"font-size":"1.5em",background:"var(--background3)"},onClick:i[0]||(i[0]=n=>o.$router.push({name:"AddWallet"})),icon:"+"}))]))}});var ce=k(ae,[["__scopeId","data-v-10548572"]]);export{ce as W};
//# sourceMappingURL=WalletsOptions.f57d9427.js.map
