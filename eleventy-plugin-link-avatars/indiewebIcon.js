const fetch = require("node-fetch");
const cheerio = require("cheerio");
const Microformats = require("microformat-node");
const mime = require("mime-types");
const parseDataUrl = require("data-urls");
const icoToPng = require("ico-to-png");

function XOR(a, b) {
  return (a || b) && !(a && b);
}

class IndieWebIcon {
  constructor(url, excludeDataURLs = false) {
    this.URL = url;
    this.baseURL = new URL(url).origin;
    this.excludeDataURLs = excludeDataURLs;
  }

  normaliseURL(url) {
    return new URL(url, this.URL).href;
  }

  async fetchPage(url) {
    try {
      const response = await fetch(url);
      const body = await response.text();

      return body;
    } catch (e) {
      throw new Error(`Error while trying to fetch page: ${e}`);
    }
  }

  findHCards(microformatItems) {
    return microformatItems.reduce((res, item) => {
      if (item.type.includes("h-card")) {
        res.push(item);
      }

      if (item.children) {
        res.push(...this.findHCards(item.children));
      }

      return res;
    }, []);
  }

  parseMicroformats(body) {
    return new Promise((resolve, reject) => {
      Microformats.get(
        {
          html: body,
          baseUrl: this.baseURL,
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }

          resolve(data);
        }
      );
    });
  }

  async getRepresentativeHCard(body) {
    const parsed = await this.parseMicroformats(body);

    const hCards = this.findHCards(parsed.items);

    for (let hCard of hCards) {
      if (
        hCard.properties?.uid?.includes(this.URL) &&
        hCard.properties?.url?.includes(this.URL)
      ) {
        return hCard;
      }
    }

    for (let hCard of hCards) {
      if (hCard.properties?.url) {
        for (let j = 0; j < hCard.properties.url.length; j++) {
          if (parsed?.rels?.me?.includes(hCard.properties.url[j])) {
            return hCard;
          }
        }
      }
    }

    if (hCards.length === 1 && hCards[0].properties?.url?.includes(this.URL)) {
      return hCards[0];
    }
  }

  getRelIcon($) {
    const results = [];
    const icons = $(
      `link[rel~=icon], link[rel~=apple-touch-icon-precomposed], link[rel~=apple-touch-icon]`
    );

    for (let icon of icons) {
      const iconURL = this.normaliseURL(icon.attribs.href);
      results.push({
        href: iconURL,
        size: icon.attribs.sizes ? icon.attribs.sizes.split("x") : ["0", "0"],
        type: icon.attribs?.type?.match(/^(image|img)\//i)
          ? mime.extension(icon.attribs.type)
          : mime.extension(mime.lookup(new URL(iconURL).pathname)) || "auto",
      });
    }

    const typeOrder = ["png", "jpeg", "gif", "ico", "auto"];
    results.sort((a, b) => {
      if (XOR(a.type === "svg", b.type === "svg")) {
        return a.type === "svg" ? -1 : 1;
      }

      if (
        XOR(
          a.size[0].toLowerCase() === "any",
          b.size[0].toLowerCase() === "any"
        )
      ) {
        return a.size[0].toLowerCase() === "any" ? -1 : 1;
      }

      if (a.size[0] === b.size[0]) {
        for (const type of typeOrder) {
          if (
            XOR(a.type.toLowerCase() === type, b.type.toLowerCase() === type)
          ) {
            return a.type.toLowerCase() === type ? -1 : 1;
          }
        }
      }

      const order = parseInt(b.size[0], 10) - parseInt(a.size[0], 10);
      if (!Number.isNaN(order) && order !== 0) {
        return order;
      }

      return 0;
    });

    if (this.excludeDataURLs) {
      return results.filter((icon) => {
        const href = new URL(icon.href);
        if (href.protocol === "data:") {
          return false;
        }

        return true;
      })[0];
    }

    return results[0];
  }

  async getIconStats() {
    const body = await this.fetchPage(this.URL);

    try {
      const representativeHCard = await this.getRepresentativeHCard(body);

      if (representativeHCard?.properties?.photo?.length > 0) {
        const faviconUrl = this.normaliseURL(
          representativeHCard.properties.photo[0]
        );

        return {
          href: faviconUrl,
          size: ["0", "0"],
          type: mime.extension(mime.lookup(new URL(faviconUrl).pathname)),
        };
      }
    } catch (e) {
      console.log(`Error when trying to get representative h-card: ${e}`);
    }

    const $ = cheerio.load(body);
    const relIcon = this.getRelIcon($);
    if (relIcon) {
      return relIcon;
    }

    const faviconUrl = this.normaliseURL("/favicon.ico");
    if (await fetch(faviconUrl).then((res) => res.ok)) {
      return {
        href: faviconUrl,
        size: ["0", "0"],
        type: "ico",
      };
    }

    throw new Error(`Page has no icon`);
  }

  async getURL() {
    const stats = await this.getIconStats();
    return stats.href;
  }

  async getData(width = 60) {
    const imageStats = await this.getIconStats();
    const imageURL = new URL(imageStats.href);

    if (imageURL.protocol === "data:") {
      const URLData = parseDataUrl(imageURL.href);
      return {
        extension: mime.extension(URLData.mimeType.essence),
        data: Buffer.from(URLData.body),
      };
    }

    const data = await fetch(imageStats.href).then((res) => {
      if (!res.ok) {
        throw "Error when trying to fetch the icon file";
      }

      return res.buffer();
    });

    if (imageStats.type === "ico") {
      const pngData = await icoToPng(data, width);
      return {
        extension: "png",
        data: pngData,
      };
    }

    return {
      extension: imageStats.type,
      data,
    };
  }
}

module.exports = IndieWebIcon;
