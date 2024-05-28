import { sassPlugin } from 'esbuild-sass-plugin';
import { nunjucksPlugin } from './esbuild-plugin-nunjucks.js';
import { jsonbakePlugin } from './esbuild-plugin-jsonbake/esbuild-plugin-jsonbake.js';
import { clean } from 'esbuild-plugin-clean';
import { copy } from 'esbuild-plugin-copy';


export function createBuildSettings(options) {
    return {
        logLevel: "info",
        entryPoints: [
            './src/js/main.js',
            './src/scss/main.scss',
            './src/**/*.html',
            './src/page-data/**/*.json',
        ],
        outdir: './dist/',
        bundle: true,
        allowOverwrite: true,
        loader: {
            ".html": "text",
            ".png": "file",
            // ".jpg": "file",
            // ".bmp": "file",
            // ".svg": "file",
        },
        plugins: [
            clean({
                patterns: [
                    './dist/*',
                    './dist/assets/*.map.js'
                ],
                cleanOnStartPatterns: [
                    './dist/*'
                ],
                cleanOnEndPatterns: [
                    './dist/*.js',
                    './dist/*.map',
                    './dist/templates',
                    './dist/page-data',
                    './dist/*.png',
                ]
            }),
            jsonbakePlugin({
                files: [{
                    src: './src/page-data/page-data.json', dest: './src/site-content-compiled.json'
                }]
            }),
            nunjucksPlugin({
                outputDir: './dist',
                pageDir: './src',
                templateDir: './src/templates',
                dataFile: './src/site-content-compiled.json'
            }),
            sassPlugin(),
            copy({
                // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
                // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
                resolveFrom: 'cwd',
                assets: {
                  from: ['./src/assets/**/*'],
                  to: ['./dist/assets'],
                },
                watch: true,
            }),
        ],
        minify: true,
        sourcemap: true,
        assetNames: '[name]',
        target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
        ...options
    };
}