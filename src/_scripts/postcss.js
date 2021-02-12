const fs = require("fs").promises;
const path = require("path");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");

module.exports = async () => {
  const css = await fs.readFile(
    path.join(__dirname, "..", "static", "css", "main.css")
  );

  const result = await postcss([autoprefixer]).process(css, {
    from: path.join(__dirname, "..", "static", "css", "main.css"),
    to: path.join(__dirname, "..", "..", "dist", "static", "css", "dist.css"),
  });

  await fs.mkdir(path.join(__dirname, "..", "..", "dist", "static", "css"), {
    recursive: true,
  });

  const prismcss = await fs.readFile(
    path.join(__dirname, "..", "static", "css", "prism-a11y-dark.css")
  );

  return fs.writeFile(
    path.join(__dirname, "..", "..", "dist", "static", "css", "dist.css"),
    `${result.css}

${prismcss}`
  );
};
