---
title: Pixelated rounded corners with CSS clip-path
date: 2022-01-17 10:30:00
tags:
  - CSS
  - Web Development
  - Website
  - Announcements
---

I remember the day in 2011 when the design agency that I worked for decided that we were dropping IE6 support and raising our minimum to IE 9. Among other things, we didn't have to use images for rounded corners any more, we could use `border-radius`!

Adding rounded corners to items such as images and buttons makes them feel a bit softer and more aesthetically pleasing, but I didn't feel that regular rounded corners would suit the style of my website. That's when I had the idea to use [CSS `clip-path`](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path).

<!-- excerpt -->

CSS `clip-path` allows us to determine what part of an element should be shown. We can define a path and anything outside that path will be hidden. There are a number of different shape functions we can use, these are:

- `circle`
- `ellipse`
- `inset` - defines an inset rectangle
- `polygon` - a set of x and y coordinates for a path
- `path` - an SVG path string

For this article, we'll be focusing on `polygon`.

The `polygon` shape function takes a set of x and y coordinates to make up a path, the x and y values being an offset from the top left of the element. Each of these sets of coordinates can be defined as any [valid CSS length](https://developer.mozilla.org/en-US/docs/Web/CSS/length) or as a percentage.

In all of the examples on this page, I'll be using images as they help visualise the things I'm talking about, but `clip-path` can be applied to any HTML element.

The example below shows how we can apply `clip-path` to an image using pixel values to show only a specified area.

{% demo "clip-path/basic" %}

This is fine if we know the size of our images and want to apply it to images with that particular size, otherwise we'll end up cropping out bits of larger or differently proportioned images. In the below example, the same image and `clip-path` are used, but one image is `300px` and the other is `600px`. As we can see, it shows the same size section of the image, but it shows different parts of the image.

{% demo "clip-path/basic-wrong-size" %}

If we want to allow the `clip-path` to flex and fit the image that we're applying it to, we can use percentages. This means that the clip path is based on a percentage of the image's dimensions, as can be seen below.

{% demo "clip-path/basic-percentages" %}

We can also combine fixed units and percentages to achieve a balance between the look that we want and flexability.

{% demo "clip-path/combined" %}

Finally, using the CSS `calc` function means that we can achieve offsets from each edge while still staying flexible to different shapes and sizes of image.

{% demo "clip-path/combined-calc" %}

So now that we have all of the bits of knowledge that we have for the CSS side, lets look at the corner itself.

Below there is an example of a pixel art curve, with outlines added for emphasis. As you can see, it's made of a number of "blocks" (called pixels) and each of these is placed in a certain way to give the idea of a curve. We need to replicate this shape with our CSS `clip-path`.

{% svg "./src/posts/pixelated-rounded-corners-with-css-clip-path/pixel-curve.svg", "A diagram of a pixel art rounded corner", "400px", [400], {class: "image__no-clip-path"} %}

To replicate the shape, we need to create a set of points that follow the outside of the pixels. If we start from the leftmost point that we need to define, we have `x` being `0px` and `y` being `5px`. We then need to step inwards one pixel to create the top of the pixel, so for our next point we have `x` being `1px` and `y` still being `5px`. Our next step is to follow the pixels up, so we have `x` still as `1px`, but `y` is now `3px`.

After repeating this to follow the entire curve, we get the following set of coordinates:

```css
clip-path: polygon(
  0px 5px,
  1px 5px,
  1px 3px,
  2px 3px,
  2px 2px,
  3px 2px,
  3px 1px,
  4px 1px,
  5px 1px,
  5px 0px
);
```

This gives us the top left corner. By using `calc()` and flipping horizontally and vertically, we can create the points for the other 4 corners.

As you can see in the below demo, while it compares well to the `border-radius` example, it's not very noticable at the current scale because we're doing it on a single pixel basis.

{% demo "clip-path/rounded-corners" %}

To make it clearer, we have to scale the pixels up. I personally use a scaling multiplier of 4, so 4 on-screen pixels is one pixel in the design. To actually implement this, we take the fixed values from the previous example and multiply them by our scaling multiplier, so the top left corner would be the following:

```css
clip-path: polygon(
  0px 20px,
  4px 20px,
  4px 12px,
  8px 12px,
  8px 8px,
  12px 8px,
  12px 4px,
  16px 4px,
  20px 4px,
  20px 0px
);
```

After applying this to the rest of the corners, it looks like the below demo:

{% demo "clip-path/rounded-corners-scaled" %}

We have some nice pixelated rounded corners! I think it looks great and fits in really well on my site. This technique can be used for all sorts of shapes though, and it doesn't have to be pixelated.

But if you do want to do pixelated rounded corners, you can save yourself the effort and use [the generator that I created](https://pixelcorners.lukeb.co.uk/) after I'd done this on my own site. With the generator you can choose your own pixel multiplier and radius rather than using the ones I've defined here, and you'll get a live preview!
