import{d as $,r as u,c as B,g as S,o as n,a as A,w as v,b as e,h as i,a1 as M,a2 as z,_ as I,R as T,Y as C,Z as O,e as g,a3 as R,i as c,u as p,a4 as f,t as b}from"./index-4b9ba95a.js";const y=a=>(C("data-v-eb6cfddd"),a=a(),O(),a),W={class:"bubbles"},G=y(()=>e("div",{class:"base"},null,-1)),L=["onAnimationiteration"],D={style:{position:"fixed"}},N=y(()=>e("defs",null,[e("filter",{id:"blob"},[e("feGaussianBlur",{in:"SourceGraphic",result:"blur",stdDeviation:"7"}),e("feColorMatrix",{in:"blur",result:"blob",values:"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -11"}),e("feMorphology",{in:"blob",result:"mask",operator:"erode",radius:"2"}),e("feComposite",{in:"blob",in2:"mask",operator:"out"})])],-1)),V=[N],E=$({__name:"TravellingBlocks",setup(a){const o=u(void 0),r=B(()=>Math.floor((o.value?.contentRect.width||0)/60)),s=u([]),l=u([]),m=t=>o.value=t,h=()=>{const t=o.value?.contentRect.height||0;return`
		--size:${(1.7+Math.random()*.5)*100}%;
		--distance:${t*.5+t*.5*Math.random()}px;
		--position:${Math.random()*100}%;
		--time:${4+Math.random()*18}s;
	`};S(r,t=>{s.value=Array(t).fill(0),l.value=Array(t).fill(void 0).map(()=>h())},{immediate:!0});const w=(t,d)=>{s.value[d]++,l.value[d]=h()};return(t,d)=>(n(),A(I,{class:"travelling-blocks",onResize:m},{default:v(()=>[e("div",W,[G,(n(!0),i(z,null,M(l.value.entries(),(k,_)=>(n(),i("div",{class:"bubble",key:_+"i"+s.value[_],style:T(k),onAnimationiteration:x=>w(x,_)},null,44,L))),128))]),(n(),i("svg",D,V))]),_:1}))}});const F=g(E,[["__scopeId","data-v-eb6cfddd"]]);const Y={class:"welcome flex-column"},Z={class:"main flex-column"},j={class:"column"},q={class:"logo-background"},H={class:"column content"},J={__name:"Welcome",setup(a){const o=R.arweaveOutline,r="The Arweave web wallet lets you deploy permanent data from the browser, connect your accounts securely to decentralized applications, and navigate the weave",s="Arweave Wallet";return(l,m)=>(n(),i("div",Y,[e("div",Z,[c(f,{name:"slide-down",appear:""},{default:v(()=>[e("div",j,[e("div",q,[c(p(o),{class:"logo"})])])]),_:1}),c(f,{name:"slide-down",appear:""},{default:v(()=>[e("div",H,[e("div",null,[e("h1",null,b(p(s)),1),e("p",null,b(p(r)),1)])])]),_:1})]),c(F)]))}},P=g(J,[["__scopeId","data-v-07aac147"]]);export{P as default};
//# sourceMappingURL=Welcome-c4b9c161.js.map