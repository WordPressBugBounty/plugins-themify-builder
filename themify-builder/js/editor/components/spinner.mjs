((api,topWindowDoc) => {
    "use strict";
    api.Spinner=  {
        el : topWindowDoc.tfClass('tb_loader')[0],
        showLoader(mode = 'show') {
            return new Promise(resolve => {
                const l = this.el,
                    cl = l.classList;
                if (mode === 'spinhide') {
                    cl.add('tf_hide');
                    cl.remove('tf_opacity', 'tb_done', 'tb_error','tb_show');
                    resolve();
                } else if (!cl.contains('tb_' + mode)) {
                    cl.remove('tf_hide','tf_opacity','tb_done', 'tb_error','tb_show');
                    if (mode !== 'show') {
                        if (mode !== 'error') {
                            mode = 'done';
                        }
                        cl.add('tb_' + mode);
                        requestAnimationFrame(()=>{
                            if(cl.contains('tb_' + mode)){
                                const end=function(){
                                    cl.remove('tb_' + mode, 'tf_opacity');
                                    cl.add('tf_hide');
                                    this.tfOff('transitioncancel transitionend',end, {passive: true,once: true});
                                    resolve();
                                };
                                l.tfOn('transitionend transitioncancel', end, {
                                    passive: true,
                                    once: true
                                });
                                cl.add('tf_opacity');
                            }
                        });
                    }
                    else {
                        cl.add('tb_show');
                        resolve();
                    }
                } else {
                    resolve();
                }
            });
        }
    };
})(tb_app,topWindowDoc);