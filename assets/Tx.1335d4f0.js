import{_ as D,d as R,r as A,c as l,o,a as g,w as v,b as n,n as K,u as e,e as te,f as U,g as d,A as k,h as y,i as ae,j as ne,k as N,m as C,L as oe,l as se,T as P,p as T,q as u,B as re,s as F,t as _,v as z,x as p,y as ie,z as de,C as le,D as O,E as ce,F as E,G as J,H as ue,I as ve,O as he,J as pe,K as fe,M as _e,N as V,P as L,Q as me,R as ge,S as xe,U as ye,V as we,W as M}from"./index.5b67e890.js";import{I as be}from"./download.45578383.js";import{P as Q}from"./ProfilePreview.9e6b9e8e.js";const ke={class:"frame-scroller"},Ie=["src"],Se=R({props:["src"],emits:["load","error"],setup(c,{emit:s}){const h=A(null),a=A(null),t=A(null),x=r=>a.value=r.contentRect.width/r.contentRect.height,I=()=>{t.value=h.value&&h.value.naturalWidth/h.value.naturalHeight,s("load")},b=l(()=>a.value&&t.value&&a.value<t.value),i=l(()=>a.value&&t.value&&a.value>=t.value);return(r,f)=>(o(),g(te,{onResize:x,class:K(["img",{x:e(b),y:e(i)}])},{default:v(()=>[n("div",ke,[n("img",{ref_key:"imgRef",ref:h,src:c.src,onLoad:I,onError:f[0]||(f[0]=$=>s("error"))},null,40,Ie)])]),_:1},8,["class"]))}});var Ce=D(Se,[["__scopeId","data-v-416a5f9a"]]);const Te={controls:""},ze=["src","type"],Ae=y(" Not supported "),$e=R({props:{tx:null},setup(c){const s=c,h=l(()=>U(s.tx.tags));return(a,t)=>(o(),d("video",Te,[n("source",{src:e(k).gatewayURL+c.tx.id,type:e(h)["Content-Type"]},null,8,ze),Ae]))}});var G=D($e,[["__scopeId","data-v-67247f52"]]);const Le=y("Load large file"),De={key:"json",class:"selector data-container min-height box"},Re={key:1,class:"raw"},je={key:2,class:"selector"},Be=R({props:["tx"],setup(c){const s=c;ae(i=>({"0074eb30":x.value}));const h=l(()=>k.gatewayURL+s.tx.id),a=l(()=>"https://arcode.studio/#/"+s.tx.id+"?theme=dark-blue&hideToolbar=true"),t=ne({handler:void 0,payload:void 0,loaded:!1,error:!1,intent:!1}),x=A(void 0);N(()=>s.tx.id,()=>{t.handler=void 0,t.payload=void 0,t.loaded=!1,t.error=!1,t.intent=!1,x.value="pre-wrap",I()},{immediate:!0}),N(()=>t.intent,()=>t.intent&&I());async function I(){if(!s.tx||s.tx.data?.size==="0"||s.tx.data?.size==null)return;const i=U(s.tx.tags);if(i["Bundle-Version"])return t.loaded=!0,t.handler={is:C(oe),attrs:{query:se({bundledIn:s.tx.id}),component:C(P),componentProps:{options:{space:!0}},class:["column"]},containerAttrs:{class:["data-container","column-container","padding"]}};if(i["Content-Type"]==="application/x.arweave-manifest+json"||i["Content-Type"]==="text/html"||i["Content-Type"]==="application/pdf")return t.handler={is:"iframe",attrs:{src:h.value,class:["hover"]},containerAttrs:{class:["iframe-container","fixed-height"]}};if(i["Content-Type"]?.split("/")[0]==="video")return t.loaded=!0,t.handler={is:C(G),attrs:{tx:s.tx},containerAttrs:{class:["iframe-container"]}};if(i["Content-Type"]?.split("/")[0]==="audio")return t.loaded=!0,t.handler={is:C(G),attrs:{tx:s.tx},containerAttrs:{class:["iframe-container"]}};if(s.tx.data.size>104857600&&!t.intent)return t.handler="intent";if(i["Content-Type"]?.split("/")[0]==="image")return t.handler={is:C(Ce),attrs:{src:h.value},containerAttrs:{class:["img-container"]}};if(i["App-Name"]==="SmartWeaveContract"||i["App-Name"]==="SmartWeaveContractSource")return t.handler={is:"iframe",attrs:{src:a.value},containerAttrs:{class:["iframe-container","fixed-height"]}};t.handler="raw";try{i["Content-Type"]==="application/gzip"&&(t.payload??=await b(s.tx.id))}catch(r){console.error(r)}try{t.payload??=(await T.api.get(s.tx.id)).data}catch{}try{t.payload??=await T.transactions.getData(s.tx.id,{decode:!0,string:!0})}catch{}if(t.payload?.[0]==="{"||t.payload?.[0]==="[")try{t.payload=JSON.stringify(JSON.parse(t.payload),null,2),x.value="pre"}catch{}t.loaded=!0}async function b(i){let r;try{r??=(await T.api.get(i,{responseType:"blob"})).data}catch{}try{r??=new Blob([await T.transactions.getData(i,{decode:!0})])}catch{}const f=new DecompressionStream("gzip"),$=r.stream().pipeThrough(f);return(await new Response($).blob()).text()}return(i,r)=>(o(),g(z,null,{default:v(()=>[e(t).handler==="intent"?(o(),d("div",{key:0,onClick:r[0]||(r[0]=f=>e(t).intent=!0),class:"selector data-container min-height box",style:{display:"flex","justify-content":"center","padding-top":"5em"}},[u(re,{icon:e(be)},{default:v(()=>[Le]),_:1},8,["icon"])])):e(t).handler==="raw"?(o(),d("div",De,[u(z,null,{default:v(()=>[!e(t).loaded&&!e(t).error?(o(),g(F,{key:0,class:"loader"})):(o(),d("pre",Re,_(e(t).payload),1))]),_:1})])):e(t).handler?(o(),d("div",je,[u(z,null,{default:v(()=>[!e(t).loaded&&!e(t).error?(o(),g(F,{key:0,class:"loader"})):p("",!0)]),_:1}),u(z,null,{default:v(()=>[ie(n("div",O(e(t).handler.containerAttrs,{class:"box"}),[(o(),g(le(e(t).handler.is),O(e(t).handler.attrs,{onLoad:r[1]||(r[1]=f=>e(t).loaded=!0),onError:r[2]||(r[2]=f=>{e(t).error=!0,e(ce).error("Failed to load")})}),null,16))],16),[[de,e(t).loaded]])]),_:1})])):p("",!0)]),_:1}))}});var Ve=D(Be,[["__scopeId","data-v-64d429f0"]]);const w=c=>(ye("data-v-06012e35"),c=c(),we(),c),Ne={key:0,style:{position:"relative",width:"100%","min-height":"var(--current-vh)",color:"var(--element-secondary)"}},Pe={key:0},Ue={key:1},He={class:"meta flex-column"},We={class:"box",style:{padding:"0"}},qe={key:1,class:"spacer"},Fe={key:2,class:"divider"},Oe=w(()=>n("h3",null,"Transaction",-1)),Ee={class:"flex-column"},Je={key:0},Me=["href"],Qe={key:1},Ge=["href"],Ke={class:"secondary-text"},Xe=y("ID:\xA0"),Ye={key:3},Ze=w(()=>n("h3",null,"Bundle",-1)),et={class:"flex-column"},tt={class:"secondary-text"},at=y("ID:\xA0"),nt={key:4},ot=w(()=>n("h3",null,"Pending",-1)),st={key:5},rt=w(()=>n("h3",null,"Block",-1)),it={key:0,class:"secondary-text"},dt=w(()=>n("div",{class:"spacer"},null,-1)),lt={class:"secondary-text"},ct=y("ID:\xA0"),ut=w(()=>n("h3",null,"Data",-1)),vt=y(" Fee: "),ht={key:0,style:{background:"var(--background)"}},pt=w(()=>n("h3",{style:{"margin-bottom":"0",padding:"var(--spacing) 0 0 var(--spacing)"}},"Tags",-1)),ft=R({props:{txId:null},setup(c){const s=c,h=E(J(s,"txId")),a=h.state,t=h.queryStatus,x=l(()=>a.value?.bundledIn?.id),b=E(x).state,i=l(()=>k.gatewayURL&&new URL(k.gatewayURL).hostname),r=l(()=>a.value?.bundledIn?.id||s.txId),f=ue({name:"single tx status",params:r,query:async m=>(await T.transactions.getStatus(m)).status,completed:m=>!r.value||a.value?.block||m&&m!==404,seconds:30}).state,$=l(()=>a.value?.owner&&M(a.value?.owner.address)),H=l(()=>a.value?.recipient&&M(a.value?.recipient)),j=l(()=>U(a.value?.tags||[])["Content-Type"]),W=l(()=>a.value?.data?.size!=="0"),X=l(()=>!a.value?.block),Y=l(()=>{if(!a.value?.block)return"";const m=new Date(a.value?.block.timestamp*1e3);return m.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})+" "+m.toLocaleTimeString()}),q=l(()=>L.value?.height&&a.value?.block?.height&&L.value?.height-a.value?.block?.height+1),Z=J(ve.breakpoints,"verticalContent"),B=A(0);return N(a,(m,S)=>{if(!!S){if(S?.bundledIn?.id===s.txId)return B.value=-1;B.value=1}}),(m,S)=>(o(),g(z,{vector:B.value,axis:"x"},{default:v(()=>[e(a)?(o(),g(pe,{key:c.txId},fe({left:v(()=>[n("div",He,[n("div",We,[n("div",{class:"box-padding flex-column",style:_e([e(a).tags.length&&"padding-bottom: 0"])},[u(P,{tx:e(a),options:{half:!0}},null,8,["tx"]),e(a).recipient?(o(),g(Q,{key:0,wallet:e(H)},null,8,["wallet"])):p("",!0),e(a).recipient?(o(),d("div",qe)):p("",!0),e(a).recipient?(o(),d("div",Fe)):p("",!0),u(Q,{wallet:e($)},null,8,["wallet"]),n("div",null,[Oe,n("div",Ee,[e(W)?(o(),d("div",Je,[n("a",{href:e(k).gatewayURL+e(a).id,target:"_blank"},_(e(i)),9,Me)])):p("",!0),e(j)==="application/x.arweave-manifest+json"?(o(),d("div",Qe,[n("a",{href:e(k).gatewayURL+"tx/"+e(a).id+"/data.json",target:"_blank"},"Manifest",8,Ge)])):p("",!0),n("div",Ke,[u(V,{tx:e(a).id},{default:v(()=>[Xe]),_:1},8,["tx"])])])]),e(a).bundledIn?.id?(o(),d("div",Ye,[Ze,n("div",et,[e(b)?(o(),g(P,{key:0,tx:e(b),options:{space:!0}},null,8,["tx"])):p("",!0),n("div",tt,[u(V,{tx:e(a).bundledIn?.id},{default:v(()=>[at]),_:1},8,["tx"])])])])):p("",!0),e(X)?(o(),d("div",nt,[ot,n("div",null,"Status: "+_(e(f)?e(f):"..."),1)])):(o(),d("div",st,[rt,n("div",null,[y(" Height: "+_(e(a).block.height)+" ",1),e(L)?.height?(o(),d("span",it,"/ "+_(e(L).height)+" ("+_(e(q))+" confirmation"+_(e(q)>1?"s":"")+")",1)):p("",!0)]),n("div",null,_(e(Y)),1),dt,n("div",lt,[u(V,{block:e(a).block.id},{default:v(()=>[ct]),_:1},8,["block"])])])),n("div",null,[ut,n("div",null,"Size: "+_(e(me)(e(a).data.size)),1),n("div",null,[vt,u(ge,{ar:e(a).fee.ar},null,8,["ar"])])])],4),e(a).tags.length?(o(),d("div",ht,[pt,u(xe,{modelValue:e(a).tags,"onUpdate:modelValue":S[0]||(S[0]=ee=>e(a).tags=ee),disabled:""},null,8,["modelValue"])])):p("",!0)])])]),_:2},[e(a)&&e(W)?{name:"right",fn:v(()=>[u(Ve,{tx:e(a),class:K({inline:!e(Z)})},null,8,["tx","class"])])}:void 0]),1024)):(o(),d("div",Ne,[u(he,{options:{icon:"loader"},class:"box"},{default:v(()=>[e(t).error?(o(),d("h2",Pe,_(e(t).error),1)):(o(),d("h2",Ue,"Loading"))]),_:1})]))]),_:1},8,["vector"]))}});var xt=D(ft,[["__scopeId","data-v-06012e35"]]);export{xt as default};
//# sourceMappingURL=Tx.1335d4f0.js.map