---
title: "Now with added Eleventy!"
date: 2021-02-12 10:30:00
tags:
  - CSS
  - HTML
  - Website
  - Eleventy
  - Announcements
  - Web Development
---

Ever since I gave [Eleventy](https://11ty.dev/) a go when I was building the [LeedsJS](https://leedsjs.com) website, I've been a huge fan and advocate, even convincing some people to give it a try out of my sheer enthusiasm for it. I absolutely love the simplicity and flexibility of it, as well as things like data files. I have a whole post talking about this stuff from when I was [building the new LeedsJS website](/blog/2019/11/11/building-the-new-leedsjs-website/).

I've been meaning to convert my own site over for a while, and recently took the plunge and decided to do it. As well as giving me the opportunity to dig into Eleventy without a deadline pressing me, it also gave me the chance to make some stylistic changes.

<!-- excerpt -->

## Building the site

My previous site was built with Hexo, which was my first foray into static site generators. Hexo is pretty prescriptive but it did the job well and gave me an easily updatable website. By comparison, Eleventy is super flexible and much more generic. There isn't a concept of a blog post in Eleventy, you just have named collections of pages with various metadata elements on them such as tags and dates. This means that you can structure your site however you want.

In moving over to Eleventy, I decided to rewrite a load of the HTML and CSS instead of doing a straight copy and paste. The code ended up being super similar, but I still felt it was worth it to make sure that I was doing the right thing.

### Build processing

Because you can hook into various parts of the Eleventy build process (like `beforeBuild` and after a file has been processed), I don't have to maintain various different build processes and can just have a single coherent process to get my site up and running. I've used these hooks to do some CSS processing.

In the `beforeBuild` event, I use `postcss` to run my CSS through `autoprefixer` to ensure that any properties that I've used are supported on older browsers.

I've also added a transform for HTML pages that grabs the CSS files for the whole site, runs them through `purgecss` to remove any unused code for the current page and then runs the result through `csso` to optimise it. The resulting CSS is then inlined into the page.

### Images

Eleventy also has a plugin called [Eleventy Image](https://www.11ty.dev/docs/plugins/image/) that I've used to optimise the images. I've configured it to generate AVIF, WebP, JPEG and PNG versions of the images at widths of 1000px, 800px, 600px and 250px. It then generates a `picture` tag with these in and the most optimal image is chosen by the browser depending on what it supports and what the viewport width is.

I also converted a number of my images to SVGs, such as my spaceship logo. I did this by exporting the 1:1 pixel versions of the images as PNGs from the pixel art editor I use ([Aseprite](https://www.aseprite.org/)) then converted them to SVG using an excellent codepen I found called [Pixels.svg](https://codepen.io/shshaw/pen/XbxvNj). I then ran the svgs through [SVGOMG](https://jakearchibald.github.io/svgomg/) to optimise them. While Aseprite has the option to export as SVG, it exports each pixel as a rect, which means that the SVG has a massive file size.

### Using Data

I got to use one my favourite features of Eleventy when building this site: Data files. For my [speaking](/speaking) page, I wanted a list of all my talks and where I gave them. The most sensible way for me to do this (to me at least) was to have an array of talk objects. Within each talk object I have some information about the talk and an array of events I've given the talk at. This can then be used to build out the speaking page in a nice way.

## Design changes

While rebuilding the site, I decided to make a few design changes. I still love the pixel art space theme and colour scheme, but felt I could make some of the bits more pixel-art like and make some things stand out more.

### Making a hero out of the homepage

My old website just had the blog listing on the homepage and the same header as the rest of the website. I wanted to make the site a little bit more about me, so I moved the content of the about page to the homepage, and moved the blog to live under the `/blog/` path.

I then decided to differentiate the header on the homepage a bit and changed it to take up almost the whole screen. I then added the asteroids from the hidden game I have on the site, animated the spaceship to move around a little more, and added some laser shots.

I'm really happy with how the homepage has turned out and think it gives my site a bit more personality!

### Navigation

The navigation on the old site stood out alright, but it never quite looked how I wanted. On the new site, I've made it a complete red bar, with the red buttons surrounded by a black border.

I've changed the 3D effect on the buttons too. Previously they were using `border-style: outset` but I used CSS gradients to make the borders look a bit more like a pixel art button. I also took the oppotunity to add a rollover effect to the buttons, to make them look like they're pressed. It sort of reminds me of the rollover effects you'd get on websites in the 90s!

### Author bar

I've added an author bar to the bottom of my blog posts with a photo of me, my bio and some links to follow me on twitter and subscribe to my RSS feed. I feel that this makes the page feel a little more complete and makes it feel less like the page is abruptly ending.
