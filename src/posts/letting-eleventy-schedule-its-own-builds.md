---
title: Letting Eleventy Schedule Its Own Builds
date: 2022-12-07 10:30:00
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

## Building a Scheduled Function

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

exports.handler = schedule("* * * * *", await () => {
  console.log("Hello world!");

  return {
    statusCode: 200
  };
}
```

In the above example, we `require` the `@netlify/functions` package and use the destructuring assignment to unpack `schedule` from it. We then call `schedule` with a cron value and a callback, and then assign that to `exports.handler`, which is what Netlify Functions will run.

In the `schedule` call, we use `* * * * *` as the cron value, which means that it will run every minute. As the callback value, we have a function that calls `console.log` to write "Hello world!" to the console and then returns a response object that contains the key `statusCode` with the value `200`.

We can then save this file within our Netlify site directory as `netlify/functions/hello.js` and when Netlify deploys our site, we'll see "Hello world!" being printed to the logs in the Netlify UI!

## Rebuilding your Netlify site with Scheduled Functions

So the example above isn't particularly useful, but it gives us a base for building something that can trigger a rebuild of our Netlify site. We can do this with [Netlify's build hooks](https://docs.netlify.com/configure-builds/build-hooks/), which is a URL that we can do a `POST` request to and tell Netlify to start a build.

I'd recommend that you store the build hook (either entirely or the identifier from the end) in your [Netlify environment variables](https://docs.netlify.com/environment-variables/overview/).

To make the `POST` request, we can use Node's built in `https` module.

```javascript
const { request } = require("https");
const { schedule } = require("@netlify/functions");

exports.handler = schedule("30 10 * * *", async () => {
  await new Promise((resolve, reject) => {
    const req = request(
      `https://api.netlify.com/build_hooks/${process.env.BUILD_HOOK}`,
      { method: "POST" },
      (res) => {
        console.log("statusCode:", res.statusCode);
        resolve();
      }
    );

    req.on("error", (e) => {
      console.error(e);
      reject();
    });
    req.end();
  });

  return {
    statusCode: 200,
  };
});
```

In this example we're still using the `schedule` method, but the schedule is now `30 10 * * *` which runs it every day at 10:30, and the callback function uses `https.request` to send a `POST` request to our build hook.

So now we have something that rebuilds the site once a day, but we already had that with GitHub Actions. Lets make it more specific!

## Using Eleventy to generate Netlify Scheduled Functions

Netlify doesn't deploy any functions until after the build process for your site has completed, and this means that we can generate or modify our Netlify Functions at build time!

First up, we need to separate live posts and future posts so that only the posts that should be live are listed on any pages. To do this, we'll create 2 new collections in our `.eleventy.js`: `posts` and `futurePosts`

```javascript
const now = new Date();

eleventyConfig.addCollection("posts", (collectionApi) =>
  collectionApi
    .getFilteredByGlob("./src/posts/*")
    .filter((post) => post.date <= now)
    .reverse()
);

eleventyConfig.addCollection("futurePosts", (collectionApi) =>
  collectionApi
    .getFilteredByGlob("./src/posts/*")
    .filter((post) => post.date > now)
);
```

Now that we have our collections, it's important to update any pages that list posts to refer to our new `posts` collection so that we only show the posts that are aready live.

Next we need to create the file that will generate our Scheduled Function. I've called mine `buildFunction.11ty.js` and it's using the `11ty.js` template format.

```javascript
class BuildFunction {
  data() {
    return {
      permalink: "netlify/functions/build.js",
      permalinkBypassOutputDir: true,
    };
  }

  dateToCron(date) {
    return `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
      date.getMonth() + 1
    } ${date.getDay()}`;
  }

  render({ collections, site }) {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    nextYear.setHours(0);
    nextYear.setMinutes(0);
    nextYear.setSeconds(0);

    const postDates = collections.futurePosts
      .map((post) => {
        return post.date;
      })
      .filter((date) => date <= nextYear)
      .sort((a, b) => a - b);

    postDates.push(nextYear);

    return `
const { request } = require("https");
const { schedule } = require("@netlify/functions");

exports.handler = schedule("${this.dateToCron(postDates[0])}", async () => {
  await new Promise((resolve, reject) => {
    const req = request(
      "https://api.netlify.com/build_hooks/${process.env.BUILD_HOOK}",
      { method: "POST" },
      (res) => {
        console.log("statusCode:", res.statusCode);
        resolve();
      }
    );

    req.on("error", (e) => {
      console.error(e);
      reject();
    });
    req.end();
  });

  return {
    statusCode: 200,
  };
});`;
  }
}

module.exports = BuildFunction;
```

Above is the complete code for this file, but I'll go through the various parts of it

### `data` method

The data method allows us to specify the frontmatter data for this file. Here we've set the `permalink` attribute to `"netlify/functions/build.js"` and the `permalinkBypassOutputDir` attribute to `true`. This means that Eleventy will build this file to `netlify/functions/build.js`, starting from your project root directory.

### `render` method

In our render method, we first `map` over our `futurePosts` collection so that we have an array of dates that posts will be live. Then, as cron doesn't specify a year, we filter the array to only have dates within the next year. Next, we sort the array so that we have the nearest date first. Just in case we don't have any posts due to go live in the next year, we push the date for 1 year from now into the array too.

Finally, we return our function code using a template string. We insert our cron pattern using a `dateToCron` method which takes a date and converts it into a cron pattern, and we insert our `BUILD_HOOK` environment variable.

## Timezones

An important thing to note is that Netlify uses UTC for times, so if you have `25th December 2022 10:30` in your post and you're expecting it to post at 10:30 in your local timezone, you'll need to convert the dates from your timezone to UTC.

I do this using the `zonedTimeToUtc` method from the `date-fns-tz` package, with a method like this:

```javascript
getUTCPostDate(date) {
  const padded = (val) => val.toString().padStart(2, "0");

  return zonedTimeToUtc(
    `${date.getFullYear()}-${padded(date.getMonth() + 1)}-${padded(
      date.getDate()
    )} ${padded(date.getHours())}:${padded(date.getMinutes())}:${padded(
      date.getSeconds()
    )}`,
    "Europe/London"
  );
}
```

## Wrapping up

This post was published with this method! I figured what better post to test it on than a post about the thing itself. Is that [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)?

Anyway, I hope this helps you figure out how to use Netlify Scheduled Functions to rebuild your own site!

## Edit (2022-12-07 14:12)

I noticed that my Scheduled Function ran 3 times, and this was down to Netlify requiring an async function to be passed. I've updated the examples above.
