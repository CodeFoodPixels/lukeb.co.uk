---
title: "Now with added Eleventy!"
date: 2021-02-12
draft: true
tags:
 - css
 - HTML
 - website
 - eleventy
 - announcements
 - web development
---
Ever since I gave [Eleventy](https://11ty.dev/) a go when I was building the [LeedsJS](https://leedsjs.com) website, I've been a huge fan and advocate, even convincing some people to give it a try out of my sheer enthusiasm for it. I absolutely love the simplicity and flexibility of it, as well as things like data files. I have a whole post talking about this stuff from when I was [building the new LeedsJS website](/blog/2019/11/11/building-the-new-leedsjs-website/).

I've been meaning to convert my own site over for a while, and recently took the plunge and decided to do it. As well as giving me the opportunity to dig into Eleventy without a deadline pressing me, it also gave me the chance to make some stylistic changes.
<!-- excerpt -->
## Design changes
While rebuilding the site, I decided to make a few design changes. I still love the pixel art space theme and colour scheme, but felt I could make some of the bits more pixel-art like and make some things stand out more.

### Making a hero out of the homepage
My old website just had the blog listing on the homepage and the same header as the rest of the website. I wanted to make the site a little bit more about me, so I moved the content of the about page to the homepage, and moved the blog to live under the `/blog/` path.

I then decided to differentiate the header on the homepage a bit and changed it to take up almost the whole screen. I then added the asteroids from the hidden game I have on the site, animated the spaceship to move around a little more, and added some laser shots.

I'm really happy with how the homepage has turned out and think it gives my site a bit more personality!

### Navigation
The navigation on the old site stood out alright, but it never quite looked how I wanted. On the new site, I've made it a complete red bar, with the red buttons surrounded by a black border.

I've changed the 3D effect on the buttons too. Previously they were using `border-style: outset` but I used CSS gradients to make the borders look a bit more like a pixel art button. I also took the oppotunity to add a rollover effect to the buttons, to make them look like they're pressed. It sort of reminds me of the rollover effects you'd get on websites in the 90s!


