const fs = require("fs").promises;
const fetch = require("node-fetch");
const unionBy = require("lodash.unionby");
const site = require("./site.json");

const CACHE_DIR = "_cache";
const WEBMENTION_URL = `https://webmention.io/api/mentions.jf2?domain=${site.domain}&token=${site.webmentionToken}`;

async function fetchWebmentions(since) {
  const url = `${WEBMENTION_URL}&per-page=9999${
    since ? `&since=${since}` : ""
  }`;

  const response = await fetch(url);

  if (response.ok) {
    const feed = await response.json();
    return feed;
  }

  return null;
}

function mergeWebmentions(a, b) {
  return unionBy(a.children, b.children, "wm-id");
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
  const { lastFetched } = cache;

  // Only fetch new mentions in production
  if (!lastFetched) {
    const feed = await fetchWebmentions(lastFetched);

    if (feed) {
      const webmentions = {
        lastFetched: new Date().toISOString(),
        children: mergeWebmentions(cache, feed),
      };

      await writeToCache(webmentions);
      return webmentions.children;
    }
  }

  return cache.children;
};
