---
title: The Viewbuilder Pattern
date: 2020-02-01
tags:
  - programming
  - patterns
---

Many companies have internal APIs that provide their data, but scaling these can be tricky and expensive. There are also cases where you're using a rate-limited 3rd party API that you need to use to provide data to the frontend of your website.

While I was working at Sky Betting and Gaming, I was introduced to a pattern that they use called a viewbuilder. I find it to be a really interesting and useful idea, and we used it heavily in my time there.

<!-- excerpt -->

## What is a viewbuilder?

At its most simple, a viewbuilder is a process that runs a task on a set interval to gather, manipulate and store data for later use.

The interval you set can depend how often the data will update and how fresh you want it to be. Most of our instances ran at a 1 second interval, but some ran at other intervals such as 5 and 10 seconds.

## Why use a viewbuilder?

While you could gather and return this data as and when it is requested by the frontend, this can be slow and can introduce scaling and caching issues.

By using a viewbuilder we only gather this data once within a set interval, reducing the load on any APIs used and reducing the work done during the call from the frontend.

This may sound just like caching, but there are 2 key differences. The first is that caching is usually done on the first request. In cases of heavy traffic sites, this can result in a cache stampede and potentially bringing your site down. The second difference is that this is a transformed cache, so there is no extra processing necessary when making the request.

The downside of the viewbuilder approach is that the data is only as fresh as the frequency of the viewbuilder. This may be a problem for some use cases, but it was acceptable for us.

## Anatomy of a viewbuilder

When we first start the viewbuilder process, we initialise things like logging and any necessary connections to data stores. We then set the interval to run the viewbuilder task.

The task is usually broken down into 3 stages:

### Read

At the read stage, we'd gather all the data we need for that particular process. This may be calls to internal APIs, calls to 3rd party APIs or even direct database calls.

We would frequently gather data from multiple sources at this stage, and would occasionally have cases where the data from one source would be used to gather data from another.

### Transform

During the transform stage, the data from the read stage would be combined and manipulated to produce the desired output.

### Write

At the write stage, we would write the document into MongoDB for later use. We would also add a timestamp so that we can see how fresh the data was when debugging.
