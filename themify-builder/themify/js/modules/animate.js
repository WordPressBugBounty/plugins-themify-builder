(t=>{"use strict";const i=function(){if(!0!==this.tbAnimating){this.tbAnimating=!0;const t=this.style,i=t.animationName,a=this.dataset.tfAnimation_hover;i&&(t.animationIterationCount=t.animationDelay=t.animationName="",this.classList.remove(i)),this.tfOn("animationend",(function(t){this.classList.remove("animated","tb_hover_animate",t.animationName),this.style.animationName=this.style.willChange="",this.tbAnimating=!1}),{passive:!0,once:!0}),setTimeout((()=>{t.animationName=a,this.classList.add(a,"animated","tb_hover_animate")}),2)}},a=a=>{t.imagesLoad(a).then((t=>{if(t.style.visibility="visible",t.hasAttribute("data-tf-animation")){t.hasAttribute("data-tf-animation_repeat")&&(t.style.animationIterationCount=t.dataset.tfAnimation_repeat),t.hasAttribute("data-tf-animation_delay")&&(t.style.animationDelay=t.dataset.tfAnimation_delay+"s");const i=t.dataset.tfAnimation;t.classList.add(i),t.style.animationName=i,t.tfOn("animationend",(function(){this.style.animationIterationCount=this.style.animationDelay=this.style.willChange="",this.classList.remove("animated",i),this.removeAttribute("data-tf-animation")}),{passive:!0,once:!0}).classList.add("animated")}t.classList.contains("hover-wow")&&(t=>{const a=["pointerenter","tf_custom_animate"];t.tfOff(a,i,{passive:!0}).tfOn(a,i,{passive:!0})})(t)}))},n=new IntersectionObserver(((t,i)=>{for(let n=t.length-1;n>-1;--n)!0===t[n].isIntersecting&&t[n].intersectionRatio>.001&&(i.unobserve(t[n].target),a(t[n].target))}),{threshold:[0,.5,1]});t.on("tf_wow_init",(i=>{t.animateCss().then((()=>{for(let t=i.length-1;t>-1;--t)i[t].style.willChange="transform,opacity",n.observe(i[t])}))}))})(Themify);