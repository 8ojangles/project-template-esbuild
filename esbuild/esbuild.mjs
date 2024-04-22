#!/usr/bin/env node
import * as esbuild from 'esbuild';
import {sassPlugin} from 'esbuild-sass-plugin';

await esbuild.build({
    logLevel: "info",
    entryPoints: ['./src/main.js', './src/scss/main.scss'],
    outdir: './dist/',
    bundle: true,
    allowOverwrite: true,
    plugins: [sassPlugin()],
    minify: true,
    sourcemap: true,
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
});