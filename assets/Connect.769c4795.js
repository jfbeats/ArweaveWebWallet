import{_ as p,c as E,i as A,D as R,T as U,A as N,j as q,e as F,n as H,k as P,l as G,b as J,m as K,o as O,s as X,p as Y}from"./index.54ed5028.js";import{e as k,j as _,o as a,f as l,F as I,h as C,y as V,k as m,s as w,z as S,B as $,g as s,p as y,K as x,I as Q,d as D,a as B,x as Z,l as T,N as L,J as ee,T as te}from"./vendor.035b7bf8.js";const ne={components:{AddressIcon:E},props:["addresses","modelValue","exit"],setup(n,{emit:o}){return{model:k({get(){return n.modelValue},set(e){o("update:modelValue",e)}})}}},W=n=>(S("data-v-24011c94"),n=n(),$(),n),ae={class:"wallet-tabs"},oe=["onClick"],se=W(()=>s("div",{class:"exit-background"},null,-1)),ce=W(()=>s("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor"},[s("path",{d:"M0 0h24v24H0V0z",fill:"none"}),s("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"})],-1)),le=[se,ce];function de(n,o,t,e,u,v){const i=_("AddressIcon");return a(),l("div",ae,[(a(!0),l(I,null,C(t.addresses,d=>(a(),l("button",{key:d,type:"button",onClick:r=>e.model=d,class:V(["tab",{active:d==e.model}])},[m(i,{address:d},null,8,["address"])],10,oe))),128)),t.exit?(a(),l("button",{key:0,class:"exit",type:"button",onClick:o[0]||(o[0]=d=>n.$emit("exit"))},le)):w("",!0)])}var ie=p(ne,[["render",de],["__scopeId","data-v-24011c94"]]);const re={components:{Icon:A},props:["icon","img"],setup(){}},_e={class:"icon-background"};function ue(n,o,t,e,u,v){const i=_("Icon");return a(),l("div",_e,[t.img?(a(),y(i,{key:0,class:"page-logo",icon:t.img},null,8,["icon"])):(a(),y(i,{key:1,class:"page-logo placeholder",icon:t.icon},null,8,["icon"]))])}var z=p(re,[["render",ue],["__scopeId","data-v-34c166f1"]]);const me={props:["modelValue"],setup(n,{emit:o}){return{expanded:k({get(){return n.modelValue},set(e){o("update:modelValue",e)}})}}},j=n=>(S("data-v-52e2fbe0"),n=n(),$(),n),ve=j(()=>s("path",{d:"M24 24H0V0h24v24z",fill:"none",opacity:".87"},null,-1)),fe=j(()=>s("path",{d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"},null,-1)),xe=[ve,fe];function ge(n,o,t,e,u,v){return a(),l("button",{type:"button",class:"expand",onClick:o[0]||(o[0]=i=>e.expanded=!e.expanded)},[(a(),l("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",class:V({expanded:e.expanded})},xe,2))])}var pe=p(me,[["render",ge],["__scopeId","data-v-52e2fbe0"]]),ye="/assets/notification.8a26e511.svg";const be={components:{IconBackground:z,Icon:A,Date:R,Expand:pe},props:["data"],setup(n){return{iconNotification:ye}}},he={class:"flex-row"},ke={class:"flex-row",style:{flex:"1 1 0"}},we={class:"content"},Ie={class:"title"},Ce={class:"secondary-text"},Ve={key:1,class:"actions flex-row"},Be=["onClick"];function Te(n,o,t,e,u,v){const i=_("IconBackground"),d=_("Date"),r=_("Icon"),g=_("Expand");return a(),l("div",{class:V(["notification",{expanded:t.data.expanded}])},[s("div",he,[s("div",ke,[m(i,{icon:t.data.icon||e.iconNotification,img:t.data.img},null,8,["icon","img"]),s("div",we,[t.data.expanded?(a(),y(d,{key:0,class:"secondary-text",timestamp:t.data.timestamp},null,8,["timestamp"])):w("",!0),s("div",Ie,x(t.data.title),1),s("div",Ce,[Q(n.$slots,"default",{},void 0,!0)]),t.data.expanded?(a(),l("div",Ve,[(a(!0),l(I,null,C(t.data.actions,c=>(a(),l("button",{key:c.name,onClick:c.run,type:"button",class:"action flex-row"},[m(r,{icon:c.img},null,8,["icon"]),s("div",null,x(c.name),1)],8,Be))),128))])):w("",!0)])]),m(g,{modelValue:t.data.expanded,"onUpdate:modelValue":o[0]||(o[0]=c=>t.data.expanded=c)},null,8,["modelValue"])])],2)}var Ae=p(be,[["render",Te],["__scopeId","data-v-e0bffb3c"]]),Ne="/assets/y.229c7801.svg",Se="/assets/launch.fc946be2.svg";const $e={components:{WalletTabs:ie,Tabs:U,IconBackground:z,Icon:A,Notification:Ae},props:["state"],setup(n){const o=k(()=>N.wallets.map(c=>c.key)),t=D(n.state.wallet||o.value[0]),e=[{name:"Requests",color:"var(--orange)"},{name:"Permissions",color:"var(--green)"}],u=D(t.value?e[0].name:null);B(()=>n.state.wallet,c=>{t.value=c,u.value=e[0].name});const v=()=>n.state.wallet=!1,i=k(()=>{var b;const c=n.state.wallet?"Switch":"Connect",f=n.state.wallet?`Switch to ${t.value}`:`Connect to ${((b=n.state.appInfo)==null?void 0:b.name)||n.state.origin} from the account ${t.value}`;return{title:c,timestamp:Date.now(),actions:[{name:c,img:Ne,run:()=>n.state.wallet=t.value},{name:"Exit",img:q,run:v}],expanded:!0,content:f}}),d=Z(F.breakpoints,"verticalLayout"),r=D(null),g=(c,f)=>c>f?r.value="slide-left":r.value="slide-right";return B(()=>e.findIndex(c=>c.name===u.value),g),B(()=>N.wallets.findIndex(c=>c.key===t.value),g),B(()=>t.value,(c,f)=>{c&&!f&&(u.value=e[0].name)}),{addresses:o,currentAddress:t,tabs:e,currentTab:u,connectData:i,verticalLayout:d,transitionName:r,disconnect:v,navigateBack:H,navigateBackAvailable:P,iconConnection:G,iconLauch:Se}}},De={class:"connection-card card flex-column"},Ee=["disabled"],Le={class:"secondary-text"},We={class:"flex-column",style:{flex:"1 1 0"}},ze={class:"container flex-column"},je={key:0,class:"info flex-column"},Me={key:1,class:"flex-column"},Re={key:0,class:"fade-list-item"},Ue={key:2,class:"flex-column"};function qe(n,o,t,e,u,v){var f,b;const i=_("IconBackground"),d=_("Icon"),r=_("WalletTabs"),g=_("Tabs"),c=_("Notification");return a(),l("div",De,[s("div",{class:V([e.verticalLayout?"flex-column":"flex-row"])},[s("button",{type:"button",class:"flex-row",onClick:o[0]||(o[0]=(...h)=>e.navigateBack&&e.navigateBack(...h)),disabled:!e.navigateBackAvailable(t.state.origin)},[m(i,{img:(f=t.state.appInfo)==null?void 0:f.logo,icon:e.iconConnection},null,8,["img","icon"]),s("div",null,[s("div",null,x(((b=t.state.appInfo)==null?void 0:b.name)||"Connector"),1),s("div",Le,x(t.state.origin),1)]),e.navigateBackAvailable(t.state.origin)?(a(),y(d,{key:0,icon:e.iconLauch},null,8,["icon"])):w("",!0)],8,Ee),m(r,{addresses:e.addresses,modelValue:e.currentAddress,"onUpdate:modelValue":o[1]||(o[1]=h=>e.currentAddress=h),exit:"true",onExit:e.disconnect},null,8,["addresses","modelValue","onExit"])],2),s("div",We,[m(g,{tabs:e.tabs,modelValue:e.currentTab,"onUpdate:modelValue":o[2]||(o[2]=h=>e.currentTab=h),disabled:!e.currentAddress},null,8,["tabs","modelValue","disabled"]),s("div",ze,[m(te,{name:e.transitionName,mode:"out-in"},{default:T(()=>[(a(),l("div",{key:e.currentAddress+e.currentTab,class:"content"},[e.currentAddress?e.currentTab==="Requests"?(a(),l("div",Me,[m(L,{name:"fade-list"},{default:T(()=>[e.currentAddress===t.state.wallet?(a(),l("div",Re,"Connected")):(a(),y(c,{key:1,data:e.connectData,class:"fade-list-item"},{default:T(()=>[ee(x(e.connectData.content),1)]),_:1},8,["data"]))]),_:1})])):e.currentTab==="Permissions"?(a(),l("div",Ue,"Wip")):w("",!0):(a(),l("div",je,"Select a wallet"))]))]),_:1},8,["name"])])])])}var Fe=p($e,[["render",qe],["__scopeId","data-v-97edcc04"]]);const He={components:{ConnectionCard:Fe,AddressIcon:E,Address:J,Button:K},setup(){return{currentWallet:k(()=>N.currentWallet),iframes:O,state:X,states:Y}}},M=n=>(S("data-v-5ba4c81f"),n=n(),$(),n),Pe={class:"connect flex-column"},Ge={class:"connectors flex-row no-scrollbar"},Je=M(()=>s("div",{class:"margin",key:"margin1"},null,-1)),Ke=M(()=>s("div",{class:"margin",key:"margin2"},null,-1)),Oe={class:"bottom-info secondary-text",style:{opacity:"0.0","pointer-events":"none"}};function Xe(n,o,t,e,u,v){const i=_("ConnectionCard");return a(),l("div",Pe,[s("div",Ge,[m(L,{name:"fade-list"},{default:T(()=>[Je,(a(!0),l(I,null,C(e.iframes,(d,r)=>(a(),y(i,{key:r,state:d,class:"fade-list-item"},null,8,["state"]))),128)),Ke]),_:1})]),s("div",Oe,[s("div",null,"All Channels "+x(Object.keys(e.states).length),1),(a(!0),l(I,null,C(e.states,(d,r)=>(a(),l("div",{key:r},x(d),1))),128))])])}var Ze=p(He,[["render",Xe],["__scopeId","data-v-5ba4c81f"]]);export{Ze as default};
