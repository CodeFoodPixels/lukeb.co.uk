const Image = require("@11ty/eleventy-img");
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const readingTime = require("eleventy-plugin-reading-time");
const nunjucksDate = require("nunjucks-date-filter");
const slugify = require("slugify");

const fs = require("fs");
const path = require("path");
const purifycss = require("purify-css");
const inlineSVG = require("postcss-inline-svg");
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
  const markdownLib = markdownIt({ html: true }).use(markdownItLinkAttributes, {
    pattern: /^(?!(https:\/\/lukeb\.co.uk|#|\/)).*$/,
    attrs: {
      target: "_blank",
      rel: "noopener noreferrer",
    },
  });

  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addPassthroughCopy("src/static");
  eleventyConfig.addPassthroughCopy("src/.well-known");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  eleventyConfig.addWatchTarget("src/static/css/");

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("video", videoShortcode);

  eleventyConfig.on("beforeBuild", async () => {
    const css = fs.readFileSync(
      path.join(__dirname, "src", "static", "css", "main.css")
    );

    const result = await postcss([inlineSVG, autoprefixer]).process(css, {
      from: path.join(__dirname, "src", "static", "css", "main.css"),
      to: path.join(__dirname, "dist", "static", "css", "dist.css"),
    });

    fs.mkdirSync(path.join(__dirname, "dist", "static", "css"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(__dirname, "dist", "static", "css", "dist.css"),
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
              path.join(__dirname, "dist", "static", "css", "dist.css"),
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

  eleventyConfig.addCollection("tagList", function (collection) {
    let tagList = [];
    collection.getAll().forEach(function (item) {
      if ("tags" in item.data) {
        let tags = item.data.tags;

        tags = tags.filter(function (item) {
          switch (item) {
            // this list should match the `filter` list in tags.njk
            case "all":
            case "nav":
            case "pages":
            case "posts":
            case "postFeed":
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          const tagIndex = tagList.findIndex(
            (element) => element.name === tag.toLowerCase()
          );
          if (tagIndex > -1) {
            tagList[tagIndex].count += 1;
          } else {
            tagList.push({ name: tag.toLowerCase(), count: 1 });
          }
        }
      }
    });
    return tagList.sort((a, b) => {
      const diff = b.count - a.count;
      if (diff === 0) {
        return a.name < b.name ? -1 : 1;
      }
      return diff;
    });
  });

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });

  eleventyConfig.addPlugin(readingTime);
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addFilter("date", nunjucksDate);

  eleventyConfig.addFilter("debug", (data) => {
    console.log(data);
  });

  eleventyConfig.addFilter("md", (content = "") => {
    return markdownLib.render(content);
  });

  eleventyConfig.addFilter("w3DateFilter", function w3cDate(value) {
    const dateObject = new Date(value);

    return dateObject.toISOString();
  });

  eleventyConfig.addFilter("lowercase", (text) => {
    return text.toLowerCase();
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
