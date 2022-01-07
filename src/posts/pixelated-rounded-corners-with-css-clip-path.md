---
title: Pixelated rounded corners with CSS clip-path
date: 2021-04-20
draft: true
tags:
 - css
 - web development
 - website
 - announcements
---
I remember the day in 2011 when the design agency that I worked for decided that we were dropping IE6 support and raising our minimum to IE 9. Among other things, we didn't have to use images for rounded corners any more, we could use `border-radius`!

Adding rounded corners to items such as images and buttons makes them feel a bit softer and more aesthetically pleasing, but I didn't feel that regular rounded corners would suit the style of my website. That's when I had the idea to use CSS `clip-path`.

<!-- excerpt -->

CSS `clip-path` allows us to determine what part of an element should be shown. We can define a path and anything outside that path will be hidden. There are a number of different shape functions we can use, these are:
 - `circle`
 - `ellipse`
 - `inset` - defines an inset rectangle
 - `polygon` - a set of x and y coordinates for a path
 - `path` - an SVG path string

For this article, we'll be focusing on `polygon`.

The `polygon` shape function takes a set of x and y coordinates to make up a path. Each of these sets of coordinates can be defined as any [valid CSS length](https://developer.mozilla.org/en-US/docs/Web/CSS/length) or as a percentage.

The example below shows how we can apply `clip-path` to an image using pixel values to show only a specified area:

{% set demoPath = "clip-path/basic" %}
{% include "components/demo.njk" %}

And this is an example of the same shape, using percentages

{% set demoPath = "clip-path/basic-percentages" %}
{% include "components/demo.njk" %}

