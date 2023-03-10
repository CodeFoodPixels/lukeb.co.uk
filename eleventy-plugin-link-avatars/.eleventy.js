const EleventyImage = require("@11ty/eleventy-img");
const cheerio = require("cheerio");
const IndieWebIcon = require("./indiewebIcon");

function deepMerge(base, overrides) {
  const returnObj = {};
  Object.keys(base).forEach((key) => {
    if (Array.isArray(base[key]) && overrides[key] !== undefined) {
      return (returnObj[key] = [...base[key], ...overrides[key]]);
    } else if (overrides[key] !== undefined) {
      return (returnObj[key] = overrides[key]);
    }

    returnObj[key] = base[key];
  });

  return returnObj;
}

const defaults = {
  excludedUrls: [],
  excludeSelectors: [
    ".eleventy-plugin-link-avatars--optout a",
    "a.eleventy-plugin-link-avatars--optout",
  ],
  includeSelectors: [".eleventy-plugin-link-avatars--optin"],
  outputDir: "./_site/link-avatars/",
  urlPath: "/link-avatars/",
  width: 60,
  position: "after",
};

module.exports = function linkAvatars(eleventyConfig, userOptions = {}) {
  const options = deepMerge(defaults, userOptions);

  const excludedUrlSelectors = options.excludedUrls.map((url) => {
    return `a[href^="${url}"]`;
  });

  const excludeSelector = [...excludedUrlSelectors, ...options.excludeSelectors]
    .map((selector) => `:not(${selector})`)
    .join("");

  const context = options.includeSelectors.join(", ");

  const imageCache = {};

  eleventyConfig.addTransform("link-avatars", async function (content) {
    if (this.outputPath.endsWith(".html")) {
      const $ = cheerio.load(content);
      const links = $(`a[href*="//"]${excludeSelector}`, context);

      for (const linkEl of links) {
        if (imageCache[linkEl.attribs.href] === undefined) {
          const indieWebIcon = new IndieWebIcon(linkEl.attribs.href);
          imageCache[linkEl.attribs.href] = indieWebIcon
            .getData(options.width)
            .then((iconData) => {
              return EleventyImage(iconData.data, {
                widths: [options.width],
                formats: [iconData.extension],
                outputDir: options.outputDir,
                urlPath: options.urlPath,
              });
            })
            .then((imageStatObject) => {
              const formatKey = Object.keys(imageStatObject).pop();
              const imageStats = imageStatObject[formatKey][0];

              return `<img src="${imageStats.url}" width="${imageStats.width}" height="${imageStats.height}" alt="Avatar for ${linkEl.attribs.href}" loading="lazy" decoding="async" class="eleventy-plugin-link-avatars__image">`;
            })
            .catch((e) => {
              console.log(
                `[eleventy-plugin-link-avatars] Error when trying to get icon for ${linkEl.attribs.href}: ${e}`
              );
              return false;
            });
        }

        const icon = await imageCache[linkEl.attribs.href];

        if (icon === false) {
          continue;
        }

        $(linkEl)
          .addClass("eleventy-plugin-link-avatars__link")
          [options.position === "before" ? "prepend" : "append"](`${icon}`);
      }

      return $.html();
    }

    return content;
  });
};
