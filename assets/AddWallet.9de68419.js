import{_ as O,d as j,r as o,c as L,o as s,g as u,b as a,q as p,u as m,aG as z,aH as G,a as c,w as d,aI as U,B as h,h as w,t as k,x,O as F,a0 as P,$ as B,aJ as H,aK as K,U as R,V as J,ad as Q,aL as Y,aM as D,aN as b,aO as X,aj as Z,aP as E,a4 as ee,aQ as ae,D as te,ah as se,C as le,aR as ne,E as oe}from"./index.5b67e890.js";const v=g=>(R("data-v-e97237ac"),g=g(),J(),g),ce={class:"add-wallet flex-column"},de={class:"card"},ie=v(()=>a("h2",{style:{display:"flex","justify-content":"space-between"}},[a("span",null,"Passphrase"),a("span",null,"Key file")],-1)),re={class:"flex-column"},ue=v(()=>a("div",null,null,-1)),pe=w("Create new wallet"),me=w("Import passphrase"),he={key:0,style:{"text-align":"center"}},ve=v(()=>a("p",null,"This passphrase was not generated by arweave.app",-1)),_e=v(()=>a("p",null,"Make sure that it was entered correctly, without typing errors or extra characters. You can still import the wallet and use it normally",-1)),we=[ve,_e],ge={class:"flex-row",style:{"align-items":"center"}},ye={class:"flex-column"},fe={class:"flex-row"},ke={class:"flex-row"},xe={key:0,class:"popup"},be={class:"card flex-column",style:{"min-width":"300px"}},Ce={class:"flex-row",style:{"justify-content":"space-between","align-items":"center"}},Ie=v(()=>a("h2",null,"Settings",-1)),Ae={class:"card"},We=v(()=>a("h2",null,"Address Only",-1)),Ve=j({setup(g){const y=Q(),l=o(""),C=o(""),_=o(void 0),A=L(()=>l.value.trim().split(/\s+/g).length>=12),f=o(!1),W=o(!1),i=o(null),T=async()=>{f.value=!0,l.value=await Y();const n=D(l.value);setTimeout(async()=>i.value=await n,1e4),b.account("Account Create")},$=()=>{!i.value||y.push({name:"EditWallet",query:{wallet:i.value.id}})},V=async()=>{W.value=!0;const n=D(l.value);_.value={icon:"loader",message:"importing"},y.push({name:"EditWallet",query:{wallet:(await n).id}}),b.account("Account Import")},q=async()=>{if(await X(l.value))return V();_.value={messageType:"invalid",actions:[{name:"Back",run:()=>_.value=void 0},{name:"Import",run:()=>V()}]}},M=async n=>{try{const t=await E(void 0,n);y.push({name:"EditWallet",query:{wallet:t.id}}),b.account("Account Ledger")}catch(t){console.error(t),oe.error(t.message||t)}},N={icon:Z,run:async()=>{const n=await E(C.value);y.push({name:"EditWallet",query:{wallet:n.id}}),b.account("Account Watch")}},I=o(-1);return(n,t)=>(s(),u("div",ce,[a("div",de,[ie,a("div",re,[p(G,{modelValue:l.value,"onUpdate:modelValue":t[0]||(t[0]=e=>l.value=e),onFiles:t[1]||(t[1]=e=>m(z)(e,"keyfile")),disabled:f.value,placeholder:"Import passphrase or key file",autocapitalize:"none"},null,8,["modelValue","disabled"]),ue,!f.value&&!l.value.length?(s(),c(h,{key:0,onClick:T,disabled:l.value.length&&!m(A),icon:m(U),class:"main",glow:!0,color:"#81a1c1"},{default:d(()=>[pe]),_:1},8,["disabled","icon"])):f.value?(s(),c(h,{key:1,disabled:i.value==null,onClick:$,icon:i.value==null?"loader":"",class:"main",glow:!0,color:"#81a1c1"},{default:d(()=>[w(k(i.value==null?"Generating, write down the passphrase":"Passphrase saved? Click here to proceed"),1)]),_:1},8,["disabled","icon"])):(s(),c(h,{key:2,disabled:!m(A)||W.value,onClick:q,class:"main",glow:!0,color:"#81a1c1"},{default:d(()=>[me]),_:1},8,["disabled"]))]),p(F,{options:_.value},{default:d(()=>[_.value.messageType==="invalid"?(s(),u("div",he,we)):x("",!0)]),_:1},8,["options"])]),(s(!0),u(P,null,B(m(H),(e,S)=>(s(),u("div",{class:"card",key:e.metadata.name},[a("h2",ge,[p(ee,{icon:e.metadata.icon},null,8,["icon"]),a("span",null,k(e.metadata.name)+" Hardware Wallet (awaiting release)",1)]),a("div",ye,[a("div",fe,[p(h,{disabled:e.metadata.disabled,onClick:r=>M(e),icon:e.metadata.icon,class:"main",glow:!0,color:"#81a1c1"},{default:d(()=>[w(k(e.metadata.disabled?`${e.metadata.name} not supported for this browser`:`Connect with ${e.metadata.name}`),1)]),_:2},1032,["disabled","onClick","icon"]),e.metadata.componentSettings?(s(),c(h,{key:0,icon:m(ae),class:"secondary",onClick:r=>I.value=S},null,8,["icon","onClick"])):x("",!0)]),a("div",ke,[(s(!0),u(P,null,B(e.metadata.actions,r=>(s(),c(h,te({key:r.name},r),{default:d(()=>[w(k(r.name),1)]),_:2},1040))),128))]),e.metadata.componentSettings?(s(),c(ne,{key:0,background:!0},{default:d(()=>[I.value===S?(s(),u("div",xe,[a("div",be,[a("div",Ce,[Ie,p(se,{onExit:t[2]||(t[2]=r=>I.value=-1)})]),(s(),c(le(e.metadata.componentSettings)))])])):x("",!0)]),_:2},1024)):x("",!0)])]))),128)),a("div",Ae,[We,p(K,{modelValue:C.value,"onUpdate:modelValue":t[3]||(t[3]=e=>C.value=e),submit:N},null,8,["modelValue"])])]))}});var Pe=O(Ve,[["__scopeId","data-v-e97237ac"]]);export{Pe as default};
//# sourceMappingURL=AddWallet.9de68419.js.map