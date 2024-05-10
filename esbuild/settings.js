import { sassPlugin } from 'esbuild-sass-plugin';
import { nunjucksPlugin } from './esbuild-plugin-nunjucks.js';
import { jsonbakePlugin } from './esbuild-plugin-jsonbake/esbuild-plugin-jsonbake.js';
import { clean } from 'esbuild-plugin-clean';


export function createBuildSettings(options) {
    return {
        logLevel: "info",
        entryPoints: [
            './src/js/main.js',
            './src/scss/main.scss',
            './src/**/*.html',
            './src/page-data/**/*.json'
        ],
        outdir: './dist/',
        bundle: true,
        allowOverwrite: true,
        loader: {
            ".html": "text",
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
                    './dist/page-data'
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
            sassPlugin()
        ],
        minify: true,
        sourcemap: true,
        assetNames: '[name]',
        target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
        ...options
    };
}