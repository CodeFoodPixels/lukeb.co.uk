const fs = require("fs");
const path = require("path");

module.exports = function demoFileExists(demoPath) {
  try {
    const filePath = path.join(__dirname, "..", demoPath);
    fs.accessSync(filePath);
    return true;
  } catch (e) {
    return false;
  }
};
