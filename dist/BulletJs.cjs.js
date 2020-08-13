"use strict";require("core-js/modules/es7.object.get-own-property-descriptors"),require("core-js/modules/es6.symbol"),require("core-js/modules/web.dom.iterable"),require("core-js/modules/es6.array.iterator"),require("core-js/modules/es6.object.to-string"),require("core-js/modules/es6.object.keys"),require("core-js/modules/es6.array.fill"),require("core-js/modules/es6.object.assign"),require("core-js/modules/es7.array.includes"),require("core-js/modules/es6.string.includes"),require("core-js/modules/es6.regexp.to-string");var t=function(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r};var e=function(e){if(Array.isArray(e))return t(e)};var n=function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)};var r=function(e,n){if(e){if("string"==typeof e)return t(e,n);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?t(e,n):void 0}};var i=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")};var s=function(t){return e(t)||n(t)||r(t)||i()};var a=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")};function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var l=function(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),t};var u=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t},c=function(t){var e=t.duration,n=document.createElement("div");return n.id=Math.random().toString(36).substring(2),n.classList.add("bullet-item-style"),n.style.animationDuration=e,n};function h(t,e,n,r){t.addEventListener(e,(function(e){for(var i=e.target;!i.className.includes(n);){if(i===t){i=null;break}i=i.parentNode}i&&r(i)}))}function d(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function f(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?d(Object(n),!0).forEach((function(e){u(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var g={trackHeight:50,pauseOnHover:!1,pauseOnClick:!1,onStart:null,onEnd:null,duration:"10s",speed:100},p=function(){function t(e){var n=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};a(this,t),u(this,"target",null),u(this,"tempContanier",null),u(this,"bulletInfo",{}),u(this,"bullets",[]),u(this,"tracks",[]),u(this,"queues",[]),u(this,"targetW",0),u(this,"pauseArrs",[]),u(this,"_render",(function(t,e){if(t.dataset.track=e,t.style.top=e*n.options.trackHeight+"px",n.target.appendChild(t),n.queues.length){var r=n.queues.shift();n.push(r.item,r.opts,!0)}})),u(this,"_toggleAnimateStatus",(function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"paused";t?"running"===e?(t.style.animationPlayState="running",t.style.zIndex=0,t.classList.remove("bullet-item-paused")):(t.style.animationPlayState="paused",t.style.zIndex=99999,t.classList.add("bullet-item-paused")):n.pauseArrs.length&&"paused"==e||(n.pauseArrs=n.getBulletsList(),n.pauseArrs.forEach((function(t){t.style.animationPlayState=e})),n.pauseArrs=[])})),this.options=Object.assign(g,r),this.ele=e,this.initScreen(),this.initOpt(),this.initTempContainer(),this._addExtraEvent()}return l(t,[{key:"initScreen",value:function(){if("string"==typeof this.ele){if(this.target=document.querySelector(this.ele),!this.target)throw new Error("The display target does not exist")}else{if(!(this.ele instanceof HTMLElement))throw new Error("The display target of the barrage must be set");this.target=this.ele}}},{key:"initOpt",value:function(){var t=this.options.trackHeight;this.targetPos=this.target.getBoundingClientRect();var e=Math.floor(this.targetPos.height/t);this.tracks=new Array(e).fill("idle"),this.bullets=new Array(e).fill([]),this.targetW=this.targetPos.width,"static"===getComputedStyle(this.target).position&&(this.target.style.position="relative",this.target.style.overflow="hidden"),function(t){var e=document.createElement("style");e.classList.add("BULLET_ANIMATE");var n="from { visibility: visible; transform: translateX(".concat(t,"px); }"),r="@keyframes RightToLeft { ".concat(n," ").concat("to { visibility: visible; transform: translateX(-100%); }"," }");e.innerHTML=r+"\n    .bullet-item-style {\n\t\tcursor: pointer;\n\t\tposition: absolute;\n\t\tleft: 0;\n\t\tanimation-name: RightToLeft;\n\t\tanimation-timing-function: linear;\n\t\twill-change: transform;\n\t}\n\t\n\t.bullet-temp-container {\n\t\tposition: absolute;\n\t\tright: 9999px;\n\t\tvisibility: hidden;\n\t}\n\t",document.head.appendChild(e)}(this.targetW)}},{key:"initTempContainer",value:function(){this.tempContanier=document.createElement("div"),this.tempContanier.classList.add("bullet-temp-container"),document.body.appendChild(this.tempContanier)}},{key:"push",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=Object.assign({},this.options,e),i=c(f(f({},r),{},{currScreen:this}));i.innerHTML=t,this.tempContanier.appendChild(i),this.bulletInfo={width:i.offsetWidth};var s=0;r.speed?(s=(this.targetW+this.bulletInfo.width)/r.speed,i.style.animationDuration=s+"s"):s=+r.duration.slice(0,-1),i.dataset.duration=s,this.bulletInfo.duration=s,i.remove();var a=this._getTrackIndex();return-1===a?n&&this.queues.push({item:t,opts:e}):(this.bullets[a].length?this.bullets[a].push(i):this.bullets[a]=[i],this._render(i,a),this._addEvent(i,a,r)),i.id}},{key:"_getTrackIndex",value:function(){var t,e,n=[],r=-1;if(this.tracks.forEach((function(t,e){return"idle"===t&&n.push(e)})),n.length){var i=(t=0,e=n.length-1,parseInt(Math.random()*(e-t+1))+t);return r=n[i],this.tracks[r]="running",r}for(var s=0;s<this.bullets.length;s++){var a=this.bullets[s].length;if(a){var o=this.bullets[s][a-1];if(o&&this._checkTrack(o))return s}}return r}},{key:"_checkTrack",value:function(t){var e=t.getBoundingClientRect();if(e.right>this.targetPos.right)return!1;if(this.options.speed){if(e.right<this.targetPos.right)return!0}else{var n=(this.targetW+e.width)/t.dataset.duration,r=(this.targetW+this.bulletInfo.width)/this.bulletInfo.duration;if(r<=n)return!0;var i=(e.right-this.targetPos.left)/n;if(this.targetW/r<i)return!1}return!0}},{key:"_addEvent",value:function(t,e,n){var r=this,i=n.onStart,s=n.onEnd;t.addEventListener("animationstart",(function(){i&&i.call(window,t.id,r)})),t.addEventListener("animationend",(function(){s&&s.call(window,t.id,r),r.bullets[e]=r.bullets[e].filter((function(e){return e.id!==t.id})),r.bullets[e].length||(r.tracks[e]="idle"),t.remove()}))}},{key:"_addExtraEvent",value:function(){var t=this;this.options.pauseOnClick&&h(this.target,"click","bullet-item-style",(function(e){console.log("el-click----\x3e",e),"paused"==e.style.animationPlayState&&e.dataset.clicked?(e.dataset.clicked="",t._toggleAnimateStatus(e,"running")):(e.dataset.clicked="true",t._toggleAnimateStatus(e,"paused"))})),this.options.pauseOnHover&&(h(this.target,"mouseover","bullet-item-style",(function(e){t._toggleAnimateStatus(e,"paused")})),h(this.target,"mouseout","bullet-item-style",(function(e){t._toggleAnimateStatus(e,"running")})))}},{key:"getBulletsList",value:function(){return this.bullets.reduce((function(t,e){return[].concat(s(e),s(t))}),[])}},{key:"pause",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this._toggleAnimateStatus(t,"paused")}},{key:"resume",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this._toggleAnimateStatus(t,"running")}}]),t}();module.exports=p;
