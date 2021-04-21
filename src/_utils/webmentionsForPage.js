const { URL } = require("url");
const uniqBy = require("lodash.uniqby");

const allowedTypes = {
  likes: ["like-of"],
  reposts: ["repost-of"],
  comments: ["mention-of", "in-reply-to"],
};

function filteredWebmentions(webmentions, page) {
  const url = new URL(page, "https://lukeb.co.uk/").toString();

  const flattenedAllowedTypes = Object.values(allowedTypes).flat();

  return webmentions
    .filter((mention) => mention["wm-target"] === url)
    .filter((mention) =>
      flattenedAllowedTypes.includes(mention["wm-property"])
    );
}

function clean(entry) {
  if (entry.content) {
    entry.content.value =
      entry.content.text.length > 280
        ? `${entry.content.text.substr(
            0,
            280
          )}&hellip; <span class="webmention__truncated">Truncated</span>`
        : entry.content.text;
  }
  return entry;
}

module.exports = {
  count(webmentions, page) {
    return filteredWebmentions(webmentions, page).length;
  },

  mentions(webmentions, page) {
    const cleanedWebmentions = filteredWebmentions(webmentions, page)
      .sort(
        (a, b) =>
          new Date(a.published || a["wm-received"]) -
          new Date(b.published || b["wm-received"])
      )
      .map(clean);

    const likes = cleanedWebmentions
      .filter((mention) => mention["wm-property"] === "like-of")
      .filter((entry) => !!entry.author)
      .map((like) => like.author);

    const reposts = cleanedWebmentions
      .filter((mention) => mention["wm-property"] === "repost-of")
      .filter((entry) => !!entry.author)
      .map((repost) => repost.author);

    const comments = cleanedWebmentions
      .filter(
        (entry) => !!entry.author && !!entry.author.name && !!entry.published
      )
      .filter((mention) =>
        allowedTypes.comments.includes(mention["wm-property"])
      );

    return {
      total: cleanedWebmentions.length,
      likes,
      reposts,
      comments,
    };
  },
};
