(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-77c6c930"],{"299e":function(e,t,a){},"30de":function(e,t,a){"use strict";a.r(t);var c=a("7a23"),r=Object(c["withScopeId"])("data-v-2d38d478");Object(c["pushScopeId"])("data-v-2d38d478");var n={class:"meta flex-column"},o={class:"card"},d={class:"row flex-row"},l={class:"item",style:{"font-size":"1.5em"}},i={class:"row flex-row"},s={class:"item"},u={class:"row flex-row"},b={class:"item"},v=Object(c["createVNode"])("h3",null,"Properties",-1),j={class:"card"},O=Object(c["createVNode"])("h3",null,"ID",-1),p={class:"ellipsis"},m={key:0},f=Object(c["createVNode"])("br",null,null,-1),k={key:1},h=Object(c["createVNode"])("h3",null,"Pending",-1),x={key:2},N=Object(c["createVNode"])("h3",null,"Block ",-1),V={class:"ellipsis"},g=Object(c["createVNode"])("br",null,null,-1),y=Object(c["createVNode"])("h3",null,"Data",-1),w=Object(c["createTextVNode"])("Fee "),S=Object(c["createTextVNode"])(" "),B=Object(c["createTextVNode"])("|"),I=Object(c["createVNode"])("h3",null,"Tags",-1),C={style:{background:"var(--background2)","border-radius":"var(--border-radius)"}},D={key:"iframe",class:"frame-container"},L={key:"img",class:"frame-container"},A={key:"smartweave"},T={key:"json",class:"data-container"},z={class:"raw"};Object(c["popScopeId"])();var F=r((function(e,t,a,F,_,R){var J=Object(c["resolveComponent"])("Ar"),P=Object(c["resolveComponent"])("LocaleCurrency"),W=Object(c["resolveComponent"])("AddressIcon"),q=Object(c["resolveComponent"])("Address"),G=Object(c["resolveComponent"])("InputGrid"),U=Object(c["resolveComponent"])("SmartWeave"),M=Object(c["resolveComponent"])("FoldingLayout");return F.tx?(Object(c["openBlock"])(),Object(c["createBlock"])(M,{key:0},Object(c["createSlots"])({left:r((function(){return[Object(c["createVNode"])("div",n,[Object(c["createVNode"])("div",o,[Object(c["createVNode"])("div",d,[Object(c["createVNode"])("div",l,[Object(c["createVNode"])(J,{class:"ar",ar:F.tx.quantity.ar},null,8,["ar"]),Object(c["createVNode"])(P,{class:"small",ar:F.tx.quantity.ar},null,8,["ar"])])]),Object(c["createVNode"])("div",i,[Object(c["createVNode"])("div",s,[Object(c["createVNode"])(W,{address:F.tx.owner.address},null,8,["address"]),Object(c["createVNode"])(q,{class:"small",address:F.tx.owner.address},null,8,["address"])])]),Object(c["createVNode"])("div",u,[Object(c["createVNode"])("div",b,[Object(c["createVNode"])(W,{address:F.tx.recipient},null,8,["address"]),Object(c["createVNode"])(q,{class:"small",address:F.tx.recipient},null,8,["address"])])])]),v,Object(c["createVNode"])("div",j,[O,Object(c["createVNode"])("div",p,Object(c["toDisplayString"])(F.tx.id),1),F.tx.data.size>0?(Object(c["openBlock"])(),Object(c["createBlock"])("div",m,"Link")):Object(c["createCommentVNode"])("",!0),f,F.isPending?(Object(c["openBlock"])(),Object(c["createBlock"])("div",k,[h])):(Object(c["openBlock"])(),Object(c["createBlock"])("div",x,[N,Object(c["createVNode"])("div",V,Object(c["toDisplayString"])(F.tx.block.id),1),Object(c["createVNode"])("span",null,[Object(c["createTextVNode"])(Object(c["toDisplayString"])(F.tx.block.height),1),F.currentBlock?(Object(c["openBlock"])(),Object(c["createBlock"])(c["Fragment"],{key:0},[Object(c["createTextVNode"])(" / "+Object(c["toDisplayString"])(F.currentBlock),1)],64)):Object(c["createCommentVNode"])("",!0)]),Object(c["createVNode"])("div",null,Object(c["toDisplayString"])(F.date),1),g])),y,Object(c["createVNode"])("div",null,"Data size "+Object(c["toDisplayString"])(F.humanFileSize(F.tx.data.size)),1),Object(c["createVNode"])("div",null,[w,Object(c["createVNode"])(J,{class:"ar",ar:F.tx.fee.ar},null,8,["ar"]),S,Object(c["createVNode"])(P,{class:"small",ar:F.tx.fee.ar},{default:r((function(){return[B]})),_:1},8,["ar"])])]),F.tagsSchema.length?(Object(c["openBlock"])(),Object(c["createBlock"])(c["Fragment"],{key:0},[I,Object(c["createVNode"])("div",C,[Object(c["createVNode"])(G,{schema:F.tagsSchema,disabled:""},null,8,["schema"])])],64)):Object(c["createCommentVNode"])("",!0)])]})),_:2},[F.data.handler?{name:"right",fn:r((function(){return[Object(c["createVNode"])(c["Transition"],{name:F.verticalContent?"slide-up":"slide-left",appear:""},{default:r((function(){return["iframe"===F.data.handler?Object(c["withDirectives"])((Object(c["openBlock"])(),Object(c["createBlock"])("div",D,[Object(c["createVNode"])("iframe",{class:"iframe",src:F.ArweaveStore.gatewayURL+F.tx.id,onLoad:t[1]||(t[1]=function(e){return F.data.loaded=!0})},null,40,["src"])],512)),[[c["vShow"],F.data.loaded]]):"img"===F.data.handler?Object(c["withDirectives"])((Object(c["openBlock"])(),Object(c["createBlock"])("div",L,[Object(c["createVNode"])("img",{class:"img",src:F.ArweaveStore.gatewayURL+F.tx.id,onLoad:t[2]||(t[2]=function(e){return F.data.loaded=!0})},null,40,["src"])],512)),[[c["vShow"],F.data.loaded]]):"smartweave"===F.data.handler?(Object(c["openBlock"])(),Object(c["createBlock"])("div",A,[Object(c["createVNode"])(U,{txId:F.tx.id},null,8,["txId"])])):"json"===F.data.handler||"raw"===F.data.handler?(Object(c["openBlock"])(),Object(c["createBlock"])("div",T,[Object(c["createVNode"])("pre",z,Object(c["toDisplayString"])(F.data.payload),1)])):Object(c["createCommentVNode"])("",!0)]})),_:1},8,["name"])]}))}:void 0]),1024)):Object(c["createCommentVNode"])("",!0)})),_=a("b85c"),R=a("1da1"),J=(a("96cf"),a("ac1f"),a("1276"),a("7db0"),a("b0c0"),a("c4bb")),P=a("3f0a"),W=a("cff5"),q=a("9d5f"),G=a("d545"),U=a("0a2f"),M=Object(c["withScopeId"])("data-v-724b5eb4");Object(c["pushScopeId"])("data-v-724b5eb4");var E={class:"smart-weave"};Object(c["popScopeId"])();var H=M((function(e,t,a,r,n,o){return Object(c["openBlock"])(),Object(c["createBlock"])("div",E," SmartWeave Contract ")})),K={props:["txId"]};K.render=H,K.__scopeId="data-v-724b5eb4";var Q=K,X=a("319a"),Y=a("1205"),Z=a("0784"),$={components:{FoldingLayout:J["a"],Address:P["a"],AddressIcon:W["a"],InputGrid:q["a"],Ar:G["a"],LocaleCurrency:U["a"],SmartWeave:Q},props:{txId:String},setup:function(e){var t=Object(c["ref"])(null),r=Object(c["reactive"])({payload:null,handler:null,loaded:!1}),n=Object(c["computed"])((function(){var e;return"0"!==(null===(e=t.value.data)||void 0===e?void 0:e.size)})),o=Object(c["computed"])((function(){return!t.value.block})),d=Object(c["computed"])((function(){if(o.value)return"";var e=new Date(1e3*t.value.block.timestamp);return e.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})+" "+e.toLocaleTimeString()})),l=Object(c["computed"])((function(){return Y["a"].breakpoints.verticalContent}));Object(c["watch"])((function(){return e.txId}),Object(R["a"])(regeneratorRuntime.mark((function a(){var c,o,d,l,i,s,u;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,Object(X["e"])(e.txId);case 2:if(t.value=a.sent,t.value){a.next=5;break}return a.abrupt("return");case 5:if(r.handler=null,r.loaded=!1,n.value){a.next=11;break}return a.abrupt("return");case 11:if("application/x.arweave-manifest+json"!==(null===(c=t.value.data)||void 0===c?void 0:c.type)&&"text/html"!==(null===(o=t.value.data)||void 0===o?void 0:o.type)&&"application/pdf"!==(null===(d=t.value.data)||void 0===d?void 0:d.type)){a.next=15;break}r.handler="iframe",a.next=33;break;case 15:if("image"!==(null===(l=t.value.data)||void 0===l||null===(i=l.type)||void 0===i?void 0:i.split("/")[0])){a.next=19;break}r.handler="img",a.next=33;break;case 19:if("SmartWeaveContract"!==(null===(s=t.value.tags)||void 0===s||null===(u=s.find((function(e){return"App-Name"===e.name})))||void 0===u?void 0:u.value)){a.next=23;break}r.handler="smartweave",a.next=33;break;case 23:return r.handler="raw",a.prev=24,a.next=27,X["a"].transactions.getData(e.txId,{decode:!0,string:!0});case 27:if(r.payload=a.sent,"{"===r.payload[0])try{r.payload=JSON.stringify(JSON.parse(r.payload),null,2),r.handler="json"}catch(b){}a.next=33;break;case 31:a.prev=31,a.t0=a["catch"](24);case 33:case"end":return a.stop()}}),a,null,[[24,31]])}))),{immediate:!0});var i=function(){r.loaded=!0},s=Object(c["computed"])((function(){var e,c=[],r=Object(_["a"])(t.value.tags);try{for(r.s();!(e=r.n()).done;){var n=e.value;c.push({items:[{name:"Tag",value:n.name,attrs:{disabled:!0},icon:a("765c")},{name:"Value",value:n.value,attrs:{disabled:!0}}]})}}catch(o){r.e(o)}finally{r.f()}return c})),u=Object(c["ref"])(null);return Object(c["onMounted"])(Object(R["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,X["a"].network.getInfo();case 2:if(e.t1=t=e.sent,e.t0=null===e.t1,e.t0){e.next=6;break}e.t0=void 0===t;case 6:if(!e.t0){e.next=10;break}e.t2=void 0,e.next=11;break;case 10:e.t2=t.height;case 11:return e.abrupt("return",u.value=e.t2);case 12:case"end":return e.stop()}}),e)})))),{ArweaveStore:X["b"],tx:t,data:r,loaded:i,currentBlock:u,isData:n,isPending:o,date:d,verticalContent:l,tagsSchema:s,humanFileSize:Z["e"]}}};a("8b35");$.render=F,$.__scopeId="data-v-2d38d478";t["default"]=$},"8b35":function(e,t,a){"use strict";a("299e")}}]);
//# sourceMappingURL=chunk-77c6c930.67d1c37b.js.map