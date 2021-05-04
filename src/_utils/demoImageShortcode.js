const Image = require("@11ty/eleventy-img");
Image.concurrency = 20;

module.exports = async function demoImageShortcode(
  src,
  alt,
  width = 250,
  attributes = {}
) {
  let metadata = await Image(src, {
    widths: [width],
    formats: [null],
    outputDir: "./dist/static/images",
    urlPath: "/static/images",
  });

  const data = metadata[Object.keys(metadata)[0]][0];

  const attributesString = Object.keys(attributes)
    .map((attribute) => `${attribute}="${attributes[attribute]}"`)
    .join(" ");

  return `<img src="${data.url}" width="${data.width}" height="${data.height}" alt="${alt}" loading="lazy" decoding="async" ${attributesString}>`;
};
