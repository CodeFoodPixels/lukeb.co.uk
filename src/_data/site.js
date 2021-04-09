module.exports = () => {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

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
  };
};
