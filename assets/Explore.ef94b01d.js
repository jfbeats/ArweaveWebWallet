import{_ as f,i as P,W,g as q,D as y,E as V,G as D,T as G,r as R,H as U,b as F,a as H,h as Q,J,K,A as M,n as g,L as O,M as A,e as X}from"./index.703fc6ce.js";import{o as d,c as v,a0 as Y,X as m,a as e,q as _,am as Z,e as k,d as x,w as $,u,i as ee,s as w,x as b,D as I,F as T,l as L,a2 as N,a3 as z,W as p,a6 as E}from"./vendor.3a3a0930.js";import{C as se}from"./Carousel.d73704bc.js";const te={},ae={class:"list flex-column"};function le(t,s){return d(),v("div",ae,[Y(t.$slots,"default",{},void 0,!0)])}var j=f(te,[["render",le],["__scopeId","data-v-e2799d1c"]]);const ne={class:"profile-card flex-row row",style:{"align-items":"center"}},oe={class:"address-icon-margin"},ce=m({props:{wallet:null},setup(t){return(s,a)=>(d(),v("div",ne,[e("div",oe,[_(P,{address:t.wallet.key},null,8,["address"])]),_(W,{wallet:t.wallet},null,8,["wallet"])]))}});var re=f(ce,[["__scopeId","data-v-1c417b52"]]);function ue(t,s=200){let a;return Z((c,l)=>({get(){return c(),t},set(r){clearTimeout(a),a=setTimeout(()=>{t=r,l()},s)}}))}const S=t=>(N("data-v-114d481d"),t=t(),z(),t),ie={class:"global-search"},de={class:"input-container"},_e={key:0,class:"results input-box"},ve=S(()=>e("div",{class:"secondary-text"},"User",-1)),pe=S(()=>e("div",null,null,-1)),he=S(()=>e("div",{class:"secondary-text"},"Transactions",-1)),me=m({setup(t){const s=ue(""),a=k(()=>s.value.match(/^[a-z0-9_-]{43}$/i)),c={run:()=>{},icon:U};let l;const r=x({}),n=k(()=>{var o,i;return a.value&&!((i=(o=r.value.idQuery)==null?void 0:o.state)==null?void 0:i.length)&&q(s.value)});return $(s,()=>{if(l=void 0,r.value={},a.value){const o=y({ids:[s.value]});r.value.idQuery=o,l=V([o,y({owners:[s.value]}),y({recipients:[s.value]})])}else s.value.length&&(l=V([y({tags:[{name:"App-Name",values:["arweave-id"]},{name:"Name",values:[s.value]}]})]));r.value.query=l==null?void 0:l.state,l==null||l.fetchQuery.query()}),(o,i)=>(d(),v("div",ie,[e("div",de,[_(D,{modelValue:u(s),"onUpdate:modelValue":i[0]||(i[0]=h=>ee(s)?s.value=h:null),actions:[c],placeholder:"Search - username, address, transaction id",style:{flex:"1 1 0"}},null,8,["modelValue","actions"])]),_(R,null,{default:w(()=>{var h;return[((h=r.value.query)==null?void 0:h.length)?(d(),v("div",_e,[_(j,{class:"query-list input-box"},{default:w(()=>[u(n)?(d(),b(j,{key:0,class:"flex-column"},{default:w(()=>[ve,_(re,{wallet:u(n),compact:"true"},null,8,["wallet"]),pe]),_:1})):I("",!0),he,(d(!0),v(T,null,L(r.value.query,C=>{var B;return d(),v("div",{key:C,class:"result"},[_(G,{tx:C.node,"current-address":(B=u(n))==null?void 0:B.key},null,8,["tx","current-address"])])}),128))]),_:1})])):I("",!0)]}),_:1})]))}});var fe=f(me,[["__scopeId","data-v-114d481d"]]);const ye={class:"block-card"},ge={class:"flex-row",style:{"align-items":"center","justify-content":"space-between"}},xe={key:0,style:{"text-align":"end"}},we=m({props:{block:null},setup(t){const s=t,a=x(!1),c=x(void 0);return $(a,async l=>l&&!c.value&&(c.value=await F.blocks.get(s.block.node.id))),(l,r)=>{var n;return d(),v("div",ye,[_(H,{onIntersection:r[0]||(r[0]=o=>a.value=!0)}),e("div",ge,[e("h2",null," Block "+p(t.block.node.height),1),c.value?(d(),v("div",xe,[e("div",null,p((n=c.value.txs)==null?void 0:n.length)+" Transactions | "+p(u(Q)(c.value.block_size)),1),e("div",null,[_(J,{timestamp:c.value.timestamp*1e3},null,8,["timestamp"])])])):I("",!0)])])}}});const ke=m({setup(t){const s=x(void 0),a=K({}),c=k(()=>a.state.value&&[...a.state.value].reverse());$(c,(n,o)=>!(o==null?void 0:o.length)&&(n==null?void 0:n.length)&&(s.value=n.length-1)),a==null||a.fetchQuery.query();const l=n=>n.isIntersecting&&(a==null?void 0:a.fetchQuery.query()),r=n=>n.isIntersecting;return(n,o)=>(d(),b(se,{modelValue:s.value,"onUpdate:modelValue":o[0]||(o[0]=i=>s.value=i),options:{align:"center",overscroll:!0},onStart:l,onEnd:r,class:"block-carousel"},{default:w(()=>[(d(!0),v(T,null,L(u(c),i=>(d(),b(we,{key:i.node.id,block:i,class:"block fade-list-item box"},null,8,["block"]))),128))]),_:1},8,["modelValue"]))}});const $e=t=>(N("data-v-572686f5"),t=t(),z(),t),be={class:"settings"},Ie={class:"container"},Se={class:"column"},Ce={class:"group"},Be={style:{"text-transform":"capitalize"}},Ve=E(" Gateway State"),Qe={class:"flex-column"},Ae={class:"group"},Te=$e(()=>e("h2",null,"Weave State",-1)),Le={class:"flex-column"},Ne=E("Endowment Pool: "),ze=m({setup(t){return(s,a)=>{var c,l,r,n,o,i,h;return d(),v("div",be,[e("div",Ie,[e("div",Se,[_(fe),e("div",Ce,[e("h2",null,[e("span",Be,p(u(M).gatewayURLObject.hostname),1),Ve]),e("div",Qe,[e("div",null,"Peers: "+p((c=u(g))==null?void 0:c.peers),1),e("div",null,"Queue: "+p((l=u(g))==null?void 0:l.queue_length),1),e("div",null,"State Latency: "+p((r=u(g))==null?void 0:r.node_state_latency),1),e("div",null,"Pending Transactions: "+p((n=u(O))==null?void 0:n.length),1)])]),e("div",Ae,[Te,e("div",Le,[e("div",null,"Network Height: "+p((o=u(g))==null?void 0:o.height),1),e("div",null,"Weave Size: "+p(u(Q)((i=u(A))==null?void 0:i.weave_size)),1),e("div",null,[Ne,_(X,{winston:(h=u(A))==null?void 0:h.reward_pool},null,8,["winston"])])])])])]),_(ke)])}}});var We=f(ze,[["__scopeId","data-v-572686f5"]]);export{We as default};
//# sourceMappingURL=Explore.ef94b01d.js.map
