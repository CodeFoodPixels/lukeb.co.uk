const fs = require("fs").promises;
const path = require("path");
const sass = require("sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");

module.exports = async () => {
  const sassResult = sass.compile(
    path.join(__dirname, "..", "_styles", "main.scss")
  );

  const postcssResult = await postcss([autoprefixer]).process(
    sassResult.css,
    {}
  );

  await fs.mkdir(path.join(__dirname, "..", "..", "dist", "static", "css"), {
    recursive: true,
  });
  return fs.writeFile(
    path.join(__dirname, "..", "..", "dist", "static", "css", "dist.css"),
    postcssResult.css
  );
};
