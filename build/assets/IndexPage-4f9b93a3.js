import{ao as vt,aw as yt,r as b,c as Ee,p as Le,a as Ae,j as n,T as $e,L as Ye,ax as Ge,O as wt,m as St}from"./index-f415b1f3.js";import{t as jt,L as oe,A as kt,P as It,g as zt}from"./LatestMovies-cc2619a0.js";import{P as Ct}from"./ProgressBar-2a87d027.js";import{c as ee}from"./createSvgIcon-4f7a0c31.js";import{S as Et,N as Lt,a as At}from"./swiper-slide-7403b21c.js";var Je={exports:{}};(()=>{var j={n:t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return j.d(e,{a:e}),e},d:(t,e)=>{for(var s in e)j.o(e,s)&&!j.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},R={};j.r(R),j.d(R,{default:()=>bt});const q=yt;var w=j.n(q);const I=b;var x=j.n(I),S="fslightbox-",X="".concat(S,"styles"),V="".concat(S,"cursor-grabbing"),B="".concat(S,"full-dimension"),T="".concat(S,"flex-centered"),M="".concat(S,"transform-transition"),L="".concat(S,"absoluted"),W="".concat(S,"fade-in"),C="".concat(S,"fade-out"),z=W+"-strong",D=C+"-strong",Y="".concat(S,"opacity-1");const O=function(t){var e=t.size,s=t.viewBox,l=t.d;return x().createElement("svg",{width:e,height:e,viewBox:s,xmlns:"http://www.w3.org/2000/svg"},x().createElement("path",{className:"".concat(S,"svg-path"),d:l}))},E=function(t){var e=t.onClick,s=t.viewBox,l=t.size,r=t.d,c=t.title;return x().createElement("div",{onClick:e,className:"".concat(S,"toolbar-button ").concat(T),title:c},x().createElement(O,{viewBox:s,size:l,d:r}))};function ae(t,e){(e==null||e>t.length)&&(e=t.length);for(var s=0,l=new Array(e);s<e;s++)l[s]=t[s];return l}function xe(t){var e=t.o,s=e.fs,l=s.o,r=s.x,c=e.fss,d=function(a,p){return function(u){if(Array.isArray(u))return u}(a)||function(u,m){var h=u==null?null:typeof Symbol<"u"&&u[Symbol.iterator]||u["@@iterator"];if(h!=null){var g,v,y,k,U=[],H=!0,N=!1;try{if(y=(h=h.call(u)).next,m===0){if(Object(h)!==h)return;H=!1}else for(;!(H=(g=y.call(h)).done)&&(U.push(g.value),U.length!==m);H=!0);}catch(_){N=!0,v=_}finally{try{if(!H&&h.return!=null&&(k=h.return(),Object(k)!==k))return}finally{if(N)throw v}}return U}}(a,p)||function(u,m){if(u){if(typeof u=="string")return ae(u,m);var h=Object.prototype.toString.call(u).slice(8,-1);return h==="Object"&&u.constructor&&(h=u.constructor.name),h==="Map"||h==="Set"?Array.from(u):h==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(h)?ae(u,m):void 0}}(a,p)||function(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}()}((0,I.useState)(!1),2),o=d[0],i=d[1];return c.g=function(){return o},c.s=i,x().createElement(E,{onClick:o?r:l,viewBox:o?"0 0 950 1024":"0 0 18 18",size:o?"24px":"20px",d:o?"M682 342h128v84h-212v-212h84v128zM598 810v-212h212v84h-128v128h-84zM342 342v-128h84v212h-212v-84h128zM214 682v-84h212v212h-84v-128h-128z":"M4.5 11H3v4h4v-1.5H4.5V11zM3 7h1.5V4.5H7V3H3v4zm10.5 6.5H11V15h4v-4h-1.5v2.5zM11 3v1.5h2.5V7H15V3h-4z",title:o?"Exit fullscreen":"Enter fullscreen"})}const he=function(t){var e=t.fsLightbox.core.lightboxCloser.closeLightbox;return x().createElement(E,{onClick:e,viewBox:"0 0 24 24",size:"20px",d:"M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z",title:"Close"})},se=function(t){var e=t.fsLightbox;return x().createElement("div",{className:"".concat(S,"toolbar")},x().createElement(xe,{o:e}),x().createElement(he,{fsLightbox:e}))};function A(t,e){(e==null||e>t.length)&&(e=t.length);for(var s=0,l=new Array(e);s<e;s++)l[s]=t[s];return l}const ge=function(t){var e,s,l=t.fsLightbox,r=l.componentsServices,c=l.props.sources,d=l.stageIndexes,o=(e=(0,I.useState)(d.current+1),s=2,function(m){if(Array.isArray(m))return m}(e)||function(m,h){var g=m==null?null:typeof Symbol<"u"&&m[Symbol.iterator]||m["@@iterator"];if(g!=null){var v,y,k,U,H=[],N=!0,_=!1;try{if(k=(g=g.call(m)).next,h===0){if(Object(g)!==g)return;N=!1}else for(;!(N=(v=k.call(g)).done)&&(H.push(v.value),H.length!==h);N=!0);}catch(F){_=!0,y=F}finally{try{if(!N&&g.return!=null&&(U=g.return(),Object(U)!==U))return}finally{if(_)throw y}}return H}}(e,s)||function(m,h){if(m){if(typeof m=="string")return A(m,h);var g=Object.prototype.toString.call(m).slice(8,-1);return g==="Object"&&m.constructor&&(g=m.constructor.name),g==="Map"||g==="Set"?Array.from(m):g==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(g)?A(m,h):void 0}}(e,s)||function(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}()),i=o[0],a=o[1];r.setSlideNumber=function(m){a(m)};var p=x().createRef(),u=x().createRef();return(0,I.useEffect)(function(){u.current.offsetWidth>55&&(p.current.style.justifyContent="flex-start")},[]),x().createElement("div",{ref:p,className:"".concat(S,"slide-number-container")},x().createElement("div",{ref:u,className:"fslightbox-flex-centered"},x().createElement("span",null,i),x().createElement("span",{className:"".concat(S,"slash")}),x().createElement("span",null,c.length)))},be=function(t){var e=t.fsLightbox;return x().createElement("div",{className:"".concat(S,"nav")},x().createElement(se,{fsLightbox:e}),e.props.sources.length>1&&x().createElement(ge,{fsLightbox:e}))};function le(t,e){(e==null||e>t.length)&&(e=t.length);for(var s=0,l=new Array(e);s<e;s++)l[s]=t[s];return l}function ve(t){var e,s,l=t.o,r=(e=(0,I.useState)(0),s=2,function(o){if(Array.isArray(o))return o}(e)||function(o,i){var a=o==null?null:typeof Symbol<"u"&&o[Symbol.iterator]||o["@@iterator"];if(a!=null){var p,u,m,h,g=[],v=!0,y=!1;try{if(m=(a=a.call(o)).next,i===0){if(Object(a)!==a)return;v=!1}else for(;!(v=(p=m.call(a)).done)&&(g.push(p.value),g.length!==i);v=!0);}catch(k){y=!0,u=k}finally{try{if(!v&&a.return!=null&&(h=a.return(),Object(h)!==h))return}finally{if(y)throw u}}return g}}(e,s)||function(o,i){if(o){if(typeof o=="string")return le(o,i);var a=Object.prototype.toString.call(o).slice(8,-1);return a==="Object"&&o.constructor&&(a=o.constructor.name),a==="Map"||a==="Set"?Array.from(o):a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?le(o,i):void 0}}(e,s)||function(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}()),c=r[0],d=r[1];return l.ssh=function(){return d(1)},l.hsh=function(){return d(0)},c&&x().createElement("div",{className:"fslightboxsh ".concat(B).concat(L)})}const f=function(t){var e=t.onClick,s=t.name,l=t.d,r=s.charAt(0).toUpperCase()+s.slice(1),c="".concat(S,"slide-btn");return x().createElement("div",{onClick:e,title:"".concat(r," slide"),className:"".concat(c,"-container ").concat(c,"-").concat(s,"-container")},x().createElement("div",{className:"".concat(c," ").concat(T)},x().createElement(O,{viewBox:"0 0 20 20",size:"20px",d:l})))};function $(t,e){(e==null||e>t.length)&&(e=t.length);for(var s=0,l=new Array(e);s<e;s++)l[s]=t[s];return l}function ne(t){var e=t.o,s=e.elements.sourcesComponents,l=e.isl,r=e.loc,c=e.saw,d=e.sawu,o=e.st,i=e.stageIndexes.current,a=t.i,p=function(h,g){return function(v){if(Array.isArray(v))return v}(h)||function(v,y){var k=v==null?null:typeof Symbol<"u"&&v[Symbol.iterator]||v["@@iterator"];if(k!=null){var U,H,N,_,F=[],P=!0,Q=!1;try{if(N=(k=k.call(v)).next,y===0){if(Object(k)!==k)return;P=!1}else for(;!(P=(U=N.call(k)).done)&&(F.push(U.value),F.length!==y);P=!0);}catch(ue){Q=!0,H=ue}finally{try{if(!P&&k.return!=null&&(_=k.return(),Object(_)!==_))return}finally{if(Q)throw H}}return F}}(h,g)||function(v,y){if(v){if(typeof v=="string")return $(v,y);var k=Object.prototype.toString.call(v).slice(8,-1);return k==="Object"&&v.constructor&&(k=v.constructor.name),k==="Map"||k==="Set"?Array.from(v):k==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(k)?$(v,y):void 0}}(h,g)||function(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}()}((0,I.useState)(!1),2),u=p[0],m=p[1];return d[a]=function(){m(!u)},x().createElement("div",{ref:c[a]},!l[a]&&x().createElement("div",{className:"fslightboxl"},x().createElement("div",null),x().createElement("div",null),x().createElement("div",null),x().createElement("div",null)),(a===i||!r&&o.i(a))&&s[a])}function ie(t){var e=t.o,s=t.i,l=e.props.slideDistance,r=e.smw,c=e.smwm,d=e.st,o=0;c[s]={};var i=c[s];function a(){return r[s].current}function p(m){a().style.transform="translateX(".concat(m+o,"px)"),o=0}function u(){return(1+l)*innerWidth}return i.s=function(){a().style.display="flex"},i.h=function(){a().style.display="none"},i.a=function(){a().classList.add(M)},i.d=function(){a().classList.remove(M)},i.n=function(){a().style.removeProperty("transform")},i.v=function(m){return o=m,i},i.ne=function(){p(-u())},i.z=function(){p(0)},i.p=function(){p(u())},x().createElement("div",{ref:r[s],className:"".concat(L," ").concat(B," ").concat(T),style:d.i(s)?{}:{display:"none"}},x().createElement(ne,{o:e,i:s}))}function G(t){return t.touches?t.touches[0].screenX:t.screenX}const J=function(t){for(var e=t.o,s=[],l=0;l<e.sl;l++)s.push(x().createElement(ie,{o:e,i:l,key:l}));return x().createElement("div",{className:"".concat(L," ").concat(B),onPointerDown:function(r){(function(c,d){var o=c.elements.sources,i=c.p,a=c.smwm,p=c.stageIndexes;d.target.tagName==="IMG"&&d.preventDefault(),i.isSwiping=!0,i.downScreenX=G(d),i.swipedX=0;var u=o[p.current].current;u&&u.contains(d.target)?i.isSourceDownEventTarget=!0:i.isSourceDownEventTarget=!1;for(var m=0;m<a.length;m++)a[m].d()})(e,r)}},s)};var tt=".fslightbox-absoluted{position:absolute;top:0;left:0}.fslightbox-fade-in{animation:fslightbox-fade-in .25s cubic-bezier(0,0,.7,1)}.fslightbox-fade-out{animation:fslightbox-fade-out .25s ease}.fslightbox-fade-in-strong{animation:fslightbox-fade-in-strong .25s cubic-bezier(0,0,.7,1)}.fslightbox-fade-out-strong{animation:fslightbox-fade-out-strong .25s ease}@keyframes fslightbox-fade-in{from{opacity:.65}to{opacity:1}}@keyframes fslightbox-fade-out{from{opacity:.35}to{opacity:0}}@keyframes fslightbox-fade-in-strong{from{opacity:.3}to{opacity:1}}@keyframes fslightbox-fade-out-strong{from{opacity:1}to{opacity:0}}.fslightbox-cursor-grabbing{cursor:grabbing}.fslightbox-full-dimension{width:100%;height:100%}.fslightbox-open{overflow:hidden;height:100%}.fslightbox-flex-centered{display:flex;justify-content:center;align-items:center}.fslightbox-opacity-0{opacity:0!important}.fslightbox-opacity-1{opacity:1!important}.fslightbox-scrollbarfix{padding-right:17px}.fslightbox-transform-transition{transition:transform .3s}.fslightbox-container{font-family:Arial,sans-serif;position:fixed;top:0;left:0;background:linear-gradient(rgba(30,30,30,.9),#000 1810%);z-index:1000000000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;touch-action:none;-webkit-tap-highlight-color:transparent}.fslightbox-container *{box-sizing:border-box}.fslightbox-svg-path{transition:fill .15s ease;fill:#ddd}.fslightbox-nav{height:45px;width:100%;position:absolute;top:0;left:0}.fslightbox-slide-number-container{display:flex;justify-content:center;align-items:center;position:relative;height:100%;font-size:15px;color:#d7d7d7;z-index:0;max-width:55px;text-align:left}.fslightbox-slash{display:block;margin:0 5px;width:1px;height:12px!important;transform:rotate(15deg);background:#fff}.fslightbox-toolbar{position:absolute;z-index:3;right:0;top:0;height:100%;display:flex;background:rgba(35,35,35,.65)}.fslightbox-toolbar-button{height:100%;width:45px;cursor:pointer}.fslightbox-toolbar-button:hover .fslightbox-svg-path{fill:#fff}.fslightbox-slide-btn-container{display:flex;align-items:center;padding:12px 12px 12px 6px;position:absolute;top:50%;cursor:pointer;z-index:3;transform:translateY(-50%)}@media (min-width:476px){.fslightbox-slide-btn-container{padding:22px 22px 22px 6px}}@media (min-width:768px){.fslightbox-slide-btn-container{padding:30px 30px 30px 6px}}.fslightbox-slide-btn-container:hover .fslightbox-svg-path{fill:#f1f1f1}.fslightbox-slide-btn{padding:9px;font-size:26px;background:rgba(35,35,35,.65)}@media (min-width:768px){.fslightbox-slide-btn{padding:10px}}@media (min-width:1600px){.fslightbox-slide-btn{padding:11px}}.fslightbox-slide-btn-previous-container{left:0}@media (max-width:475.99px){.fslightbox-slide-btn-previous-container{padding-left:3px}}.fslightbox-slide-btn-next-container{right:0;padding-left:12px;padding-right:3px}@media (min-width:476px){.fslightbox-slide-btn-next-container{padding-left:22px}}@media (min-width:768px){.fslightbox-slide-btn-next-container{padding-left:30px}}@media (min-width:476px){.fslightbox-slide-btn-next-container{padding-right:6px}}.fslightbox-down-event-detector{position:absolute;z-index:1}.fslightboxsh{z-index:4}.fslightboxin{font-size:22px;color:#eaebeb;margin:auto}.fslightboxv{object-fit:cover}.fslightboxl{display:block;margin:auto;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:67px;height:67px}.fslightboxl div{box-sizing:border-box;display:block;position:absolute;width:54px;height:54px;margin:6px;border:5px solid;border-color:#999 transparent transparent transparent;border-radius:50%;animation:fslightboxl 1.2s cubic-bezier(.5,0,.5,1) infinite}.fslightboxl div:nth-child(1){animation-delay:-.45s}.fslightboxl div:nth-child(2){animation-delay:-.3s}.fslightboxl div:nth-child(3){animation-delay:-.15s}@keyframes fslightboxl{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.fslightboxs{position:relative;z-index:2;opacity:0;transform:translateZ(0);margin:auto;backface-visibility:hidden}";function We(){var t=document.createElement("style");t.className=X,t.appendChild(document.createTextNode(tt)),document.head.appendChild(t)}function ye(t){for(var e=t.props.sources,s=[],l=0;l<e.length;l++)s.push(x().createRef());return s}function Ne(t,e,s){for(var l=0;l<t.props.sources.length;l++)t.collections[e][l]=t.resolve(s,[l])}var Te="fslightbox-types";function nt(t){var e,s=t.props,l=!1,r={},c=0;if(this.getSourceTypeFromLocalStorageByUrl=function(o){return e[o]?e[o]:d(o)},this.handleReceivedSourceTypeForUrl=function(o,i){if(r[i]===l&&(c--,o!=="invalid"?r[i]=o:delete r[i],c===0)){(function(a,p){for(var u in p)a[u]=p[u]})(e,r);try{localStorage.setItem(Te,JSON.stringify(e))}catch{}}},s.disableLocalStorage)this.getSourceTypeFromLocalStorageByUrl=function(){},this.handleReceivedSourceTypeForUrl=function(){};else{try{e=JSON.parse(localStorage.getItem(Te))}catch{}e||(e={},this.getSourceTypeFromLocalStorageByUrl=d)}function d(o){c++,r[o]=l}}var Fe="image",Re="video",Me="youtube",Oe="custom",He="invalid";function we(){return we=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var l in s)Object.prototype.hasOwnProperty.call(s,l)&&(t[l]=s[l])}return t},we.apply(this,arguments)}function it(t){var e=t.o,s=e.collections.sourceLoadHandlers,l=e.elements.sources,r=e.props,c=r.customAttributes,d=r.sources,o=t.i;return x().createElement("img",we({className:"fslightboxs",onLoad:s[o].handleImageLoad,ref:l[o],src:d[o]},c&&c[o]?c[o]:{}))}function Se(){return Se=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var l in s)Object.prototype.hasOwnProperty.call(s,l)&&(t[l]=s[l])}return t},Se.apply(this,arguments)}function ot(t){var e=t.o,s=e.collections.sourceLoadHandlers,l=e.elements.sources,r=e.iap,c=e.props,d=c.customAttributes,o=c.sources,i=e.timeout,a=t.i;return i(s[a].handleNotMetaDatedVideoLoad,3e3),x().createElement("video",Se({ref:l[a],className:"fslightboxs fslightboxv",src:o[a],onLoadedMetadata:s[a].handleVideoLoad,controls:!0,autoPlay:r},d&&d[a]?d[a]:{}))}function je(){return je=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var l in s)Object.prototype.hasOwnProperty.call(s,l)&&(t[l]=s[l])}return t},je.apply(this,arguments)}function rt(t){var e=t.o,s=e.elements.sources,l=e.collections.sourceLoadHandlers,r=e.iap,c=e.props,d=c.customAttributes,o=c.sources,i=t.i;(0,I.useEffect)(l[i].handleYoutubeLoad);var a=o[i],p=a.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)[2],u=a.split("?")[1];return u=u||"",x().createElement("iframe",je({ref:s[i],className:"fslightboxs",src:"https://www.youtube.com/embed/".concat(p,"?enablejsapi=1&").concat(r?"&mute=1&autoplay=1":"","&").concat(u),frameBorder:"0",allowFullScreen:!0},d&&d[i]?d[i]:{}))}function at(t){var e=t.o,s=e.isl,l=e.sawu,r=e.smw,c=t.i;return(0,I.useEffect)(function(){s[c]=!0,l[c](),r[c].current.classList.add(z)}),x().createElement("div",{className:"fslightboxin ".concat(T)},"Invalid source")}function st(t){var e=t.o,s=e.collections.sourceLoadHandlers,l=e.elements.sources,r=e.props.sources,c=t.i;(0,I.useEffect)(s[c].handleCustomLoad);var d=r[c].props.className;return x().cloneElement(r[c],{ref:l[c],className:d?"".concat(d," fslightboxs"):"fslightboxs"})}function lt(t){var e=t.componentsServices.isLightboxOpenManager,s=t.elements.sourcesComponents,l=t.sawu;this.runActionsForSourceTypeAndIndex=function(r,c){var d;switch(r){case Fe:d=it;break;case Re:d=ot;break;case Me:d=rt;break;case Oe:d=st;break;default:d=at}s[c]=x().createElement(d,{o:t,i:c}),e.get()&&l[c]()}}function ct(t,e,s){var l=t.props,r=l.types,c=l.type,d=l.sources;this.getTypeSetByClientForIndex=function(o){var i;return r&&r[o]?i=r[o]:c&&(i=c),i},this.retrieveTypeWithXhrForIndex=function(o){(function(i,a){var p=document.createElement("a");p.href=i;var u=p.hostname;if(u==="www.youtube.com"||u==="youtu.be")return a(Me);var m=new XMLHttpRequest;m.onreadystatechange=function(){if(m.readyState!==4){if(m.readyState===2){var h,g=m.getResponseHeader("content-type");switch(g.slice(0,g.indexOf("/"))){case"image":h=Fe;break;case"video":h=Re;break;default:h=He}m.onreadystatechange=null,m.abort(),a(h)}}else a(He)},m.open("GET",i),m.send()})(d[o],function(i){e.handleReceivedSourceTypeForUrl(i,d[o]),s.runActionsForSourceTypeAndIndex(i,o)})}}function dt(t){var e=t.componentsServices.isLightboxOpenManager,s=t.core,l=s.lightboxCloser,r=s.slideIndexChanger,c=t.stageIndexes;this.runTogglerUpdateActions=function(){e.get()?l.closeLightbox():t.ii?t.o():t.i()},this.runCurrentStageIndexUpdateActionsFor=function(d){d!==c.current&&(e.get()?r.jumpTo(d):c.current=d)}}function Be(t){var e=t.core.lightboxUpdater,s=(0,t.resolve)(dt);e.handleUpdate=function(l){var r=t.props;r.source!==void 0?s.runCurrentStageIndexUpdateActionsFor(r.sources.indexOf(r.source)):r.sourceIndex!==void 0?s.runCurrentStageIndexUpdateActionsFor(r.sourceIndex):r.slide!==void 0&&s.runCurrentStageIndexUpdateActionsFor(r.slide-1),l.toggler!==r.toggler&&s.runTogglerUpdateActions()}}var Pe=250;function Ve(t){var e=t.loc,s=t.stageIndexes,l=t.sawu;if(e)l[s.current]();else for(var r in s){var c=s[r];c!==void 0&&l[c]()}}function ce(t,e){var s=t.current.classList;s.contains(e)&&s.remove(e)}function pt(t){var e,s=t.dss,l=t.p,r=t.sl,c=(e=!1,function(){return!e&&(e=!0,requestAnimationFrame(function(){e=!1}),!0)});this.a=r===1||s?function(){l.swipedX=1}:function(d){l.isSwiping&&c()&&function(o,i){o.componentsServices;var a=o.elements.container,p=o.p,u=o.smwm,m=o.stageIndexes;o.ssh(),a.current.classList.add(V),p.swipedX=G(i)-p.downScreenX;var h=m.previous,g=m.next;function v(y,k){u[y].v(p.swipedX)[k]()}v(m.current,"z"),h!==void 0&&p.swipedX>0?v(h,"ne"):g!==void 0&&p.swipedX<0&&v(g,"p")}(t,d)}}function ut(t){var e=t.core.slideIndexChanger,s=t.smwm,l=t.stageIndexes,r=t.sws;function c(o){var i=s[l.current];i.a(),i[o]()}function d(o,i){o!==void 0&&(s[o].s(),s[o][i]())}this.p=function(){var o=l.previous;if(o===void 0)c("z");else{c("p");var i=l.next;e.changeTo(o);var a=l.previous;r.d(a),r.b(i),c("z"),d(a,"ne")}},this.n=function(){var o=l.next;if(o===void 0)c("z");else{c("ne");var i=l.previous;e.changeTo(o);var a=l.next;r.d(a),r.b(i),c("z"),d(a,"p")}}}function mt(t){t.componentsServices;var e=t.core.lightboxCloser,s=t.dss,l=t.elements.container,r=t.p,c=t.props.disableBackgroundClose,d=(0,t.r)(ut);this.n=function(){t.hsh(),r.isSourceDownEventTarget||c||e.closeLightbox(),r.isSwiping=!1},this.s=function(){s||(r.swipedX>0?d.p():d.n()),t.hsh(),l.current.classList.remove(V),r.isSwiping=!1}}function ft(t){var e,s,l;(function(r){var c=r.ap,d=r.elements.sources,o=r.iap;function i(a,p){if(p!="play"||o){var u=d[a];if(u&&(u=u.current)){var m=u.tagName;if(m=="VIDEO")u[p]();else if(m=="IFRAME"){var h=u.contentWindow;h&&h.postMessage('{"event":"command","func":"'.concat(p,'Video","args":""}'),"*")}}}}c.p=function(a){i(a,"play")},c.c=function(a,p){i(a,"pause"),i(p,"play")}})(t),function(r){var c=r.props.sources,d=r.st,o=r.stageIndexes,i=c.length-1;d.p=function(){return o.current===0?i:o.current-1},d.n=function(){return o.current===i?0:o.current+1},d.u=i===0?function(){}:i===1?function(){o.current===0?(o.next=1,delete o.previous):(o.previous=0,delete o.next)}:function(){o.previous=d.p(),o.next=d.n()},d.i=i<=2?function(){return!0}:function(a){var p=o.current;if(p===0&&a===i||p===i&&a===0)return!0;var u=p-a;return u===-1||u===0||u===1}}(t),s=(e=t).core.classFacade,l=e.elements,s.removeFromEachElementClassIfContains=function(r,c){for(var d=0;d<l[r].length;d++)ce(l[r][d],c)},function(r){var c=r.fs,d=r.fss,o=["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"];function i(p){for(var u=0;u<o.length;u++)document[p](o[u],a)}function a(){d.s(document.fullscreenElement||document.webkitIsFullScreen||document.mozFullScreen||document.msFullscreenElement)}c.o=function(){d.s(!0);var p=document.documentElement;p.requestFullscreen?p.requestFullscreen():p.mozRequestFullScreen?p.mozRequestFullScreen():p.webkitRequestFullscreen?p.webkitRequestFullscreen():p.msRequestFullscreen&&p.msRequestFullscreen()},c.x=function(){d.s(!1),document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen()},c.t=function(){d.g()?c.x():c.o()},c.l=function(){i("addEventListener")},c.q=function(){i("removeEventListener")}}(t),function(r){var c,d,o=r.core,i=o.globalEventsController,a=o.windowResizeActioner,p=r.fs,u=(0,r.r)(pt);i.attachListeners=function(){document.addEventListener("pointermove",u.a),d=function(m){var h,g,v;g=(h=r).p,v=(0,h.r)(mt),g.isSwiping&&(g.swipedX?v.s():v.n())},document.addEventListener("pointerup",d),addEventListener("resize",a.runActions),c=function(m){(function(h,g){var v=h.core.lightboxCloser,y=h.fs;switch(g.key){case"Escape":v.closeLightbox();break;case"ArrowLeft":h.pr();break;case"ArrowRight":h.n();break;case"F11":g.preventDefault(),y.t()}})(r,m)},document.addEventListener("keydown",c),p.l()},i.removeListeners=function(){document.removeEventListener("pointermove",u.a),document.removeEventListener("pointerup",d),removeEventListener("resize",a.runActions),document.removeEventListener("keydown",c),p.q()}}(t),function(r){var c=r.core,d=c.lightboxCloser,o=c.lightboxCloseActioner;d.closeLightbox=function(){o.isLightboxFadingOut||o.runActions()}}(t),function(r){var c=r.componentsServices.isLightboxOpenManager,d=r.core,o=d.globalEventsController,i=d.lightboxCloseActioner,a=d.scrollbarRecompensor,p=r.e,u=r.elements.container,m=r.fs,h=r.fss,g=r.p,v=r.props,y=r.timeout;i.isLightboxFadingOut=!1,i.runActions=function(){i.isLightboxFadingOut=!0,u.current.classList.add(D),o.removeListeners(),v.exitFullscreenOnClose&&h.g()&&m.x(),y(function(){i.isLightboxFadingOut=!1,g.isSwiping=!1,u.current.classList.remove(D),document.documentElement.classList.remove("fslightbox-open"),a.removeRecompense(),c.set(!1),p("onClose")},Pe-30)}}(t),Be(t),function(r){var c=r.data,d=r.core.scrollbarRecompensor;d.addRecompense=function(){document.readyState==="complete"?o():window.addEventListener("load",function(){o(),d.addRecompense=o})};var o=function(){document.body.offsetHeight>window.innerHeight&&(document.body.style.marginRight=c.scrollbarWidth+"px")};d.removeRecompense=function(){document.body.style.removeProperty("margin-right")}}(t),function(r){var c=r.core.slideIndexChanger,d=r.sl,o=r.st;d>1?(r.pr=function(){c.jumpTo(o.p())},r.n=function(){c.jumpTo(o.n())}):(r.pr=function(){},r.n=function(){})}(t),function(r){var c=r.ap,d=r.componentsServices,o=r.core.slideIndexChanger,i=r.isl,a=r.saw,p=r.smwm,u=r.st,m=r.stageIndexes,h=r.sws;o.changeTo=function(g){c.c(m.current,g),m.current=g,u.u(),d.setSlideNumber(g+1),Ve(r)},o.jumpTo=function(g){var v=m.previous,y=m.current,k=m.next,U=i[y],H=i[g];o.changeTo(g);for(var N=0;N<p.length;N++)p[N].d();h.d(y),h.c(),requestAnimationFrame(function(){requestAnimationFrame(function(){var _=m.previous,F=m.current,P=m.next;function Q(){u.i(y)?y===m.previous?p[y].ne():y===m.next&&p[y].p():(p[y].h(),p[y].n())}U&&a[y].current.classList.add(C),H&&a[F].current.classList.add(W),h.a(),_!==void 0&&_!==y&&p[_].ne(),p[F].n(),P!==void 0&&P!==y&&p[P].p(),h.b(v),h.b(k),i[y]?setTimeout(Q,Pe-40):Q()})})}}(t),function(r){var c=r.isl,d=r.stageIndexes,o=r.saw,i=r.smwm,a=r.st,p=r.sws;p.a=function(){for(var u in d)i[d[u]].s()},p.b=function(u){u===void 0||a.i(u)||(i[u].h(),i[u].n())},p.c=function(){for(var u in d)p.d(d[u])},p.d=function(u){if(c[u]){var m=o[u];ce(m,z),ce(m,W),ce(m,C)}}}(t),function(r){var c=r.collections.sourceSizers,d=r.core.windowResizeActioner,o=r.data,i=r.elements.sources,a=r.smwm,p=r.stageIndexes;d.runActions=function(){innerWidth<992?o.maxSourceWidth=innerWidth:o.maxSourceWidth=.9*innerWidth,o.maxSourceHeight=.9*innerHeight;for(var u=0;u<i.length;u++)a[u].d(),c[u]&&i[u].current&&c[u].adjustSize();var m=p.previous,h=p.next;m!==void 0&&a[m].ne(),h!==void 0&&a[h].p()}}(t)}function xt(t,e,s,l){var r=t.data,c=t.elements.sources,d=s/l,o=0;this.adjustSize=function(){if((o=r.maxSourceWidth/d)<r.maxSourceHeight)return s<r.maxSourceWidth&&(o=l),i();o=l>r.maxSourceHeight?r.maxSourceHeight:l,i()};var i=function(){var a=c[e].current.style;a.width=o*d+"px",a.height=o+"px"}}function ht(t,e){var s=this,l=t.collections.sourceSizers,r=t.elements.sources,c=t.isl,d=t.resolve,o=t.saw,i=t.sawu;function a(p,u){l[e]=d(xt,[e,p,u]),l[e].adjustSize()}this.runActions=function(p,u){c[e]=!0,i[e](),r[e].current.classList.add(Y),o[e].current.classList.add(z),a(p,u),s.runActions=a}}function De(t,e){var s,l=this,r=t.elements.sources,c=t.props,d=(0,t.resolve)(ht,[e]);this.handleImageLoad=function(o){var i=o.target,a=i.naturalWidth,p=i.naturalHeight;d.runActions(a,p)},this.handleVideoLoad=function(o){var i=o.target,a=i.videoWidth,p=i.videoHeight;s=!0,d.runActions(a,p)},this.handleNotMetaDatedVideoLoad=function(){s||l.handleYoutubeLoad()},this.handleYoutubeLoad=function(){var o=1920,i=1080;c.maxYoutubeVideoDimensions&&(o=c.maxYoutubeVideoDimensions.width,i=c.maxYoutubeVideoDimensions.height),d.runActions(o,i)},this.handleCustomLoad=function(){var o=r[e].current;if(o){var i=o.offsetWidth,a=o.offsetHeight;i&&a?d.runActions(i,a):setTimeout(l.handleCustomLoad)}}}function ke(t){return ke=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},ke(t)}function te(t){return te=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},te(t)}function Ie(t,e,s){return Ie=Ue()?Reflect.construct.bind():function(l,r,c){var d=[null];d.push.apply(d,r);var o=new(Function.bind.apply(l,d));return c&&de(o,c.prototype),o},Ie.apply(null,arguments)}function ze(t,e){(e==null||e>t.length)&&(e=t.length);for(var s=0,l=new Array(e);s<e;s++)l[s]=t[s];return l}function gt(t,e){for(var s=0;s<e.length;s++){var l=e[s];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(t,(r=function(c,d){if(te(c)!=="object"||c===null)return c;var o=c[Symbol.toPrimitive];if(o!==void 0){var i=o.call(c,"string");if(te(i)!=="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(c)}(l.key),te(r)==="symbol"?r:String(r)),l)}var r}function de(t,e){return de=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(s,l){return s.__proto__=l,s},de(t,e)}function Z(t){if(t===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function Ue(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function pe(t){return pe=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},pe(t)}(typeof document>"u"?"undefined":ke(document))==="object"&&We();var Ce=function(t){(function(o,i){if(typeof i!="function"&&i!==null)throw new TypeError("Super expression must either be null or a function");o.prototype=Object.create(i&&i.prototype,{constructor:{value:o,writable:!0,configurable:!0}}),Object.defineProperty(o,"prototype",{writable:!1}),i&&de(o,i)})(d,t);var e,s,l,r,c=(l=d,r=Ue(),function(){var o,i=pe(l);if(r){var a=pe(this).constructor;o=Reflect.construct(i,arguments,a)}else o=i.apply(this,arguments);return function(p,u){if(u&&(te(u)==="object"||typeof u=="function"))return u;if(u!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return Z(p)}(this,o)});function d(o){var i;return function(a,p){if(!(a instanceof p))throw new TypeError("Cannot call a class as a function")}(this,d),(i=c.call(this,o)).state={isOpen:!1},i.data={maxSourceWidth:0,maxSourceHeight:0,scrollbarWidth:0},i.isl=[],i.p={isSwiping:!1,downScreenX:null,isSourceDownEventTarget:!1,swipedX:0},i.stageIndexes={current:0},i.componentsServices={setSlideNumber:null,isSlideSwipingHovererShown:{},isLightboxOpenManager:{get:function(){return i.state.isOpen},set:function(a,p){i.setState({isOpen:a},p)}}},i.fss={},i.sawu=[],i.elements={container:x().createRef(),sources:null,sourcesComponents:[]},i.collections={sourceLoadHandlers:[],sourceSizers:[],xhrs:[]},i.smwm=[],i.core={classFacade:{},globalEventsController:{},lightboxCloser:{},lightboxCloseActioner:{},lightboxUpdater:{},scrollbarRecompensor:{},slideIndexChanger:{},windowResizeActioner:{}},i.ap={},i.fs={},i.st={},i.sws={},i.timeout=i.timeout.bind(Z(i)),i.getQueuedAction=i.getQueuedAction.bind(Z(i)),i.r=i.resolve.bind(Z(i)),i.resolve=i.resolve.bind(Z(i)),i.e=i.e.bind(Z(i)),Be(Z(i)),function(a){var p=a.ap,u=a.componentsServices.isLightboxOpenManager,m=a.core,h=m.globalEventsController,g=m.scrollbarRecompensor,v=m.windowResizeActioner,y=a.e,k=a.elements,U=a.st,H=a.stageIndexes,N=a.sws;function _(){Ve(a),document.documentElement.classList.add("fslightbox-open"),g.addRecompense(),h.attachListeners(),v.runActions(),p.p(H.current),y("onOpen")}a.o=function(){Ne(a,"sourceLoadHandlers",De),u.set(!0,function(){N.b(H.previous),N.b(H.current),N.b(H.next),U.u(),N.c(),N.a(),_(),y("onShow")})},a.i=function(){a.ii=1,function(F){var P=F.props;F.s=P.sources,F.sl=F.s.length,F.dss=P.disableSlideSwiping,F.iap=P.autoplay,F.loc=P.loadOnlyCurrentSource}(a),a.smw=ye(a),a.saw=ye(a),k.sources=ye(a),Ne(a,"sourceLoadHandlers",De),a.iap&&(a.loc=1),ft(a),U.u(),u.set(!0,function(){_(),function(F){for(var P=F.props.sources,Q=F.resolve,ue=Q(nt),me=Q(lt),_e=Q(ct,[ue,me]),K=0;K<P.length;K++)if(typeof P[K]=="string"){var qe=_e.getTypeSetByClientForIndex(K);if(qe)me.runActionsForSourceTypeAndIndex(qe,K);else{var Xe=ue.getSourceTypeFromLocalStorageByUrl(P[K]);Xe?me.runActionsForSourceTypeAndIndex(Xe,K):_e.retrieveTypeWithXhrForIndex(K)}}else me.runActionsForSourceTypeAndIndex(Oe,K)}(a),y("onInit")})}}(Z(i)),i}return e=d,s=[{key:"timeout",value:function(o,i){var a=this;setTimeout(function(){a.elements.container.current&&o()},i)}},{key:"getQueuedAction",value:function(o,i){var a=this,p=[];return function(){p.push(!0),a.timeout(function(){p.pop(),p.length||o()},i)}}},{key:"resolve",value:function(o){var i,a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];return a.unshift(this),Ie(o,function(p){if(Array.isArray(p))return ze(p)}(i=a)||function(p){if(typeof Symbol<"u"&&p[Symbol.iterator]!=null||p["@@iterator"]!=null)return Array.from(p)}(i)||function(p,u){if(p){if(typeof p=="string")return ze(p,u);var m=Object.prototype.toString.call(p).slice(8,-1);return m==="Object"&&p.constructor&&(m=p.constructor.name),m==="Map"||m==="Set"?Array.from(p):m==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(m)?ze(p,u):void 0}}(i)||function(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}())}},{key:"e",value:function(o){var i=this.props[o];i&&i(this)}},{key:"componentDidUpdate",value:function(o,i,a){this.core.lightboxUpdater.handleUpdate(o)}},{key:"componentDidMount",value:function(){var o,i,a,p;i=(o=this).data,a=o.i,p=o.props.openOnMount,document.getElementsByClassName(X).length||We(),i.scrollbarWidth=function(){var u=document.createElement("div"),m=u.style,h=document.createElement("div");m.visibility="hidden",m.width="100px",m.msOverflowStyle="scrollbar",m.overflow="scroll",h.style.width="100%",document.body.appendChild(u);var g=u.offsetWidth;u.appendChild(h);var v=h.offsetWidth;return document.body.removeChild(u),g-v}(),p&&a()}},{key:"componentWillUnmount",value:function(){(function(o){for(var i=o.collections.xhrs,a=o.componentsServices.isLightboxOpenManager,p=o.core.globalEventsController,u=0;u<i.length;u++)i[u].abort();a.get()&&p.removeListeners()})(this)}},{key:"render",value:function(){return this.state.isOpen?x().createElement("div",{ref:this.elements.container,className:"".concat(S,"container ").concat(B," ").concat(z)},x().createElement(ve,{o:this}),x().createElement(be,{fsLightbox:this}),this.props.sources.length>1?x().createElement(x().Fragment,null,x().createElement(f,{onClick:this.pr,name:"previous",d:"M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788S18.707,9.212,18.271,9.212z"}),x().createElement(f,{onClick:this.n,name:"next",d:"M1.729,9.212h14.656l-4.184-4.184c-0.307-0.306-0.307-0.801,0-1.107c0.305-0.306,0.801-0.306,1.106,0l5.481,5.482c0.018,0.014,0.037,0.019,0.053,0.034c0.181,0.181,0.242,0.425,0.209,0.66c-0.004,0.038-0.012,0.071-0.021,0.109c-0.028,0.098-0.075,0.188-0.143,0.271c-0.021,0.026-0.021,0.061-0.045,0.085c-0.015,0.016-0.034,0.02-0.051,0.033l-5.483,5.483c-0.306,0.307-0.802,0.307-1.106,0c-0.307-0.305-0.307-0.801,0-1.105l4.184-4.185H1.729c-0.436,0-0.788-0.353-0.788-0.788S1.293,9.212,1.729,9.212z"})):null,x().createElement(J,{o:this})):null}}],s&&gt(e.prototype,s),Object.defineProperty(e,"prototype",{writable:!1}),d}(I.Component);Ce.propTypes={toggler:w().bool,sources:w().array,slide:w().number,source:w().string,sourceIndex:w().number,onOpen:w().func,onClose:w().func,onInit:w().func,onShow:w().func,disableLocalStorage:w().bool,types:w().array,type:w().string,customAttributes:w().array,maxYoutubeVideoDimensions:w().object,autoplay:w().bool,disableBackgroundClose:w().bool,disableSlideSwiping:w().bool,exitFullscreenOnClose:w().bool,loadOnlyCurrentSource:w().bool,openOnMount:w().bool,slideDistance:w().number},Ce.defaultProps={slideDistance:.3};const bt=Ce;Je.exports=R})();var Wt=Je.exports;const Nt=vt(Wt),Tt="https://primerad-backend.onrender.com/api/sessions/getTopRatedLectures",Qe=b.memo(()=>{const{t:j}=Ee(),R=Le(jt),[q,w]=b.useState(!1),[I,x]=b.useState(""),[S,X]=b.useState(!1),[V,B]=b.useState([]),[T,M]=b.useState(!0),[L,W]=b.useState(0),[C,z]=b.useState(0),D=4,Y=Ae();b.useEffect(()=>{M(!0),fetch(Tt).then(f=>f.json()).then(f=>{f!=null&&f.data&&Array.isArray(f.data)?B(f.data):B([]),M(!1)}).catch(()=>{B([]),M(!1)})},[]);const O=V.length;b.useEffect(()=>{let f;return O>1&&(f=setInterval(()=>{W($=>($+1)%O)},5e3)),()=>{f&&clearInterval(f)}},[O]),b.useCallback(()=>{W(f=>(f+1)%O)},[O]),b.useCallback(()=>{W(f=>(f-1+O)%O)},[O]);const E=b.useCallback(f=>{W(f)},[]),ae=b.useCallback(f=>{W(f)},[]),xe=b.useCallback(()=>{C+D<O&&z(f=>f+1)},[C,O]),he=b.useCallback(()=>{C>0&&z(f=>f-1)},[C]);b.useEffect(()=>{L<C?z(L):L>=C+D&&z(L-D+1)},[L,C]),b.useEffect(()=>{const f=()=>X(window.innerWidth<=768);return f(),window.addEventListener("resize",f),()=>window.removeEventListener("resize",f)},[]);const se=f=>({id:f._id,title:f.title,description:f.description,cmeCredits:f.isAssessment?j("Assessment"):"",movieTime:f.sessionDuration,level:f.difficulty,category:f.moduleName,tags:[],image:S?f.imageUrl_522x760?`https://primerad-backend.onrender.com${f.imageUrl_522x760}`:"https://placehold.co/522x760?text=No+Image":f.imageUrl_1920x1080?`https://primerad-backend.onrender.com${f.imageUrl_1920x1080}`:"https://placehold.co/1920x1080?text=No+Image",previewVideoUrl:f.vimeoVideoId?`https://player.vimeo.com/video/${f.vimeoVideoId}`:null,vimeoVideoId:f.vimeoVideoId||null,faculty:f.faculty||"Unknown Faculty",module:f.moduleName||"General",submodule:f.subCategoryId||"General",duration:f.sessionDuration||"",isFree:f.isFree,startDate:f.startDate,contentType:f.sessionType==="Dicom"?"Case":f.sessionType==="Vimeo"?"Lecture":f.sessionType||"Other"}),A=V.length>0?se(V[L]):null,ge=b.useCallback(f=>{f.contentType&&f.contentType.toLowerCase()==="case"?Y(`/case/${f.id}`):f.contentType&&f.contentType.toLowerCase()==="lecture"?Y("/lecture-detail",{state:{id:f.id,vimeoVideoId:f.vimeoVideoId,title:f.title,description:f.description,faculty:f.faculty,module:f.module,submodule:f.submodule,isFree:f.isFree,duration:f.duration,startDate:f.startDate,contentType:f.contentType}}):f.contentType&&f.contentType.toLowerCase()==="live"&&Y("/live",{state:f})},[Y]);if(T)return n.jsx("div",{style:{padding:"100px",textAlign:"center",color:"#666",minHeight:"400px",display:"flex",alignItems:"center",justifyContent:"center"},children:"Loading hero content..."});if(!A)return n.jsx("div",{style:{padding:"100px",textAlign:"center",color:"#666",minHeight:"400px",display:"flex",alignItems:"center",justifyContent:"center"},children:"No hero content available."});const be=V.slice(C,C+D),le=C>0,ve=C+D<O;return n.jsxs(b.Fragment,{children:[n.jsxs("div",{id:"home-banner-carousel",className:"iq-main-slider banner-home-swiper overflow-hidden mb-0",style:{paddingTop:S?"80px":"0",position:"relative",width:"100%",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",direction:R},children:[n.jsxs("div",{className:"slide-content",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",transition:"opacity 0.7s ease-in-out",opacity:1},children:[n.jsxs("div",{className:"banner-home-swiper-image",style:{position:"relative",width:"100%",height:"100%"},children:[n.jsx("img",{src:A.image,alt:A.title||"CME Content Banner",style:{width:"100%",height:"100%",objectFit:"cover",opacity:.8,filter:"brightness(0.85)"}}),n.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.45)",zIndex:2,pointerEvents:"none"}})]}),n.jsx("div",{className:"container-fluid position-absolute h-100",style:{top:0,left:0,width:"100%",height:"100%",zIndex:3,display:"flex",alignItems:"center",pointerEvents:"auto"},children:n.jsx("div",{className:"slider-inner h-100",style:{width:"100%"},children:n.jsx("div",{className:"row align-items-center mr-7 iq-ltr-direction h-100",children:n.jsxs("div",{className:"col-lg-7 col-md-12",children:[n.jsx("h3",{className:"texture-text big-font-5 letter-spacing-1 text-uppercase mb-0 fs-3 fs-md-2 fs-lg-1",style:{color:"ghostwhite",fontWeight:400,textShadow:"0 4px 24px rgba(0,0,0,0.45)"},children:A.title}),n.jsxs("div",{className:"d-flex flex-wrap align-items-center r-mb-23",style:{marginTop:16,gap:"0.5rem",marginBottom:window.innerWidth<=480?"5px":"10px"},children:[A.cmeCredits&&n.jsx("span",{className:"badge  text-white text-uppercase px-3 py-2",style:{background:"#0d47a1",fontWeight:600,letterSpacing:.5,borderRadius:"10px",fontSize:"0.85rem"},children:A.cmeCredits}),A.movieTime&&n.jsxs("span",{className:"badge  text-white text-uppercase px-3 py-2",style:{background:"#6a1b9a",fontWeight:500,borderRadius:"10px",fontSize:"0.8rem"},children:[n.jsx("i",{className:"fa-regular fa-clock me-1"}),A.movieTime]}),A.level&&n.jsxs("span",{className:"badge text-black text-uppercase px-3 py-2",style:{background:"lightblue",fontWeight:500,fontSize:"0.8rem",borderRadius:"10px"},children:[n.jsx("i",{className:"fa-solid fa-layer-group me-1"}),j(A.level)]})]}),n.jsx("div",{style:{marginBottom:(window.innerWidth<=480,"10px")},children:A.description&&n.jsxs("p",{className:"line-count-3",style:{color:"#e3eaf2",fontSize:"1.15rem",fontWeight:400,textShadow:"0 2px 8px rgba(0,0,0,0.25)"},children:[A.description," "]})}),n.jsxs("div",{className:"trending-list",style:{marginBottom:18,marginBottom:(window.innerWidth<=480,"10px")},children:[A.category&&n.jsxs("span",{className:"badge text-white text-uppercase p-2",style:{background:"#4caf50",fontWeight:600,letterSpacing:.5,borderRadius:"8px"},children:[j("Module"),": ",j(A.category)]}),A.tags&&A.tags.length>0&&n.jsxs("div",{className:"text-primary tag fw-500",style:{color:"#b3e5fc"},children:[j("content.topics"),":"," ",n.jsx("span",{style:{color:"#fff",fontWeight:500},children:A.tags.map(f=>j(f)).join(", ")})]})]}),n.jsx("div",{children:n.jsx("div",{className:"iq-button",children:n.jsxs("button",{onClick:()=>ge(A),style:{color:"black",fontWeight:700,borderRadius:"8px",padding:"10px 12px",fontSize:"1.1rem",boxShadow:"0 2px 12px rgba(25,118,210,0.18)",background:"lightblue",border:"none",cursor:"pointer"},children:[n.jsxs("span",{className:"button-text",children:[j("buttons.view_content")," "]}),n.jsx("i",{className:"fa-solid fa-arrow-right",style:{marginLeft:10}})]})})})]})})})})]}),O>1&&n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:"hero-carousel-container d-none d-md-flex",style:{position:"absolute",bottom:"20px",left:"50%",transform:"translateX(-50%)",zIndex:10,display:"flex",alignItems:"center",gap:"12px",padding:"16px 24px",background:"rgba(0,0,0,0.7)",borderRadius:"16px",backdropFilter:"blur(10px)",border:"1px solid rgba(255, 255, 255, 0.1)",maxWidth:"90vw"},children:[le&&n.jsx("button",{onClick:he,style:{background:"rgba(255, 255, 255, 0.2)",border:"1px solid rgba(255, 255, 255, 0.3)",borderRadius:"8px",padding:"8px 10px",color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s ease",fontSize:"14px"},onMouseEnter:f=>{f.target.style.background="rgba(255, 255, 255, 0.3)"},onMouseLeave:f=>{f.target.style.background="rgba(255, 255, 255, 0.2)"},children:n.jsx("i",{className:"fa-solid fa-chevron-left"})}),n.jsx("div",{className:"hero-carousel-thumbnails",style:{display:"flex",gap:"12px",transition:"all 0.3s ease"},children:be.map((f,$)=>{const ne=C+$,ie=se(f),G=ne===L;return n.jsxs("div",{onClick:()=>ae(ne),style:{cursor:"pointer",borderRadius:"12px",overflow:"hidden",border:G?"rgba(0, 123, 255, 0.8)":"3px solid transparent",transition:"all 0.3s ease",transform:G?"scale(1.05)":"scale(1)",opacity:G?1:.7,minWidth:"120px",boxShadow:G?"0 0 8px rgba(0, 123, 255, 0.8)":"",width:"120px",height:"68px",position:"relative"},onMouseEnter:J=>{G||(J.currentTarget.style.opacity="0.9",J.currentTarget.style.transform="scale(1.02)")},onMouseLeave:J=>{G||(J.currentTarget.style.opacity="0.7",J.currentTarget.style.transform="scale(1)")},children:[n.jsx("img",{src:ie.image,alt:ie.title,style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"8px"},onError:J=>{J.target.src="https://placehold.co/120x68?text=No+Image"}}),G&&n.jsx("div",{style:{position:"absolute",bottom:"2px",left:"50%",transform:"translateX(-50%)",width:"20px",height:"3px",background:"#fff",borderRadius:"2px"}}),ie.previewVideoUrl&&n.jsx("div",{})]},f._id||ne)})}),ve&&n.jsx("button",{onClick:xe,style:{background:"rgba(255, 255, 255, 0.2)",border:"1px solid rgba(255, 255, 255, 0.3)",borderRadius:"8px",padding:"8px 10px",color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s ease",fontSize:"14px"},onMouseEnter:f=>{f.target.style.background="rgba(255, 255, 255, 0.3)"},onMouseLeave:f=>{f.target.style.background="rgba(255, 255, 255, 0.2)"},children:n.jsx("i",{className:"fa-solid fa-chevron-right"})})]}),n.jsx("div",{className:"hero-pagination-dots d-md-none",style:{position:"absolute",bottom:"20px",left:"50%",transform:"translateX(-50%)",zIndex:10,display:"flex",alignItems:"center",gap:"6px",borderRadius:"50%",backdropFilter:"blur(8px)"},children:V.map((f,$)=>n.jsx("button",{onClick:()=>E($),style:{minWidth:"10px",minHeight:"10px",borderRadius:"50%",border:"none",background:L===$?"lightgreen":"gray",cursor:"pointer",transition:"all 0.3s ease",padding:0}},$))})]})]}),n.jsx(Nt,{toggler:q,sources:[I]}),n.jsx("style",{children:`
    #home-banner-carousel {
      height: 100vh;
      min-height: 560px;
      padding-top: 0;
      overflow: hidden;
    }
    .slide-content {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .slider-inner {
      width: 100%;
      max-width: 1450px;
      margin: 0 auto;
    }
.row.align-items-center {
    display: flex;
    flex-wrap: wrap;
}
.col-lg-7,
.col-lg-5 {
    flex: 0 0 58%;
    max-width: 58%;
}
.col-lg-5 {
    flex: 0 0 42%;
    max-width: 42%;
}

/* Carousel navigation button styles */
.hero-carousel-container button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
}

.hero-carousel-container button:active {
    transform: scale(0.95);
}

/* Mobile pagination dots styles */
.hero-pagination-dots button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
}

.hero-pagination-dots button:active {
    transform: scale(0.9);
}

/* Tablet Styles */
@media (max-width: 1024px) {
    #home-banner-carousel {
        height: 70vh;
        min-height: 400px;

    }
    .slider-inner {
        max-width: 1000px;
        padding-left: 16px;
        padding-right: 16px;
    }
    .row.align-items-center {
        flex-direction: column;
    }
    .col-lg-7,
    .col-lg-5 {
        flex: 0 0 100%;
        max-width: 100%;
    }
    h1.texture-text {
        font-size: clamp(2rem, 7vw, 3.2rem);
    }
    .line-count-3 {
        font-size: 1rem;
        line-height: 1.3;
    }
    .hero-carousel-container {
        bottom: 15px;
        padding: 12px 16px;
        gap: 8px;
    }
    .hero-carousel-thumbnails {
        gap: 8px;
    }
}

/* Mobile Styles */
@media (max-width: 768px) {
    #home-banner-carousel {
        height: 52vh;
        min-height: 320px;
        padding-top: 45px;
    }
    .slide-content, .slider-inner, .row.align-items-center, .container-fluid {
        padding: 0 !important;
        margin: 0 !important;
        min-width: 0 !important;
        width: 100% !important;
        box-sizing: border-box;
    }
    .col-lg-7, .col-lg-5 {
        flex: 0 0 100%;
        max-width: 100%;
        align-items: center !important;
        align-content: center !important;
        // text-align: center !important;
    }
    .col-lg-7 {
        margin-bottom: 0;
    }
    h1.texture-text {
        font-size: clamp(1.7rem, 16vw, 2.6rem) !important;
        padding-left: 4px;
        padding-right: 4px;
    }
    .line-count-3 {
        font-size: 0.95rem !important;
        line-height: 1.7 !important;
        margin: 0 2vw !important;
    }
    .iq-button button, .iq-button .btn {
        font-size: 0.8rem !important;
        // height: 5px !important;
        // padding: 5px 8px !important;
        border-radius: 6px !important;
    }
    .badge {
        font-size: 0.8rem !important;
        padding: 6px 10px !important;
        border-radius: 8px !important;
        margin: 2px 4px !important;
        display: inline-block !important;
    }
    /* Hide video preview area on small screens to save space */
    .trailor-video.iq-slider, .col-lg-5.d-none.d-lg-block {
        display: none !important;
    }
    
    /* Mobile pagination dots positioning */
    .hero-pagination-dots {
        bottom: 15px !important;
        // padding: 10px 16px !important;
    }
}

/* Extra mobile tweaks for portrait phones */
@media (max-width: 480px) {
    #home-banner-carousel {
        // height: 36vh;
        min-height: 110px;
        max-height: 730px
    }
    h1.texture-text {
        font-size: 2.1rem !important;
    }
    .slide-content {
        min-height: 210px !important;
    }
    .hero-pagination-dots {
        bottom: 12px !important;
        // padding: 8px 14px !important;
        gap: 6px !important;
    }
}

/* Utility styles */
.line-count-1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.line-count-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
`})]})});Qe.displayName="HomeHeroSlider";const Ke=b.memo(({imagePath:j,dataLeftTime:R,progressValue:q,title:w,sessionData:I,category:x,contentType:S})=>{const[X,V]=b.useState(!1),B=Ae(),T=j.startsWith("http")?j:`https://primerad-backend.onrender.com${j}`,M=()=>{B("/lecture-detail",{state:{id:I.sessionId,vimeoVideoId:I.vimeoVideoId,title:I.title||"Untitled Lecture",description:I.description||"No description available.",faculty:I.faculty||"Unknown Faculty",module:I.module||"General",isFree:I.isFree,submodule:I.submodule||"General",duration:I.duration||"N/A",startDate:I.startDate,contentType:I.contentType}})};return n.jsx(b.Fragment,{children:n.jsxs("div",{className:"iq-watching-block",style:{position:"relative",cursor:"pointer",width:"100%",height:"100%"},onMouseEnter:()=>V(!0),onMouseLeave:()=>V(!1),onClick:M,children:[n.jsxs("div",{className:"block-images position-relative",children:[n.jsxs("div",{className:"iq-image-box overly-images",style:{position:"relative",overflow:"hidden",borderRadius:"8px"},children:[n.jsx("img",{src:T,alt:"content-thumbnail",style:{width:"100%",height:"100%",display:"block",objectFit:"cover",opacity:"0.8"}}),n.jsxs("div",{style:{position:"absolute",top:12,right:12,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,zIndex:2},children:[x&&n.jsx("span",{style:{background:"#1976d2",color:"#fff",fontWeight:600,fontSize:"0.62rem",borderRadius:"8px",padding:"2px 10px",letterSpacing:"0.5px",marginBottom:2,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"},children:x}),S&&n.jsx("span",{style:{background:"#e0e7ef",color:"#003366",fontWeight:600,fontSize:"0.62rem",borderRadius:"8px",padding:"2px 10px",letterSpacing:"0.5px",boxShadow:"0 2px 8px rgba(0,0,0,0.08)"},children:S})]}),(window.innerWidth<=768||X&&window.innerWidth>768)&&n.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",fontSize:"20px",color:"#ffffff",background:"rgba(0, 0, 0, 0.6)",borderRadius:"50%",width:"40px",height:"40px",display:"flex",alignItems:"center",justifyContent:"center",zIndex:8,pointerEvents:"none"},children:n.jsx("i",{className:"fa-solid fa-play"})})]}),n.jsxs("div",{className:"iq-preogress",style:{position:"absolute",bottom:"10px",left:"10px",right:"10px",zIndex:5},children:[n.jsx("span",{style:{fontSize:"0.8rem",fontWeight:500,color:"white",marginBottom:"5px",display:"block",textAlign:"right"},children:R}),n.jsx(Ct,{now:q,style:{height:"4px",backgroundColor:"rgba(255,255,255,0.3)",borderRadius:"5px"},variant:"success"})]})]}),w&&n.jsx("div",{style:{marginTop:10,textAlign:"left",fontSize:"1rem",fontWeight:600,color:"#222",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",padding:"0 5px"},children:w})]})})});Ke.displayName="ContinueWatchCard";const Ze=b.memo(()=>{const{t:j}=Ee(),R=Le($e),q=b.useRef(null),[w,I]=b.useState(0),[x,S]=b.useState(5),[X,V]=b.useState([]),B=20,T=X.length;b.useEffect(()=>{if(!R)return;(async()=>{try{const Y=await(await fetch(`https://primerad-backend.onrender.com/api/sessions/getWatchedSessions?userId=${localStorage.getItem("userId")}`)).json();if(Y!=null&&Y.data){console.log(Y.data);const O=Y.data.map(E=>({image:E.imageUrl_1920x1080?E.imageUrl_1920x1080:"/assets/images/default.jpg",value:E.playbackProgress?Math.min(Math.round(E.playbackProgress.currentTime/(parseFloat(E.sessionDuration)*60||1)*100),100):0,leftTime:E.sessionDuration,id:E._id,title:E.title,sessionId:E._id,vimeoVideoId:E.vimeoVideoId,description:E.description,faculty:E.facultyName,module:E.moduleName,submodule:E.subModuleName,duration:E.sessionDuration,startDate:E.startDate,isFree:E.isFree,contentType:E.sessionType==="Dicom"?"Case":E.sessionType==="Vimeo"?"Lecture":E.sessionType||"Other"}));console.log(O),V(O)}}catch(D){console.error("Error fetching watched sessions:",D)}})()},[R]),b.useEffect(()=>{const z=()=>{window.innerWidth>=1400?S(6):window.innerWidth>=1200?S(5):window.innerWidth>=992?S(4):window.innerWidth>=768?S(3):window.innerWidth>=576?S(2):S(1)};return window.addEventListener("resize",z),z(),()=>window.removeEventListener("resize",z)},[]),b.useEffect(()=>{if(q.current&&T>0){const z=q.current.children[0];if(!z)return;const D=z.offsetWidth+B;q.current.scrollTo({left:w*D,behavior:"smooth"})}},[w,x,B,T]);const M=b.useCallback(()=>{I(z=>Math.min(z+x,T-x))},[x,T]),L=b.useCallback(()=>{I(z=>Math.max(z-x,0))},[x]),W=w<T-x,C=w>0;return!R||X.length===0?null:n.jsx(b.Fragment,{children:n.jsx("div",{className:"continue-watching-block section-padding-top",style:{position:"relative",padding:"88px 0"},children:n.jsxs("div",{className:"container-fluid",style:{height:"100%"},children:[n.jsx("h2",{style:{fontWeight:600,fontSize:window.innerWidth<=468?20:28,color:"darkslategrey",marginBottom:36,textAlign:"left",paddingLeft:window.innerWidth<=468?"18px":"15px"},children:j("ott_home.continue_watching")}),n.jsxs("div",{style:{position:"relative"},children:[T>x&&window.innerWidth>468&&n.jsx("div",{onClick:C?L:null,style:{position:"absolute",top:"50%",transform:"translateY(-50%)",zIndex:10,cursor:C?"pointer":"not-allowed",backgroundColor:C?"rgba(0,0,0,0.4)":"rgba(0,0,0,0.1)",borderRadius:"50%",width:"45px",height:"45px",display:"flex",alignItems:"center",justifyContent:"center",color:C?"white":"#999",fontSize:"28px"},children:"❮"}),n.jsx("div",{ref:q,style:{display:"flex",gap:`${B}px`,overflowX:"auto",overflowY:"hidden",scrollbarWidth:"none",msOverflowStyle:"none",scrollBehavior:"smooth",width:"100%",paddingBottom:"10px"},children:X.map((z,D)=>n.jsx("div",{style:{flexShrink:0,width:`calc((100% - ${B*(x-1)}px) / ${x})`},children:n.jsx(Ke,{sessionData:z,contentType:z.contentType,category:z.module,imagePath:z.image,progressValue:z.value,dataLeftTime:z.leftTime,title:z.title})},D))}),T>x&&window.innerWidth>468&&n.jsx("div",{onClick:W?M:null,style:{position:"absolute",right:"0px",top:"50%",transform:"translateY(-50%)",zIndex:10,cursor:W?"pointer":"not-allowed",backgroundColor:W?"rgba(0,0,0,0.4)":"rgba(0,0,0,0.1)",borderRadius:"50%",width:"45px",height:"45px",display:"flex",alignItems:"center",justifyContent:"center",color:W?"white":"#999",fontSize:"28px"},children:"❯"})]})]})})})});Ze.displayName="ContinueWatching";const et=b.memo(j=>{const{t:R}=Ee();return n.jsxs(b.Fragment,{children:[n.jsx("section",{id:"parallex",className:"parallax-window",style:{background:"lightgray",padding:"20px 16px"},children:n.jsxs("div",{style:{display:"flex",flexDirection:"row",width:"100%",maxWidth:1400,margin:"0 auto",gap:"24px","@media (max-width: 768px)":{flexDirection:"column",gap:"16px"}},className:"parallex-container",children:[n.jsx("div",{style:{flex:1,background:"#fff",borderRadius:24,boxShadow:"0 4px 32px rgba(76,175,80,0.08)",padding:"40px 32px",minHeight:420,display:"flex",flexDirection:"column",justifyContent:"center"},className:"content-section",children:n.jsxs("div",{className:"text-start",children:[n.jsx("h2",{className:"big-font-5 text-uppercase texture-text mb-0",style:{color:"#2e7d32",fontWeight:800,textShadow:"0 2px 8px rgba(76,175,80,0.08)",fontSize:"clamp(1.3rem, 4vw, 2.5rem)",marginBottom:"16px"},children:"KNEE MRI CASE"}),n.jsxs("div",{className:"d-flex flex-wrap align-items-center r-mb-23 my-4",style:{gap:"8px"},children:[n.jsxs("div",{className:"slider-ratting d-flex align-items-center",children:[n.jsxs("ul",{className:"ratting-start p-0 m-0 list-inline text-warning d-flex align-items-center justify-content-left",children:[n.jsx("li",{children:n.jsx("i",{className:"fa fa-star","aria-hidden":"true"})}),n.jsx("li",{children:n.jsx("i",{className:"fa fa-star","aria-hidden":"true"})}),n.jsx("li",{children:n.jsx("i",{className:"fa fa-star","aria-hidden":"true"})}),n.jsx("li",{children:n.jsx("i",{className:"fa fa-star","aria-hidden":"true"})}),n.jsx("li",{children:n.jsx("i",{className:"fa fa-star-half","aria-hidden":"true"})})]}),n.jsx("span",{className:"ms-2 font-size-14 fw-500 text-dark",children:"4.8"}),n.jsxs("span",{className:"ms-2",style:{display:"flex",alignItems:"center",background:"#e0f7e9",borderRadius:6,padding:"2px 10px"},children:[n.jsx("i",{className:"fas fa-stethoscope",style:{color:"#388e3c",fontSize:18,marginRight:6}}),n.jsx("span",{style:{color:"#388e3c",fontWeight:600},children:"MEDICAL"})]})]}),n.jsx("span",{className:"badge rounded-0 text-white text-uppercase p-2",style:{background:"#43a047",fontWeight:600,letterSpacing:1},children:"15+"}),n.jsx("span",{className:"font-size-14 fw-500 text-dark",children:"45 Mins"})]}),n.jsx("h4",{className:"iq-title mb-2 fw-bold",style:{color:"#388e3c",fontSize:"1.15rem"},children:"Case Overview"}),n.jsx("p",{className:"line-count-2 mb-md-4 mb-2",style:{color:"#333",fontSize:"1.1rem",fontWeight:400,width:"100%",maxWidth:"90%"},children:"A 32-year-old male presents with knee pain and swelling after a sports injury. MRI reveals a complex meniscal tear and joint effusion. Discuss diagnosis, imaging findings, and management options for optimal recovery."}),n.jsx("div",{className:"iq-button",children:n.jsxs(Ye,{to:"/lecture-detail",className:"btn text-uppercase position-relative",style:{background:"#e0f7e9",color:"black",fontWeight:700,borderRadius:8,padding:"12px 32px",cursor:"pointer",fontSize:"1.1rem",boxShadow:"0 2px 12px rgba(76,175,80,0.08)",display:"inline-flex",alignItems:"center",textDecoration:"none"},children:[R("ott_home.play_now"),n.jsx("i",{className:"fa-solid fa-play",style:{marginLeft:10}})]})})]})}),n.jsx("div",{style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:"#e0f7e9",borderRadius:24,minHeight:420},className:"image-section","data-aos":"fade-up","data-aos-duration":"900",children:n.jsx("div",{className:"parallax-img",style:{width:"100%",maxWidth:600,padding:"20px"},children:n.jsx(Ye,{to:"",children:n.jsx("img",{src:j.randomImage,className:"img-fluid w-100",loading:"lazy",alt:"bailey",style:{borderRadius:16,boxShadow:"0 4px 32px rgba(76,175,80,0.10)",objectFit:"cover",height:"auto"}})})})})]})}),n.jsx("style",{jsx:!0,children:`
        @media (max-width: 768px) {
          .parallex-container {
            flex-direction: column !important;
            gap: 16px !important;
          }

          .content-section {
            padding: 24px 20px !important;
            min-height: auto !important;
            order: 2;
          }

          .image-section {
            min-height: 280px !important;
            order: 1;
          }

          .content-section h2 {
            font-size: clamp(1.5rem, 6vw, 2rem) !important;
            text-align: center;
            margin-bottom: 20px !important;
          }

          .content-section .d-flex.flex-wrap {
            justify-content: center !important;
            text-align: center;
            margin: 16px 0 !important;
          }

          .content-section h4 {
            text-align: center;
            margin-top: 20px !important;
          }

          .content-section p {
            text-align: center;
            max-width: 100% !important;
            font-size: 1rem !important;
          }

          .iq-button {
            text-align: center;
            margin-top: 24px;
          }

          .parallax-img {
            padding: 16px !important;
          }
        }

        @media (max-width: 480px) {
          #parallex {
            padding: 16px 12px !important;
          }

          .content-section {
            padding: 20px 16px !important;
            border-radius: 16px !important;
          }

          .image-section {
            border-radius: 16px !important;
            min-height: 240px !important;
          }

          .content-section .btn {
            padding: 10px 24px !important;
            font-size: 1rem !important;
          }

          .slider-ratting {
            scale: 0.9;
          }

          .badge {
            font-size: 0.8rem !important;
          }
        }
      `})]})});et.displayName="ParallexSection";const Ft=ee(n.jsx("path",{d:"M9.68 13.69 12 11.93l2.31 1.76-.88-2.85L15.75 9h-2.84L12 6.19 11.09 9H8.25l2.31 1.84zM20 10c0-4.42-3.58-8-8-8s-8 3.58-8 8c0 2.03.76 3.87 2 5.28V23l6-2 6 2v-7.72c1.24-1.41 2-3.25 2-5.28m-8-6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6"})),Rt=ee(n.jsx("path",{d:"M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-7 12h-2v-2h2zm0-4h-2V6h2z"})),Mt=ee(n.jsx("path",{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2z"})),Ot=ee(n.jsx("path",{d:"M4 6H2v14c0 1.1.9 2 2 2h14v-2H4zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-8 12.5v-9l6 4.5z"})),Ht=ee(n.jsx("path",{d:"M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"})),Bt=ee(n.jsx("path",{d:"M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M1 18v3h3c0-1.66-1.34-3-3-3m0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7m0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11m10 1.09v2L14.5 15l3.5-1.91v-2L14.5 13zM14.5 6 9 9l5.5 3L20 9z"}));const Pt=[{text:"“PrimeRad Academy has revolutionized my CME. The content is top-notch and the assessments are invaluable.”",name:"Dr. Emily White",title:"Radiologist"},{text:"“The interactive cases and expert lectures have helped me stay updated and confident in my practice.”",name:"Dr. Michael Chen",title:"Orthopedic Surgeon"},{text:"“The platform is user-friendly and the community support is fantastic. Highly recommended!”",name:"Dr. Sarah Johnson",title:"Pediatrician"}];function Vt(){return b.useEffect(()=>{Ge.init({duration:1e3,once:!0})},[]),n.jsxs("section",{style:{background:"#f4f8ff",padding:"48px 0"},children:[n.jsx("h2",{"data-aos":"fade-up",style:{textAlign:"center",fontWeight:900,fontSize:38,marginBottom:36,color:"#111",letterSpacing:-1},children:"What Our Users Say"}),n.jsx("div",{className:"testimonials-row",style:{display:"flex",flexDirection:"row",justifyContent:"center",gap:32,maxWidth:1200,margin:"0 auto"},children:Pt.map((j,R)=>n.jsxs("div",{"data-aos":"fade-up","data-aos-delay":100*(R+1),style:{background:"#eaf3ff",borderRadius:18,boxShadow:"0 2px 12px rgba(33, 150, 243, 0.06)",padding:"36px 32px",width:340,minWidth:0,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"},children:[n.jsx("div",{style:{marginBottom:18},children:n.jsx(Rt,{style:{color:"blue"}})}),n.jsx("div",{style:{fontStyle:"italic",color:"#444",fontSize:18,marginBottom:18},children:j.text}),n.jsxs("div",{style:{fontWeight:700,color:"#2563eb",fontSize:18},children:["- ",j.name]}),n.jsx("div",{style:{color:"#888",fontSize:16},children:j.title})]},R))}),n.jsx("style",{children:`
        @media (max-width: 1100px) {
          .testimonials-row { flex-direction: column !important; align-items: center !important; }
        }
        @media (max-width: 900px) {
          .testimonials-row { flex-direction: column !important; align-items: center !important; }
        }
        @media (max-width: 700px) {
          .testimonials-row { flex-direction: column !important; align-items: center !important; }
        }
      `})]})}const Dt=ee(n.jsx("path",{d:"M5 13.18v4L12 21l7-3.82v-4L12 17zM12 3 1 9l11 6 9-4.91V17h2V9z"})),re=["#fff","#f5f7fa"],fe={primary:"#1976d2",secondary:"#00bfae",background:"#f4f8fb",card:"#fff",accent:"#ffb300",text:"#263238",border:"#e0e0e0",headingColor:"#222",textColor:"#555"},Ut=b.memo(()=>{const j=Le($e),R=Ae(),[q,w]=b.useState([]),[I,x]=b.useState(!0),[S,X]=b.useState(!1),[V,B]=b.useState(null);if(b.useEffect(()=>{Ge.init({duration:1e3,once:!0})},[]),b.useEffect(()=>{(()=>{const L=window.innerWidth<=768;X(L)})()},[S]),b.useEffect(()=>{(async()=>{try{const W=(await St.get("https://primerad-backend.onrender.com/api/faculty/get")).data.data.map(C=>({_id:C._id,name:C.name,title:C.description,image:`https://primerad-backend.onrender.com/${C.image.replace(/\\/g,"/")}`}));w(W)}catch(L){console.error("Error fetching faculty data:",L),B("Failed to load faculty members. Please try again later.")}finally{x(!1)}})()},[]),I)return n.jsx("div",{style:{textAlign:"center",padding:"40px 20px"},children:"Loading Faculty..."});if(V)return n.jsx("div",{style:{textAlign:"center",padding:"40px 20px",color:"red"},children:V});if(q.length===0)return n.jsx("div",{style:{textAlign:"center",padding:"40px 20px",color:fe.textColor},children:"No faculty members found."});const T=n.jsxs("div",{style:{background:"#2A2F42",padding:"48px 20px 32px 20px",display:"flex",flexDirection:"column",alignItems:"center"},children:[n.jsx("h2",{"data-aos":"fade-up",style:{fontWeight:430,fontSize:"clamp(24px, 5vw, 34px)",marginBottom:36,color:"ghostwhite",letterSpacing:-1,textAlign:"center",padding:"0 10px"},children:"Why Choose PrimeRad?"}),n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"24px",width:"100%",maxWidth:1200,padding:"0 10px"},className:"why-choose-grid",children:[n.jsxs("div",{"data-aos":"fade-up","data-aos-delay":"100",style:{background:"#fff",borderRadius:24,boxShadow:"0 2px 12px rgba(33, 150, 243, 0.06)",padding:"36px 24px",display:"flex",flexDirection:"column",alignItems:"center",minHeight:"200px"},children:[n.jsx(Ft,{style:{fontSize:38,color:"blue",marginBottom:18}}),n.jsx("div",{style:{fontWeight:700,fontSize:"clamp(18px, 3vw, 22px)",color:"#222",marginBottom:8,textAlign:"center"},children:"Accredited CME/CE"}),n.jsx("div",{style:{color:"#555",fontSize:"clamp(14px, 2.5vw, 16px)",textAlign:"center"},children:"Valuable credits from recognized bodies."})]}),n.jsxs("div",{"data-aos":"fade-up","data-aos-delay":"200",style:{background:"#fff",borderRadius:24,boxShadow:"0 2px 12px rgba(19, 57, 88, 0.06)",padding:"36px 24px",display:"flex",flexDirection:"column",alignItems:"center",minHeight:"200px"},children:[n.jsx(Dt,{style:{fontSize:38,color:"#6d4c41",marginBottom:18}}),n.jsx("div",{style:{fontWeight:700,fontSize:"clamp(18px, 3vw, 22px)",color:"#222",marginBottom:8,textAlign:"center"},children:"Expert-Led Content"}),n.jsx("div",{style:{color:"#555",fontSize:"clamp(14px, 2.5vw, 16px)",textAlign:"center"},children:"Learn from top radiologists and medical professionals."})]}),n.jsxs("div",{"data-aos":"fade-up","data-aos-delay":"300",style:{background:"#fff",borderRadius:24,boxShadow:"0 2px 12px rgba(33, 150, 243, 0.06)",padding:"36px 24px",display:"flex",flexDirection:"column",alignItems:"center",minHeight:"200px"},children:[n.jsx(Ot,{style:{fontSize:38,color:"#1976d2",marginBottom:18}}),n.jsx("div",{style:{fontWeight:700,fontSize:"clamp(18px, 3vw, 22px)",color:"#222",marginBottom:8,textAlign:"center"},children:"Vast Content Library"}),n.jsx("div",{style:{color:"#555",fontSize:"clamp(14px, 2.5vw, 16px)",textAlign:"center"},children:"Access thousands of hours of lectures and cases."})]}),n.jsxs("div",{"data-aos":"fade-up","data-aos-delay":"400",style:{background:"#fff",borderRadius:24,boxShadow:"0 2px 12px rgba(33, 150, 243, 0.06)",padding:"36px 24px",display:"flex",flexDirection:"column",alignItems:"center",minHeight:"200px"},children:[n.jsx(Mt,{style:{fontSize:38,color:"#ffb300",marginBottom:18}}),n.jsx("div",{style:{fontWeight:700,fontSize:"clamp(18px, 3vw, 22px)",color:"#222",marginBottom:8,textAlign:"center"},children:"Interactive Assessments"}),n.jsx("div",{style:{color:"#555",fontSize:"clamp(14px, 2.5vw, 16px)",textAlign:"center"},children:"Test your knowledge and track your progress."})]}),n.jsxs("div",{"data-aos":"fade-up","data-aos-delay":"500",style:{background:"#fff",borderRadius:24,boxShadow:"0 2px 12px rgba(33, 150, 243, 0.06)",padding:"36px 24px",display:"flex",flexDirection:"column",alignItems:"center",minHeight:"200px"},children:[n.jsx(Ht,{style:{fontSize:38,color:"#00bfae",marginBottom:18}}),n.jsx("div",{style:{fontWeight:700,fontSize:"clamp(18px, 3vw, 22px)",color:"#222",marginBottom:8,textAlign:"center"},children:"Community Support"}),n.jsx("div",{style:{color:"#555",fontSize:"clamp(14px, 2.5vw, 16px)",textAlign:"center"},children:"Join a vibrant community of peers and mentors for guidance and collaboration."})]}),n.jsxs("div",{"data-aos":"fade-up","data-aos-delay":"600",style:{background:"#fff",borderRadius:24,boxShadow:"0 2px 12px rgba(33, 150, 243, 0.06)",padding:"36px 24px",display:"flex",flexDirection:"column",alignItems:"center",minHeight:"200px"},children:[n.jsx(Bt,{style:{fontSize:38,color:"#ff7043",marginBottom:18}}),n.jsx("div",{style:{fontWeight:700,fontSize:"clamp(18px, 3vw, 22px)",color:"#222",marginBottom:8,textAlign:"center"},children:"Flexible Learning"}),n.jsx("div",{style:{color:"#555",fontSize:"clamp(14px, 2.5vw, 16px)",textAlign:"center"},children:"Learn at your own pace, anytime, anywhere, with on-demand access."})]})]})]});return n.jsxs(n.Fragment,{children:[n.jsx(Qe,{latestMovie:wt}),!j&&T,j&&n.jsx("div",{"data-aos":"fade-left","data-aos-duration":"1000",style:{background:re[0],padding:"clamp(30px, 6vw, 48px) 0"},children:n.jsx(Ze,{})}),j&&T,n.jsx("div",{"data-aos":"fade-right","data-aos-duration":"1000",style:{background:re[1],padding:"clamp(30px, 6vw, 48px) 0"},children:n.jsx(oe,{title:"Trending"})}),n.jsxs("div",{style:{background:"lavender",padding:"clamp(30px, 5vw, 40px) clamp(15px, 3vw, 30px)",display:"flex",justifyContent:"center",alignItems:"center",position:"relative"},children:[n.jsxs("div",{"data-aos":"flip-left","data-aos-duration":"1000",style:{position:"relative",borderRadius:"clamp(16px, 3vw, 24px)",boxShadow:"0 8px 32px 0 rgba(255, 193, 7, 0.18)",background:"linear-gradient(120deg, #fbf7e2 80%, #fef8df 100%)",padding:"10px",minWidth:"min(320px, 90vw)",maxWidth:920,overflow:"hidden",display:"flex",flexDirection:window.innerWidth<=768?"column":"row",alignItems:"center",zIndex:1,animation:"assessmentCardPop 1s cubic-bezier(.4,2,.6,1)"},children:[n.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"linear-gradient(120deg, rgba(255, 235, 59, 0.12) 60%, rgba(255, 193, 7, 0.10) 100%)",borderRadius:"clamp(16px, 3vw, 24px)",zIndex:0,pointerEvents:"none"}}),n.jsx("div",{style:{flex:window.innerWidth<=768?"none":"0 0 160px",width:window.innerWidth<=768?"120px":"160px",height:window.innerWidth<=768?"140px":"190px",marginLeft:window.innerWidth<=768?"0":"100px",marginBottom:window.innerWidth<=768?"-10px":"0",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:window.innerWidth<=768?"24px":"24px 0 0 24px",zIndex:2},children:n.jsx("img",{src:"/assets/images/assessment.jpeg",alt:"Assessment Thumbnail",style:{width:window.innerWidth<=768?"100px":"200px",height:window.innerWidth<=768?"100px":"160px",objectFit:"cover",borderRadius:18,boxShadow:"0 2px 12px #ffe08288"},loading:"lazy"})}),n.jsxs("div",{style:{flex:1,padding:window.innerWidth<=768?"8px":"36px 36px 36px 32px",position:"relative",zIndex:1,textAlign:window.innerWidth<=768?"center":"left",display:"flex",flexDirection:"column",alignItems:window.innerWidth<=768?"center":"flex-start",justifyContent:"center"},children:[n.jsx("div",{style:{fontSize:"clamp(28px, 5vw, 34px)",marginBottom:10,color:"#ffb300",fontWeight:700,letterSpacing:1,textShadow:"0 2px 8px #fffde4"}}),n.jsx("h2",{style:{fontWeight:800,fontSize:"clamp(20px, 4vw, 24px)",color:"#b28704",marginBottom:8,letterSpacing:.5},children:"Assessments Now Available!"}),n.jsxs("p",{style:{fontSize:"clamp(15px, 3vw, 17px)",color:"#7c6f1c",marginBottom:18,fontWeight:500,lineHeight:"1.5"},children:["Test your knowledge and track your progress.",n.jsx("br",{}),"Assessments are now available for all modules."]}),n.jsxs("button",{onClick:()=>window.location.href="/atlas",style:{background:"linear-gradient(90deg, #ffe082 60%, #ffd54f 100%)",color:"black",border:"none",borderRadius:8,padding:"clamp(10px, 2vw, 12px) clamp(20px, 4vw, 28px)",fontWeight:700,fontSize:"clamp(14px, 3vw, 16px)",boxShadow:"0 2px 8px #ffe08288",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all 0.2s",whiteSpace:"nowrap"},children:["Go to Modules",n.jsx("span",{style:{fontSize:"clamp(18px, 3vw, 20px)",marginLeft:2},children:"→"})]})]})]}),n.jsx("style",{children:`
          @keyframes assessmentCardPop {
            0% { transform: scale(0.92) translateY(30px); opacity: 0; }
            60% { transform: scale(1.04) translateY(-8px); opacity: 1; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
        `})]}),n.jsx("div",{"data-aos":"fade-up","data-aos-duration":"2000",style:{background:re[0],padding:"clamp(30px, 6vw, 48px) 0"},children:n.jsx(oe,{title:"Recent Items"})}),n.jsxs("div",{style:{background:"#e3f2fd",padding:"clamp(30px, 5vw, 40px) clamp(10px, 2vw, 20px) clamp(40px, 6vw, 48px) 0",margin:"0 0 0 0",position:"relative",width:"100vw",left:"50%",right:"50%",marginLeft:"-50vw",marginRight:"-50vw"},children:[n.jsx("h2",{style:{fontWeight:600,fontSize:"clamp(22px, 4vw, 28px)",color:"#222",marginBottom:"clamp(20px, 3vw, 24px)",textAlign:"center",letterSpacing:-.5,padding:"0 20px"},children:"Meet Our Faculty"}),n.jsx("div",{style:{position:"absolute",top:0,left:0,width:window.innerWidth<=768?0:60,height:"100%",background:"linear-gradient(to right, #e3f2fd 80%, rgba(227,242,253,0))",zIndex:2,pointerEvents:"none"}}),n.jsx("div",{style:{position:"absolute",top:0,right:0,width:window.innerWidth<=768?0:60,height:"100%",background:"linear-gradient(to left, #e3f2fd 80%, rgba(227,242,253,0))",zIndex:2,pointerEvents:"none"}}),n.jsx(Et,{modules:[Lt,kt,It],navigation:window.innerWidth>768,autoplay:{delay:3500,disableOnInteraction:!1},spaceBetween:(window.innerWidth<=480,24),slidesPerView:1,grabCursor:!0,freeMode:!1,breakpoints:{0:{slidesPerView:1,spaceBetween:24},480:{slidesPerView:1,spaceBetween:10},600:{slidesPerView:2,spaceBetween:20},768:{slidesPerView:3,spaceBetween:24},900:{slidesPerView:3,spaceBetween:24},1200:{slidesPerView:4,spaceBetween:24}},style:{maxWidth:1200,margin:(window.innerWidth<=768,"0 auto"),marginLeft:window.innerWidth<=768&&"25px",position:"relative",zIndex:3,padding:"0 clamp(10px, 2vw, 20px)"},pagination:{clickable:!0},children:q.map((M,L)=>n.jsx(At,{children:n.jsxs("div",{style:{background:"#fff",borderRadius:"clamp(14px, 2.5vw, 18px)",boxShadow:"0 2px 12px rgba(33, 150, 243, 0.08)",padding:"clamp(24px, 4vw, 32px)",display:"flex",flexDirection:"column",alignItems:"center",minHeight:"clamp(280px, 45vw, 340px)",height:"auto",transition:"transform 0.2s",textAlign:"center",cursor:"pointer"},onClick:()=>R("/faculty-detail"),onMouseEnter:W=>{window.innerWidth>768&&(W.currentTarget.style.transform="translateY(-5px)")},onMouseLeave:W=>{window.innerWidth>768&&(W.currentTarget.style.transform="translateY(0)")},children:[n.jsx("img",{src:M.image,alt:M.name+" photo",style:{width:"clamp(120px, 20vw, 160px)",height:"clamp(120px, 20vw, 160px)",objectFit:"cover",borderRadius:"50%",marginBottom:"clamp(16px, 3vw, 22px)",boxShadow:"0 2px 8px rgba(25,118,210,0.2)",border:`3px solid ${fe.primary}`},loading:"lazy"}),n.jsx("div",{style:{fontWeight:700,fontSize:"clamp(16px, 3vw, 20px)",color:fe.text,marginBottom:4,lineHeight:"1.2"},children:M.name}),n.jsx("div",{style:{color:fe.textColor,fontSize:"clamp(14px, 2.5vw, 16px)",lineHeight:"1.3",padding:"0 5px"},children:M.title})]})},M._id||L))})]}),n.jsx("div",{"data-aos":"zoom-in","data-aos-duration":"1000",style:{background:re[1],padding:"clamp(30px, 6vw, 48px) 0"},children:n.jsx(oe,{title:"Recommended Cases"})}),n.jsx(et,{randomImage:zt()}),n.jsx("div",{"data-aos":"slide-up","data-aos-duration":"1000",style:{background:re[0],padding:"clamp(30px, 6vw, 48px) 0"},children:n.jsx(oe,{title:"Upcoming Live Programs"})}),n.jsx(Vt,{}),n.jsx("div",{"data-aos":"fade-up","data-aos-delay":"200","data-aos-duration":"1000",style:{background:"ghostwhite",padding:"clamp(30px, 6vw, 48px) 0"},children:n.jsx(oe,{title:"Recommended Lectures"})}),n.jsx("style",{jsx:!0,children:`
        html {
          scroll-behavior: smooth;
        }

        * {
          box-sizing: border-box;
        }

        /* Container max-width adjustments */
        .container {
          max-width: 100%;
          padding: 0 clamp(15px, 3vw, 30px);
        }

        /* Typography scaling */
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          word-wrap: break-word;
          hyphens: auto;
        }

        /* Button responsiveness */
        button {
          min-height: 44px; /* Touch target size */
          touch-action: manipulation;
        }

        /* Image responsiveness */
        img {
          max-width: 100%;
          height: auto;
        }

        /* Responsive grid adjustments */
        @media (max-width: 1024px) {
          .why-choose-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
        }

        @media (max-width: 768px) {
          .why-choose-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            // padding: 0 5px !important;
          }

          .swiper-pagination {
            bottom: 10px !important; /* space above dots */
            position: relative !important; /* ensures dots don't overlap cards */
          }

          /* Assessment card mobile adjustments */
          [data-aos="flip-left"] {
            flex-direction: column !important;
            // gap: 10px !important
            text-align: center !important;
          }

          /* Faculty section mobile spacing */
          .swiper {
            padding: 0 10px !important;
          }

          /* Section padding mobile override */
          div[style*="padding"] {
            padding-left: clamp(15px, 4vw, 20px) !important;
            padding-right: clamp(15px, 4vw, 20px) !important;
          }
        }

        @media (max-width: 480px) {
          /* Extra small screens */
          .why-choose-grid div {
            // padding: 24px 16px !important;
            min-height: 50px !important;
          }

          /* Faculty cards smaller */
          .swiper-slide > div {
            min-height: 260px !important;
            // padding: 20px !important;
          }

          /* Assessment card extra small */
          [data-aos="flip-left"] {
            min-width: 95vw !important;
            margin: 0 auto !important;
          }
        }

        /* Landscape tablet adjustments */
        @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
          .why-choose-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
          img {
            image-rendering: -webkit-optimize-contrast;
          }
        }

        .main-title {
          color: #1976d2 !important;
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus styles for keyboard navigation */
        button:focus,
        [tabindex]:focus {
          outline: 2px solid #1976d2;
          outline-offset: 2px;
        }
      `})]})});Ut.displayName="HomePage";export{Ut as default};
