const Image = require("@11ty/eleventy-img");
const purifycss = require("purify-css");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const fs = require("fs");
const path = require("path");
const markdownIt = require("markdown-it");
const markdownItLinkAttributes = require("markdown-it-link-attributes");

async function imageShortcode(
  src,
  alt,
  sizes = "(min-width: 1172px) 1000px, (min-width: 864px) 800px, (min-width: 664px) 600px, 250px"
) {
  let metadata = await Image(src, {
    widths: [1000, 800, 600, 250],
    formats: ["avif", "webp", "jpeg", "png"],
    outputDir: "./dist/static/images",
    urlPath: "/static/images",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
  });
}

module.exports = function (eleventyConfig) {
  eleventyConfig.setLibrary(
    "md",
    markdownIt({ html: true }).use(markdownItLinkAttributes, {
      pattern: /^(?!(https:\/\/lukeb\.co.uk|#|\/)).*$/,
      attrs: {
        target: "_blank",
        rel: "noopener noreferrer",
      },
    })
  );

  eleventyConfig.addPassthroughCopy("src/static");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  eleventyConfig.addWatchTarget("src/static/css/");

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.on("beforeBuild", async () => {
    const css = fs.readFileSync(
      path.join(__dirname, "src", "static", "css", "main.css")
    );

    const result = await postcss([autoprefixer]).process(css, {
      from: path.join(__dirname, "src", "static", "css", "main.css"),
      to: path.join(__dirname, "dist", "static", "css", "main.css"),
    });

    fs.mkdirSync(path.join(__dirname, "dist", "static", "css"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(__dirname, "dist", "static", "css", "main.css"),
      result.css
    );
  });

  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set();

    collection.getAll().forEach((item) => {
      if ("tags" in item.data) {
        let tags = item.data.tags;

        tags
          .filter((item) => {
            switch (item) {
              case "all":
              case "nav":
              case "post":
              case "posts":
                return false;
            }

            return true;
          })
          .forEach((tag) => {
            tagSet.add(tag);
          });
      }
    });

    return [...tagSet];
  });

  eleventyConfig.addTransform(
    "purifycss",
    async function (content, outputPath) {
      if (outputPath.endsWith(".html")) {
        return new Promise((resolve) => {
          purifycss(
            content,
            [path.join(__dirname, "dist", "static", "css", "main.css")],
            {
              minify: true,
              whitelist: ["*easter*"],
            },
            (css) => {
              resolve(
                content.replace(
                  '<link rel="stylesheet" href="/static/css/main.css">',
                  `<style>${css}</style>`
                )
              );
            }
          );
        });
      }

      return content;
    }
  );

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    passthroughFileCopy: true,
    markdownTemplateEngine: "njk",
  };
};
