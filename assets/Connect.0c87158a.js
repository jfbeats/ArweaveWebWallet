var pe=Object.defineProperty,ge=Object.defineProperties;var ye=Object.getOwnPropertyDescriptors;var G=Object.getOwnPropertySymbols;var he=Object.prototype.hasOwnProperty,xe=Object.prototype.propertyIsEnumerable;var Q=(e,t,s)=>t in e?pe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,Y=(e,t)=>{for(var s in t||(t={}))he.call(t,s)&&Q(e,s,t[s]);if(G)for(var s of G(t))xe.call(t,s)&&Q(e,s,t[s]);return e},J=(e,t)=>ge(e,ye(t));import{W,X as we,e as g,d as z,a8 as ke,ak as $e,w as M,a9 as Ie,o as a,c as l,q as _,s as C,D as y,$ as Z,aa as j,n as D,u as r,P as N,a1 as F,a2 as H,a as c,F as k,k as L,i as be,x as S,V as I,z as Ve,C as Ce,T as Se,a5 as P,t as Te}from"./vendor.864071fb.js";import{_ as b,j as ee,k as O,e as te,W as B,l as A,m as ze,I as ae,h as Be,o as We,T as Le,p as se,q as ne,r as le,s as oe,t as Ee,v as ie,w as ce,x as de,y as re}from"./index.a29cafa2.js";import{I as ue}from"./y.dc90e8e0.js";const Me={class:"margin fade-list-item",key:"margin1"},Pe={class:"margin fade-list-item",key:"margin2"},je=W({props:{modelValue:null,options:null},emits:["update:modelValue"],setup(e,{emit:t}){const s=e,n=we("transitionState",null),d=g({get(){return s.modelValue},set(i){t("update:modelValue",i)}}),o=z(null),u=i=>{if(!(!i||!o.value))return s.options.align==="center"?i.offsetLeft+i.offsetWidth/2-o.value.offsetWidth/2:s.options.align==="end"?i.offsetLeft+i.offsetWidth-o.value.offsetWidth:i.offsetLeft},m=g(()=>{var i;return $.value,((i=o.value)==null?void 0:i.children)?Array(...o.value.children).filter(w=>!w.classList.contains("margin")):[]}),x=g(()=>{var i;return{"--position":((i=s.options)==null?void 0:i.align)||"start"}}),f=async(i,w)=>{var T;!w&&s.options.awaitTransition&&await ee(()=>!n.running),i=Math.max(i||0,0),(T=o.value)==null||T.scroll({left:u(m.value[i]),behavior:w?"instant":"smooth"})};let h;const $=z(0);return ke(async()=>{h=new MutationObserver(async()=>{$.value++}),h.observe(o.value,{subtree:!1,childList:!0}),await $e(),await ee(()=>m.value.length),setTimeout(()=>{const i=!s.options.immediate&&d.value&&d.value>0||!1;f(i?0:d.value,!0),M(d,w=>f(w),{immediate:i})})}),Ie(()=>h&&h.disconnect()),(i,w)=>(a(),l("div",{ref_key:"root",ref:o,class:"carousel flex-row no-scrollbar",style:D(r(x))},[_(j,{name:"fade-list"},{default:C(()=>{var T,E;return[((T=e.options)==null?void 0:T.overscroll)?(a(),l("div",Me)):y("",!0),Z(i.$slots,"default",{},void 0,!0),((E=e.options)==null?void 0:E.overscroll)?(a(),l("div",Pe)):y("",!0)]}),_:3})],4))}});var ve=b(je,[["__scopeId","data-v-db91b436"]]);const _e=e=>(F("data-v-7b045f16"),e=e(),H(),e),Ne={class:"wallet-selector"},Ae=_e(()=>c("div",{class:"exit-background"},null,-1)),De=_e(()=>c("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor"},[c("path",{d:"M0 0h24v24H0V0z",fill:"none"}),c("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"})],-1)),Fe=[Ae,De],He=W({props:{modelValue:String,default:String,exit:Boolean,active:Boolean},emits:["update:modelValue","selectWallet","exit"],setup(e,{emit:t}){const s=e,n=g({get(){return s.modelValue||s.default},set(o){t("update:modelValue",o)}}),d=g(()=>{var o;return(o=O(n.value))==null?void 0:o.key});return(o,u)=>(a(),l("div",Ne,[r(n)?(a(),l("button",{key:0,type:"button",onClick:u[0]||(u[0]=m=>o.$emit("selectWallet")),class:N(["tab",{active:e.active}])},[_(te,{address:r(d)},null,8,["address"])],2)):y("",!0),e.exit?(a(),l("button",{key:1,class:"exit",type:"button",onClick:u[1]||(u[1]=m=>o.$emit("exit"))},Fe)):y("",!0)]))}});var Oe=b(He,[["__scopeId","data-v-7b045f16"]]);const Re={class:"wallet-tabs"},Ue=["onClick"],qe=W({props:["modelValue"],emits:["update:modelValue"],setup(e,{emit:t}){const s=e,n=g({get(){return s.modelValue},set(o){t("update:modelValue",o)}}),d=g(()=>B.value.findIndex(o=>o.id===n.value));return(o,u)=>(a(),l("div",Re,[_(ve,{modelValue:r(d),"onUpdate:modelValue":u[0]||(u[0]=m=>be(d)?d.value=m:null),options:{align:"center",overscroll:!0,immediate:!0}},{default:C(()=>[(a(!0),l(k,null,L(r(B),m=>(a(),l("button",{key:m.id,type:"button",onClick:x=>n.value=m.id,class:N(["tab",{active:m.id==r(n)}])},[_(te,{address:m.key},null,8,["address"])],10,Ue))),128))]),_:1},8,["modelValue"])]))}});var Ke=b(qe,[["__scopeId","data-v-0aced8d6"]]);const Xe={class:"icon-background"},Ge={props:["icon","img"],setup(e){return(t,s)=>(a(),l("div",Xe,[e.img?(a(),S(A,{key:0,class:"page-logo",icon:e.img},null,8,["icon"])):(a(),S(A,{key:1,class:"page-logo placeholder",icon:e.icon},null,8,["icon"]))]))}};var me=b(Ge,[["__scopeId","data-v-7bef1ba0"]]);const fe=e=>(F("data-v-9a5c4e1a"),e=e(),H(),e),Qe=fe(()=>c("path",{d:"M24 24H0V0h24v24z",fill:"none",opacity:".87"},null,-1)),Ye=fe(()=>c("path",{d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"},null,-1)),Je=[Qe,Ye],Ze={props:["modelValue"],emits:["update:modelValue"],setup(e,{emit:t}){const s=e,n=g({get(){return s.modelValue},set(d){t("update:modelValue",d)}});return(d,o)=>(a(),l("button",{type:"button",class:"expand",onClick:o[0]||(o[0]=u=>n.value=!r(n))},[(a(),l("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",class:N({expanded:r(n)})},Je,2))]))}};var et=b(Ze,[["__scopeId","data-v-9a5c4e1a"]]);const tt={class:"actions-list flex-row"},at=["onClick"],st={props:["actions"],setup(e){return(t,s)=>(a(),l("div",tt,[(a(!0),l(k,null,L(e.actions,n=>(a(),l("button",{key:n.name,onClick:n.run,type:"button",class:"action flex-row"},[_(A,{icon:n.icon},null,8,["icon"]),c("div",null,I(n.name),1)],8,at))),128))]))}};var R=b(st,[["__scopeId","data-v-99d382fa"]]);const nt={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"#FFF"},lt=c("path",{d:"M0 0h24v24H0V0z",fill:"none"},null,-1),ot=c("path",{d:"M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"},null,-1),it=[lt,ot];function ct(e,t){return a(),l("svg",nt,it)}var dt={render:ct};const rt={class:"flex-row"},ut={class:"flex-row",style:{flex:"1 1 0"}},vt={class:"content"},_t={class:"title"},mt={class:"secondary-text"},ft={props:["data"],setup(e){return(t,s)=>(a(),l("div",{class:N(["notification",{expanded:e.data.expanded}])},[c("div",rt,[c("div",ut,[_(me,{icon:e.data.icon||r(dt),img:e.data.img},null,8,["icon","img"]),c("div",vt,[e.data.expanded?(a(),S(ze,{key:0,class:"secondary-text",timestamp:e.data.timestamp},null,8,["timestamp"])):y("",!0),c("div",_t,I(e.data.title),1),c("div",mt,[Z(t.$slots,"default",{},void 0,!0)]),e.data.expanded?(a(),S(R,{key:1,actions:e.data.actions},null,8,["actions"])):y("",!0)])]),_(et,{modelValue:e.data.expanded,"onUpdate:modelValue":s[0]||(s[0]=n=>e.data.expanded=n)},null,8,["modelValue"])])],2))}};var pt=b(ft,[["__scopeId","data-v-7ece1c50"]]);const gt={class:"tx-card-extension"},yt={key:0,class:"flex-row",style:{"justify-content":"space-between"}},ht={key:0},xt={key:1},wt={key:1,class:"tags secondary-text"},kt={props:["tx"],setup(e){return g(()=>ae.breakpoints.verticalLayout),(t,s)=>(a(),l("div",gt,[e.tx.tags.length||e.tx.data_size?(a(),l("div",yt,[e.tx.tags.length?(a(),l("div",ht,"Tags:")):y("",!0),e.tx.data_size?(a(),l("div",xt,"Data: "+I(r(Be)(e.tx.data_size)),1)):y("",!0)])):y("",!0),e.tx.tags.length?(a(),l("ul",wt,[(a(!0),l(k,null,L(e.tx.tags,n=>(a(),l("li",null,I(n.name+" | "+n.value),1))),256))])):y("",!0)]))}};var $t=b(kt,[["__scopeId","data-v-5ae3361a"]]);const It={class:"permission-card"},bt=P(" Share the public key "),Vt=P(" Share the arweave config "),Ct=P(" Sign data "),St=P(" Decrypt data "),Tt=W({props:{messageEntry:null},setup(e){const t=e,s=z(null),n=g(()=>{var x,f,h,$;if(((x=s.value)==null?void 0:x.method)!=="signTransaction")return;const u=(h=(f=s.value)==null?void 0:f.params)==null?void 0:h[0],m=($=u.tags)==null?void 0:$.map(({name:i,value:w})=>({name:window.atob(i),value:window.atob(w)}));return J(Y({},u),{tags:m})});M(()=>t.messageEntry,async()=>{s.value=await We(t.messageEntry)},{immediate:!0});const d=[{name:"Accept",icon:ue,run:()=>t.messageEntry.status="accepted"},{name:"Reject",icon:se,run:()=>t.messageEntry.status="rejected"}],o=[{name:"Pending",icon:ne,run:()=>{}}];return(u,m)=>{var x,f,h,$,i;return Ve((a(),l("div",It,[((x=s.value)==null?void 0:x.method)==="signTransaction"?(a(),l(k,{key:0},[_(Le,{tx:r(n)},null,8,["tx"]),_($t,{tx:r(n)},null,8,["tx"])],64)):((f=s.value)==null?void 0:f.method)==="getPublicKey"?(a(),l(k,{key:1},[bt],64)):((h=s.value)==null?void 0:h.method)==="getArweaveConfig"?(a(),l(k,{key:2},[Vt],64)):(($=s.value)==null?void 0:$.method)==="sign"?(a(),l(k,{key:3},[Ct],64)):((i=s.value)==null?void 0:i.method)==="decrypt"?(a(),l(k,{key:4},[St],64)):y("",!0),_(Se,{name:"fade",mode:"out-in"},{default:C(()=>[e.messageEntry.status?(a(),S(R,{key:1,actions:o})):(a(),S(R,{key:0,actions:d}))]),_:1})],512)),[[Ce,s.value]])}}});var zt=b(Tt,[["__scopeId","data-v-0e1a76fc"]]);const Bt={class:"connection-card flex-column no-scrollbar"},Wt={key:"connect"},Lt=W({props:{walletId:null},setup(e){const t=e,s={connect:"Connect automatically",signTransaction:"Sign transaction",getPublicKey:"Share public key",sign:"Sign arbitrary data",decrypt:"Decrypt data",getArweaveConfig:"Share arweave gateway configuration"},n=u=>!u||u.options&&!u.options.permissions?[]:Object.getOwnPropertyNames(Object.getPrototypeOf(u.messageRunner)).filter(m=>u.messageRunner[m]&&m!=="constructor"),d=g(()=>O(t.walletId)),o=g(()=>n(d.value));return(u,m)=>(a(),l("div",Bt,[c("div",Wt,I(r(s).connect),1),(a(!0),l(k,null,L(r(o),x=>(a(),l("div",{key:x},I(r(s)[x]),1))),128))]))}}),Et={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"#fff"},Mt=c("path",{d:"M0 0h24v24H0V0z",fill:"none"},null,-1),Pt=c("path",{d:"M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"},null,-1),jt=[Mt,Pt];function Nt(e,t){return a(),l("svg",Et,jt)}var At={render:Nt};const Dt=e=>(F("data-v-71566a1e"),e=e(),H(),e),Ft={class:"connection-card flex-column no-scrollbar"},Ht={class:"flex-row"},Ot=["disabled"],Rt={style:{"min-width":"0"}},Ut={class:"ellipsis"},qt={class:"secondary-text ellipsis"},Kt={class:"flex-column",style:{flex:"1 1 0"}},Xt={class:"container"},Gt={class:"page-container",key:"0"},Qt={key:0},Yt={class:"status fade-list-item",key:"1"},Jt={key:1},Zt=Dt(()=>c("div",{class:"status fade-list-item",key:"1"},"WIP",-1)),ea=W({props:{state:null},setup(e){var U;const t=e,s=(U=B.value[0])==null?void 0:U.id;g(()=>B.value.map(v=>v.key));const n=z(t.state.walletId||s);g(()=>O(s));const d=[{name:"Requests",color:"var(--orange)"},{name:"Permissions",color:"var(--green)"}],o=z(n.value?d[0].name:null);M(()=>t.state.walletId,v=>{!v||(f.value=!1,n.value=v,o.value=d[0].name)});const u=()=>t.state.walletId=!1,m=()=>{f.value=!1,t.state.walletId=n.value+""},x=()=>{var v;!t.state.walletId||(n.value!==(t.state.walletId||((v=B.value[0])==null?void 0:v.id))&&h.value++,f.value=!1,n.value=t.state.walletId)},f=z(!t.state.walletId),h=z(0),$=()=>{var v,p;if(!f.value){f.value=!0;return}n.value!==(t.state.walletId||((v=B.value[0])==null?void 0:v.id))&&h.value++,n.value=t.state.walletId||((p=B.value[0])==null?void 0:p.id),f.value=!1},i=g(()=>{var p;const v=t.state.walletId?`Switch to ${n.value}`:`Connect to ${((p=t.state.appInfo)==null?void 0:p.name)||t.state.origin} from the account ${n.value}`;return{title:t.state.walletId?"Switch":"Connect",timestamp:Date.now(),actions:[{name:"Connect",icon:ue,run:m},{name:t.state.walletId?"Cancel":"Switch",icon:se,run:t.state.walletId?x:$}],expanded:!0,content:v}}),w=g(()=>{var v;return n.value!==t.state.walletId?[]:(v=t.state.messageQueue)==null?void 0:v.filter(p=>!p.fulfilled)});Te(ae.breakpoints,"verticalLayout");const T=z(null),E=(v,p)=>T.value=v-p;return M(()=>d.findIndex(v=>v.name===o.value),E),M(()=>B.value.findIndex(v=>v.id===n.value),E),(v,p)=>{var q,K;return a(),l("div",Ft,[c("div",Ht,[c("button",{type:"button",class:"info flex-row",onClick:p[0]||(p[0]=(...V)=>r(le)&&r(le)(...V)),disabled:!r(oe)(e.state.origin,e.state.session)},[_(me,{img:(q=e.state.appInfo)==null?void 0:q.logo,icon:r(ne)},null,8,["img","icon"]),c("div",Rt,[c("div",Ut,I(((K=e.state.appInfo)==null?void 0:K.name)||"Connector"),1),c("div",qt,I(e.state.origin),1)]),r(oe)(e.state.origin,e.state.session)?(a(),S(A,{key:0,icon:r(At)},null,8,["icon"])):y("",!0)],8,Ot),_(Oe,{modelValue:e.state.walletId,"onUpdate:modelValue":p[1]||(p[1]=V=>e.state.walletId=V),default:r(s),exit:!0,active:!f.value,onSelectWallet:$,onExit:u},null,8,["modelValue","default","active"])]),c("div",Kt,[_(Ee,{tabs:d,modelValue:o.value,"onUpdate:modelValue":p[2]||(p[2]=V=>o.value=V),disabled:!n.value},null,8,["modelValue","disabled"]),c("div",Xt,[_(ie,{vector:T.value,axis:"x"},{default:C(()=>[(a(),l("div",{class:"container-scroll",key:h.value},[_(j,{name:"fade-list"},{default:C(()=>[f.value?(a(),S(Ke,{modelValue:n.value,"onUpdate:modelValue":p[3]||(p[3]=V=>n.value=V),class:"fade-list-item",key:"-1"},null,8,["modelValue"])):y("",!0),c("div",Gt,[_(ie,{vector:T.value,axis:"x"},{default:C(()=>[(a(),l("div",{key:(n.value||"")+o.value,class:"content"},[o.value==="Requests"?(a(),l("div",Qt,[_(j,{name:"fade-list"},{default:C(()=>{var V;return[c("div",{class:"fade-list-item",key:"0",style:D({padding:0,border:0,outline:"0.5px solid var(--border)"})},null,4),((V=r(w))==null?void 0:V.length)===0&&e.state.walletId&&e.state.walletId===n.value?(a(),l("div",Yt,"Connected")):y("",!0),n.value!==e.state.walletId?(a(),S(pt,{data:r(i),class:"fade-list-item",key:"2"},{default:C(()=>[P(I(r(i).content),1)]),_:1},8,["data"])):y("",!0),(a(!0),l(k,null,L(r(w),X=>(a(),S(zt,{key:X.uuid,messageEntry:X,style:{padding:"var(--spacing)"},class:"flex-column fade-list-item"},null,8,["messageEntry"]))),128))]}),_:1})])):o.value==="Permissions"?(a(),l("div",Jt,[_(j,{name:"fade-list"},{default:C(()=>[c("div",{class:"fade-list-item",key:"0",style:D({padding:0,border:0,outline:"0.5px solid var(--border)"})},null,4),Zt,_(Lt,{walletId:n.value,class:"fade-list-item",key:"2"},null,8,["walletId"])]),_:1})])):y("",!0)]))]),_:1},8,["vector"])])]),_:1})]))]),_:1},8,["vector"])])])])}}});var ta=b(ea,[["__scopeId","data-v-71566a1e"]]);const aa={class:"connect flex-column"},sa={class:"bottom-info secondary-text",style:{opacity:"0.0","pointer-events":"none"}},na=W({setup(e){const t=z(ce.value.findIndex(s=>s.origin===de.origin&&s.session===de.session));return(s,n)=>(a(),l("div",aa,[_(ve,{modelValue:t.value,"onUpdate:modelValue":n[0]||(n[0]=d=>t.value=d),options:{align:"start",overscroll:!0},class:"connectors"},{default:C(()=>[(a(!0),l(k,null,L(r(ce),d=>(a(),l("div",{key:d.session,class:"connection-card-container fade-list-item"},[_(ta,{state:d,class:"box"},null,8,["state"])]))),128))]),_:1},8,["modelValue"]),c("div",sa,[c("div",null,"All Channels "+I(Object.keys(r(re)).length),1),(a(!0),l(k,null,L(r(re),(d,o)=>(a(),l("div",{key:o},I(d),1))),128))])]))}});var da=b(na,[["__scopeId","data-v-7c3f5fef"]]);export{da as default};
//# sourceMappingURL=Connect.0c87158a.js.map
