import{e as y,d as I,w as K,L as O,o,f as l,k as f,l as C,I as R,N as D,z as L,B as E,g as c,j as u,y as V,s as p,F as T,h as W,p as b,K as h,a as N,x as X,J as Y,T as Q}from"./vendor.035b7bf8.js";import{_ as k,c as z,e as q,i as U,D as Z,T as ee,A,j as te,n as ne,k as ae,l as oe,b as se,m as le,o as F,s as j,p as ce}from"./index.d519af87.js";const de={props:["modelValue"],setup(t,{emit:a}){const n=y({get(){return t.modelValue},set(s){a("update:modelValue",s)}}),e=I(null),i=y(()=>{var s;return((s=e.value)==null?void 0:s.children)?Array(...e.value.children).slice(1,e.value.children.length-1):null}),r=()=>{var s,d;(d=(s=i.value)==null?void 0:s[n.value])==null||d.scrollIntoView({behavior:"smooth",block:"start",inline:"start"})};return K(r),O(()=>setTimeout(r)),{model:n,root:e}}},H=t=>(L("data-v-de8bc108"),t=t(),E(),t),ie={ref:"root",class:"carousel flex-row no-scrollbar"},re=H(()=>c("div",{class:"margin",key:"margin1"},null,-1)),ue=H(()=>c("div",{class:"margin",key:"margin2"},null,-1));function _e(t,a,n,e,i,r){return o(),l("div",ie,[f(D,{name:"fade-list"},{default:C(()=>[re,R(t.$slots,"default",{},void 0,!0),ue]),_:3})],512)}var me=k(de,[["render",_e],["__scopeId","data-v-de8bc108"]]);const ve={components:{AddressIcon:z},props:["modelValue","default","exit","active"],setup(t,{emit:a}){return{model:y({get(){return t.modelValue||t.default},set(e){a("update:modelValue",e)}}),InterfaceStore:q}}},P=t=>(L("data-v-c234a916"),t=t(),E(),t),fe={class:"wallet-selector"},ge=P(()=>c("div",{class:"exit-background"},null,-1)),xe=P(()=>c("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor"},[c("path",{d:"M0 0h24v24H0V0z",fill:"none"}),c("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"})],-1)),ye=[ge,xe];function pe(t,a,n,e,i,r){const s=u("AddressIcon");return o(),l("div",fe,[e.model?(o(),l("button",{key:0,type:"button",onClick:a[0]||(a[0]=d=>t.$emit("selectWallet")),class:V(["tab",{active:n.active}])},[f(s,{address:e.model},null,8,["address"])],2)):p("",!0),n.exit?(o(),l("button",{key:1,class:"exit",type:"button",onClick:a[1]||(a[1]=d=>t.$emit("exit"))},ye)):p("",!0)])}var be=k(ve,[["render",pe],["__scopeId","data-v-c234a916"]]);const ke={components:{AddressIcon:z},props:["addresses","modelValue"],setup(t,{emit:a}){return{model:y({get(){return t.modelValue},set(e){a("update:modelValue",e)}})}}},he={class:"wallet-tabs"},we=["onClick"];function Ie(t,a,n,e,i,r){const s=u("AddressIcon");return o(),l("div",he,[(o(!0),l(T,null,W(n.addresses,d=>(o(),l("button",{key:d,type:"button",onClick:m=>e.model=d,class:V(["tab",{active:d==e.model}])},[f(s,{address:d},null,8,["address"])],10,we))),128))])}var Ce=k(ke,[["render",Ie],["__scopeId","data-v-09215434"]]);const Ve={components:{Icon:U},props:["icon","img"],setup(){}},Ae={class:"icon-background"};function Se(t,a,n,e,i,r){const s=u("Icon");return o(),l("div",Ae,[n.img?(o(),b(s,{key:0,class:"page-logo",icon:n.img},null,8,["icon"])):(o(),b(s,{key:1,class:"page-logo placeholder",icon:n.icon},null,8,["icon"]))])}var G=k(Ve,[["render",Se],["__scopeId","data-v-34c166f1"]]);const Be={props:["modelValue"],setup(t,{emit:a}){return{expanded:y({get(){return t.modelValue},set(e){a("update:modelValue",e)}})}}},J=t=>(L("data-v-52e2fbe0"),t=t(),E(),t),Te=J(()=>c("path",{d:"M24 24H0V0h24v24z",fill:"none",opacity:".87"},null,-1)),We=J(()=>c("path",{d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"},null,-1)),Ne=[Te,We];function $e(t,a,n,e,i,r){return o(),l("button",{type:"button",class:"expand",onClick:a[0]||(a[0]=s=>e.expanded=!e.expanded)},[(o(),l("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",class:V({expanded:e.expanded})},Ne,2))])}var De=k(Be,[["render",$e],["__scopeId","data-v-52e2fbe0"]]),Le="/assets/notification.8a26e511.svg";const Ee={components:{IconBackground:G,Icon:U,Date:Z,Expand:De},props:["data"],setup(t){return{iconNotification:Le}}},ze={class:"flex-row"},Ue={class:"flex-row",style:{flex:"1 1 0"}},je={class:"content"},Me={class:"title"},Re={class:"secondary-text"},qe={key:1,class:"actions flex-row"},Fe=["onClick"];function He(t,a,n,e,i,r){const s=u("IconBackground"),d=u("Date"),m=u("Icon"),v=u("Expand");return o(),l("div",{class:V(["notification",{expanded:n.data.expanded}])},[c("div",ze,[c("div",Ue,[f(s,{icon:n.data.icon||e.iconNotification,img:n.data.img},null,8,["icon","img"]),c("div",je,[n.data.expanded?(o(),b(d,{key:0,class:"secondary-text",timestamp:n.data.timestamp},null,8,["timestamp"])):p("",!0),c("div",Me,h(n.data.title),1),c("div",Re,[R(t.$slots,"default",{},void 0,!0)]),n.data.expanded?(o(),l("div",qe,[(o(!0),l(T,null,W(n.data.actions,g=>(o(),l("button",{key:g.name,onClick:g.run,type:"button",class:"action flex-row"},[f(m,{icon:g.img},null,8,["icon"]),c("div",null,h(g.name),1)],8,Fe))),128))])):p("",!0)])]),f(v,{modelValue:n.data.expanded,"onUpdate:modelValue":a[0]||(a[0]=g=>n.data.expanded=g)},null,8,["modelValue"])])],2)}var Pe=k(Ee,[["render",He],["__scopeId","data-v-2826c74f"]]),Ge="/assets/y.229c7801.svg",Je="/assets/launch.fc946be2.svg";const Ke={components:{WalletSelector:be,WalletTabs:Ce,Tabs:ee,IconBackground:G,Icon:U,Notification:Pe},props:["state"],setup(t){var M;const a=(M=A.wallets[0])==null?void 0:M.key,n=y(()=>A.wallets.map(_=>_.key)),e=I(t.state.wallet||a),i=[{name:"Requests",color:"var(--orange)"},{name:"Permissions",color:"var(--green)"}],r=I(e.value?i[0].name:null);N(()=>t.state.wallet,_=>{v.value=!1,e.value=_,r.value=i[0].name});const s=()=>t.state.wallet=!1,d=()=>{v.value=!1,t.state.wallet=e.value},m=()=>{v.value=!1,e.value=t.state.wallet},v=I(!t.state.wallet),g=()=>{var _;if(!v.value){v.value=!0;return}e.value=t.state.wallet||((_=A.wallets[0])==null?void 0:_.key),v.value=!1},$=y(()=>{var B;const _=t.state.wallet?`Switch to ${e.value}`:`Connect to ${((B=t.state.appInfo)==null?void 0:B.name)||t.state.origin} from the account ${e.value}`;return{title:t.state.wallet?"Switch":"Connect",timestamp:Date.now(),actions:[{name:"Connect",img:Ge,run:d},{name:t.state.wallet?"Cancel":"Switch",img:te,run:t.state.wallet?m:g}],expanded:!0,content:_}}),S=X(q.breakpoints,"verticalLayout"),w=I(null),x=(_,B)=>_>B?w.value="slide-left":w.value="slide-right";return N(()=>i.findIndex(_=>_.name===r.value),x),N(()=>A.wallets.findIndex(_=>_.key===e.value),x),N(()=>e.value,()=>{r.value=i[0].name}),{defaultAddress:a,addresses:n,currentAddress:e,tabs:i,currentTab:r,isSelectingWallet:v,selectWallet:g,connectData:$,verticalLayout:S,transitionName:w,disconnect:s,navigateBack:ne,navigateBackAvailable:ae,iconConnection:oe,iconLauch:Je}}},Oe={class:"connection-card flex-column"},Xe=["disabled"],Ye={class:"secondary-text"},Qe={class:"flex-column",style:{flex:"1 1 0"}},Ze={class:"container"},et={key:0},tt={class:"fade-list-item",key:"0"},nt={key:1,class:"flex-column"};function at(t,a,n,e,i,r){var S,w;const s=u("IconBackground"),d=u("Icon"),m=u("WalletSelector"),v=u("Tabs"),g=u("WalletTabs"),$=u("Notification");return o(),l("div",Oe,[c("div",{class:V([e.verticalLayout?"flex-column":"flex-row"])},[c("button",{type:"button",class:"flex-row",onClick:a[0]||(a[0]=(...x)=>e.navigateBack&&e.navigateBack(...x)),disabled:!e.navigateBackAvailable(n.state.origin)},[f(s,{img:(S=n.state.appInfo)==null?void 0:S.logo,icon:e.iconConnection},null,8,["img","icon"]),c("div",null,[c("div",null,h(((w=n.state.appInfo)==null?void 0:w.name)||"Connector"),1),c("div",Ye,h(n.state.origin),1)]),e.navigateBackAvailable(n.state.origin)?(o(),b(d,{key:0,icon:e.iconLauch},null,8,["icon"])):p("",!0)],8,Xe),f(m,{modelValue:n.state.wallet,"onUpdate:modelValue":a[1]||(a[1]=x=>n.state.wallet=x),default:e.defaultAddress,exit:!0,active:!e.isSelectingWallet,onSelectWallet:e.selectWallet,onExit:e.disconnect},null,8,["modelValue","default","active","onSelectWallet","onExit"])],2),c("div",Qe,[f(v,{tabs:e.tabs,modelValue:e.currentTab,"onUpdate:modelValue":a[2]||(a[2]=x=>e.currentTab=x),disabled:!e.currentAddress},null,8,["tabs","modelValue","disabled"]),c("div",Ze,[f(Q,{name:e.transitionName,mode:"out-in"},{default:C(()=>[(o(),l("div",{key:(e.currentAddress||"")+e.currentTab,class:"content"},[e.currentTab==="Requests"?(o(),l("div",et,[f(D,{name:"fade-list"},{default:C(()=>[e.isSelectingWallet?(o(),b(g,{addresses:e.addresses,modelValue:e.currentAddress,"onUpdate:modelValue":a[3]||(a[3]=x=>e.currentAddress=x),class:"fade-list-item",key:"0"},null,8,["addresses","modelValue"])):p("",!0),e.currentAddress===n.state.wallet?(o(),l("div",tt,"Connected")):(o(),b($,{data:e.connectData,class:"fade-list-item",key:"1"},{default:C(()=>[Y(h(e.connectData.content),1)]),_:1},8,["data"]))]),_:1})])):e.currentTab==="Permissions"?(o(),l("div",nt,[f(D,{name:"fade-list"},{default:C(()=>[e.isSelectingWallet?(o(),b(g,{addresses:e.addresses,modelValue:e.currentAddress,"onUpdate:modelValue":a[4]||(a[4]=x=>e.currentAddress=x),class:"fade-list-item",key:"0"},null,8,["addresses","modelValue"])):p("",!0)]),_:1})])):p("",!0)]))]),_:1},8,["name"])])])])}var ot=k(Ke,[["render",at],["__scopeId","data-v-4a0589ee"]]);const st={components:{Carousel:me,ConnectionCard:ot,AddressIcon:z,Address:se,Button:le},setup(){const t=I(F.value.findIndex(n=>n.origin===j.origin&&n.session===j.session)),a=y(()=>A.currentWallet);return{currentConnectorIndex:t,currentWallet:a,connectors:F,state:j,states:ce}}},lt={class:"connect flex-column"},ct={class:"bottom-info secondary-text",style:{opacity:"0.0","pointer-events":"none"}};function dt(t,a,n,e,i,r){const s=u("ConnectionCard"),d=u("Carousel");return o(),l("div",lt,[f(d,{modelValue:e.currentConnectorIndex,"onUpdate:modelValue":a[0]||(a[0]=m=>e.currentConnectorIndex=m),class:"connectors"},{default:C(()=>[(o(!0),l(T,null,W(e.connectors,m=>(o(),b(s,{key:m.session,state:m,class:"box fade-list-item"},null,8,["state"]))),128))]),_:1},8,["modelValue"]),c("div",ct,[c("div",null,"All Channels "+h(Object.keys(e.states).length),1),(o(!0),l(T,null,W(e.states,(m,v)=>(o(),l("div",{key:v},h(m),1))),128))])])}var ut=k(st,[["render",dt],["__scopeId","data-v-f3f0c1e8"]]);export{ut as default};