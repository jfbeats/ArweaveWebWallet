import{_ as q,J as E,L as N,B as p,K as j,M as F,N as P,O as L,P as M,x as T,Q as D,R as G,S as J}from"./index.6f63016f.js";import{W as K,a0 as R,d as o,e as U,c as W,a as t,q as m,x as f,s as v,u as w,F as $,l as H,a1 as Q,a2 as z,o as i,a5 as _,V as g}from"./vendor.241c16ad.js";import{O as X}from"./OverlayPrompt.bfc67c3a.js";const h=r=>(Q("data-v-0c90a12c"),r=r(),z(),r),Y={class:"add-wallet flex-column"},Z={class:"card"},ee=h(()=>t("h2",{style:{display:"flex","justify-content":"space-between"}},[t("span",null,"Passphrase"),t("span",null,"Key file")],-1)),ae={class:"flex-column"},se=h(()=>t("div",null,null,-1)),te=_("Create new wallet"),le=_("Import passphrase"),oe={class:"card"},ne=h(()=>t("h2",null,"Hardware",-1)),de={class:"card"},ie=h(()=>t("h2",null,"Address Only",-1)),re=K({setup(r){const n=R(),l=o(""),y=o(""),c=o(void 0),k=U(()=>l.value.trim().split(/\s+/g).length>=12),u=o(!1),x=o(!1),d=o(null),I=async()=>{u.value=!0,l.value=await F();const e=P(l.value);setTimeout(async()=>d.value=await e,1e4)},C=()=>{n.push({name:"EditWallet",query:{wallet:d.value}})},b=async()=>{x.value=!0;const e=P(l.value);c.value={icon:"loader",message:"importing"},n.push({name:"EditWallet",query:{wallet:await e}})},V=async()=>{if(await L(l.value))return b();c.value={message:"This passphrase is not valid, do you want to import it anyway?",actions:[{name:"Back",run:()=>c.value=void 0},{name:"Import Passphrase",run:()=>b()}]}},A=async e=>{if(!e)return;const s=await M(JSON.parse(await e[0].text()));n.push({name:"EditWallet",query:{wallet:s}})},B=async e=>{const s=await G(e);n.push({name:"EditWallet",query:{wallet:s}})},S=[J],O={icon:T,run:async()=>{const e=await D(y.value);n.push({name:"EditWallet",query:{wallet:e}})}};return(e,s)=>(i(),W("div",Y,[t("div",Z,[ee,t("div",ae,[m(E,{modelValue:l.value,"onUpdate:modelValue":s[0]||(s[0]=a=>l.value=a),onFiles:A,disabled:u.value,placeholder:"Import passphrase or key file"},null,8,["modelValue","disabled"]),se,!u.value&&!l.value.length?(i(),f(p,{key:0,onClick:s[1]||(s[1]=a=>I()),disabled:l.value.length&&!w(k),icon:w(N)},{default:v(()=>[te]),_:1},8,["disabled","icon"])):u.value?(i(),f(p,{key:1,disabled:d.value==null,onClick:C,icon:d.value==null?"loader":""},{default:v(()=>[_(g(d.value==null?"Generating, write down the passphrase":"Passphrase saved? Click here to proceed"),1)]),_:1},8,["disabled","icon"])):(i(),f(p,{key:2,disabled:!w(k)||x.value,onClick:V},{default:v(()=>[le]),_:1},8,["disabled"]))]),m(X,{options:c.value},null,8,["options"])]),t("div",oe,[ne,(i(),W($,null,H(S,a=>m(p,{key:a.metadata.name,disabled:!a.metadata.isSupported,onClick:ce=>B(a),icon:a.metadata.icon},{default:v(()=>[_(g(a.metadata.name)+" "+g(a.metadata.isSupported?"":" not supported for this browser"),1)]),_:2},1032,["disabled","onClick","icon"])),64))]),t("div",de,[ie,m(j,{modelValue:y.value,"onUpdate:modelValue":s[2]||(s[2]=a=>y.value=a),actions:[O]},null,8,["modelValue","actions"])])]))}});var ve=q(re,[["__scopeId","data-v-0c90a12c"]]);export{ve as default};
//# sourceMappingURL=AddWallet.4d20031f.js.map