(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7a99c0af"],{"19bd":function(e,t,a){},"2ceb":function(e,t,a){"use strict";a("19bd")},"30de":function(e,t,a){"use strict";a.r(t);a("b0c0");var c=a("7a23"),n=Object(c["withScopeId"])("data-v-1747b7d0");Object(c["pushScopeId"])("data-v-1747b7d0");var r={class:"meta"},o=Object(c["createTextVNode"])("Tags "),d={class:"tags"},i={key:0},l={key:"iframe",class:"frame-container"},s={key:"img",class:"frame-container"},u={key:"json",class:"card-container"},b={class:"raw card"},p={key:"raw",class:"card-container"},j={class:"raw card"};Object(c["popScopeId"])();var O=n((function(e,t,a,O,v,f){var m=Object(c["resolveComponent"])("FoldingLayout");return O.tx?(Object(c["openBlock"])(),Object(c["createBlock"])(m,{key:0},Object(c["createSlots"])({left:n((function(){return[Object(c["createVNode"])("div",r,[Object(c["createVNode"])("div",null,"id "+Object(c["toDisplayString"])(O.tx.id),1),Object(c["createVNode"])("div",null,"block "+Object(c["toDisplayString"])(O.isPending?"Pending":O.tx.block.id),1),Object(c["createVNode"])("div",null,"date "+Object(c["toDisplayString"])(O.date),1),Object(c["createVNode"])("div",null,"data.size "+Object(c["toDisplayString"])(O.tx.data.size),1),Object(c["createVNode"])("div",null,"fee.ar "+Object(c["toDisplayString"])(O.tx.fee.ar),1),Object(c["createVNode"])("div",null,"owner.address "+Object(c["toDisplayString"])(O.tx.owner.address),1),Object(c["createVNode"])("div",null,"quantity.ar "+Object(c["toDisplayString"])(O.tx.quantity.ar),1),Object(c["createVNode"])("div",null,"recipient "+Object(c["toDisplayString"])(O.tx.recipient),1),Object(c["createVNode"])("div",null,[o,Object(c["createVNode"])("ul",d,[(Object(c["openBlock"])(!0),Object(c["createBlock"])(c["Fragment"],null,Object(c["renderList"])(O.tx.tags,(function(e){return Object(c["openBlock"])(),Object(c["createBlock"])("li",{key:e.name},Object(c["toDisplayString"])(e.name)+" - "+Object(c["toDisplayString"])(e.value),1)})),128))])]),O.tx.data.size>0?(Object(c["openBlock"])(),Object(c["createBlock"])("div",i,"link")):Object(c["createCommentVNode"])("",!0)])]})),_:2},[O.data.handler?{name:"right",fn:n((function(){return[Object(c["createVNode"])(c["Transition"],{name:O.verticalContent?"slide-up":"slide-left",appear:""},{default:n((function(){return["iframe"===O.data.handler?Object(c["withDirectives"])((Object(c["openBlock"])(),Object(c["createBlock"])("div",l,[Object(c["createVNode"])("iframe",{class:"iframe",src:O.ArweaveStore.gatewayURL+O.tx.id,onLoad:t[1]||(t[1]=function(e){return O.data.loaded=!0})},null,40,["src"])],512)),[[c["vShow"],O.data.loaded]]):"img"===O.data.handler?Object(c["withDirectives"])((Object(c["openBlock"])(),Object(c["createBlock"])("div",s,[Object(c["createVNode"])("img",{class:"img",src:O.ArweaveStore.gatewayURL+O.tx.id,onLoad:t[2]||(t[2]=function(e){return O.data.loaded=!0})},null,40,["src"])],512)),[[c["vShow"],O.data.loaded]]):"json"===O.data.handler?(Object(c["openBlock"])(),Object(c["createBlock"])("div",u,[Object(c["createVNode"])("pre",b,Object(c["toDisplayString"])(O.data.payload),1)])):"raw"===O.data.handler?(Object(c["openBlock"])(),Object(c["createBlock"])("div",p,[Object(c["createVNode"])("div",j,Object(c["toDisplayString"])(O.data.payload),1)])):Object(c["createCommentVNode"])("",!0)]})),_:1},8,["name"])]}))}:void 0]),1024)):Object(c["createCommentVNode"])("",!0)})),v=a("1da1"),f=(a("96cf"),a("ac1f"),a("1276"),a("c4bb")),m=a("319a"),g=a("1205"),k={components:{FoldingLayout:f["a"]},props:{txId:String},setup:function(e){var t=Object(c["ref"])(null),a=Object(c["reactive"])({payload:null,handler:null,loaded:!1}),n=Object(c["computed"])((function(){var e;return"0"!==(null===(e=t.value.data)||void 0===e?void 0:e.size)})),r=Object(c["computed"])((function(){return!t.value.block})),o=Object(c["computed"])((function(){if(r.value)return"";var e=new Date(1e3*t.value.block.timestamp);return e.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})+" "+e.toLocaleTimeString()})),d=Object(c["computed"])((function(){return g["a"].breakpoints.verticalContent}));Object(c["watch"])((function(){return e.txId}),Object(v["a"])(regeneratorRuntime.mark((function c(){var r,o,d,i;return regeneratorRuntime.wrap((function(c){while(1)switch(c.prev=c.next){case 0:return c.next=2,Object(m["e"])(e.txId);case 2:if(t.value=c.sent,a.handler=null,a.loaded=!1,n.value){c.next=9;break}return c.abrupt("return");case 9:if("text/html"!==(null===(r=t.value.data)||void 0===r?void 0:r.type)&&"application/pdf"!==(null===(o=t.value.data)||void 0===o?void 0:o.type)){c.next=13;break}a.handler="iframe",c.next=36;break;case 13:if("image"!==(null===(d=t.value.data)||void 0===d||null===(i=d.type)||void 0===i?void 0:i.split("/")[0])){c.next=17;break}a.handler="img",c.next=36;break;case 17:return console.log("getting data"),c.prev=18,c.next=21,m["a"].transactions.getData(e.txId,{decode:!0,string:!0});case 21:if(a.payload=c.sent,c.prev=22,a.payload=JSON.stringify(JSON.parse(a.payload),null,2),"{"===a.payload[0]){c.next=26;break}throw"";case 26:a.handler="json",c.next=32;break;case 29:c.prev=29,c.t0=c["catch"](22),a.handler="raw";case 32:c.next=36;break;case 34:c.prev=34,c.t1=c["catch"](18);case 36:case"end":return c.stop()}}),c,null,[[18,34],[22,29]])}))),{immediate:!0});var i=function(){console.log("loaded"),a.loaded=!0};return{ArweaveStore:m["b"],tx:t,data:a,loaded:i,isData:n,isPending:r,date:o,verticalContent:d}}};a("2ceb");k.render=O,k.__scopeId="data-v-1747b7d0";t["default"]=k}}]);
//# sourceMappingURL=chunk-7a99c0af.2fbeb7dc.js.map