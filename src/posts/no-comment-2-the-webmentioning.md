---
title: "No Comment 2: The Webmentioning"
date: 2022-06-28
tags:
  - website
  - web development
  - eleventy
  - indieweb
---

When version 1.0.0 of Eleventy was released, one of the features that I was excited to see was the ability to add global data through configuration. This means that plugins can now add global data, and I saw it as a great opportunity to move [my webmentions code](/blog/2021/03/15/no-comment-adding-webmentions-to-my-site/) into a plugin for others to use!

<!-- excerpt -->

When I started to look into how to create a plugin, I quickly realised that in the Eleventy world, a plugin is just an extra `.eleventy.js` file that gets loaded 🤯. What an amazingly simple way to create plugins!

Because it's just an extra `.eleventy.js`, you have access to everything you can do in an Eleventy config file. In my case, I needed `.addFilter` to add the `webmentionsForPage` and `webmentionCountForPage` filters, and `.addGlobalData` to add the webmentions to the global data.

You can [install it from npm](https://www.npmjs.com/package/eleventy-plugin-webmentions) and the load it using `.addPlugin`, like this:

```javascript
const Webmentions = require("eleventy-plugin-webmentions");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(Webmentions, {
    domain: "lukeb.co.uk",
    token: "ABC123XYZ987",
  });
};
```

This adds a `webmentions` global data object, and then in your templates, you can use the `webmentionsForPage` and `webmentionCountForPage` to filter `webmentions`.

Full documentation, including a load of configurable options is in the [readme on GitHub](https://github.com/CodeFoodPixels/eleventy-plugin-webmentions#readme).
