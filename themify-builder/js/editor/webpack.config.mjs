import path from "path";
import fs from "fs"; 
import MergeIntoSingleFilePlugin from 'webpack-merge-and-include-globally';
import WatchExternalFilesPlugin from 'webpack-watch-external-files-plugin';
import TerserPlugin from "terser-webpack-plugin";
const argv = {};
process.argv.forEach(arg => {
  const parts = arg.split("=");
  argv[parts[0].trim()] = parts[1]?.trim() || '';
});
let gitRepoPath="../../../../../",
    terserOptions={};
const modulesDIr=path.resolve("./modules"),
    componentsDIr=path.resolve("./components"),
    mode=argv['--mode'] || 'development',
    isMin=mode==='production' || process.env.npm_config_min!==undefined;
    if(isMin){
        if(mode!=='production'){
            gitRepoPath='';//set for local dev
        }
        terserOptions=JSON.parse(fs.readFileSync(path.resolve(gitRepoPath+'backend/deploy/.terser.json')));
        if(mode!=='production'){
            terserOptions.compress.drop_console=false;
        }
    }
const config= {
        mode:mode,
        entry: {},
        output: {
            iife: false,
            filename: '[name].min.js',
            path: path.resolve("./build")
        },
        optimization: {
            minimize: isMin,
            minimizer: [new TerserPlugin({
                terserOptions:terserOptions
            })]
        },
        performance: {
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },
        plugins: [
            new MergeIntoSingleFilePlugin({
                files: {
                    'components.min.js': [
                        path.resolve(componentsDIr, 'wrap_start.mjs'),
                        path.resolve('./themify-builder-app.mjs'),
                        path.resolve(componentsDIr, 'constructor.mjs'),
                        path.resolve(componentsDIr, 'toolbar.mjs'),
                        path.resolve(componentsDIr, 'lightbox.mjs'),
                        path.resolve(componentsDIr, 'action-bar.mjs'),
                        path.resolve(componentsDIr, 'drag.mjs'),
                        path.resolve(componentsDIr, 'drop.mjs'),
                        path.resolve(componentsDIr, 'gs.mjs'),
                        path.resolve(componentsDIr, 'panel.mjs'),
                        path.resolve(componentsDIr, 'undomanager.mjs'),
                        path.resolve(componentsDIr, 'ticks.mjs'),
                        path.resolve(componentsDIr, 'gradient.mjs'),
                        path.resolve(componentsDIr, 'spinner.mjs'),
                        path.resolve(componentsDIr, 'wrap_end.mjs')
                    ],
                    'modules.min.js':[
                        path.resolve(modulesDIr, 'wrap_start.mjs'),
                        path.resolve(modulesDIr,'base.mjs'),
                        path.resolve(modulesDIr,'builder.mjs'),
                        path.resolve(modulesDIr,'row.mjs'),
                        path.resolve(modulesDIr,'column.mjs'),
                        path.resolve(modulesDIr,'subrow.mjs'),
                        path.resolve(modulesDIr,'module.mjs'),
                        path.resolve(modulesDIr,'accordion.mjs'),
                        path.resolve(modulesDIr,'alert.mjs'),
                        path.resolve(modulesDIr,'box.mjs'),
                        path.resolve(modulesDIr,'buttons.mjs'),
                        path.resolve(modulesDIr,'callout.mjs'),
                        path.resolve(modulesDIr,'code.mjs'),
                        path.resolve(modulesDIr,'copyright.mjs'),
                        path.resolve(modulesDIr,'divider.mjs'),
                        path.resolve(modulesDIr,'fancy-heading.mjs'),
                        path.resolve(modulesDIr,'feature.mjs'),
                        path.resolve(modulesDIr,'gallery.mjs'),
                        path.resolve(modulesDIr,'icon.mjs'),
                        path.resolve(modulesDIr,'image.mjs'),
                        path.resolve(modulesDIr,'layout-part.mjs'),
                        path.resolve(modulesDIr,'link-block.mjs'),
                        path.resolve(modulesDIr,'login.mjs'),
                        path.resolve(modulesDIr,'lottie.mjs'),
                        path.resolve(modulesDIr,'map.mjs'),
                        path.resolve(modulesDIr,'menu.mjs'),
                        path.resolve(modulesDIr,'optin.mjs'),
                        path.resolve(modulesDIr,'overlay-content.mjs'),
                        path.resolve(modulesDIr,'page-break.mjs'),
                        path.resolve(modulesDIr,'plain-text.mjs'),
                        path.resolve(modulesDIr,'post.mjs'),
                        path.resolve(modulesDIr,'service-menu.mjs'),
                        path.resolve(modulesDIr,'signup-form.mjs'),
                        path.resolve(modulesDIr,'slider.mjs'),
                        path.resolve(modulesDIr,'social-share.mjs'),
                        path.resolve(modulesDIr,'star.mjs'),
                        path.resolve(modulesDIr,'tab.mjs'),
                        path.resolve(modulesDIr,'testimonial-slider.mjs'),
                        path.resolve(modulesDIr,'text.mjs'),
                        path.resolve(modulesDIr,'toc.mjs'),
                        path.resolve(modulesDIr,'video.mjs'),
                        path.resolve(modulesDIr,'widget.mjs'),
                        path.resolve(modulesDIr,'widgetized.mjs'),
                        path.resolve(modulesDIr, 'wrap_end.mjs')
                    ]
                }
            })
          ]
    };
    if(argv['-w']!==undefined && config.mode==='development'){
        config.plugins.push(
            new WatchExternalFilesPlugin({
                files: [
                  './themify-builder-app.mjs',
                  './components/*.mjs',
                  './modules/*.mjs'
                ]
              })
        );
    }
export default config;