(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-211cab62"],{"30de":function(e,t,a){"use strict";a.r(t);a("b0c0");var c=a("7a23"),n=Object(c["withScopeId"])("data-v-49219f31");Object(c["pushScopeId"])("data-v-49219f31");var r={class:"meta"},o=Object(c["createTextVNode"])("Tags "),d={class:"tags"},i={key:0},l={key:"iframe",class:"frame-container"},s={key:"img",class:"frame-container"},u={key:"json",class:"card-container"},b={class:"raw card"},p={key:"raw",class:"card-container"},j={class:"raw card"};Object(c["popScopeId"])();var v=n((function(e,t,a,v,O,f){var m=Object(c["resolveComponent"])("FoldingLayout");return v.tx?(Object(c["openBlock"])(),Object(c["createBlock"])(m,{key:0,class:{verticalContent:v.verticalContent}},Object(c["createSlots"])({left:n((function(){return[Object(c["createVNode"])("div",r,[Object(c["createVNode"])("div",null,"id "+Object(c["toDisplayString"])(v.tx.id),1),Object(c["createVNode"])("div",null,"block "+Object(c["toDisplayString"])(v.isPending?"Pending":v.tx.block.id),1),Object(c["createVNode"])("div",null,"date "+Object(c["toDisplayString"])(v.date),1),Object(c["createVNode"])("div",null,"data.size "+Object(c["toDisplayString"])(v.tx.data.size),1),Object(c["createVNode"])("div",null,"fee.ar "+Object(c["toDisplayString"])(v.tx.fee.ar),1),Object(c["createVNode"])("div",null,"owner.address "+Object(c["toDisplayString"])(v.tx.owner.address),1),Object(c["createVNode"])("div",null,"quantity.ar "+Object(c["toDisplayString"])(v.tx.quantity.ar),1),Object(c["createVNode"])("div",null,"recipient "+Object(c["toDisplayString"])(v.tx.recipient),1),Object(c["createVNode"])("div",null,[o,Object(c["createVNode"])("ul",d,[(Object(c["openBlock"])(!0),Object(c["createBlock"])(c["Fragment"],null,Object(c["renderList"])(v.tx.tags,(function(e){return Object(c["openBlock"])(),Object(c["createBlock"])("li",{key:e.name},Object(c["toDisplayString"])(e.name)+" - "+Object(c["toDisplayString"])(e.value),1)})),128))])]),v.tx.data.size>0?(Object(c["openBlock"])(),Object(c["createBlock"])("div",i,"link")):Object(c["createCommentVNode"])("",!0)])]})),_:2},[v.data.handler?{name:"right",fn:n((function(){return[Object(c["createVNode"])(c["Transition"],{name:v.verticalContent?"slide-up":"slide-left",appear:""},{default:n((function(){return["iframe"===v.data.handler?Object(c["withDirectives"])((Object(c["openBlock"])(),Object(c["createBlock"])("div",l,[Object(c["createVNode"])("iframe",{class:"iframe",src:v.ArweaveStore.gatewayURL+v.tx.id,onLoad:t[1]||(t[1]=function(e){return v.data.loaded=!0})},null,40,["src"])],512)),[[c["vShow"],v.data.loaded]]):"img"===v.data.handler?Object(c["withDirectives"])((Object(c["openBlock"])(),Object(c["createBlock"])("div",s,[Object(c["createVNode"])("img",{class:"img",src:v.ArweaveStore.gatewayURL+v.tx.id,onLoad:t[2]||(t[2]=function(e){return v.data.loaded=!0})},null,40,["src"])],512)),[[c["vShow"],v.data.loaded]]):"json"===v.data.handler?(Object(c["openBlock"])(),Object(c["createBlock"])("div",u,[Object(c["createVNode"])("pre",b,Object(c["toDisplayString"])(v.data.payload),1)])):"raw"===v.data.handler?(Object(c["openBlock"])(),Object(c["createBlock"])("div",p,[Object(c["createVNode"])("div",j,Object(c["toDisplayString"])(v.data.payload),1)])):Object(c["createCommentVNode"])("",!0)]})),_:1},8,["name"])]}))}:void 0]),1032,["class"])):Object(c["createCommentVNode"])("",!0)})),O=a("1da1"),f=(a("96cf"),a("ac1f"),a("1276"),a("c4bb")),m=a("319a"),g=a("1205"),k={components:{FoldingLayout:f["a"]},props:{txId:String},setup:function(e){var t=Object(c["ref"])(null),a=Object(c["reactive"])({payload:null,handler:null,loaded:!1}),n=Object(c["computed"])((function(){var e;return"0"!==(null===(e=t.value.data)||void 0===e?void 0:e.size)})),r=Object(c["computed"])((function(){return!t.value.block})),o=Object(c["computed"])((function(){if(r.value)return"";var e=new Date(1e3*t.value.block.timestamp);return e.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})+" "+e.toLocaleTimeString()})),d=Object(c["computed"])((function(){return g["a"].breakpoints.verticalContent}));Object(c["watch"])((function(){return e.txId}),Object(O["a"])(regeneratorRuntime.mark((function c(){var r,o,d,i;return regeneratorRuntime.wrap((function(c){while(1)switch(c.prev=c.next){case 0:return c.next=2,Object(m["d"])(e.txId);case 2:if(t.value=c.sent,a.handler=null,a.loaded=!1,n.value){c.next=9;break}return c.abrupt("return");case 9:if("text/html"!==(null===(r=t.value.data)||void 0===r?void 0:r.type)&&"application/pdf"!==(null===(o=t.value.data)||void 0===o?void 0:o.type)){c.next=13;break}a.handler="iframe",c.next=36;break;case 13:if("image"!==(null===(d=t.value.data)||void 0===d||null===(i=d.type)||void 0===i?void 0:i.split("/")[0])){c.next=17;break}a.handler="img",c.next=36;break;case 17:return console.log("getting data"),c.prev=18,c.next=21,m["a"].transactions.getData(e.txId,{decode:!0,string:!0});case 21:if(a.payload=c.sent,c.prev=22,a.payload=JSON.stringify(JSON.parse(a.payload),null,2),"{"===a.payload[0]){c.next=26;break}throw"";case 26:a.handler="json",c.next=32;break;case 29:c.prev=29,c.t0=c["catch"](22),a.handler="raw";case 32:c.next=36;break;case 34:c.prev=34,c.t1=c["catch"](18);case 36:case"end":return c.stop()}}),c,null,[[18,34],[22,29]])}))),{immediate:!0});var i=function(){console.log("loaded"),a.loaded=!0};return{ArweaveStore:m["b"],tx:t,data:a,loaded:i,isData:n,isPending:r,date:o,verticalContent:d}}};a("4d47");k.render=v,k.__scopeId="data-v-49219f31";t["default"]=k},"4d47":function(e,t,a){"use strict";a("e326")},e326:function(e,t,a){}}]);
//# sourceMappingURL=chunk-211cab62.f1b2d58d.js.map