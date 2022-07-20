const path = require("path");
const fs = require("fs").promises;
const { PurgeCSS } = require("purgecss");
const csso = require("csso");

module.exports = async function (content) {
  if (this.outputPath && this.outputPath.endsWith(".html")) {
    const css = (
      await Promise.all([
        fs.readFile(
          path.join(
            __dirname,
            "..",
            "..",
            "dist",
            "static",
            "css",
            "prism-a11y-dark.css"
          )
        ),
        fs.readFile(
          path.join(__dirname, "..", "..", "dist", "static", "css", "dist.css")
        ),
      ])
    ).join(" ");

    const purgeCSSResult = await new PurgeCSS().purge({
      content: [{ raw: content, extension: "html" }],
      css: [{ raw: css }],
      keyframes: true,
      variables: true,
      safelist: [/^easter(.+?)/],
    });

    const minified = csso.minify(purgeCSSResult[0].css);

    return content.replace(
      '<link rel="stylesheet" href="/static/css/dist.css">',
      `<style>${minified.css}</style>`
    );
  }

  return content;
};
