"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5015],{95015:function(t,e,i){i.r(e),i.d(e,{default:function(){return c}});var a=i(85893),l=i(67294);let s=i(10508).ZP.div(["iframe{opacity:",";transition:opacity 0.25s ease-in;}.loading{&::before{color:#fff;font-weight:500;mix-blend-mode:normal;text-shadow:1px 2px 3px rgba(0,0,0,50%);}}"],({$loaded:t})=>t?"100%":"0%");var n=i(44696),r=i(58437),o=i(20063),d=i(74399),c=({id:t})=>{let{prependFileToTitle:e}=(0,n.Z)(t),{readFile:i}=(0,o.o)(),c=(0,d.C)(),{processes:{[t]:{url:u=""}={}},close:f}=(0,r.z)();(0,l.useEffect)(()=>{e(u)},[e,u]),(0,l.useEffect)(()=>{i&&c&&u&&u.startsWith("/")&&(f(t),i(u).then(async t=>{let e=await c.api.loadPlugin({src:t.toString()});await e.setup(),e.run&&await e.run({config:{},data:{}})}))},[i,c,u,f,t]);let p={height:"100%",width:"100%"};return u.startsWith("http")?(0,a.jsx)(s,{$loaded:!0,children:(0,a.jsx)("iframe",{src:u,style:p,title:"ImJoy Window"})}):(0,a.jsx)(s,{$loaded:!0,children:(0,a.jsx)("div",{id:u,style:p})})}},44696:function(t,e,i){var a=i(67294),l=i(58437),s=i(37176),n=i(97836);e.Z=t=>{let{title:e}=(0,l.z)(),[i]=t.split(n.CC),{title:r}=s.Z[i]||{};return{appendFileToTitle:(0,a.useCallback)((i,a)=>{let l=i?` - ${i}${a?` ${n.xy}`:""}`:"";e(t,`${r}${l}`)},[t,r,e]),prependFileToTitle:(0,a.useCallback)((i,a,l)=>{let s=i?`${a?`${n.xy} `:""}${i}${l?" ":" - "}`:"";e(t,`${s}${r}`)},[t,r,e])}}}}]);