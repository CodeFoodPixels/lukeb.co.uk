const site = require("./src/_data/site")();
const redirects = require("./src/_data/redirects.json");
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const readingTime = require("eleventy-plugin-reading-time");
const nunjucksDate = require("nunjucks-date-filter");
const slugify = require("slugify");
const { zonedTimeToUtc } = require("date-fns-tz");

const processCss = require("./src/_utils/processCss.js");
const minifyCss = require("./src/_utils/minifyCss.js");
const {
  imageShortcode,
  svgShortcode,
} = require("./src/_utils/imageShortcodes.js");
const videoShortcode = require("./src/_utils/videoShortcode.js");

const markdownIt = require("markdown-it");
const markdownItLinkAttributes = require("markdown-it-link-attributes");
const markdownItAnchor = require("markdown-it-anchor");
const demoImageShortcode = require("./src/_utils/demoImageShortcode.js");
const demo = require("eleventy-plugin-embedded-demos");
const avatars = require("./eleventy-plugin-link-avatars");

const webmentions = require("eleventy-plugin-webmentions");

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/_styles/");

  const slug = (input) => {
    const options = {
      replacement: "-",
      remove: /[&,+()$~%.'":*!?<>{}]/g,
      lower: true,
    };
    return slugify(input, options);
  };

  const linkAttributes = {
    pattern: /^(?!(https:\/\/lukeb\.co.uk|#|\/)).*$/,
    attrs: {
      target: "_blank",
      rel: "external noopener noreferrer",
    },
  };
  // Markdown config
  const markdownLib = markdownIt({ html: true })
    .use(markdownItLinkAttributes, linkAttributes)
    .use(markdownItAnchor, { slugify: slug });

  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });

  // Build processes
  eleventyConfig.on("beforeBuild", processCss);
  eleventyConfig.addTransform("inlinecode", (content) => {
    if (this.outputPath && this.outputPath.endsWith(".html")) {
      return content.replace(/<code>/g, '<code class="language-inline">');
    }
    return content;
  });

  eleventyConfig.addPlugin(avatars, {
    excludedUrls: ["https://lukeb.co.uk"],
    includeSelectors: ["#main-content"],
    excludeSelectors: [],
    outputDir: "./dist/static/images/",
    urlPath: "/static/images/",
  });

  eleventyConfig.addPlugin((eleventyConfig) =>
    eleventyConfig.addTransform("minifycss", minifyCss)
  );

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
  eleventyConfig.addNunjucksAsyncShortcode("svg", svgShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("demoImage", demoImageShortcode);
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
    debugger;
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

  eleventyConfig.addFilter("stripExcerpt", (content, excerptMarkdown) => {
    if (!excerptMarkdown) {
      return content;
    }

    const excerpt = markdownLib.render(excerptMarkdown);

    return content.replace(excerpt, "");
  });

  eleventyConfig.addFilter("uniq", (array) => {
    return [...new Set(array)];
  });

  eleventyConfig.addFilter("split", (string, separator) => {
    return string.split(separator);
  });

  // Plugins
  eleventyConfig.addPlugin(webmentions, {
    domain: site.domain,
    token: "pDjIX81PRC-fGTpGYOXOMQ",
    truncationMarker:
      '&hellip; <span class="webmention__truncated">Truncated</span>',
    pageAliases: Object.keys(redirects).reduce((aliases, key) => {
      if (key.match(/^\/[0-9]/)) {
        aliases[redirects[key]] = key;
      }
      return aliases;
    }, {}),
    sanitizeOptions: {
      ...webmentions.defaults.sanitizeOptions,
      allowedAttributes: {
        a: [...Object.keys(linkAttributes.attrs), "href"],
      },
      transformTags: {
        a: (tagName, attribs) => {
          if (attribs.href && attribs.href.match(linkAttributes.pattern)) {
            return {
              tagName,
              attribs: {
                href: attribs.href,
                ...linkAttributes.attrs,
              },
            };
          }

          const returnObj = {
            tagName,
          };

          if (attribs.href) {
            returnObj.attribs = {
              href: attribs.href,
            };
          }

          return returnObj;
        },
      },
    },
  });

  eleventyConfig.addPlugin(readingTime);
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(demo, {
    path: "./src/demos",
  });
  eleventyConfig.addPlugin(syntaxHighlight, {
    init: ({ Prism }) => {
      Prism.languages.nunjucks = {
        keyword:
          /\b(?:comment|endcomment|if|elsif|else|endif|unless|endunless|for|endfor|case|endcase|when|in|break|assign|continue|limit|offset|range|reversed|raw|endraw|capture|endcapture|tablerow|endtablerow)\b/,
        number:
          /\b0b[01]+\b|\b0x(?:\.[\da-fp-]+|[\da-f]+(?:\.[\da-fp-]+)?)\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?[df]?/i,
        operator: {
          pattern:
            /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m,
          lookbehind: true,
        },
        function: {
          pattern:
            /(^|[\s;|&])(?:append|prepend|capitalize|cycle|cols|increment|decrement|abs|at_least|at_most|ceil|compact|concat|date|default|divided_by|downcase|escape|escape_once|first|floor|join|last|lstrip|map|minus|modulo|newline_to_br|plus|remove|remove_first|replace|replace_first|reverse|round|rstrip|size|slice|sort|sort_natural|split|strip|strip_html|strip_newlines|times|truncate|truncatewords|uniq|upcase|url_decode|url_encode|include|paginate)(?=$|[\s;|&])/,
          lookbehind: true,
        },
      };

      Prism.languages.njk = Prism.languages.nunjucks;
    },
  });

  function getUTCPostDate(date) {
    const padded = (val) => val.toString().padStart(2, "0");

    return zonedTimeToUtc(
      `${date.getFullYear()}-${padded(date.getMonth() + 1)}-${padded(
        date.getDate()
      )} ${padded(date.getHours())}:${padded(date.getMinutes())}:${padded(
        date.getSeconds()
      )}`,
      site.timezone
    );
  }

  // Collections
  const now = new Date();
  const livePosts = (post) => {
    return getUTCPostDate(post.date) <= now && !post.data.draft;
  };

  const futurePosts = (post) =>
    getUTCPostDate(post.date) > now && !post.data.draft;

  const posts = (collectionApi, filter = livePosts) =>
    collectionApi.getFilteredByGlob("./src/posts/*").filter(filter).reverse();

  eleventyConfig.addCollection("posts", (collectionApi) =>
    posts(collectionApi)
  );

  eleventyConfig.addCollection("futurePosts", (collectionApi) =>
    posts(collectionApi, futurePosts).reverse()
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
              (element) => element.name === tag
            );
            if (tagIndex > -1) {
              tagList[tagIndex].count += 1;
            } else {
              tagList.push({ name: tag, count: 1 });
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
