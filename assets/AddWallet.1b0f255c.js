import{_ as q,Q as O,R as $,B as o,S as F,U as L,V as C,X as N,Y as T,x as M,Z as U,k as D,$ as G,a0 as R,a1 as X}from"./index.67dff84e.js";import{O as Y}from"./OverlayPrompt.a3615b7d.js";import{Y as j,d as i,e as H,o as p,c as b,a as e,s as n,y,x as d,u as m,a7 as c,X as w,F as J,n as K,a3 as Q,a4 as Z,a5 as z}from"./vendor.284ce6b0.js";import{I as aa}from"./launch.a850f84b.js";const k=_=>(Q("data-v-6960c506"),_=_(),Z(),_),ea={class:"add-wallet flex-column"},sa={class:"card"},ta=k(()=>e("h2",{style:{display:"flex","justify-content":"space-between"}},[e("span",null,"Passphrase"),e("span",null,"Key file")],-1)),la={class:"flex-column"},na=k(()=>e("div",null,null,-1)),oa=c("Create new wallet"),ia=c("Import passphrase"),da={class:"flex-row",style:{"align-items":"center"}},ca={class:"flex-column"},ra={class:"flex-row"},ua=c("Verify address"),pa=["href"],ma=c("Purchase | affiliate link"),_a={class:"card"},ha=k(()=>e("h2",null,"Address Only",-1)),va=j({setup(_){const r=z(),l=i(""),f=i(""),h=i(void 0),g=H(()=>l.value.trim().split(/\s+/g).length>=12),v=i(!1),x=i(!1),u=i(null),W=async()=>{v.value=!0,l.value=await L();const s=C(l.value);setTimeout(async()=>u.value=await s,1e4)},P=()=>{r.push({name:"EditWallet",query:{wallet:u.value}})},I=async()=>{x.value=!0;const s=C(l.value);h.value={icon:"loader",message:"importing"},r.push({name:"EditWallet",query:{wallet:await s}})},V=async()=>{if(await N(l.value))return I();h.value={message:"This passphrase is not valid, do you want to import it anyway?",actions:[{name:"Back",run:()=>h.value=void 0},{name:"Import Passphrase",run:()=>I()}]}},A=async s=>{if(!s)return;const t=await T(JSON.parse(await s[0].text()));r.push({name:"EditWallet",query:{wallet:t}})},B=async s=>{const t=await R(s);r.push({name:"EditWallet",query:{wallet:t}})},S=[X],E={icon:M,run:async()=>{const s=await U(f.value);r.push({name:"EditWallet",query:{wallet:s}})}};return(s,t)=>(p(),b("div",ea,[e("div",sa,[ta,e("div",la,[n(O,{modelValue:l.value,"onUpdate:modelValue":t[0]||(t[0]=a=>l.value=a),onFiles:A,disabled:v.value,placeholder:"Import passphrase or key file"},null,8,["modelValue","disabled"]),na,!v.value&&!l.value.length?(p(),y(o,{key:0,onClick:t[1]||(t[1]=a=>W()),disabled:l.value.length&&!m(g),icon:m($),class:"main"},{default:d(()=>[oa]),_:1},8,["disabled","icon"])):v.value?(p(),y(o,{key:1,disabled:u.value==null,onClick:P,icon:u.value==null?"loader":"",class:"main"},{default:d(()=>[c(w(u.value==null?"Generating, write down the passphrase":"Passphrase saved? Click here to proceed"),1)]),_:1},8,["disabled","icon"])):(p(),y(o,{key:2,disabled:!m(g)||x.value,onClick:V,class:"main"},{default:d(()=>[ia]),_:1},8,["disabled"]))]),n(Y,{options:h.value},null,8,["options"])]),(p(),b(J,null,K(S,a=>e("div",{class:"card",key:a.metadata.name},[e("h2",da,[n(D,{icon:a.metadata.icon},null,8,["icon"]),e("span",null,w(a.metadata.name)+" Hardware Wallet",1)]),e("div",ca,[n(o,{disabled:!a.metadata.isSupported,onClick:fa=>B(a),icon:a.metadata.icon,class:"main"},{default:d(()=>[c(w(a.metadata.isSupported?`Connect with ${a.metadata.name}`:`${a.metadata.name} not supported for this browser`),1)]),_:2},1032,["disabled","onClick","icon"]),e("div",ra,[n(o,{icon:m(G),onClick:a.metadata.verify},{default:d(()=>[ua]),_:2},1032,["icon","onClick"]),e("a",{href:a.metadata.link,target:"_blank",class:"reset"},[n(o,{icon:m(aa)},{default:d(()=>[ma]),_:1},8,["icon"])],8,pa)])])])),64)),e("div",_a,[ha,n(F,{modelValue:f.value,"onUpdate:modelValue":t[2]||(t[2]=a=>f.value=a),actions:[E]},null,8,["modelValue","actions"])])]))}});var xa=q(va,[["__scopeId","data-v-6960c506"]]);export{xa as default};
//# sourceMappingURL=AddWallet.1b0f255c.js.map
