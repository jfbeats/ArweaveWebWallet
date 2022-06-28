import{_ as D,Y as E,Z as $,$ as q,B as d,a0 as O,a1 as S,a2 as T,a3 as x,a4 as j,E as F,a5 as L,o as M,a6 as N,a7 as G}from"./index.dfeb5663.js";import{O as K}from"./OverlayPrompt.7efa44c3.js";import{d as U,r as c,c as H,o as r,a as y,e,g as n,u as o,j as w,h as u,V as m,t as g,F as R,f as Y,a3 as Z,a4 as z,aj as J}from"./vendor.cc129a20.js";import{I as Q}from"./launch.943af7ae.js";const k=p=>(Z("data-v-08350a26"),p=p(),z(),p),X={class:"add-wallet flex-column"},aa={class:"card"},ea=k(()=>e("h2",{style:{display:"flex","justify-content":"space-between"}},[e("span",null,"Passphrase"),e("span",null,"Key file")],-1)),sa={class:"flex-column"},ta=k(()=>e("div",null,null,-1)),la=m("Create new wallet"),na=m("Import passphrase"),oa={class:"flex-row",style:{"align-items":"center"}},ia={class:"flex-column"},da={class:"flex-row"},ca=m("Verify address"),ra=["href"],ua=m("Purchase | affiliate link"),ma={class:"card"},pa=k(()=>e("h2",null,"Address Only",-1)),_a=U({setup(p){const _=J(),t=c(""),f=c(""),v=c(void 0),I=H(()=>t.value.trim().split(/\s+/g).length>=12),h=c(!1),b=c(!1),i=c(null),V=async()=>{h.value=!0,t.value=await T();const l=x(t.value);setTimeout(async()=>i.value=await l,1e4)},P=()=>{!i.value||_.push({name:"EditWallet",query:{wallet:i.value.id}})},C=async()=>{b.value=!0;const l=x(t.value);v.value={icon:"loader",message:"importing"},_.push({name:"EditWallet",query:{wallet:(await l).id}})},W=async()=>{if(await j(t.value))return C();v.value={message:"This passphrase is not valid, do you want to import it anyway?",actions:[{name:"Back",run:()=>v.value=void 0},{name:"Import Passphrase",run:()=>C()}]}},A=async l=>{const s=await G(l);_.push({name:"EditWallet",query:{wallet:s.id}})},B={icon:F,run:async()=>{const l=await L(f.value);_.push({name:"EditWallet",query:{wallet:l.id}})}};return(l,s)=>(r(),y("div",X,[e("div",aa,[ea,e("div",sa,[n($,{modelValue:t.value,"onUpdate:modelValue":s[0]||(s[0]=a=>t.value=a),onFiles:s[1]||(s[1]=a=>o(E)(a)),disabled:h.value,placeholder:"Import passphrase or key file"},null,8,["modelValue","disabled"]),ta,!h.value&&!t.value.length?(r(),w(d,{key:0,onClick:s[2]||(s[2]=a=>V()),disabled:t.value.length&&!o(I),icon:o(q),class:"main"},{default:u(()=>[la]),_:1},8,["disabled","icon"])):h.value?(r(),w(d,{key:1,disabled:i.value==null,onClick:P,icon:i.value==null?"loader":"",class:"main"},{default:u(()=>[m(g(i.value==null?"Generating, write down the passphrase":"Passphrase saved? Click here to proceed"),1)]),_:1},8,["disabled","icon"])):(r(),w(d,{key:2,disabled:!o(I)||b.value,onClick:W,class:"main"},{default:u(()=>[na]),_:1},8,["disabled"]))]),n(K,{options:v.value},null,8,["options"])]),(r(!0),y(R,null,Y(o(O),a=>(r(),y("div",{class:"card",key:a.metadata.name},[e("h2",oa,[n(M,{icon:a.metadata.icon},null,8,["icon"]),e("span",null,g(a.metadata.name)+" Hardware Wallet (awaiting release)",1)]),e("div",ia,[n(d,{disabled:a.metadata.disabled,onClick:va=>A(a),icon:a.metadata.icon,class:"main"},{default:u(()=>[m(g(a.metadata.disabled?`${a.metadata.name} not supported for this browser`:`Connect with ${a.metadata.name}`),1)]),_:2},1032,["disabled","onClick","icon"]),e("div",da,[n(d,{icon:o(N),onClick:a.metadata.verify},{default:u(()=>[ca]),_:2},1032,["icon","onClick"]),e("a",{href:a.metadata.link,target:"_blank",class:"reset"},[n(d,{icon:o(Q)},{default:u(()=>[ua]),_:1},8,["icon"])],8,ra)])])]))),128)),e("div",ma,[pa,n(S,{modelValue:f.value,"onUpdate:modelValue":s[3]||(s[3]=a=>f.value=a),actions:[B]},null,8,["modelValue","actions"])])]))}});var ga=D(_a,[["__scopeId","data-v-08350a26"]]);export{ga as default};
//# sourceMappingURL=AddWallet.76eec268.js.map
