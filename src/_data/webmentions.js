const fs = require("fs").promises;
const fetch = require("node-fetch");
const site = require("./site.js");

const CACHE_DIR = "_webmentioncache";
const CACHE_TIME = 3600;
const PER_PAGE = 1000;
const WEBMENTION_URL = `https://webmention.io/api/mentions.jf2?domain=${site.domain}&token=${site.webmentionToken}`;

async function fetchWebmentions(since, page = 0) {
  const params = `&per-page=${PER_PAGE}&page=${page}${
    since ? `&since=${since}` : ""
  }`;
  const response = await fetch(`${WEBMENTION_URL}${params}`);

  if (response.ok) {
    const feed = await response.json();
    if (feed.children.length === PER_PAGE) {
      console.log(feed.children);
      const olderMentions = await fetchWebmentions(since, page + 1);

      return [...feed.children, ...olderMentions];
    }
    return feed.children;
  }

  return null;
}

async function writeToCache(data) {
  const filePath = `${CACHE_DIR}/webmentions.json`;
  const fileContent = JSON.stringify(data, null, 2);

  // create cache folder if it doesnt exist already
  if (!(await fs.stat(CACHE_DIR).catch(() => false))) {
    await fs.mkdir(CACHE_DIR);
  }
  // write data to cache json file
  await fs.writeFile(filePath, fileContent);
}

async function readFromCache() {
  const filePath = `${CACHE_DIR}/webmentions.json`;

  if (await fs.stat(filePath).catch(() => false)) {
    const cacheFile = await fs.readFile(filePath);
    return JSON.parse(cacheFile);
  }

  return {
    lastFetched: null,
    children: [],
  };
}

module.exports = async function () {
  const cache = await readFromCache();

  if (
    !cache.lastFetched ||
    Date.now() - new Date(cache.lastFetched) >= CACHE_TIME * 1000
  ) {
    const feed = await fetchWebmentions(cache.lastFetched);

    if (feed) {
      const webmentions = {
        lastFetched: new Date().toISOString(),
        children: [...feed, ...cache.children],
      };

      await writeToCache(webmentions);
      return webmentions.children;
    }
  }
  return cache.children;
};
