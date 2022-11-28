const { readFile } = require("fs/promises");
const path = require("path");

class NextBuild {
  data() {
    return {
      permalink: "../netlify/functions/build.js",
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

  async render({ collections, site }) {
    const template = await readFile(
      path.join(__dirname, "_scripts", "templates", "buildFunction.js"),
      { encoding: "utf-8" }
    );

    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    nextYear.setHours(0);
    nextYear.setMinutes(0);
    nextYear.setSeconds(0);

    const postDates = collections.futurePosts.map((post) => {
      return post.date;
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
