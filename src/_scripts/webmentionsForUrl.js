const sanitizeHTML = require("sanitize-html");
const uniqBy = require("lodash.uniqby");
const webmentions = require("../_data/webmentions");

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

function filteredWebmentions(webmentions, url) {
  return webmentions
    .filter((mention) => mention["wm-target"] === url)
    .filter(
      (mention) => mention.author.url !== "https://twitter.com/CodeFoodPixels"
    )
    .filter((mention) => allowedTypes.includes(mention["wm-property"]));
}

function clean(entry) {
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
}

module.exports = {
  count(webmentions, url) {
    console.log(url);
    return filteredWebmentions(webmentions, url).length;
  },

  mentions(webmentions, url) {
    const cleanedWebmentions = filteredWebmentions(webmentions, url)
      .sort((a, b) => new Date(b.published) - new Date(a.published))
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
      .filter(
        (entry) => !!entry.author && !!entry.author.name && !!entry.published
      )
      .filter((mention) => mention["wm-property"] === "mention-of");

    return {
      total: cleanedWebmentions.length,
      likes,
      reposts,
      replies,
      bookmarks,
      mentions,
    };
  },
};
