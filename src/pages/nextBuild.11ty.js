class NextBuild {
  data() {
    return {
      permalink: "/nextbuild.json",
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

  render({ collections, site }) {
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

    return JSON.stringify({
      date: postDates[0],
      cron: this.dateToCron(postDates[0]),
    });
  }
}

module.exports = NextBuild;
