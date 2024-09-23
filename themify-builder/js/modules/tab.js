(($,t,e,a)=>{"use strict";let n=!1;const l=ThemifyBuilderModuleJs.cssUrl+"tab_styles/",r=()=>{const t=a.location.hash.replace("#","");""!==t&&"#"!==t&&e.querySelector('.module-tab a[href="#'+CSS.escape(t)+'"]')?.click()},i=a=>{for(let n=e.querySelectorAll(".module-tab[data-tab-breakpoint]"),r=n.length-1;r>-1;--r){let e=n[r];if(~~e.dataset.tabBreakpoint>=a)t.loadCss(l+"responsive").then((()=>{e.classList.add("responsive-tab-style")}));else{e.classList.remove("responsive-tab-style");for(let t=e.tfClass("tab-nav"),a=t.length-1;a>-1;--a)t[a].classList.remove("right-align","center-align")}}},s=e=>{let a,n=!0,l=!!e.dataset.timerbar,r=!!e.dataset.disablepause,i=e.tfClass("tab-nav")[0].tfClass("tb_tab_timerbar"),s=()=>{let t=e.isConnected?e.querySelector("li.current"):null,a=t?t.nextElementSibling||e.querySelector(".tab-nav li:first-child"):null;a?(n=!1,a.firstElementChild.click(),n=!0,l&&(o(),c(a))):v()},c=t=>{const a=t.tfClass("tb_tab_timerbar")[0];a.style.width="100%",a.style.transitionDuration=e.dataset.autoplay+"s"},o=()=>{for(var t=0;t<i.length;t++)i[t].style.transitionDuration="0s",i[t].style.width=0},b=()=>{const t=e;a=setInterval(s,1e3*t.dataset.autoplay),l&&c(e.querySelector("li.current")),r||t.tfOn("pointerenter",d,{passive:!0,once:!0})},d=t=>{l&&o(),clearInterval(a),r||t.currentTarget.tfOn("pointerleave",b,{passive:!0,once:!0})},u=t=>{t.closest(".module-tab")===e&&n&&(e.dataset.autoplayStopOnClick?v():r&&(d(),b()))},v=()=>{clearInterval(a),e.tfOff("pointerenter",d,{passive:!0,once:!0}).tfOff("pointerleave",b,{passive:!0,once:!0}),t.off("tb_tabs_switch",u),l&&o(),e=s=b=d=u=v=a=null};b({currentTarget:e}),t.on("tb_tabs_switch",u)};t.on("tfsmartresize",(t=>{t&&i(t.w)})).on("builder_load_module_partial",((c,o)=>{if(!0!==o||c.classList.contains("module-tab")){for(let e=t.selectWithParent("module-tab",c),a=e.length-1;a>-1;--a){let n=e[a].classList,r="";n.contains("transparent")&&t.loadCss(l+"transparent","tb_tab_transparent"),n.contains("minimal")?r="minimal":n.contains("panel")?r="panel":n.contains("vertical")&&(r="vertical"),""!==r&&t.loadCss(l+r,"tb_tab_"+r),e[a].dataset.autoplay&&s(e[a]),e[a].dataset.fx&&t.wow()}!1===n&&(n=!0,a.tfOn("hashchange",r,{passive:!0}),t.requestIdleCallback((()=>{(()=>{i(t.w),e.body.tfOn("click",(e=>{const n=e.target?.closest(".tab-nav a,.tab-nav-current-active");if(n){e.preventDefault(),e.stopPropagation();const l=t=>{const e=t.classList;if(e.contains("clicked"))e.remove("clicked");else{const a=$(t),n=a.position().left,l=a.closest(".module-tab").width()/2,r=a.next(".tab-nav")[0].classList;r.toggle("center-align",n>0&&n<=l),r.toggle("right-align",n>l),e.add("clicked")}},r=n.closest(".module-tab").dataset.fx;if(n.classList.contains("tab-nav-current-active"))l(n);else{const e=n.parentNode,i=n.getAttribute("href").replace("#",""),s=e.closest(".module-tab"),c=s.tfClass("tab-nav")[0].tfTag("li"),o=s.tfClass("tab-nav-current-active")[0],b=s.querySelector(':scope > .tab-content[aria-hidden="false"]'),d=s.querySelector(':scope > .tab-content[data-id="'+i+'"]'),u=t=>{t.setAttribute("aria-hidden",!("true"===t.getAttribute("aria-hidden")))};for(let t=c.length-1;t>-1;--t){let a=c[t]===e?"true":"false";c[t].classList.toggle("current","true"===a),c[t].setAttribute("aria-expanded",a)}r?(b.style.animationName=r.replace("In","Out"),b.tfOn("animationend",(()=>{u(b),d.style.animationName=r,u(d)}),{once:!0,passive:!0})):(u(b),u(d)),!0===s.hasAttribute("data-hashtag")&&a.history.pushState(null,null,"#"+i),o.tfClass("tb_tab_title")[0].innerText=n.innerText,l(o),t.trigger("tb_tabs_switch",[d,n,i])}}}))})(),r()}),-1,500))}}))})(jQuery,Themify,document,window);