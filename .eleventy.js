const Image = require("@11ty/eleventy-img");
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const readingTime = require("eleventy-plugin-reading-time");
const nunjucksDate = require("nunjucks-date-filter");
const slugify = require("slugify");

const fs = require("fs");
const path = require("path");
const purifycss = require("purify-css");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const markdownIt = require("markdown-it");
const markdownItLinkAttributes = require("markdown-it-link-attributes");

const site = require("./src/_data/site.json");

async function imageShortcode(
  src,
  alt,
  sizes = "(min-width: 73.25rem) 62.5rem, (min-width: 54rem) 50rem, (min-width: 41.5rem) 37.5rem, 15.625rem"
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

async function videoShortcode(src, width, options) {
  await fs.promises.mkdir(path.join(__dirname, "dist", "static", "videos"), {
    recursive: true,
  });
  const filename = path.basename(src);
  await fs.promises.copyFile(
    src,
    path.join(__dirname, "dist", "static", "videos", filename)
  );

  return `<video controls src="/static/videos/${filename}" width="${width}" ${
    options.autoplay ? 'autoplay="true"' : ""
  } ${options.loop ? 'loop="true"' : ""} ${
    options.muted ? 'muted="true"' : ""
  }></video>`;
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
  eleventyConfig.addPassthroughCopy("src/.well-known");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  eleventyConfig.addWatchTarget("src/static/css/");

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("video", videoShortcode);

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

  eleventyConfig.addTransform(
    "purifycss",
    async function (content, outputPath) {
      if (outputPath.endsWith(".html")) {
        return new Promise((resolve) => {
          purifycss(
            content,
            [
              path.join(
                __dirname,
                "dist",
                "static",
                "css",
                "prism-a11y-dark.css"
              ),
              path.join(__dirname, "dist", "static", "css", "main.css"),
            ],
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

  const now = new Date();
  const livePosts = (post) => post.date <= now && !post.data.draft;
  eleventyConfig.addCollection("posts", (collection) => {
    return [
      ...collection.getFilteredByGlob("./src/posts/*.md").filter(livePosts),
    ].reverse();
  });

  eleventyConfig.addCollection("postFeed", (collection) => {
    return [
      ...collection.getFilteredByGlob("./src/posts/*.md").filter(livePosts),
    ]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });

  eleventyConfig.addPlugin(readingTime);
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addFilter("date", nunjucksDate);
  eleventyConfig.addFilter("excerpt", (post) => {
    const content = post.replace(/(<([^>]+)>)/gi, "");
    return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
  });
  eleventyConfig.addFilter("slug", (input) => {
    const options = {
      replacement: "-",
      remove: /[&,+()$~%.'":*!?<>{}]/g,
      lower: true,
    };
    return slugify(input, options);
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    passthroughFileCopy: true,
    markdownTemplateEngine: "njk",
  };
};
