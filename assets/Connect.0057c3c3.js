var me=Object.defineProperty,fe=Object.defineProperties;var pe=Object.getOwnPropertyDescriptors;var X=Object.getOwnPropertySymbols;var xe=Object.prototype.hasOwnProperty,he=Object.prototype.propertyIsEnumerable;var G=(e,a,s)=>a in e?me(e,a,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[a]=s,K=(e,a)=>{for(var s in a||(a={}))xe.call(a,s)&&G(e,s,a[s]);if(X)for(var s of X(a))he.call(a,s)&&G(e,s,a[s]);return e},O=(e,a)=>fe(e,pe(a));import{W as T,X as ge,e as h,d as S,a8 as ye,ak as we,w as E,o as t,c as o,q as v,s as C,D as f,$ as Q,aa as P,n as $e,u,P as j,a1 as A,a2 as D,a as c,F as $,k as z,i as ke,x as k,V,z as Ie,C as be,T as Ve,a5 as M,t as Ce}from"./vendor.864071fb.js";import{_ as I,j as Y,k as J,e as Z,W as B,l as N,m as Se,I as ee,h as Te,o as ze,T as Be,p as te,q as ae,r as se,s as ne,t as Ee,v as Me,w as oe,x as le,y as ie}from"./index.77c80902.js";import{I as ce}from"./y.dc90e8e0.js";const We={class:"margin fade-list-item",key:"margin1"},Le={class:"margin fade-list-item",key:"margin2"},je=T({props:{modelValue:null,options:null},emits:["update:modelValue"],setup(e,{emit:a}){const s=e,n=ge("transitionState",null),d=h({get(){return s.modelValue},set(i){a("update:modelValue",i)}}),l=S(null),_=h(()=>{var i;return((i=l.value)==null?void 0:i.children)?Array(...l.value.children).filter(g=>!g.classList.contains("margin")):[]}),p=h(()=>{var i;return{"--position":((i=s.options)==null?void 0:i.position)||"start"}}),w=async i=>{var x,y;if(d.value==null)return;s.options.ignoreTransition||await Y(()=>!n.running);const g=Math.max(d.value||0,0);(y=_.value[g])==null||y.scrollIntoView({behavior:i?"instant":"smooth",block:"start",inline:((x=s.options)==null?void 0:x.position)||"start"})};return ye(async()=>{await we(),await Y(()=>_.value.length),setTimeout(()=>w(s.options.immediate)),E(d,()=>w())}),(i,g)=>(t(),o("div",{ref_key:"root",ref:l,class:"carousel flex-row no-scrollbar",style:$e(u(p))},[v(P,{name:"fade-list"},{default:C(()=>{var x,y;return[((x=e.options)==null?void 0:x.overscroll)?(t(),o("div",We)):f("",!0),Q(i.$slots,"default",{},void 0,!0),((y=e.options)==null?void 0:y.overscroll)?(t(),o("div",Le)):f("",!0)]}),_:3})],4))}});var de=I(je,[["__scopeId","data-v-2acccaa4"]]);const ue=e=>(A("data-v-7b045f16"),e=e(),D(),e),Ne={class:"wallet-selector"},Pe=ue(()=>c("div",{class:"exit-background"},null,-1)),Ae=ue(()=>c("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor"},[c("path",{d:"M0 0h24v24H0V0z",fill:"none"}),c("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"})],-1)),De=[Pe,Ae],Fe=T({props:{modelValue:String,default:String,exit:Boolean,active:Boolean},emits:["update:modelValue","selectWallet","exit"],setup(e,{emit:a}){const s=e,n=h({get(){return s.modelValue||s.default},set(l){a("update:modelValue",l)}}),d=h(()=>{var l;return(l=J(n.value))==null?void 0:l.key});return(l,_)=>(t(),o("div",Ne,[u(n)?(t(),o("button",{key:0,type:"button",onClick:_[0]||(_[0]=p=>l.$emit("selectWallet")),class:j(["tab",{active:e.active}])},[v(Z,{address:u(d)},null,8,["address"])],2)):f("",!0),e.exit?(t(),o("button",{key:1,class:"exit",type:"button",onClick:_[1]||(_[1]=p=>l.$emit("exit"))},De)):f("",!0)]))}});var He=I(Fe,[["__scopeId","data-v-7b045f16"]]);const Ue={class:"wallet-tabs"},Re=["onClick"],qe=T({props:["modelValue"],emits:["update:modelValue"],setup(e,{emit:a}){const s=e,n=h({get(){return s.modelValue},set(l){a("update:modelValue",l)}}),d=h(()=>B.value.findIndex(l=>l.id===n.value));return(l,_)=>(t(),o("div",Ue,[v(de,{modelValue:u(d),"onUpdate:modelValue":_[0]||(_[0]=p=>ke(d)?d.value=p:null),options:{position:"center",overscroll:!0}},{default:C(()=>[(t(!0),o($,null,z(u(B),p=>(t(),o("button",{key:p.id,type:"button",onClick:w=>n.value=p.id,class:j(["tab",{active:p.id==u(n)}])},[v(Z,{address:p.key},null,8,["address"])],10,Re))),128))]),_:1},8,["modelValue"])]))}});var re=I(qe,[["__scopeId","data-v-75b95e65"]]);const Xe={class:"icon-background"},Ge={props:["icon","img"],setup(e){return(a,s)=>(t(),o("div",Xe,[e.img?(t(),k(N,{key:0,class:"page-logo",icon:e.img},null,8,["icon"])):(t(),k(N,{key:1,class:"page-logo placeholder",icon:e.icon},null,8,["icon"]))]))}};var ve=I(Ge,[["__scopeId","data-v-7bef1ba0"]]);const _e=e=>(A("data-v-9a5c4e1a"),e=e(),D(),e),Ke=_e(()=>c("path",{d:"M24 24H0V0h24v24z",fill:"none",opacity:".87"},null,-1)),Oe=_e(()=>c("path",{d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"},null,-1)),Qe=[Ke,Oe],Ye={props:["modelValue"],emits:["update:modelValue"],setup(e,{emit:a}){const s=e,n=h({get(){return s.modelValue},set(d){a("update:modelValue",d)}});return(d,l)=>(t(),o("button",{type:"button",class:"expand",onClick:l[0]||(l[0]=_=>n.value=!u(n))},[(t(),o("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",class:j({expanded:u(n)})},Qe,2))]))}};var Je=I(Ye,[["__scopeId","data-v-9a5c4e1a"]]);const Ze={class:"actions-list flex-row"},et=["onClick"],tt={props:["actions"],setup(e){return(a,s)=>(t(),o("div",Ze,[(t(!0),o($,null,z(e.actions,n=>(t(),o("button",{key:n.name,onClick:n.run,type:"button",class:"action flex-row"},[v(N,{icon:n.icon},null,8,["icon"]),c("div",null,V(n.name),1)],8,et))),128))]))}};var F=I(tt,[["__scopeId","data-v-99d382fa"]]);const at={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"#FFF"},st=c("path",{d:"M0 0h24v24H0V0z",fill:"none"},null,-1),nt=c("path",{d:"M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"},null,-1),ot=[st,nt];function lt(e,a){return t(),o("svg",at,ot)}var it={render:lt};const ct={class:"flex-row"},dt={class:"flex-row",style:{flex:"1 1 0"}},ut={class:"content"},rt={class:"title"},vt={class:"secondary-text"},_t={props:["data"],setup(e){return(a,s)=>(t(),o("div",{class:j(["notification",{expanded:e.data.expanded}])},[c("div",ct,[c("div",dt,[v(ve,{icon:e.data.icon||u(it),img:e.data.img},null,8,["icon","img"]),c("div",ut,[e.data.expanded?(t(),k(Se,{key:0,class:"secondary-text",timestamp:e.data.timestamp},null,8,["timestamp"])):f("",!0),c("div",rt,V(e.data.title),1),c("div",vt,[Q(a.$slots,"default",{},void 0,!0)]),e.data.expanded?(t(),k(F,{key:1,actions:e.data.actions},null,8,["actions"])):f("",!0)])]),v(Je,{modelValue:e.data.expanded,"onUpdate:modelValue":s[0]||(s[0]=n=>e.data.expanded=n)},null,8,["modelValue"])])],2))}};var mt=I(_t,[["__scopeId","data-v-7ece1c50"]]);const ft={class:"tx-card-extension"},pt={key:0,class:"flex-row",style:{"justify-content":"space-between"}},xt={key:0},ht={key:1},gt={key:1,class:"tags secondary-text"},yt={props:["tx"],setup(e){return h(()=>ee.breakpoints.verticalLayout),(a,s)=>(t(),o("div",ft,[e.tx.tags.length||e.tx.data_size?(t(),o("div",pt,[e.tx.tags.length?(t(),o("div",xt,"Tags:")):f("",!0),e.tx.data_size?(t(),o("div",ht,"Data: "+V(u(Te)(e.tx.data_size)),1)):f("",!0)])):f("",!0),e.tx.tags.length?(t(),o("ul",gt,[(t(!0),o($,null,z(e.tx.tags,n=>(t(),o("li",null,V(n.name+" | "+n.value),1))),256))])):f("",!0)]))}};var wt=I(yt,[["__scopeId","data-v-5ae3361a"]]);const $t={class:"permission-card"},kt=M(" Share the public key "),It=M(" Share the arweave config "),bt=M(" Sign data "),Vt=M(" Decrypt data "),Ct=T({props:{messageEntry:null},setup(e){const a=e,s=S(null),n=h(()=>{var w,i,g,x;if(((w=s.value)==null?void 0:w.method)!=="signTransaction")return;const _=(g=(i=s.value)==null?void 0:i.params)==null?void 0:g[0],p=(x=_.tags)==null?void 0:x.map(({name:y,value:W})=>({name:window.atob(y),value:window.atob(W)}));return O(K({},_),{tags:p})});E(()=>a.messageEntry,async()=>{s.value=await ze(a.messageEntry)},{immediate:!0});const d=[{name:"Accept",icon:ce,run:()=>a.messageEntry.status="accepted"},{name:"Reject",icon:te,run:()=>a.messageEntry.status="rejected"}],l=[{name:"Pending",icon:ae,run:()=>{}}];return(_,p)=>{var w,i,g,x,y;return Ie((t(),o("div",$t,[((w=s.value)==null?void 0:w.method)==="signTransaction"?(t(),o($,{key:0},[v(Be,{tx:u(n)},null,8,["tx"]),v(wt,{tx:u(n)},null,8,["tx"])],64)):((i=s.value)==null?void 0:i.method)==="getPublicKey"?(t(),o($,{key:1},[kt],64)):((g=s.value)==null?void 0:g.method)==="getArweaveConfig"?(t(),o($,{key:2},[It],64)):((x=s.value)==null?void 0:x.method)==="sign"?(t(),o($,{key:3},[bt],64)):((y=s.value)==null?void 0:y.method)==="decrypt"?(t(),o($,{key:4},[Vt],64)):f("",!0),v(Ve,{name:"fade",mode:"out-in"},{default:C(()=>[e.messageEntry.status?(t(),k(F,{key:1,actions:l})):(t(),k(F,{key:0,actions:d}))]),_:1})],512)),[[be,s.value]])}}});var St=I(Ct,[["__scopeId","data-v-0e1a76fc"]]);const Tt={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"#fff"},zt=c("path",{d:"M0 0h24v24H0V0z",fill:"none"},null,-1),Bt=c("path",{d:"M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"},null,-1),Et=[zt,Bt];function Mt(e,a){return t(),o("svg",Tt,Et)}var Wt={render:Mt};const Lt=e=>(A("data-v-6a87fcc8"),e=e(),D(),e),jt={class:"connection-card flex-column no-scrollbar"},Nt={class:"flex-row"},Pt=["disabled"],At={style:{"min-width":"0"}},Dt={class:"ellipsis"},Ft={class:"secondary-text ellipsis"},Ht={class:"flex-column",style:{flex:"1 1 0"}},Ut={class:"container"},Rt={class:"container-scroll"},qt={key:0},Xt={class:"box status fade-list-item",key:"1"},Gt={key:1},Kt=Lt(()=>c("div",{class:"box status fade-list-item",key:"0"},"WIP",-1)),Ot=T({props:{state:null},setup(e){var U;const a=e,s=(U=B.value[0])==null?void 0:U.id;h(()=>B.value.map(r=>r.key));const n=S(a.state.walletId||s);h(()=>J(s));const d=[{name:"Requests",color:"var(--orange)"},{name:"Permissions",color:"var(--green)"}],l=S(n.value?d[0].name:null);E(()=>a.state.walletId,r=>{!r||(i.value=!1,n.value=r,l.value=d[0].name)});const _=()=>a.state.walletId=!1,p=()=>{i.value=!1,a.state.walletId=n.value+""},w=()=>{!a.state.walletId||(i.value=!1,n.value=a.state.walletId)},i=S(!a.state.walletId),g=()=>{var r;if(!i.value){i.value=!0;return}n.value=a.state.walletId||((r=B.value[0])==null?void 0:r.id),i.value=!1},x=h(()=>{var m;const r=a.state.walletId?`Switch to ${n.value}`:`Connect to ${((m=a.state.appInfo)==null?void 0:m.name)||a.state.origin} from the account ${n.value}`;return{title:a.state.walletId?"Switch":"Connect",timestamp:Date.now(),actions:[{name:"Connect",icon:ce,run:p},{name:a.state.walletId?"Cancel":"Switch",icon:te,run:a.state.walletId?w:g}],expanded:!0,content:r}}),y=h(()=>{var r;return n.value!==a.state.walletId?[]:(r=a.state.messageQueue)==null?void 0:r.filter(m=>!m.fulfilled)});Ce(ee.breakpoints,"verticalLayout");const W=S(null),H=(r,m)=>W.value=r-m;return E(()=>d.findIndex(r=>r.name===l.value),H),E(()=>B.value.findIndex(r=>r.id===n.value),H),(r,m)=>{var R,q;return t(),o("div",jt,[c("div",Nt,[c("button",{type:"button",class:"info flex-row",onClick:m[0]||(m[0]=(...b)=>u(se)&&u(se)(...b)),disabled:!u(ne)(e.state.origin,e.state.session)},[v(ve,{img:(R=e.state.appInfo)==null?void 0:R.logo,icon:u(ae)},null,8,["img","icon"]),c("div",At,[c("div",Dt,V(((q=e.state.appInfo)==null?void 0:q.name)||"Connector"),1),c("div",Ft,V(e.state.origin),1)]),u(ne)(e.state.origin,e.state.session)?(t(),k(N,{key:0,icon:u(Wt)},null,8,["icon"])):f("",!0)],8,Pt),v(He,{modelValue:e.state.walletId,"onUpdate:modelValue":m[1]||(m[1]=b=>e.state.walletId=b),default:u(s),exit:!0,active:!i.value,onSelectWallet:g,onExit:_},null,8,["modelValue","default","active"])]),c("div",Ht,[v(Ee,{tabs:d,modelValue:l.value,"onUpdate:modelValue":m[2]||(m[2]=b=>l.value=b),disabled:!n.value},null,8,["modelValue","disabled"]),c("div",Ut,[c("div",Rt,[v(Me,{vector:W.value,axis:"x"},{default:C(()=>[(t(),o("div",{key:(n.value||"")+l.value,class:"content"},[l.value==="Requests"?(t(),o("div",qt,[v(P,{name:"fade-list"},{default:C(()=>{var b;return[i.value?(t(),k(re,{modelValue:n.value,"onUpdate:modelValue":m[3]||(m[3]=L=>n.value=L),class:"box fade-list-item",key:"0"},null,8,["modelValue"])):f("",!0),((b=u(y))==null?void 0:b.length)===0&&e.state.walletId&&e.state.walletId===n.value?(t(),o("div",Xt,"Connected")):f("",!0),n.value!==e.state.walletId?(t(),k(mt,{data:u(x),class:"box fade-list-item",key:"2"},{default:C(()=>[M(V(u(x).content),1)]),_:1},8,["data"])):f("",!0),(t(!0),o($,null,z(u(y),L=>(t(),k(St,{key:L.uuid,messageEntry:L,style:{padding:"var(--spacing)"},class:"box flex-column fade-list-item"},null,8,["messageEntry"]))),128))]}),_:1})])):l.value==="Permissions"?(t(),o("div",Gt,[v(P,{name:"fade-list"},{default:C(()=>[i.value?(t(),k(re,{modelValue:n.value,"onUpdate:modelValue":m[4]||(m[4]=b=>n.value=b),class:"box fade-list-item",key:"0"},null,8,["modelValue"])):f("",!0),Kt]),_:1})])):f("",!0)]))]),_:1},8,["vector"])])])])])}}});var Qt=I(Ot,[["__scopeId","data-v-6a87fcc8"]]);const Yt={class:"connect flex-column"},Jt={class:"bottom-info secondary-text",style:{opacity:"0.0","pointer-events":"none"}},Zt=T({setup(e){const a=S(oe.value.findIndex(s=>s.origin===le.origin&&s.session===le.session));return(s,n)=>(t(),o("div",Yt,[v(de,{modelValue:a.value,"onUpdate:modelValue":n[0]||(n[0]=d=>a.value=d),options:{position:"start",overscroll:!0,ignoreTransition:!0},class:"connectors"},{default:C(()=>[(t(!0),o($,null,z(u(oe),d=>(t(),o("div",{key:d.session,class:"connection-card-container fade-list-item"},[v(Qt,{state:d,class:"box"},null,8,["state"])]))),128))]),_:1},8,["modelValue"]),c("div",Jt,[c("div",null,"All Channels "+V(Object.keys(u(ie)).length),1),(t(!0),o($,null,z(u(ie),(d,l)=>(t(),o("div",{key:l},V(d),1))),128))])]))}});var na=I(Zt,[["__scopeId","data-v-cfe1c1a6"]]);export{na as default};
//# sourceMappingURL=Connect.0057c3c3.js.map
