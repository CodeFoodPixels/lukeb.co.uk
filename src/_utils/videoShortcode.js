const fs = require("fs").promises;
const path = require("path");

module.exports = async function videoShortcode(src, width, options) {
  await fs.mkdir(path.join(__dirname, "..", "..", "dist", "static", "videos"), {
    recursive: true,
  });
  const filename = path.basename(src);
  await fs.copyFile(
    src,
    path.join(__dirname, "..", "..", "dist", "static", "videos", filename)
  );

  return `<video controls src="/static/videos/${filename}" width="${width}" ${
    options.autoplay ? 'autoplay="true"' : ""
  } ${options.loop ? 'loop="true"' : ""} ${
    options.muted ? 'muted="true"' : ""
  }></video>`;
};
