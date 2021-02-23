const sanitizeHTML = require("sanitize-html");
const uniqBy = require("lodash.uniqby");

module.exports = (webmentions, url) => {
  const allowedTypes = [
    "mention-of",
    "in-reply-to",
    "like-of",
    "repost-of",
    "bookmark-of",
  ];
  const allowedHTML = {
    allowedTags: ["b", "i", "em", "strong"],
  };

  // clean webmention content for output
  const clean = (entry) => {
    if (entry.content) {
      const text = sanitizeHTML(entry.content.text, allowedHTML);
      entry.content.value =
        text.length > 280
          ? `${text.substr(
              0,
              280
            )}&hellip; <span class="webmention__truncated">Truncated</span>`
          : text;
    }
    return entry;
  };

  const orderByDate = (a, b) => new Date(b.published) - new Date(a.published);

  // only allow webmentions that have an author name and a timestamp
  const checkRequiredFields = (entry) => {
    const { author, published } = entry;
    return !!author && !!author.name && !!published;
  };

  const cleanedWebmentions = webmentions
    .filter((mention) => mention["wm-target"] === url)
    .filter(
      (mention) => mention.author.url !== "https://twitter.com/CodeFoodPixels"
    )
    .filter((mention) => allowedTypes.includes(mention["wm-property"]))
    .sort(orderByDate)
    .map(clean);

  const likes = cleanedWebmentions
    .filter((mention) => mention["wm-property"] === "like-of")
    .map((like) => like.author);

  const reposts = cleanedWebmentions
    .filter((mention) => mention["wm-property"] === "repost-of")
    .map((repost) => repost.author);

  const replies = uniqBy(
    cleanedWebmentions
      .filter((mention) => mention["wm-property"] === "in-reply-to")
      .reverse(),
    (mention) => mention.author.name
  ).reverse();

  const bookmarks = webmentions.filter(
    (mention) => mention["wm-property"] === "bookmark-of"
  );

  const mentions = cleanedWebmentions
    .filter(checkRequiredFields)
    .filter((mention) => mention["wm-property"] === "mention-of");

  return {
    total: cleanedWebmentions.length,
    likes,
    reposts,
    replies,
    bookmarks,
    mentions,
  };
};
