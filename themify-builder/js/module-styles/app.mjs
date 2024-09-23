#!/usr/bin/node
const modules=[	
            'row',
            'column',
            'subrow',
            'accordion',
			'alert',
			'box',
			'buttons',
			'callout',
			'code',
			'copyright',
			'divider',
			'fancy-heading',
			'feature',
			'gallery',
			'icon',
			'image',
			'layout-part',
			'link-block',
			'login',
			'lottie',
			'map',
			'menu',
			'optin',
			'overlay-content',
			'plain-text',
			'post',
			'service-menu',
			'signup-form',
			'slider',
			'social-share',
			'star',
			'tab',
			'testimonial-slider',
			'text',
			'toc',
			'video',
			'widget',
			'widgetized'
           // 'highlight',
			//'portfolio',
			//'testimonial'
        ],
        styleData={},
        prms=[];
for(let i=0;i<modules.length;++i){
    let type=modules[i],
        p=new Promise(async (resolve,reject)=>{
        try{
            let res=await import ('./src/'+type+'.mjs'),
                item;
            if(type==='row'){
                const {Row}=res;
                item=Row;
            }else{
                const {Module}=res;
                item=Module;
            }
            styleData[type]=item.get_styles();
            resolve();
        }
        catch(e){
            reject(e);
        }
    });
    prms.push(p);
}
try {
  await Promise.all(prms);
  const fs = await import('fs'),
    dir='../../json/';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir,{mode:'0755'});  
  }
  fs.writeFileSync(dir+'style.json', JSON.stringify(styleData),{ flag: 'w',encoding: 'utf8',mode:'0644'});
}
catch (e) {
  console.error(e);
}