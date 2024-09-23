(($,Themify,window, doc, Object, requestAnimationFrame,cancelAnimationFrame,setTimeout,clearTimeout,Promise,parseInt,parseFloat,JSON,getComputedStyle,localStorage,Set,Map,Math,themifyBuilder,i18n, undefined) => { 
    "use strict";
window.tb_createElement=(tag='',props,text)=>{
    if(tag===''){
        tag='div';
    }
    const el= Themify.createElement(tag,props);
    if(text!==undefined){
        el.innerHTML=text;
    }
    return el;
};    
window.tb_createDocumentFragment=()=>{
    return doc.createDocumentFragment();
};
window.tb_createElementNS=(tag='',props='')=>{
    if(tag===''){
        tag='svg';
    }
    const el = doc.createElementNS( 'http://www.w3.org/2000/svg',tag);
    if(props!==''){
        if(typeof props==='string'){
            props={class:props};
        }
        for(let k in props){
            el.setAttribute(k,props[k]);
        }
    }
    return el;
};
const body=doc.body,
    bodyCl=body.classList,
    topWindow=bodyCl.contains('wp-admin')?window:window.top, 
    {Themify:topThemify,document:topWindowDoc}=topWindow,
    topBody=topWindowDoc.body,
    topBodyCl=topBody.classList,
    _CLICK_=Themify.click,
    createDocumentFragment=tb_createDocumentFragment,
    createElement=tb_createElement,
    createElementNS=tb_createElementNS;