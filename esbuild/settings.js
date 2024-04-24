import {sassPlugin} from 'esbuild-sass-plugin';

export function createBuildSettings(options) {
    return {
        logLevel: "info",
        entryPoints: ['./src/main.js', './src/scss/main.scss', './src/index.html'],
        outdir: './dist/',
        bundle: true,
        allowOverwrite: true,
        plugins: [sassPlugin()],
        minify: true,
        sourcemap: true,
        target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
        ...options
    };
}