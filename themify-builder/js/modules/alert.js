((e,t)=>{"use strict";const l=(t,l,i)=>{const o=new Date;o.setTime(o.getTime()+864e5*i),e.cookie=t+"="+l+";expires="+o.toUTCString()+";SameSite=strict;path=/"},i=t=>{t+="=";const l=e.cookie.split(";");for(let e=0;e<l.length;++e){let i=l[e];while(" "===i.charAt(0))i=i.substring(1);if(0===i.indexOf(t))return i.substring(t.length,i.length)}return""},o=l=>{const i=l.closest(".module-alert");t.slide(i,!1,500,(()=>{const o=l.dataset.alertMessage;if(o){const l=i.tfClass("alert-inner")[0],r=e.createElement("div");r.className="alert-message",r.textContent=o,l.textContent="",l.appendChild(r),t.slide(i,!0)}}))};t.on("builder_load_module_partial",((e,r)=>{if(!0!==r||e.classList.contains("module-alert"))for(let r=t.selectWithParent("module-alert",e),a=r.length-1;a>-1;--a){let e=r[a],{moduleId:t,alertLimit:s,autoClose:u}=e.dataset;if(s&&!isNaN(s)){let e=~~i(t);l(t,++e,365)}u&&!isNaN(u)&&setTimeout((()=>{o(e)}),1e3*u)}})),e.body.tfOn("click",(e=>{e.target.matches(".module-alert .alert-close")&&(e.preventDefault(),o(e.target))}))})(document,Themify);