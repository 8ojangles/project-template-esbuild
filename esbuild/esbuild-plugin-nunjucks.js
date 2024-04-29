import nunjucks from 'nunjucks';
import path from 'node:path';
import fs from 'node:fs';

const nunjucksPlugin = (options) => ({
    name: 'nunjucks',
    setup(build) {
        const { pageDir, templateDir, dataDir, outputDir } = options;
        // const env = new nunjucks.Environment(
        //     new nunjucks.FileSystemLoader('src'),
        //     { 
        //         autoescape: true,
        //         watch: true
        //     }
        // );

        const env = new nunjucks.configure(
            'src',
            { 
                autoescape: true,
                watch: true
            }
        );

        build.onLoad({ filter: /\.(html|njk)$/ }, async (args) => {

            const tplFolder = templateDir.split('/').pop();
            if (args.path.includes(tplFolder)) {
                return;
            }

            const pageFileArr = fs.readdirSync(pageDir, {withFileTypes: true})
                .filter(item => !item.isDirectory() && (item.name.includes('.html') || item.name.includes('.njk')))
                .map(item => item.name);
            const loadedPath = args.path;
            const pathToData = loadedPath.replace(path.extname(loadedPath), '.json');
            const dataFileExists = fs.existsSync(pathToData);
            let contents;
            let data;

            if (dataFileExists) {
                data = await fs.promises.readFile(pathToData, "utf8");
                if (pageFileArr.length > 0) {
                    pageFileArr.forEach(file => {
                        contents = env.render(file, JSON.parse(data));
                        fs.writeFile(`/${dist}/${file}`, contents, err => {
                            if (err) {
                                console.error('fs.writeFile err: ', err);
                            } else {
                                console.log(`${file} written to Dist folder`);
                            }
                        });
                    })
                }
            } else {
                if (pageFileArr.length > 0) {
                    pageFileArr.forEach(file => {
                        contents = nunjucks.render(`${file}`);
                        fs.writeFile(`dist/${file}`, contents, err => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(`${file} written to Dist folder`);
                            }
                        });
                    })
                }
            }
        })
    }
});

export { nunjucksPlugin };