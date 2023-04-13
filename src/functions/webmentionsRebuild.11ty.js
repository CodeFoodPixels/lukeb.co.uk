const { readFile } = require("fs/promises");
const path = require("path");
const { zonedTimeToUtc } = require("date-fns-tz");

class NextBuild {
  data() {
    return {
      permalink: "netlify/functions/webmentionsRebuild-generated.js",
      permalinkBypassOutputDir: true,
    };
  }

  async render({ site, webmentionsLastFetched }) {
    const template = await readFile(
      path.join(
        __dirname,
        "..",
        "_scripts",
        "templates",
        "webmentionsRebuild.js"
      ),
      { encoding: "utf-8" }
    );

    return template
      .replace("<<domain>>", site.domain)
      .replace("<<token>>", site.webmentionToken)
      .replace("<<since>>", webmentionsLastFetched.toISOString())
      .replace("<<build_hook>>", process.env.BUILD_HOOK);
  }
}

module.exports = NextBuild;
