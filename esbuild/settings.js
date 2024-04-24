import {sassPlugin} from 'esbuild-sass-plugin';
import htmlPlugin from '@chialab/esbuild-plugin-html';

export function createBuildSettings(options) {
    return {
        logLevel: "info",
        entryPoints: ['./src/main.js', './src/scss/main.scss', './src/index.html'],
        outdir: './dist/',
        bundle: true,
        allowOverwrite: true,
        plugins: [htmlPlugin(), sassPlugin()],
        minify: true,
        sourcemap: true,
        assetNames: '[name]',
        target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
        ...options
    };
}