---
title: Do I need bunting today?
date: 2020-05-25 10:30:00
tags:
  - web development
  - website
  - announcements
  - eleventy
---

A couple of weeks ago an idea popped into my head, I built it in a few hours and today, as it's a bank holiday, I'm launching it into the world!

<!-- excerpt -->

Introducing [Do I need bunting today?](https://doineedbuntingtoday.com)!

## What is it?

[Do I need bunting today?](https://doineedbuntingtoday.com) is a site that tells you whether bunting is appropriate, based on if it's a bank holiday in England, Wales, Scotland or Northern Ireland.

That's it, that's the site.

## Ok, but why?

Because I could 🤷‍♂️

The GOV.UK website has a list of bank holidays available at <https://www.gov.uk/bank-holidays>. This list is well presented, easy to read and I frequently use it to see when bank holidays are because I forget.

But a while ago, I learned that if you add `.json` to the end of that URL, you get a JSON represenation of the bank holidays, which includes a true/false value for whether bunting is appropriate.

So I decided to make a site using [Eleventy](https://11ty.dev) with JavaScript data files. The site grabs the data from <https://www.gov.uk/bank-holidays.json>, manipulates it into a format that I can use to show information to the user and then it displays it in a massive, easy to read format for the user.

It's hosted on Netlify and uses a GitHub Action to rebuild the site every day using a Netlify Build Hook.
