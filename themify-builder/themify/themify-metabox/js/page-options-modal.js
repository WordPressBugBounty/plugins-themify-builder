((t,s,i)=>{"use strict";const o={modal:null,wrap:null,active:!1,url:!1,fr:!1,init(t){this.loader("show"),this.url="A"===t.tagName?t.href:t.tfTag("A")[0].href;const o=s.createElement("div"),e=s.createElement("div"),a=s.createElement("div"),_=s.createElement("div"),p=s.createElement("div"),n=s.createElement("div");return o.id="tf_page_options_modal",o.className="tf_scrollbar",e.className="tf_w tf_h tf_rel",a.className="tf_page_options_toolbar",_.className="tf_page_options_title",_.innerText=i.pg_opt_t,n.className="tf_page_options_save",n.tfOn("click",this.save.bind(this),{passive:!0}).innerText=i.pg_opt_updt,p.tfOn("click",this.close,{once:!0,passive:!0}).className="tf_page_options_close tf_close",a.append(_,n,p),e.appendChild(a),o.appendChild(e),this.wrap=e,this.modal=o,s.body.appendChild(o),this.loadIframe()},loadIframe(){return new Promise(((t,i)=>{if(this.active)return void t();const o=s.createElement("iframe");o.className="tf_w tf_h",o.tfOn("load",(()=>{this.loader("hide"),this.modal.classList.remove("updating");const i=o.contentDocument,e=i.getElementById("post");e.action="post.php?tf-meta-opts=update",i.body.appendChild(e),i.getElementById("wpwrap").remove(),s.body.className+=" tf_page_options_active",o.contentWindow.document.documentElement.className+=" tf_scrollbar",this.active=!0,t()}),{passive:!0,once:!0}).tfOn("error",i,{passive:!0,once:!0}).src=this.url,this.fr=o,this.wrap.appendChild(o)}))},close(){window.location.reload()},save(){this.modal.className+=" updating",this.loader("show"),this.fr.contentDocument.querySelector("#post").submit()},loader(t){if("show"===t){const t=s.createElement("div");t.id="tb_alert",t.className="tb_busy",s.body.appendChild(t)}else{const t=s.tfId("tb_alert");t&&t.remove()}}};t.on("tf_page_options_init",(t=>o.init(t)),!0)})(Themify,document,themify_vars);