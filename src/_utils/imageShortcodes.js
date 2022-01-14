const Image = require("@11ty/eleventy-img");
Image.concurrency = 20;

async function imageShortcode(
  src,
  alt,
  sizes = "(min-width: 73.25rem) 62.5rem, (min-width: 54rem) 50rem, (min-width: 41.5rem) 37.5rem, 15.625rem",
  widths = [1000, 800, 600, 250],
  attributes = {}
) {
  let metadata = await Image(src, {
    widths,
    formats: ["avif", "webp", "jpeg", "png"],
    outputDir: "./dist/static/images",
    urlPath: "/static/images",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
    ...attributes,
  };

  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
  });
}

async function svgShortcode(
  src,
  alt,
  sizes = "(min-width: 73.25rem) 62.5rem, (min-width: 54rem) 50rem, (min-width: 41.5rem) 37.5rem, 15.625rem",
  widths = [1000, 800, 600, 250],
  attributes = {}
) {
  let metadata = await Image(src, {
    widths,
    formats: ["svg"],
    outputDir: "./dist/static/images",
    urlPath: "/static/images",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
    ...attributes,
  };

  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
  });
}

module.exports = {
  imageShortcode,
  svgShortcode,
};
