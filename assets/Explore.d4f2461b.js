import{_ as b,m as U,W as P,l as E,N as $,b as m,O as W,L,T as A,e as V,P as j,Q as D,c as F,o as q,R as N,i as Q,S as G,a as H,U as M,n as f,B as O,A as S,V as X,X as I,j as J}from"./index.dfeb5663.js";import{d as x,o as c,a as u,e as t,g as n,at as K,c as i,u as s,i as Y,h,W as w,a3 as T,a4 as z,r as R,j as Z,t as d,w as ee,F as te,f as se,V as C}from"./vendor.cc129a20.js";import{L as ae,C as oe}from"./ListContainer.79f967bc.js";const ne={class:"profile-card flex-row row",style:{"align-items":"center"}},le={class:"address-icon-margin"},ce=x({props:{wallet:null},setup(o){return(e,a)=>(c(),u("div",ne,[t("div",le,[n(U,{address:o.wallet.key},null,8,["address"])]),n(P,{wallet:o.wallet},null,8,["wallet"])]))}});var re=b(ce,[["__scopeId","data-v-1c417b52"]]);function ie(o,e){let a;return K((r,l)=>({get(){return r(),o},set(_){clearTimeout(a),a=setTimeout(()=>{o=_,l()},e)}}))}const B=o=>(T("data-v-92b4291a"),o=o(),z(),o),ue={class:"global-search"},de={class:"input-container"},_e={key:0,class:"results input-box"},ve={class:"query-list input-box flex-column"},pe={key:0,class:"flex-column"},me=B(()=>t("div",{class:"secondary-text"},"User",-1)),he=B(()=>t("div",null,null,-1)),ye=B(()=>t("div",{class:"secondary-text"},"Transactions",-1)),ge=x({setup(o){const e=ie("",1e3),a=i(()=>e.value.match(/^[a-z0-9_-]{43}$/i)),r={run:()=>{},icon:j},l=i(()=>a.value&&_?.state?.value?.length&&E(e.value)),_=$([m(i(()=>a.value?{owners:[e.value]}:void 0),"global search user"),m(i(()=>a.value?{recipients:[e.value]}:void 0),"global search user")]),y=$([m(i(()=>a.value?void 0:{tags:[{name:"App-Name",values:["arweave-id"]},{name:"Name",values:[e.value]}]})),m(i(()=>a.value?void 0:{tags:[{name:"App-Name",values:[e.value]}]})),m(i(()=>!a.value&&e.value.toLowerCase()!==e.value?{tags:[{name:"App-Name",values:[e.value.toLowerCase()]}]}:void 0))]),k=$([m(i(()=>a.value?{ids:[e.value]}:void 0)),_,y]);return(v,p)=>(c(),u("div",ue,[t("div",de,[n(W,{modelValue:s(e),"onUpdate:modelValue":p[0]||(p[0]=g=>Y(e)?e.value=g:null),actions:[r],placeholder:"Search - address, transaction id, username, app name",style:{flex:"1 1 0"}},null,8,["modelValue","actions"])]),n(V,null,{default:h(()=>[s(e).length?(c(),u("div",_e,[t("div",ve,[s(l)?(c(),u("div",pe,[me,n(re,{wallet:s(l),compact:"true"},null,8,["wallet"]),he])):w("",!0),ye,n(L,{query:s(k),component:A,"component-props":{options:{currentAddress:s(l)?.key}}},null,8,["query","component-props"])])])):w("",!0)]),_:1})]))}});var fe=b(ge,[["__scopeId","data-v-92b4291a"]]);const we={class:"flex-row",style:{"align-items":"center","justify-content":"space-between","flex-wrap":"wrap"}},xe={class:"flex-row",style:{"align-items":"center"}},ke={key:0,style:{"text-align":"end",flex:"1 1 auto"}},be={key:0,class:"container-scroll"},$e=x({props:{block:null},setup(o){const e=o,a=R(!1),r=m({block:{min:e.block.node.height,max:e.block.node.height}}),l=D({name:"single block header",awaitEffect:()=>a.value,query:async()=>F.blocks.get(e.block.node.id),seconds:10,completed:_=>_}).state;return(_,y)=>(c(),Z(ae,{class:"block-card"},{header:h(()=>[n(H,{onIntersection:y[0]||(y[0]=k=>a.value=!0),threshold:.5},{default:h(()=>[t("div",we,[t("h2",xe,[n(q,{icon:s(N),style:{"font-size":"1.5em",color:"var(--orange)"}},null,8,["icon"]),t("span",null,"Block "+d(o.block.node.height),1)]),n(V,null,{default:h(()=>[s(l)?(c(),u("div",ke,[t("div",null,d(s(l).txs?.length)+" Transactions | "+d(s(Q)(s(l).block_size)),1),t("div",null,[n(G,{timestamp:s(l).timestamp*1e3},null,8,["timestamp"])])])):w("",!0)]),_:1})])]),_:1},8,["threshold"])]),default:h(()=>[a.value?(c(),u("div",be,[n(L,{query:s(r),component:A,componentProps:{options:{space:!0}}},null,8,["query"])])):w("",!0)]),_:1}))}});var Ie=b($e,[["__scopeId","data-v-5e1eea52"]]);const Se={class:"block-carousel"},Ce={key:0,class:"block fade-list-item box flex-column",style:{"align-items":"center","justify-content":"center"}},Be=C("Mine new block"),Le=x({setup(o){const e=R(void 0),a=M({}),r=i(()=>a.state.value&&[...a.state.value].reverse());ee(r,(v,p)=>!p?.length&&v?.length&&(e.value=v.length-1));const l=i(()=>f.value?.network?.includes("arlocal")),_=async()=>{await fetch(S.gatewayURL+"mine"),await a.updateQuery.getState(!0),setTimeout(()=>e.value=r.value.length-1,500)},y=v=>v.isIntersecting&&a?.fetchQuery.query(),k=v=>v.isIntersecting;return(v,p)=>(c(),u("div",Se,[n(oe,{modelValue:e.value,"onUpdate:modelValue":p[0]||(p[0]=g=>e.value=g),options:{align:"center",overscroll:!0,immediate:!0},onStart:y,onEnd:k,class:"block-carousel"},{default:h(()=>[(c(!0),u(te,null,se(s(r),g=>(c(),u("div",{key:g.node.id,class:"block fade-list-item"},[n(Ie,{block:g,class:"box"},null,8,["block"])]))),128)),s(l)&&s(r).length?(c(),u("div",Ce,[n(q,{icon:s(N),style:{"font-size":"4em",opacity:"0.8"}},null,8,["icon"]),n(O,{onClick:_},{default:h(()=>[Be]),_:1})])):w("",!0)]),_:1},8,["modelValue"])]))}});const Ae=o=>(T("data-v-40de1e72"),o=o(),z(),o),Ve={class:"settings"},qe={class:"container"},Ne={class:"column"},Qe={class:"group"},Te={style:{"text-transform":"capitalize"}},ze=C(" Gateway State"),Re={class:"flex-column"},Ue={class:"group"},Pe=Ae(()=>t("h2",null,"Weave State",-1)),Ee={class:"flex-column"},We=C("Endowment Pool: "),je=x({setup(o){const e=i(()=>S.gatewayURL&&new URL(S.gatewayURL).hostname);return(a,r)=>(c(),u("div",Ve,[t("div",qe,[t("div",Ne,[n(fe),t("div",Qe,[t("h2",null,[t("span",Te,d(s(e)),1),ze]),t("div",Re,[t("div",null,"Peers: "+d(s(f)?.peers??"..."),1),t("div",null,"Queue: "+d(s(f)?.queue_length??"..."),1),t("div",null,"State Latency: "+d(s(f)?.node_state_latency??"..."),1),t("div",null,"Pending Transactions: "+d(s(X)?.length??"..."),1)])]),t("div",Ue,[Pe,t("div",Ee,[t("div",null,"Network Height: "+d(s(f)?.height??"..."),1),t("div",null,"Weave Size: "+d(s(I)?.weave_size&&s(Q)(s(I)?.weave_size)||"..."),1),t("div",null,[We,n(J,{winston:s(I)?.reward_pool},null,8,["winston"])])])])])]),n(Le)]))}});var He=b(je,[["__scopeId","data-v-40de1e72"]]);export{He as default};
//# sourceMappingURL=Explore.d4f2461b.js.map
