import{j as t,L as h}from"./app-RD4YkSLs.js";import{c as s}from"./createLucideIcon-Bh2i4FhY.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],u=s("ChevronLeft",m);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],g=s("ChevronRight",f);function b({links:r,className:c="",anchor:i=""}){function l(e){return e==="&laquo; Previous"?t.jsx(u,{className:"h-8 w-8"}):e==="Next &raquo;"?t.jsx(g,{className:"h-8 w-8"}):e}return r.length<=3?null:t.jsx("nav",{"aria-label":"Paginação",children:t.jsx("div",{className:`mt-8 flex flex-wrap items-center justify-center gap-2 ${c}`,children:r.map((e,n)=>{const o=l(e.label),a="flex h-10 items-center justify-center  px-4  font-medium";return e.url?t.jsx(h,{href:e.url+i,className:`${a} transition-colors ${e.active?"border-black bg-black font-semibold text-white hover:bg-black/90":"border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`,children:o},n):t.jsx("span",{className:`${a} cursor-not-allowed text-gray-300`,children:o},n)})})})}export{b as P};
