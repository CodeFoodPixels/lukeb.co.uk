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

  dateToCron(date) {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
  }

  getUTCPostDate(date, timezone) {
    const padded = (val) => val.toString().padStart(2, "0");

    return zonedTimeToUtc(
      `${date.getFullYear()}-${padded(date.getMonth() + 1)}-${padded(
        date.getDate()
      )} ${padded(date.getHours())}:${padded(date.getMinutes())}:${padded(
        date.getSeconds()
      )}`,
      timezone
    );
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
