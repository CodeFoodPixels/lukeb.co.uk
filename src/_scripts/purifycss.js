const path = require("path");
const purifycss = require("purify-css");

module.exports = async function (content, outputPath) {
  if (outputPath.endsWith(".html")) {
    return new Promise((resolve) => {
      purifycss(
        content,
        [
          path.join(
            __dirname,
            "..",
            "..",
            "dist",
            "static",
            "css",
            "prism-a11y-dark.css"
          ),
          path.join(__dirname, "..", "..", "dist", "static", "css", "dist.css"),
        ],
        {
          minify: true,
          whitelist: ["*easter*"],
        },
        (css) => {
          resolve(
            content.replace(
              '<link rel="stylesheet" href="/static/css/dist.css">',
              `<style>${css}</style>`
            )
          );
        }
      );
    });
  }

  return content;
};
