var K=Object.defineProperty;var R=(t,e,n)=>e in t?K(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var a=(t,e,n)=>(R(t,typeof e!="symbol"?e+"":e,n),n);function E(){}function V(t,e){for(const n in e)t[n]=e[n];return t}function M(t){return t()}function L(){return Object.create(null)}function y(t){t.forEach(M)}function v(t){return typeof t=="function"}function _t(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function W(t){return Object.keys(t).length===0}function Q(t,...e){if(t==null){for(const i of e)i(void 0);return E}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function mt(t,e,n){t.$$.on_destroy.push(Q(e,n))}function pt(t,e,n,i){if(t){const s=T(t,e,n,i);return t[0](s)}}function T(t,e,n,i){return t[1]&&i?V(n.ctx.slice(),t[1](i(e))):n.ctx}function bt(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const c=[],r=Math.max(e.dirty.length,s.length);for(let u=0;u<r;u+=1)c[u]=e.dirty[u]|s[u];return c}return e.dirty|s}return e.dirty}function yt(t,e,n,i,s,c){if(s){const r=T(e,n,i,c);t.p(r,s)}}function gt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}let j=!1;function U(){j=!0}function X(){j=!1}function Y(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function Z(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const o=[];for(let l=0;l<e.length;l++){const f=e[l];f.claim_order!==void 0&&o.push(f)}e=o}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let o=0;o<e.length;o++){const l=e[o].claim_order,f=(s>0&&e[n[s]].claim_order<=l?s+1:Y(1,s,g=>e[n[g]].claim_order,l))-1;i[o]=n[f]+1;const d=f+1;n[d]=o,s=Math.max(d,s)}const c=[],r=[];let u=e.length-1;for(let o=n[s]+1;o!=0;o=i[o-1]){for(c.push(e[o-1]);u>=o;u--)r.push(e[u]);u--}for(;u>=0;u--)r.push(e[u]);c.reverse(),r.sort((o,l)=>o.claim_order-l.claim_order);for(let o=0,l=0;o<r.length;o++){for(;l<c.length&&r[o].claim_order>=c[l].claim_order;)l++;const f=l<c.length?c[l]:null;t.insertBefore(r[o],f)}}function tt(t,e){if(j){for(Z(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function et(t,e,n){t.insertBefore(e,n||null)}function xt(t,e,n){j&&!n?tt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function H(t){t.parentNode&&t.parentNode.removeChild(t)}function J(t){return document.createElement(t)}function S(t){return document.createTextNode(t)}function wt(){return S(" ")}function Et(){return S("")}function nt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function it(t){return Array.from(t.childNodes)}function st(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function q(t,e,n,i,s=!1){st(t);const c=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const u=t[r];if(e(u)){const o=n(u);return o===void 0?t.splice(r,1):t[r]=o,s||(t.claim_info.last_index=r),u}}for(let r=t.claim_info.last_index-1;r>=0;r--){const u=t[r];if(e(u)){const o=n(u);return o===void 0?t.splice(r,1):t[r]=o,s?o===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,u}}return i()})();return c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,c}function rt(t,e,n,i){return q(t,s=>s.nodeName===e,s=>{const c=[];for(let r=0;r<s.attributes.length;r++){const u=s.attributes[r];n[u.name]||c.push(u.name)}c.forEach(r=>s.removeAttribute(r))},()=>i(e))}function jt(t,e,n){return rt(t,e,n,J)}function ct(t,e){return q(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>S(e),!0)}function At(t){return ct(t," ")}function Nt(t,e){e=""+e,t.data!==e&&(t.data=e)}function Ot(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function ot(t){const e={};return t.childNodes.forEach(n=>{e[n.slot||"default"]=!0}),e}function St(t,e){return new t(e)}let b;function p(t){b=t}function z(){if(!b)throw new Error("Function called outside component initialization");return b}function Ct(t){z().$$.on_mount.push(t)}function kt(t){z().$$.after_update.push(t)}const _=[],P=[];let m=[];const B=[],D=Promise.resolve();let N=!1;function F(){N||(N=!0,D.then(I))}function Lt(){return F(),D}function O(t){m.push(t)}const A=new Set;let $=0;function I(){if($!==0)return;const t=b;do{try{for(;$<_.length;){const e=_[$];$++,p(e),ut(e.$$)}}catch(e){throw _.length=0,$=0,e}for(p(null),_.length=0,$=0;P.length;)P.pop()();for(let e=0;e<m.length;e+=1){const n=m[e];A.has(n)||(A.add(n),n())}m.length=0}while(_.length);for(;B.length;)B.pop()();N=!1,A.clear(),p(t)}function ut(t){if(t.fragment!==null){t.update(),y(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(O)}}function lt(t){const e=[],n=[];m.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),m=e}const x=new Set;let h;function Pt(){h={r:0,c:[],p:h}}function Bt(){h.r||y(h.c),h=h.p}function ft(t,e){t&&t.i&&(x.delete(t),t.i(e))}function Mt(t,e,n,i){if(t&&t.o){if(x.has(t))return;x.add(t),h.c.push(()=>{x.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}function vt(t){t&&t.c()}function Tt(t,e){t&&t.l(e)}function at(t,e,n){const{fragment:i,after_update:s}=t.$$;i&&i.m(e,n),O(()=>{const c=t.$$.on_mount.map(M).filter(v);t.$$.on_destroy?t.$$.on_destroy.push(...c):y(c),t.$$.on_mount=[]}),s.forEach(O)}function dt(t,e){const n=t.$$;n.fragment!==null&&(lt(n.after_update),y(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ht(t,e){t.$$.dirty[0]===-1&&(_.push(t),F(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Ht(t,e,n,i,s,c,r,u=[-1]){const o=b;p(t);const l=t.$$={fragment:null,ctx:[],props:c,update:E,not_equal:s,bound:L(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(o?o.$$.context:[])),callbacks:L(),dirty:u,skip_bound:!1,root:e.target||o.$$.root};r&&r(l.root);let f=!1;if(l.ctx=n?n(t,e.props||{},(d,g,...C)=>{const k=C.length?C[0]:g;return l.ctx&&s(l.ctx[d],l.ctx[d]=k)&&(!l.skip_bound&&l.bound[d]&&l.bound[d](k),f&&ht(t,d)),g}):[],l.update(),f=!0,y(l.before_update),l.fragment=i?i(l.ctx):!1,e.target){if(e.hydrate){U();const d=it(e.target);l.fragment&&l.fragment.l(d),d.forEach(H)}else l.fragment&&l.fragment.c();e.intro&&ft(t.$$.fragment),at(t,e.target,e.anchor),X(),I()}p(o)}let G;typeof HTMLElement=="function"&&(G=class extends HTMLElement{constructor(e,n,i){super();a(this,"$$ctor");a(this,"$$s");a(this,"$$c");a(this,"$$cn",!1);a(this,"$$d",{});a(this,"$$r",!1);a(this,"$$p_d",{});a(this,"$$l",{});a(this,"$$l_u",new Map);this.$$ctor=e,this.$$s=n,i&&this.attachShadow({mode:"open"})}addEventListener(e,n,i){if(this.$$l[e]=this.$$l[e]||[],this.$$l[e].push(n),this.$$c){const s=this.$$c.$on(e,n);this.$$l_u.set(n,s)}super.addEventListener(e,n,i)}removeEventListener(e,n,i){if(super.removeEventListener(e,n,i),this.$$c){const s=this.$$l_u.get(n);s&&(s(),this.$$l_u.delete(n))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let e=function(c){return()=>{let r;return{c:function(){r=J("slot"),c!=="default"&&nt(r,"name",c)},m:function(l,f){et(l,r,f)},d:function(l){l&&H(r)}}}};if(await Promise.resolve(),!this.$$cn)return;const n={},i=ot(this);for(const c of this.$$s)c in i&&(n[c]=[e(c)]);for(const c of this.attributes){const r=this.$$g_p(c.name);r in this.$$d||(this.$$d[r]=w(r,c.value,this.$$p_d,"toProp"))}this.$$c=new this.$$ctor({target:this.shadowRoot||this,props:{...this.$$d,$$slots:n,$$scope:{ctx:[]}}});const s=()=>{this.$$r=!0;for(const c in this.$$p_d)if(this.$$d[c]=this.$$c.$$.ctx[this.$$c.$$.props[c]],this.$$p_d[c].reflect){const r=w(c,this.$$d[c],this.$$p_d,"toAttribute");r==null?this.removeAttribute(c):this.setAttribute(this.$$p_d[c].attribute||c,r)}this.$$r=!1};this.$$c.$$.after_update.push(s),s();for(const c in this.$$l)for(const r of this.$$l[c]){const u=this.$$c.$on(c,r);this.$$l_u.set(r,u)}this.$$l={}}}attributeChangedCallback(e,n,i){var s;this.$$r||(e=this.$$g_p(e),this.$$d[e]=w(e,i,this.$$p_d,"toProp"),(s=this.$$c)==null||s.$set({[e]:this.$$d[e]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{this.$$cn||(this.$$c.$destroy(),this.$$c=void 0)})}$$g_p(e){return Object.keys(this.$$p_d).find(n=>this.$$p_d[n].attribute===e||!this.$$p_d[n].attribute&&n.toLowerCase()===e)||e}});function w(t,e,n,i){var c;const s=(c=n[t])==null?void 0:c.type;if(e=s==="Boolean"&&typeof e!="boolean"?e!=null:e,!i||!n[t])return e;if(i==="toAttribute")switch(s){case"Object":case"Array":return e==null?null:JSON.stringify(e);case"Boolean":return e?"":null;case"Number":return e??null;default:return e}else switch(s){case"Object":case"Array":return e&&JSON.parse(e);case"Boolean":return e;case"Number":return e!=null?+e:e;default:return e}}function Jt(t,e,n,i,s,c){let r=class extends G{constructor(){super(t,n,s),this.$$p_d=e}static get observedAttributes(){return Object.keys(e).map(u=>(e[u].attribute||u).toLowerCase())}};return Object.keys(e).forEach(u=>{Object.defineProperty(r.prototype,u,{get(){return this.$$c&&u in this.$$c?this.$$c[u]:this.$$d[u]},set(o){var l;o=w(u,o,e),this.$$d[u]=o,(l=this.$$c)==null||l.$set({[u]:o})}})}),i.forEach(u=>{Object.defineProperty(r.prototype,u,{get(){var o;return(o=this.$$c)==null?void 0:o[u]}})}),c&&(r=c(r)),t.element=r,r}class qt{constructor(){a(this,"$$");a(this,"$$set")}$destroy(){dt(this,1),this.$destroy=E}$on(e,n){if(!v(n))return E;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!W(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{vt as A,Tt as B,at as C,dt as D,pt as E,yt as F,gt as G,bt as H,tt as I,E as J,mt as K,qt as S,wt as a,At as b,Jt as c,xt as d,Et as e,I as f,Mt as g,Bt as h,Ht as i,ft as j,H as k,kt as l,J as m,jt as n,Ct as o,it as p,nt as q,Ot as r,_t as s,Lt as t,S as u,ct as v,Nt as w,Pt as x,P as y,St as z};
