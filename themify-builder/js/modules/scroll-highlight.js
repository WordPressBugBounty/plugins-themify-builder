((e,t,l)=>{"use strict";let n,i=null,r=!0,a=!1,o=!1;const s=tbLocalScript.scrollHighlight,{navigation:u="#main-nav,.module-menu .nav",updateHash:c,element:f="module_row",speed:h=0}=s,d=~~s.offset,m=t.top.Themify?t.top:t,_=()=>{if(!0!==e.lazyScrolling){const e=m.location.hash.replace("#",""),t=l.querySelectorAll(u);for(let l=t.length-1;l>-1;--l){let i=t[l].tfClass("current-menu-item");for(let e=i.length-1;e>-1;--e)n??=i[e].tfTag("a")[0].getAttribute("href"),i[e].classList.remove("current_page_item","current-menu-item");i=""!==e&&"#"!==e?t[l].querySelectorAll('a[href*="#'+CSS.escape(e)+'"]'):null,i&&0!==i.length||(i=t[l].querySelectorAll('a[href="'+n+'"]'));for(let e=i.length-1;e>-1;--e){let t=i[e].parentNode.classList;t.add("current-menu-item"),t.contains("menu-item-object-page")&&t.add("current_page_item")}}n??=m.location.href.split("#")[0]}},g=(t,n)=>{if(!0!==e.lazyScrolling){e.lazyScrolling=!0;const i=t.closest(".module_row")||t,{nextElementSibling:r,previousElementSibling:o}=i,s=e.lazyDisable;o&&e.lazyScroll(e.convert(e.selectWithParent("[data-lazy]",o)).reverse(),!0),e.lazyScroll(e.convert(e.selectWithParent("[data-lazy]",i)).reverse(),!0).finally((()=>{let i=d+~~l.tfId("wpadminbar")?.offsetHeight,r=0;const o=!1===a,u=async()=>{l.body.classList.contains("mobile-menu-visible")&&await new Promise((e=>setTimeout(e,50)));let a=d>0?0:l.body.classList.contains("fixed-header-on")?getComputedStyle(l.documentElement).getPropertyValue("--tf_fixed_h"):0,c=i;a&&(c+=parseFloat(a)),++r,e.scrollTo(t.getBoundingClientRect().top+m.scrollY-c,h,(()=>{if(r<4)requestAnimationFrame(u);else if(!0===e.lazyScrolling){const i=b(),r=l.querySelectorAll("[data-lazy]"),a=new IntersectionObserver(((t,l)=>{for(let l=t.length-1;l>-1;--l)!0===t[l].isIntersecting&&e.lazyScroll(e.convert(e.selectWithParent("[data-lazy]",t[l].target)).reverse(),!0);l.disconnect()}),{rootMargin:"300px 0px 300px 0px"});for(let e=r.length-1;e>-1;--e)r[e].classList.contains("hide-"+i)||a.observe(r[e]);e.lazyScrolling=s,!1===o&&(n=t.hasAttribute("data-hide-anchor")?"":"#"+n.replace("#",""),m.history.replaceState(null,null,n)),_()}}))};requestAnimationFrame(u),l.activeElement.blur()})),r&&e.lazyScroll(e.convert(e.selectWithParent("[data-lazy]",r)).reverse(),!0)}},p=t=>{if(!1===a){const e=m.location.hash.replace("#","");if(e&&"#"!==e){const t=w(l.querySelectorAll("."+f+'[data-anchor="'+e+'"]'))||l.querySelector('.module [data-id="'+e+'"]')?.closest(".module");t&&g(t,e)}a=!0}(t=>{if(!1!==c){null===i&&(i=new IntersectionObserver((t=>{if(!0!==e.lazyScrolling){let e=!1;for(let l=t.length-1;l>-1;--l)if(!0===t[l].isIntersecting){e=t[l].target.dataset.anchor;break}!1===e?!1===r?(m.history.replaceState(null,null," "),_()):r=!1:(m.history.replaceState(null,null,"#"+e),_())}}),{rootMargin:"0px 0px -100%",thresholds:[0,1]}));const l=e.selectWithParent(f,t);for(let e=l.length-1;e>-1;--e)if(!l[e].hasAttribute("data-hide-anchor")){let t=l[e].dataset.anchor;t&&"#"!==t&&i.observe(l[e])}}})(t)},b=()=>{const t=e.w,l=themify_vars.breakpoints;for(let e in l)if(Array.isArray(l[e])){if(t>=l[e][0]&&t<=l[e][1])return e}else if(t<=l[e])return e;return"desktop"},w=e=>{if(!e[1])return e[0]||null;for(let t=b(),l=0;l<e.length;++l)if(!e[l].classList.contains("hide-"+t))return e[l];return null},v=t=>{let n="A"===t.target.tagName?t.target:t.target.closest("a");if(n){let i=n.getAttribute("href");if(""!==i&&null!==i&&"#"!==i&&"#/"!==i){const n=new URL(i,m.location);if(n.hash&&n.hostname===m.location.hostname&&n.pathname===m.location.pathname){const i=n.hash;if(""!==i&&"#"!==i){const n=w(l.querySelectorAll("."+f+'[data-anchor="'+i.replace("#","")+'"]'));(n||w(l.querySelectorAll(i+".module,"+i+".module_row")))&&(e.trigger("tf_side_menu_hide_all"),n&&(t.preventDefault(),t.stopPropagation(),g(n,i)))}}}}};e.on("tb_scroll_highlight_enable",(()=>{!1===o&&(o=!0,m.tfOn("hashchange",_,{passive:!0}),l.body.tfOn("click",v))})).on("tb_scroll_highlight_disable",(()=>{i?.disconnect(),i=null,o=!1,m.tfOff("hashchange",_,{passive:!0}),l.body.tfOff("click",v)})).on("tb_init_scroll_highlight",(t=>{p(t),e.trigger("tb_scroll_highlight_enable")}))})(Themify,window,document);