---
title: Letting Eleventy Schedule Its Own Builds
date: 2022-11-30 10:30:00
draft: true
tags:
  - Website
  - Web Development
  - Eleventy
  - Netlify
---

Until recently, I've been using GitHub Actions to trigger builds on my website, but this approach meant that builds for the site were only run once a day and that I couldn't schedule specific times for posts to go live. In February of this year, [Netlify announced Scheduled Functions](https://www.netlify.com/blog/quirrel-joins-netlify-and-scheduled-functions-launches-in-beta/), and one of the use cases that I'd seen mentioned was scheduling builds.

<!-- excerpt -->

## Netlify Scheduled Functions

Netlify Functions are serverless functions that can be versioned, built, and deployed along with the rest of your site. Scheduled Functions take this a step further and allow you to run the functions at certain times using the [cron](https://en.wikipedia.org/wiki/Cron) format.

### Building a Scheduled Function

There are a couple of ways to define a Scheduled Function, but we're going to focus on defining it all in the function code. You can see more about this in the [Netlify Scheduled Functions documentation](https://docs.netlify.com/functions/scheduled-functions/#writing-a-scheduled-function).

To define it in the code, we'll need the `@netlify/functions` package, so we need to install it:

```bash
npm install @netlify/functions
```

We'll be using the `schedule` method from this package, and this method takes 2 parameters:

1. `cron expression`, this is a cron pattern that defines when the Scheduled Function runs. [crontab guru](https://crontab.guru/) can help you build this expression if you want a specific pattern.
2. `callback function`, this is the function that will be called.

So let's create a basic Scheduled Function that prints "Hello world!" to the logs:

```javascript
const { schedule } = require("@netlify/functions");

exports.handler = schedule("* * * * *", () => {
  console.log("Hello world!");

  return {
    statusCode: 200
  };
}
```

In the above example, we `require` the `@netlify/functions` package and use the destructuring assignment to unpack `schedule` from it. We then call `schedule` with a cron value and a callback, and then assign that to `exports.handler`, which is what Netlify Functions will run.

In the `schedule` call, we use `* * * * *` as the cron value, which means that it will run every minute. As the callback value, we have a function that calls `console.log` to write "Hello world!" to the console and then returns a response object that contains the key `statusCode` with the value `200`.

We can then save this file within our Netlify site directory as `netlify/functions/hello.js` and when Netlify deploys our site, we'll see "Hello world!" being printed to the logs in the Netlify UI!

### Rebuilding your Netlify site with Scheduled Functions

So the example above isn't particularly useful, but it gives us a base for building something that can trigger a rebuild of our Netlify site.
