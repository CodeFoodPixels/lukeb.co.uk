const rssPlugin = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const readingTime = require("eleventy-plugin-reading-time");
const nunjucksDate = require("nunjucks-date-filter");
const slugify = require("slugify");

const postcss = require("./src/_scripts/postcss.js");
const purifycss = require("./src/_scripts/purifycss.js");
const imageShortcode = require("./src/_scripts/imageShortcode.js");
const videoShortcode = require("./src/_scripts/videoShortcode.js");

const markdownIt = require("markdown-it");
const markdownItLinkAttributes = require("markdown-it-link-attributes");

const site = require("./src/_data/site.json");

module.exports = function (eleventyConfig) {
  // Markdown config
  const markdownLib = markdownIt({ html: true }).use(markdownItLinkAttributes, {
    pattern: /^(?!(https:\/\/lukeb\.co.uk|#|\/)).*$/,
    attrs: {
      target: "_blank",
      rel: "noopener noreferrer",
    },
  });

  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });

  // Build processes
  eleventyConfig.on("beforeBuild", postcss);
  eleventyConfig.addTransform("purifycss", purifycss);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/service-worker.js");
  eleventyConfig.addPassthroughCopy("src/static");
  eleventyConfig.addPassthroughCopy("src/.well-known");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  // Watch targets
  eleventyConfig.addWatchTarget("src/static/css/");

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("video", videoShortcode);
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Filters
  eleventyConfig.addFilter("date", nunjucksDate);

  eleventyConfig.addFilter("debug", (data) => {
    console.log(data);
  });

  eleventyConfig.addFilter("md", (content = "") => {
    return markdownLib.render(content);
  });

  eleventyConfig.addFilter("w3DateFilter", (value) => {
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

  eleventyConfig.addFilter("livePosts", (posts) => {
    const now = new Date();

    return posts.filter((post) => post.date <= now && !post.data.draft);
  });

  // Plugins
  eleventyConfig.addPlugin(readingTime);
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  // Collections
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
    collection
      .getAll()
      .filter(livePosts)
      .forEach(function (item) {
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

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    passthroughFileCopy: true,
    markdownTemplateEngine: "njk",
  };
};
