---
title: "No comment: Adding Webmentions to my site"
date: 2021-03-15 10:30:00
tags:
  - website
  - web development
  - eleventy
  - indieweb
---

While I was [rebuilding my website in Eleventy](/blog/2021/02/12/now-with-added-eleventy), I saw Amber Wilson's [article about adding Webmentions to her site](https://amberwilson.co.uk/blog/grow-the-indieweb-with-webmentions/) shared on Twitter. I'd heard of Webmentions but I'd never really looked into them and while I was reading Amber's post, I thought that it's a really cool idea and added them to the list of things I wanted to add to my site.

<!-- excerpt -->

## What's a Webmention?

A Webmention is a way to let a website know that it's been mentioned by someone, somewhere on the web.

As an example: if I write a blog post and someone finds it interesting, then they can write their own blog post linking to mine and their website's software could send me a Webmention. I can then take that Webmention and display it on my website with a link to their article.

In fact, by linking to Amber's post above, I've sent her a Webmention. Cool, right?

Webmentions are a [W3C Recommendation](https://www.w3.org/TR/webmention/) and is part of the [IndieWeb movement](https://indieweb.org). It's basically pingback but reimplemented without all the XML mess, just a POST request with the source URL (page that mentions the post) and the target URL (the post being mentioned).

## Ok, how do add Webmentions to my site?

From a high level, there are 3 steps you need to take to add Webmentions to your site:

1. [Declare an endpoint so that your site can recieve Webmentions](#declaring-an-endpoint-so-that-your-site-can-recieve-webmentions)
2. [Display Webmentions within your site](#displaying-webmentions-on-your-website)
3. [Send Webmentions to other sites](#sending-webmentions-to-other-sites)

So we'll go through these stages, and I'll talk about how I integrated it into my website with [Eleventy](https://11ty.dev).

### Declaring an endpoint so that your site can recieve Webmentions

To be able to recieve webmentions, you need to declare an endpoint. In his [Parsing Webmentions post](https://adactio.com/journal/6495), Jeremy Keith talks about building a minimum viable webmention endpoint in PHP. It's definitely worth a look if you really want to build something, but otherwise you should use a service like [Webmention.io](https://webmention.io/), which is what I did.

To sign into Webmention.io, you'll need to [set up web sign-in on your website](https://indieweb.org/How_to_set_up_web_sign-in_on_your_own_domain#2._Link_to_your_home_page_from_each_service). I did this by adding `rel="me"` to the Twitter and GitHub links in my navigation, and ensuring that my Twitter and GitHub profiles link to my website.

Once signed in, you can find the tags you'll need to add to your `head` tag that will tell other sites where to send webmentions. If you can't find them straight away, try going to the [settings](https://webmention.io/settings) page.

In my case, the tags look like this:

```html
<link rel="webmention" href="https://webmention.io/lukeb.co.uk/webmention" />
<link rel="pingback" href="https://webmention.io/lukeb.co.uk/xmlrpc" />
```

Now your website can get Webmentions!

### Displaying Webmentions on your website

So now that we're gathering Webmentions, we need to show them somewhere. The way that you do this entirely depends on how your website is built and how you gathered your webmentions, I'll be writing this with Webmention.io and Eleventy in mind but some of this will be transferrable.

#### Fetching webmentions

To grab your Webmentions, [Webmention.io has an API](https://github.com/aaronpk/webmention.io#api) that returns data as JSON. Through the API, you can request all the mentions for your domain, and the mentions for specific pages. With Eleventy, we can grab this data and and display it nicely in our pages.

Eleventy has data files, and you can use [JavaScript data files](https://www.11ty.dev/docs/data-js/) to do some processing at build time. This means that we can do a call to Webmention.io and grab all of our Webmentions before we process any of the website content. An example of how we can do this is:

```js
const fetch = require("node-fetch");
const WEBMENTION_BASE_URL = "https://webmention.io/api/mentions.jf2";

module.exports = async () => {
  const domain = process.env.DOMAIN; // e.g. lukeb.co.uk
  const token = process.env.WEBMENTION_IO_TOKEN; // found at the bottom of https://webmention.io/settings

  const url = `${WEBMENTION_BASE_URL}?domain=${domain}&token=${token}&per-page=1000`;

  try {
    const res = await fetch(url);
    if (res.ok) {
      const feed = await res.json();
      return feed.children;
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};
```

If we save the above as `webmentions.js` within the `_data` folder of our Eleventy project, then we'll have an array of the 1000 most recent Webmentions for our website available under the `webmentions` key in all of our templates.

#### Filtering and rendering

We've grabbed the data, but it's just one big array for the whole domain. We need to filter this array so that we only get the mentions for the page that we're currently rendering. Within that data, we also have different types that we probably want to separate out into groups, such as likes, reposts and replies.

The different types of Webmentions supported by Webmention.io are:

- `in-reply-to`
- `like-of`
- `repost-of`
- `bookmark-of`
- `mention-of`
- `rsvp`

For my site, I'll be using `in-reply-to`, `mention-of`, `like-of` and `repost-of`, with `in-reply-to` and `mention-of` grouped together as `comments`.

The steps we'll be going through are:

- Filter to get Webmentions for the current page, and of the types of mention that we want
- Sort the Webmentions by publish date
- Truncate any long mentions

That would look something like this:

```js
const { URL } = require("url");

function webmentionsForPage(webmentions, page) {
  const url = new URL(page, "https://lukeb.co.uk/").toString();

  const allowedTypes = {
    likes: ["like-of"],
    reposts: ["repost-of"],
    comments: ["mention-of", "in-reply-to"],
  };

  const clean = (entry) => {
    if (entry.content) {
      if (entry.content.text.length > 280) {
        entry.content.value = `${entry.content.text.substr(0, 280)}&hellip;`;
      } else {
        entry.content.value = entry.content.text;
      }
    }
    return entry;
  };

  const pageWebmentions = webmentions
    .filter((mention) => mention["wm-target"] === url)
    .sort((a, b) => new Date(b.published) - new Date(a.published))
    .map(clean);

  const likes = cleanedWebmentions
    .filter((mention) => allowedTypes.likes.includes(mention["wm-property"]))
    .filter((like) => like.author)
    .map((like) => like.author);

  const reposts = cleanedWebmentions
    .filter((mention) => allowedTypes.reposts.includes(mention["wm-property"]))
    .filter((repost) => repost.author)
    .map((repost) => repost.author);

  const comments = cleanedWebmentions
    .filter((mention) => allowedTypes.comments.includes(mention["wm-property"]))
    .filter((comment) => {
      const { author, published, content } = comment;
      return author && author.name && published && content;
    });

  return {
    likes,
    reposts,
    comments,
  };
}
```

This is a long chunk of code, but we can set this up as a [custom filter](https://www.11ty.dev/docs/filters/#universal-filters) in our Eleventy config and then we can use it in our templates.

To display our Webmentions, we can render them with a partial like this:

```njk
{% raw %}
{%- set postMentions = webmentions | webmentionsForPage(page.url) -%}

<h3>Likes</h3>
<ol>
  {% for like in postMentions.likes %}
    <li>
      <a href="{{ like.url }}" target="_blank" rel="external noopener noreferrer">
        <img
          src="{{ like.photo or '/static/images/webmention-avatar-default.svg' }}"
          alt="{{ like.name }}"
          loading="lazy"
          decoding="async"
          width="48"
          height="48"
        >
      </a>
    </li>
  {% endfor %}
</ol>

<h3>Reposts</h3>
<ol>
  {% for repost in postMentions.reposts %}
    <li>
      <a href="{{ repost.url }}" target="_blank" rel="external noopener noreferrer">
        <img
          src="{{ repost.photo or '/static/images/webmention-avatar-default.svg' }}"
          alt="{{ repost.name }}"
          loading="lazy"
          decoding="async"
          width="48"
          height="48"
        >
      </a>
    </li>
  {% endfor %}
</ol>

<h3>Comments</h3>
<ol>
  {% for comment in postMentions.comments %}
    <li>
      <img
        src="{{ comment.author.photo or '/static/images/webmention-avatar-default.svg' }}"
        alt="{{ comment.author.name }}"
        loading="lazy"
        decoding="async"
        width="48"
        height="48"
      >
      <a href="{{ comment.author.url }}" target="_blank" rel="external noopener noreferrer">
        {{ comment.author.name }}
      </a>
      <time class="dt-published" datetime="{{ comment.published }}">
        {{ comment.published  | date("YYYY-MM-DD") }}
      </time>
      <p>{{ comment.content.value }}</p>
      <p>
        <a href="{{ comment.url }}" target="_blank" rel="external noopener noreferrer">
          View original post
        </a>
      </p>
    </li>
  {% endfor %}
</ol>
{% endraw %}
```

Now we have our webmentions rendering in the page!

## Sending webmentions to other sites

[Remy Sharp](https://remysharp.com) has built a great tool called [Webmention.app](https://webmention.app/) that takes care of sending your outgoing Webmentions. You can pass it a page or RSS feed URL and it'll go through, grab any links and send Webmentions (or pingbacks) to any sites that support it.

The [Webmention.app documentation](https://webmention.app/docs) has a few different ways to integrate it with your website. Originally I used an outgoing webhook within Netlify to get Webmention.app to send out my Webmentions, but I've now released a Netlify build plugin that doesn't rely on the Webmention.app website.

The [Webmentions Netlify build plugin](https://github.com/CodeFoodPixels/netlify-plugin-webmentions) is a wrapper around the tool that runs Webmention.app, but by using the build plugin, you can avoid relying on a third party service. It'll all be done locally within the build!

## Bonus: Using Bridgy to gather social media interactions

Like a lot of people, I share my blog posts on Twitter to spread it a bit more, and I often get interactions such as likes, retweets and replies. Twitter doesn't support Webmentons, but I can use [Bridgy](https://brid.gy/) to monitor Twitter for me and send Webmentions to my site for any interactions or links to my site.

But Bridgy doesn't just support Twitter, it supports a whole host of other social networks like Instagram, Facebook and Mastodon too!

## Summary

I hope this has given you an insight into what Webmentions are, and a rough idea of how to implement them on your site. I originally thought it was going to be super difficult and complex, but there were some great posts, examples and resources that really helped.

- [Amber Wilson's post "Grow the IndieWeb with Webmentions](https://amberwilson.co.uk/blog/grow-the-indieweb-with-webmentions/)
- [Max Böck's post "Using Webmentions in Eleventy"](https://mxb.dev/blog/using-webmentions-on-static-sites/)
- [IndieWeb examples on IndieWeb.org](https://indieweb.org/Webmention-developer#IndieWeb_Examples)

### Update 2022-06-28

I've now published a reworked and refined version of this [as a plugin!](https://www.npmjs.com/package/eleventy-plugin-webmentions) You can read more about it in [No Comment 2: The Webmentioning](/blog/2022/06/28/no-comment-2-the-webmentioning/).
