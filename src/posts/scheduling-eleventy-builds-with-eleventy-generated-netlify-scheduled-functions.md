---
title: Letting Eleventy Schedule Its Own Builds
date: 2022-11-30 10:30:00
draft: true
tags:
  - website
  - web development
  - eleventy
  - netlify
---

Until recently, I've been using GitHub Actions to trigger builds on my website, but this approach meant that builds for the site were only run once a day and that I couldn't schedule specific times for posts to go live. In February of this year, [Netlify announced Scheduled Functions](https://www.netlify.com/blog/quirrel-joins-netlify-and-scheduled-functions-launches-in-beta/), and one of the use cases that I'd seen mentioned was scheduling builds.

<!-- excerpt -->

## Netlify Scheduled Functions

Netlify Functions are serverless functions that can be versioned, built, and deployed along with the rest of your site. Scheduled Functions take this a step further and allow you to run the functions at certain times using the [cron](https://en.wikipedia.org/wiki/Cron) format.

### Building a Scheduled Function

To build a scheduled function, we need to use the `@netlify/functions` package
