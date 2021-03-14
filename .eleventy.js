const rssPlugin = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const readingTime = require("eleventy-plugin-reading-time");
const nunjucksDate = require("nunjucks-date-filter");
const slugify = require("slugify");

const postcss = require("./src/_scripts/postcss.js");
const minifycss = require("./src/_scripts/minifycss.js");
const imageShortcode = require("./src/_scripts/imageShortcode.js");
const videoShortcode = require("./src/_scripts/videoShortcode.js");
const webmentionsForPage = require("./src/_scripts/webmentionsForPage.js");

const markdownIt = require("markdown-it");
const markdownItLinkAttributes = require("markdown-it-link-attributes");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  const slug = (input) => {
    const options = {
      replacement: "-",
      remove: /[&,+()$~%.'":*!?<>{}]/g,
      lower: true,
    };
    return slugify(input, options);
  };

  // Markdown config
  const markdownLib = markdownIt({ html: true })
    .use(markdownItLinkAttributes, {
      pattern: /^(?!(https:\/\/lukeb\.co.uk|#|\/)).*$/,
      attrs: {
        target: "_blank",
        rel: "external noopener noreferrer",
      },
    })
    .use(markdownItAnchor, { slugify: slug });

  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });

  // Build processes
  eleventyConfig.on("beforeBuild", postcss);
  eleventyConfig.addTransform("inlinecode", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      return content.replace(/<code>/g, '<code class="language-inline">');
    }
    return content;
  });
  eleventyConfig.addTransform("minifycss", minifycss);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/service-worker.js");
  eleventyConfig.addPassthroughCopy("src/static");
  eleventyConfig.addPassthroughCopy("src/.well-known");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy({ "src/favicons/*": "/" });

  // Watch targets
  eleventyConfig.addWatchTarget("src/static/css/");

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("video", videoShortcode);
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Filters
  eleventyConfig.addFilter("date", nunjucksDate);

  eleventyConfig.addFilter("debug", (data) => {
    console.log("");
    console.log("********** DEBUG **********");
    console.log(data);
    console.log("******** END DEBUG ********");
    console.log("");
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

  eleventyConfig.addFilter("slug", slug);

  eleventyConfig.addFilter("livePosts", (posts) => {
    const now = new Date();

    return posts.filter((post) => post.date <= now && !post.data.draft);
  });

  eleventyConfig.addFilter("webmentionsForPage", webmentionsForPage.mentions);
  eleventyConfig.addFilter("webmentionCountForPage", webmentionsForPage.count);

  eleventyConfig.addFilter("stripExcerpt", (content, excerptMarkdown) => {
    if (!excerptMarkdown) {
      return content;
    }

    const excerpt = markdownLib.render(excerptMarkdown);

    return content.replace(excerpt, "");
  });

  // Plugins
  eleventyConfig.addPlugin(readingTime);
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxHighlight, {
    init: ({ Prism }) => {
      Prism.languages.nunjucks = {
        keyword: /\b(?:comment|endcomment|if|elsif|else|endif|unless|endunless|for|endfor|case|endcase|when|in|break|assign|continue|limit|offset|range|reversed|raw|endraw|capture|endcapture|tablerow|endtablerow)\b/,
        number: /\b0b[01]+\b|\b0x(?:\.[\da-fp-]+|[\da-f]+(?:\.[\da-fp-]+)?)\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?[df]?/i,
        operator: {
          pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m,
          lookbehind: true,
        },
        function: {
          pattern: /(^|[\s;|&])(?:append|prepend|capitalize|cycle|cols|increment|decrement|abs|at_least|at_most|ceil|compact|concat|date|default|divided_by|downcase|escape|escape_once|first|floor|join|last|lstrip|map|minus|modulo|newline_to_br|plus|remove|remove_first|replace|replace_first|reverse|round|rstrip|size|slice|sort|sort_natural|split|strip|strip_html|strip_newlines|times|truncate|truncatewords|uniq|upcase|url_decode|url_encode|include|paginate)(?=$|[\s;|&])/,
          lookbehind: true,
        },
      };

      Prism.languages.njk = Prism.languages.nunjucks;
    },
  });

  // Collections
  const now = new Date();
  const livePosts = (post) => post.date <= now && !post.data.draft;

  const posts = (collectionApi) =>
    collectionApi
      .getFilteredByGlob("./src/posts/*")
      .filter(livePosts)
      .reverse();

  eleventyConfig.addCollection("posts", (collectionApi) =>
    posts(collectionApi)
  );

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
