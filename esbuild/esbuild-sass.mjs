const sassPlugin = require("esbuild-plugin-sass");

require("esbuild").build({
  entryPoints: ["/src/scss/main.scss"],
  outfile: "/dist/styles.css",
  bundle: true,
  plugins: [sassPlugin()]
})
.then(() => console.log("⚡ Done"))
.catch(() => process.exit(1));