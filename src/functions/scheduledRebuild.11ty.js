const { readFile } = require("fs/promises");
const path = require("path");
const { zonedTimeToUtc } = require("date-fns-tz");

class NextBuild {
  data() {
    return {
      permalink: "netlify/functions/scheduledRebuild-generated.js",
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

  async render({ collections, site }) {
    const template = await readFile(
      path.join(
        __dirname,
        "..",
        "_scripts",
        "templates",
        "scheduledRebuild.js"
      ),
      { encoding: "utf-8" }
    );

    const nextYear = new Date();
    nextYear.setUTCFullYear(nextYear.getUTCFullYear() + 1);
    nextYear.setUTCHours(0);
    nextYear.setUTCMinutes(0);
    nextYear.setUTCSeconds(0);

    const postDates = collections.futurePosts.map((post) => {
      return this.getUTCPostDate(post.date, site.timezone);
    });

    postDates.push(...site.rebuildDates, nextYear);
    const filteredPostDates = postDates.filter((date) => date <= nextYear);
    filteredPostDates.sort((a, b) => a - b);

    return template
      .replace("0 0 0 0 0", this.dateToCron(filteredPostDates[0]))
      .replace("<<build_hook>>", process.env.BUILD_HOOK);
  }
}

module.exports = NextBuild;
