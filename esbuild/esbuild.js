import * as esbuild from 'esbuild';
import { createBuildSettings } from './settings.js';

const settings = createBuildSettings({ minify: true });

await esbuild.build(settings).then(res => {
    if (res.errors.length > 0) {
        console.log('Build error: ', res.errors)
        process.exit(1);
    } else {
        process.exit(0);
    }
});