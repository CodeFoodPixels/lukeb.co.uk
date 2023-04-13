module.exports = () => {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  const nextCssNakedDay = new Date(
    Date.UTC(today.getFullYear(), 3, 9, 0, 0, 0)
  );
  if (nextCssNakedDay < today) {
    nextCssNakedDay.setFullYear(nextCssNakedDay.getFullYear() + 1);
  }
  const dayAfterCssNakedDay = new Date(nextCssNakedDay);
  dayAfterCssNakedDay.setDate(dayAfterCssNakedDay.getDate() + 1);

  return {
    name: "Luke Bonaccorsi",
    description:
      "Hi, I'm Luke! I'm a self-taught web developer/software engineer with expertise in building scalable, performant websites using HTML, CSS and JavaScript",
    domain: "lukeb.co.uk",
    url: "https://lukeb.co.uk",
    authorName: "Luke Bonaccorsi",
    authorEmail: "luke@lukeb.co.uk",
    maxPostsPerPage: 10,
    webmentionToken: "pDjIX81PRC-fGTpGYOXOMQ",
    isCssNakedDay: month === 3 && day === 9,
    timezone: "Europe/London",
    publishTime: "10:30",
    rebuildDates: [
      nextCssNakedDay,
      dayAfterCssNakedDay,
      new Date(`${today.getFullYear() + 1}-01-01 00:00:00`), // New Year's Day
    ],
  };
};
