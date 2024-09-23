import fs from "fs"; 
const platform = process.platform,
OSTYPE=process.env.OSTYPE;
if(platform !== 'win32' && platform !== 'darwin' && OSTYPE !== 'cygwin' && OSTYPE !== 'msys'){//For accidently remove in local. This should work only in prod(linux) for deploy 
    const dirs=[
        './cleaner.mjs',
        './themify-builder-app.mjs',
        './package.json',
        './webpack.config.mjs',
        './modules',
        './components'
    ];
    for(let i=dirs.length-1;i>-1;--i){
        try {
            fs.rmSync( dirs[i], {
                force:true,
                recursive:true,
                maxRetries:2 
            } );
        }
        catch (e) {
            console.error(e);
        }
    }
}