---
title: New Website!
date: 2017-11-12
tags:
---
My previous site hadn't been touched since late 2014 and was running using a custom PHP system I'd written that took markdown and produced the page. This was happening every time someone hit the page so was pretty inefficient.

As my focus is no longer on PHP, I wanted to move towards something JavaScript based. I didn't want to use a client side framework to do this, as the content is pretty static and I feel it would be needless to require JavaScript to present static content.

<!-- more -->

## Static Site Generator

I had a look around and chose [Hexo](https://hexo.io/) as a static site generator. Because this just outputs HTML files, I am using GitHub Pages to host it. The site consists of 2 repos:

- The first is the [website-hexo](https://github.com/lukeb-uk/website-hexo) repo. This contains the Hexo project that the site is generated from. The raw markdown files and EJS templates live in here.
- The second is the [website](https://github.com/lukeb-uk/website) repo. This is where the generated site is pushed to and is then served using GitHub Pages.

## Automated Builds

I have automated the build process using Travis CI. Any time I push a commit up to the website-hexo repo, the site is generated and pushed to a new branch on the website repo. A pull request is made and a preview is pushed up to ZEIT's [Now](https://zeit.co/now). The code for all this can be found in the [Travis config file](https://github.com/lukeb-uk/website-hexo/blob/master/.travis.yml) in the website-hexo repo.

## Design And Implementation

For the actual website, I wanted to use pixel art in the design. I really enjoy creating pixel art and love the style visually. I looked at some retro games for UI inspiration and put together a design that I'm pretty happy with.

A lot of the actual layout is achieved with flexbox. I love how powerful flexbox is and what you can achieve with it. Although it does sort of remind me of the table layouts that were popular when I started developing.

I took the opportunity to add a little animation using CSS, as it's not something I've done much and wanted to try more. I feel it's worked well!

The main functionality of the site uses no JavaScript, however there is an easter egg that does. The only hint I'll give is that you should follow the instructions in the header.
