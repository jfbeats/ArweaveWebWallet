import{_ as z,n,D as E,h as I,E as a,e as T,G as L,H as N}from"./index.6f63016f.js";import{W as V,c as d,a as e,V as t,u as s,q as c,a5 as l,F,l as H,a1 as P,a2 as W,o as _,s as $}from"./vendor.241c16ad.js";const r=o=>(P("data-v-d7a01d32"),o=o(),W(),o),j={class:"settings"},q={class:"column"},C={class:"group"},D=r(()=>e("h2",null,"Gateway State",-1)),G={class:"flex-column"},b={class:"group"},Q=r(()=>e("h2",null,"Weave State",-1)),A={class:"flex-column"},J=l("Endowment Pool: "),K={class:"group"},M=r(()=>e("h2",null,"Latest Block",-1)),O={class:"flex-column"},R=l("Block Time: "),U=V({setup(o){return(X,Y)=>{var u,h,p,v,m,f,g,x,k,w,S,y,B;return _(),d("div",j,[e("div",q,[e("div",C,[D,e("div",G,[e("div",null,"Peers: "+t((u=s(n))==null?void 0:u.peers),1),e("div",null,"Queue: "+t((h=s(n))==null?void 0:h.queue_length),1),e("div",null,"State Latency: "+t((p=s(n))==null?void 0:p.node_state_latency),1),e("div",null,"Pending Transactions: "+t((v=s(E))==null?void 0:v.length),1)])]),e("div",b,[Q,e("div",A,[e("div",null,"Network Height: "+t((m=s(n))==null?void 0:m.height),1),e("div",null,"Weave Size: "+t(s(I)((f=s(a))==null?void 0:f.weave_size)),1),e("div",null,[J,c(T,{winston:(g=s(a))==null?void 0:g.reward_pool},null,8,["winston"])])])]),e("div",K,[M,e("div",O,[e("div",null,"Block Height: "+t((x=s(a))==null?void 0:x.height),1),e("div",null,"Block Size: "+t(s(I)((k=s(a))==null?void 0:k.block_size)),1),e("div",null,[R,c(L,{timestamp:((w=s(a))==null?void 0:w.timestamp)*1e3},null,8,["timestamp"])]),e("div",null,[l("Transactions ("+t((y=(S=s(a))==null?void 0:S.txs)==null?void 0:y.length)+") ",1),(_(!0),d(F,null,H((B=s(a))==null?void 0:B.txs,i=>(_(),d("div",{key:i,class:"secondary-text"},[c(N,{to:{name:"Tx",params:{txId:i}}},{default:$(()=>[l(t(i),1)]),_:2},1032,["to"])]))),128))])])])])])}}});var se=z(U,[["__scopeId","data-v-d7a01d32"]]);export{se as default};
//# sourceMappingURL=Explore.7e04829e.js.map