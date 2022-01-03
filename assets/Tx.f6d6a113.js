import{_ as y,O as W,A as S,a as $,u as V,B as P,I as H,F as U,g as E,b as A,c as B,h as J,d as q}from"./index.e04de514.js";import{d as k,g,u as w,o as r,y as O,x as I,a,P as R,f as L,c,r as G,C as F,D as N,v as u,V as m,E as f,ad as M,t as z,O as n,ae as X,a1 as C,F as T,X as Y,Y as K}from"./vendor.1187ef80.js";const Q={components:{Observer:W},props:["src"],setup(o,{emit:s}){const e=k(null),t=k(null),d=k(null),v=p=>{console.log(p),t.value=p.width/p.height},l=()=>{d.value=e.value.naturalWidth/e.value.naturalHeight,s("load")},i=g(()=>t.value&&d.value&&t.value<d.value),h=g(()=>t.value&&d.value&&t.value>=d.value);return{x:i,y:h,resize:v,load:l,imgRef:e}}},Z={class:"frame-scroller"},ee=["src"];function te(o,s,e,t,d,v){const l=w("Observer");return r(),O(l,{observe:"resize",onResize:t.resize,class:R(["img",{x:t.x,y:t.y}])},{default:I(()=>[a("div",Z,[a("img",{ref:"imgRef",src:e.src,onLoad:s[0]||(s[0]=(...i)=>t.load&&t.load(...i))},null,40,ee)])]),_:1},8,["onResize","class"])}var ae=y(Q,[["render",te],["__scopeId","data-v-729c6e3c"]]);const se={props:["tx"],setup(o){L(()=>o.tx,s=>{console.log(s),!!s},{immediate:!0})}},ne={class:"smart-weave"};function oe(o,s,e,t,d,v){return r(),c("div",ne," SmartWeave Contract ")}var re=y(se,[["render",oe]]);const de={components:{Img:ae,SmartWeave:re},props:["tx"],setup(o){const s=G({handler:null,loaded:!1,payload:null}),e=g(()=>S.gatewayURL+o.tx.id);return L(()=>o.tx,async()=>{var t,d,v,l,i,h;if(!!o.tx&&(s.handler=null,s.loaded=!1,((t=o.tx.data)==null?void 0:t.size)!=="0"))if(((d=o.tx.data)==null?void 0:d.type)==="application/x.arweave-manifest+json"||((v=o.tx.data)==null?void 0:v.type)==="text/html"||((l=o.tx.data)==null?void 0:l.type)==="application/pdf")s.handler="iframe";else if(((h=(i=o.tx.data)==null?void 0:i.type)==null?void 0:h.split("/")[0])==="image")s.handler="img";else{s.handler="raw";try{if(s.payload=await $.transactions.getData(o.tx.id,{decode:!0,string:!0}),s.payload[0]==="{")try{s.payload=JSON.stringify(JSON.parse(s.payload),null,2),s.handler="json"}catch{}}catch{}}},{immediate:!0}),{gatewayLink:e,data:s}}},le={key:"iframe",class:"selector iframe-container box"},ce=["src"],ie={key:"img",class:"selector img-container box"},_e={key:"smartweave",class:"selector"},ue={key:"json",class:"selector data-container box"},ve={class:"raw"};function he(o,s,e,t,d,v){const l=w("Img"),i=w("SmartWeave");return t.data.handler==="iframe"?F((r(),c("div",le,[a("iframe",{class:"iframe",src:t.gatewayLink,onLoad:s[0]||(s[0]=h=>t.data.loaded=!0)},null,40,ce)],512)),[[N,t.data.loaded]]):t.data.handler==="img"?F((r(),c("div",ie,[u(l,{src:t.gatewayLink,onLoad:s[1]||(s[1]=h=>t.data.loaded=!0)},null,8,["src"])],512)),[[N,t.data.loaded]]):t.data.handler==="smartweave"?(r(),c("div",_e,[u(i,{tx:e.tx},null,8,["tx"])])):t.data.handler==="json"||t.data.handler==="raw"?(r(),c("div",ue,[a("pre",ve,m(t.data.payload),1)])):f("",!0)}var me=y(de,[["render",he],["__scopeId","data-v-ee87589c"]]);const x=o=>(Y("data-v-5f31ddc8"),o=o(),K(),o),fe={class:"meta flex-column"},ge={class:"card"},pe={class:"row flex-row"},xe={class:"item",style:{"font-size":"1.5em"}},ye={class:"row flex-row"},ke={class:"item"},we={class:"row flex-row"},be={class:"item"},Se=x(()=>a("h3",null,"Properties",-1)),Ie={class:"card flex-column"},Le=x(()=>a("h3",null,"ID",-1)),ze={class:"ellipsis"},Ce={key:0},De=["href"],je={key:1},$e=["href"],Ae={key:0},Be=x(()=>a("h3",null,"Pending",-1)),Oe={key:0},Re={key:1},Fe=x(()=>a("h3",null,"Block",-1)),Ne={class:"ellipsis"},Te=x(()=>a("h3",null,"Data",-1)),We=C(" Fee "),Ve=x(()=>a("h3",null,"Tags",-1)),Pe={style:{background:"var(--background2)","border-radius":"var(--border-radius)"}},He={key:1},Ue=M({props:{txId:null},setup(o){const s=o,e=V(z(s,"txId")),t=g(()=>{var _;return((_=e.value.data)==null?void 0:_.size)!=0}),d=g(()=>!e.value.block),v=g(()=>{if(!e.value.block)return"";const _=new Date(e.value.block.timestamp*1e3);return _.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})+" "+_.toLocaleTimeString()}),l=k(null),i=z(P,"currentHeight"),h=g(()=>{if(!e.value.tags)return;const _=[];for(const b of e.value.tags)_.push({items:[{name:"",value:b.name,attrs:{disabled:!0}},{name:"",value:b.value,attrs:{disabled:!0}}]});return _});L(()=>s.txId,async()=>{E(),$.transactions.getStatus(s.txId).then(_=>l.value=_.status).catch(()=>l.value="Not Found")},{immediate:!0});const p=z(H.breakpoints,"verticalContent");return(_,b)=>{const D=w("Amount");return n(e)?(r(),O(U,{key:0},X({left:I(()=>{var j;return[a("div",fe,[a("div",ge,[a("div",pe,[a("div",xe,[u(D,{ar:n(e).quantity.ar},null,8,["ar"])])]),a("div",ye,[a("div",ke,[u(A,{address:n(e).owner.address},null,8,["address"]),u(B,{class:"secondary-text",address:n(e).owner.address},null,8,["address"])])]),a("div",we,[a("div",be,[u(A,{address:n(e).recipient},null,8,["address"]),u(B,{class:"secondary-text",address:n(e).recipient},null,8,["address"])])])]),Se,a("div",Ie,[a("div",null,[Le,a("div",ze,m(n(e).id),1),n(t)?(r(),c("div",Ce,[a("a",{href:n(S).gatewayURL+n(e).id,target:"_blank"},"Link",8,De)])):f("",!0),((j=n(e).data)==null?void 0:j.type)==="application/x.arweave-manifest+json"?(r(),c("div",je,[a("a",{href:n(S).gatewayURL+"tx/"+n(e).id+"/data.json",target:"_blank"},"Manifest",8,$e)])):f("",!0)]),n(d)?(r(),c("div",Ae,[Be,l.value?(r(),c("div",Oe,"Status: "+m(l.value),1)):f("",!0)])):(r(),c("div",Re,[Fe,a("div",Ne,m(n(e).block.id),1),a("span",null,[C(m(n(e).block.height)+" ",1),n(i)?(r(),c(T,{key:0},[C("/ "+m(n(i)),1)],64)):f("",!0)]),a("div",null,m(n(v)),1)])),a("div",null,[Te,a("div",null,"Data size "+m(n(J)(n(e).data.size)),1),a("div",null,[We,u(D,{ar:n(e).fee.ar},null,8,["ar"])])])]),n(h).length?(r(),c(T,{key:0},[Ve,a("div",Pe,[u(q,{schema:n(h),disabled:""},null,8,["schema"])])],64)):f("",!0),n(p)?(r(),c("br",He)):f("",!0)])]}),_:2},[n(t)?{name:"right",fn:I(()=>[u(me,{tx:n(e),class:R({inline:!n(p)})},null,8,["tx","class"])])}:void 0]),1024)):f("",!0)}}});var qe=y(Ue,[["__scopeId","data-v-5f31ddc8"]]);export{qe as default};
//# sourceMappingURL=Tx.f6d6a113.js.map
