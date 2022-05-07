import{_ as x,m as z,W as P,l as R,M as k,d as m,N as U,c as C,T as A,b as q,O as E,P as D,e as G,o as W,Q as j,i as B,R as F,a as H,S as M,n as g,U as O,V as b,j as J,A as S}from"./index.f5f0f36a.js";import{h as y,j as r,k as d,l as s,M as l,aq as K,d as i,u as t,i as X,H as h,Q as w,a3 as L,a4 as V,r as N,G as Y,P as u,w as Z,F as ee,n as se,O as Q}from"./vendor.ab685300.js";import{L as te,C as ae}from"./ListContainer.af6cdb83.js";const oe={class:"profile-card flex-row row",style:{"align-items":"center"}},le={class:"address-icon-margin"},ne=y({props:{wallet:null},setup(o){return(e,a)=>(r(),d("div",oe,[s("div",le,[l(z,{address:o.wallet.key},null,8,["address"])]),l(P,{wallet:o.wallet},null,8,["wallet"])]))}});var ce=x(ne,[["__scopeId","data-v-1c417b52"]]);function re(o,e=200){let a;return K((_,n)=>({get(){return _(),o},set(v){clearTimeout(a),a=setTimeout(()=>{o=v,n()},e)}}))}const $=o=>(L("data-v-92b4291a"),o=o(),V(),o),ie={class:"global-search"},ue={class:"input-container"},de={key:0,class:"results input-box"},_e={class:"query-list input-box flex-column"},ve={key:0,class:"flex-column"},pe=$(()=>s("div",{class:"secondary-text"},"User",-1)),me=$(()=>s("div",null,null,-1)),he=$(()=>s("div",{class:"secondary-text"},"Transactions",-1)),fe=y({setup(o){const e=re("",1e3),a=i(()=>e.value.match(/^[a-z0-9_-]{43}$/i)),_={run:()=>{},icon:E},n=i(()=>a.value&&v?.state?.value?.length&&R(e.value)),v=k([m(i(()=>a.value?{owners:[e.value]}:void 0),"global search user"),m(i(()=>a.value?{recipients:[e.value]}:void 0),"global search user")]),c=k([m(i(()=>a.value?void 0:{tags:[{name:"App-Name",values:["arweave-id"]},{name:"Name",values:[e.value]}]})),m(i(()=>a.value?void 0:{tags:[{name:"App-Name",values:[e.value]}]})),m(i(()=>!a.value&&e.value.toLowerCase()!==e.value?{tags:[{name:"App-Name",values:[e.value.toLowerCase()]}]}:void 0))]),p=k([m(i(()=>a.value?{ids:[e.value]}:void 0)),v,c]);return(f,I)=>(r(),d("div",ie,[s("div",ue,[l(U,{modelValue:t(e),"onUpdate:modelValue":I[0]||(I[0]=T=>X(e)?e.value=T:null),actions:[_],placeholder:"Search - address, transaction id, username, app name",style:{flex:"1 1 0"}},null,8,["modelValue","actions"])]),l(q,null,{default:h(()=>[t(e).length?(r(),d("div",de,[s("div",_e,[t(n)?(r(),d("div",ve,[pe,l(ce,{wallet:t(n),compact:"true"},null,8,["wallet"]),me])):w("",!0),he,l(C,{query:t(p),component:A,"component-props":{options:{currentAddress:t(n)?.key}}},null,8,["query","component-props"])])])):w("",!0)]),_:1})]))}});var ye=x(fe,[["__scopeId","data-v-92b4291a"]]);const ge={class:"flex-row",style:{"align-items":"center","justify-content":"space-between","flex-wrap":"wrap"}},we={class:"flex-row",style:{"align-items":"center"}},xe={key:0,style:{"text-align":"end",flex:"1 1 auto"}},ke={key:0,class:"container-scroll"},be=y({props:{block:null},setup(o){const e=o,a=N(!1),_=m({block:{min:e.block.node.height,max:e.block.node.height}}),n=D({name:"single block header",awaitEffect:()=>a.value,query:async()=>G.blocks.get(e.block.node.id),seconds:10,completed:v=>v}).state;return(v,c)=>(r(),Y(te,{class:"block-card"},{header:h(()=>[l(H,{onIntersection:c[0]||(c[0]=p=>a.value=!0),threshold:.5},{default:h(()=>[s("div",ge,[s("h2",we,[l(W,{icon:t(j),style:{"font-size":"1.5em",color:"var(--orange)"}},null,8,["icon"]),s("span",null,"Block "+u(o.block.node.height),1)]),l(q,null,{default:h(()=>[t(n)?(r(),d("div",xe,[s("div",null,u(t(n).txs?.length)+" Transactions | "+u(t(B)(t(n).block_size)),1),s("div",null,[l(F,{timestamp:t(n).timestamp*1e3},null,8,["timestamp"])])])):w("",!0)]),_:1})])]),_:1},8,["threshold"])]),default:h(()=>[a.value?(r(),d("div",ke,[l(C,{query:t(_),component:A,componentProps:{options:{space:!0}}},null,8,["query"])])):w("",!0)]),_:1}))}});var $e=x(be,[["__scopeId","data-v-d04ff38a"]]);const Ie={class:"block-carousel"},Se=y({setup(o){const e=N(void 0),a=M({}),_=i(()=>a.state.value&&[...a.state.value].reverse());Z(_,(c,p)=>!p?.length&&c?.length&&(e.value=c.length-1));const n=c=>c.isIntersecting&&a?.fetchQuery.query(),v=c=>c.isIntersecting;return(c,p)=>(r(),d("div",Ie,[l(ae,{modelValue:e.value,"onUpdate:modelValue":p[0]||(p[0]=f=>e.value=f),options:{align:"center",overscroll:!0,immediate:!0},onStart:n,onEnd:v,class:"block-carousel"},{default:h(()=>[(r(!0),d(ee,null,se(t(_),f=>(r(),d("div",{key:f.node.id,class:"block fade-list-item"},[l($e,{block:f,class:"box"},null,8,["block"])]))),128))]),_:1},8,["modelValue"])]))}});const Ce=o=>(L("data-v-4e74fe78"),o=o(),V(),o),Ae={class:"settings"},qe={class:"container"},Be={class:"column"},Le={class:"group"},Ve={style:{"text-transform":"capitalize"}},Ne=Q(" Gateway State"),Qe={class:"flex-column"},Te={class:"group"},ze=Ce(()=>s("h2",null,"Weave State",-1)),Pe={class:"flex-column"},Re=Q("Endowment Pool: "),Ue=y({setup(o){const e=i(()=>S.gatewayURL&&new URL(S.gatewayURL).hostname);return(a,_)=>(r(),d("div",Ae,[s("div",qe,[s("div",Be,[l(ye),s("div",Le,[s("h2",null,[s("span",Ve,u(t(e)),1),Ne]),s("div",Qe,[s("div",null,"Peers: "+u(t(g)?.peers??"..."),1),s("div",null,"Queue: "+u(t(g)?.queue_length??"..."),1),s("div",null,"State Latency: "+u(t(g)?.node_state_latency??"..."),1),s("div",null,"Pending Transactions: "+u(t(O)?.length??"..."),1)])]),s("div",Te,[ze,s("div",Pe,[s("div",null,"Network Height: "+u(t(g)?.height??"..."),1),s("div",null,"Weave Size: "+u(t(b)?.weave_size&&t(B)(t(b)?.weave_size)||"..."),1),s("div",null,[Re,l(J,{winston:t(b)?.reward_pool},null,8,["winston"])])])])])]),l(Se)]))}});var We=x(Ue,[["__scopeId","data-v-4e74fe78"]]);export{We as default};
//# sourceMappingURL=Explore.d31bfe5a.js.map