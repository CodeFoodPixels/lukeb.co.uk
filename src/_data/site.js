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

  const married = Date.now() >= Date.parse("31 October 2023 13:30:00 GMT");
  const domain = "codefoodpixels.com";
  const name = married ? "Luke Morrigan" : "Luke Bonaccorsi";

  return {
    name,
    description:
      "Hi, I'm Luke! I'm a self-taught web developer/software engineer with expertise in building scalable, performant websites using HTML, CSS and JavaScript",
    domain,
    url: `https://${domain}`,
    authorName: name,
    authorEmail: `luke@${domain}`,
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
