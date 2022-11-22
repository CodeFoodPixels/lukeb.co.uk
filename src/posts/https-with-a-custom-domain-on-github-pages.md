---
title: HTTPS With A Custom Domain On GitHub Pages
date: 2018-01-02
tags:
  - tips
  - GitHub pages
  - Cloudflare
---

While GitHub pages supports HTTPS for sites using the github.io domain, it doesn't support it for custom domains. I've had a few people ask how I've achieved HTTPS with a custom domain on GitHub pages, so I felt I should write a post on it.

<!-- excerpt -->

## Setting Up GitHub Pages

The first thing we have to do is configure the repo on GitHub.

1. Open the "settings" page on your repo and scroll down to the "GitHub Pages" section

2. Select the source that your GitHub pages site will be built from. There are a few options here:

   - gh-pages branch - This means you can use a separate branch on your project just for your documentation.

   - master branch - This means that the content of your master branch is used. I use this for this website.

   - master branch /docs folder - This uses the contents of a "docs" folder in the root of your master branch for the site content.

   - None - This disables GitHub pages for the repo.

3. Set your custom domain in the "Custom domain" section

**Note:** The "Enforce HTTPS" box gets disabled when you add a custom domain. This is fine as we'll be enforcing HTTPS in the next section.

## Adding HTTPS with Cloudflare

To add HTTPS to our GitHub pages custom domain we'll be using the free tier of [Cloudfare](https://www.cloudflare.com).

### Adding The DNS Records

During the process of adding your site, you'll be shown a list of DNS records for your domain. Alternatively you can go to the "DNS" section of the dashboard.

You need to add `CNAME` record for `www` that redirects to your GitHub pages URL. For me that means I have it set to `lukeb-uk.github.io`. Make sure that the traffic is set to go through Cloudflare with the orange cloud.

You could also add your root domain instead of `www` and this would mean it redirects to GitHub pages when you hit the root domain. This is how I have it set up.

### Enabling HTTPS

On the dashboard, go to the "Crypto" section. In the SSL section you should select "Full" and **not** "Full (strict)".

Further down the page there's a setting for "Always use HTTPS". Set this to "On". This means that any HTTP connections will get forced to HTTPS.

You now have a site hosted on GitHub Pages that uses a custom domain and HTTPS!

## Cloudflare Caching

Cloudflare also has a CDN (content delivery network) allowing optimised delivery of content to your visitors. By default HTML content isn't cached, but you can add a page rule to do this.

In the "Page Rules" section of the dashboard, create a page rule. In the URL box, put your domain followed by an asterisk. For me that would be `https://lukeb.co.uk/*`. Then in the settings section, select "Cache Level" from the drop down and then set the cache level to "Cache Everything". Save and deploy this rule.

You can also enable Cloudflare's Always Online™ feature that will serve your site's static pages from their cache if GitHub has an outage. You can enable this in the "Caching" section of the dashboard.
