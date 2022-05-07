import{_ as D,X as E,Y as O,Z as $,B as d,$ as q,a0 as M,a1 as S,a2 as x,a3 as T,C as F,a4 as G,o as L,a5 as N,a6 as j}from"./index.f5f0f36a.js";import{O as H}from"./OverlayPrompt.32ffbf14.js";import{h as K,r as c,d as U,j as r,k as y,l as e,M as n,u as o,G as w,H as u,O as m,P as k,F as R,n as X,a3 as Y,a4 as Z,al as z}from"./vendor.ab685300.js";import{I as J}from"./launch.e3061263.js";const g=p=>(Y("data-v-08350a26"),p=p(),Z(),p),Q={class:"add-wallet flex-column"},aa={class:"card"},ea=g(()=>e("h2",{style:{display:"flex","justify-content":"space-between"}},[e("span",null,"Passphrase"),e("span",null,"Key file")],-1)),sa={class:"flex-column"},ta=g(()=>e("div",null,null,-1)),la=m("Create new wallet"),na=m("Import passphrase"),oa={class:"flex-row",style:{"align-items":"center"}},ia={class:"flex-column"},da={class:"flex-row"},ca=m("Verify address"),ra=["href"],ua=m("Purchase | affiliate link"),ma={class:"card"},pa=g(()=>e("h2",null,"Address Only",-1)),_a=K({setup(p){const _=z(),t=c(""),f=c(""),v=c(void 0),I=U(()=>t.value.trim().split(/\s+/g).length>=12),h=c(!1),b=c(!1),i=c(null),P=async()=>{h.value=!0,t.value=await S();const l=x(t.value);setTimeout(async()=>i.value=await l,1e4)},V=()=>{!i.value||_.push({name:"EditWallet",query:{wallet:i.value.id}})},C=async()=>{b.value=!0;const l=x(t.value);v.value={icon:"loader",message:"importing"},_.push({name:"EditWallet",query:{wallet:(await l).id}})},W=async()=>{if(await T(t.value))return C();v.value={message:"This passphrase is not valid, do you want to import it anyway?",actions:[{name:"Back",run:()=>v.value=void 0},{name:"Import Passphrase",run:()=>C()}]}},A=async l=>{const s=await j(l);_.push({name:"EditWallet",query:{wallet:s.id}})},B={icon:F,run:async()=>{const l=await G(f.value);_.push({name:"EditWallet",query:{wallet:l.id}})}};return(l,s)=>(r(),y("div",Q,[e("div",aa,[ea,e("div",sa,[n(O,{modelValue:t.value,"onUpdate:modelValue":s[0]||(s[0]=a=>t.value=a),onFiles:s[1]||(s[1]=a=>o(E)(a)),disabled:h.value,placeholder:"Import passphrase or key file"},null,8,["modelValue","disabled"]),ta,!h.value&&!t.value.length?(r(),w(d,{key:0,onClick:s[2]||(s[2]=a=>P()),disabled:t.value.length&&!o(I),icon:o($),class:"main"},{default:u(()=>[la]),_:1},8,["disabled","icon"])):h.value?(r(),w(d,{key:1,disabled:i.value==null,onClick:V,icon:i.value==null?"loader":"",class:"main"},{default:u(()=>[m(k(i.value==null?"Generating, write down the passphrase":"Passphrase saved? Click here to proceed"),1)]),_:1},8,["disabled","icon"])):(r(),w(d,{key:2,disabled:!o(I)||b.value,onClick:W,class:"main"},{default:u(()=>[na]),_:1},8,["disabled"]))]),n(H,{options:v.value},null,8,["options"])]),(r(!0),y(R,null,X(o(q),a=>(r(),y("div",{class:"card",key:a.metadata.name},[e("h2",oa,[n(L,{icon:a.metadata.icon},null,8,["icon"]),e("span",null,k(a.metadata.name)+" Hardware Wallet (awaiting release)",1)]),e("div",ia,[n(d,{disabled:a.metadata.disabled,onClick:va=>A(a),icon:a.metadata.icon,class:"main"},{default:u(()=>[m(k(a.metadata.disabled?`${a.metadata.name} not supported for this browser`:`Connect with ${a.metadata.name}`),1)]),_:2},1032,["disabled","onClick","icon"]),e("div",da,[n(d,{icon:o(N),onClick:a.metadata.verify},{default:u(()=>[ca]),_:2},1032,["icon","onClick"]),e("a",{href:a.metadata.link,target:"_blank",class:"reset"},[n(d,{icon:o(J)},{default:u(()=>[ua]),_:1},8,["icon"])],8,ra)])])]))),128)),e("div",ma,[pa,n(M,{modelValue:f.value,"onUpdate:modelValue":s[3]||(s[3]=a=>f.value=a),actions:[B]},null,8,["modelValue","actions"])])]))}});var ka=D(_a,[["__scopeId","data-v-08350a26"]]);export{ka as default};
//# sourceMappingURL=AddWallet.0e8698c3.js.map