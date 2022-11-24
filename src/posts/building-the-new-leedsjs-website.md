---
title: Building the new LeedsJS website
date: 2019-11-11 10:30:00
tags:
  - community
  - meetups
  - web development
---

At the end of 2018, I announced that I was setting a 6 month deadline for LeedsJS to move away from Meetup. At the time they charged $90 for 6 months as an organiser, which I was paying out of my own pocket. At the time of writing, this has been raised to $98.94.

<!-- excerpt -->

{% image "./src/posts/building-the-new-leedsjs-website/leaving-tweet.png", "I've just made the last payment I'm going to make to @Meetup. They charge $90 for 6 months. I've been paying this myself ever since I took @leedsjs over. Charging community run groups this amount of money is bizarre to me, and I'm not going to pay it anymore.", "(min-width: 41.5rem) 37.5rem, 15.625rem" %}

Many community groups try to keep their costs as low as possible, and those that get sponsorship usually get it on a month-to-month basis and attibute it directly to something. This makes paying for a 6 month subscription to a service difficult, and organisers end up paying themselves.

I also felt that the service that Meetup was providing for the cost wasn't great. Over the past year or two, they've updated the site and have taken away a lot of flexibility.

## Requirements

There were 3 key features that we used on Meetup that we needed to replace, as well as a couple of extra features that I wanted.

- **Event page:** We needed a page for each event detailing the talks, the venue, the date and time, and the sponsors for that event.

- **RSVPs:** We need to have an idea of how many people will be attending, and to be able to set a maximum number of attendees.

- **Mailing list/email notifications:** We want to be able to contact our members with long form event notifications, as well as any other messages that we want to share with them such as conference discounts.

- **Speaker pages:** I wanted to be able to have profile pages for speakers so that people can see any previous talks that they've given and find any links that the speakers wanteed to share.

- **Talk pages:** I wanted to have pages for the talks so that after the talk we can share the video on there with all the other details of the talk.

## External services

Instead of implementing them myself, I decided to use external services for RSVPs and emails. These are usually complex systems with a lot of moving parts, and I felt it was much better to rely on tried and tested systems.

For RSVPs I decided to use [Tito](https://ti.to). Tito is free for free events and has a pretty streamlined experience when getting a ticket. It also has a very good admin experience.

For email I chose [Mailchimp](https://mailchimp.com/). Mailchimp has a pretty good free tier, and their limits surpass anything that we need.

## Building the website

In the past couple of years, I've rediscovered my love for static sites, and static site generators have played a massive part of that. I use Hexo to build my own website, but I'd heard great things about another static site generator called [Eleventy](https://www.11ty.io/) and decided to give that a go.

One of the great features of Eleventy is the ability to have [global data files](https://www.11ty.io/docs/data-global/). This allows you to define your data in JavaScript or JSON files, and have it available to use in your pages. I've used this heavily with the LeedsJS website, as it means we can split the data and use it in various forms.

### Data

I've broken the data down into 4 sections, which are linked in various ways

#### Speaker

This contains information about a speaker. This is the file for me on the new site:

```json
{
  "id": "luke-bonaccorsi",
  "name": "Luke Bonaccorsi",
  "bio": "...",
  "picture": "luke-bonaccorsi.jpg",
  "twitter": "CodeFoodPixels",
  "links": {
    "Website": "https://lukeb.co.uk",
    "GitHub": "https://github.com/lukeb-uk"
  }
}
```

#### Talk

This contains information about a talk. It links to a speaker using the speaker's ID.

```json
{
  "id": "coding-is-serious-business",
  "title": "Coding Is Serious Business",
  "speaker": "luke-bonaccorsi",
  "abstract": "...",
  "date": "2019-02-27",
  "youtube_video_id": "CWiiKljO7D0"
}
```

#### Event

This contains the information for an event. This includes the talks, sponsors and the dates of various stages.

The site uses the `announce_date` property to decide whether to show the event on the site, and it uses the `ticket_date` property to decide if it sould show the ticket button.

```json
{
  "id": "2019-02-27",
  "title": "February - Luke Bonaccorsi & Wade Penistone",
  "blurb": "...",
  "talks": ["coding-is-serious-business", "mindstack"],
  "sponsors": [
    "sky-betting-and-gaming",
    "bruntwood",
    "starlight-software",
    "jetbrains",
    "frontendne"
  ],
  "date": "2019-02-27",
  "start_time": "18:30",
  "end_time": "20:30",
  "ticket_date": "2019-02-20",
  "announce_date": "2019-02-01"
}
```

#### Sponsor

This contains the information about a sponsor so we can display it wherever we need to.

```json
{
  "id": "sky-betting-and-gaming",
  "name": "Sky Betting & Gaming",
  "url": "https://www.skybetcareers.com/",
  "logo": "sky-betting-and-gaming.png",
  "twitter": "SkyBetCareers"
}
```

### Pages

After deciding how to split the data, I had to build the pages and decide how to structure the site. This fell into a similar pattern as the data.

#### Homepage

For the homepage, I wanted the next event to be the main focus. The main purpose of the group is to hold these events, and I feel it's the primary reason that people visit our website.

I didn't want to overload the homepage with all of the information from the event, so I decided to limit it to the title, date, time, event blurb, talk titles and speakers, and then the buttons for more details and tickets. I feel that this gives a pretty good overview of the event and people can click through to get more details if they want.

I also added some information about the group itself and the venue for our events.

#### Events

Each event gets a page on our new site. This page contains all the details about that event, including the talks, sponsors and ticket information, as well as the date, time and blurb for the event.

When it's the current event, this page is linked to from the homepage and any communications such as emails and tweets. When the event is over, the page still has all the details of the event and also embeds the videos for the talks.

We also have a listing of all of the events (starting from our first event of 2019) with the most recent at the top.

#### Speakers

Every speaker has their own profile page on the site, which includes their biography, an image, any links that they want and links to all the talks that they've given.

All the speakers are also listed on a directory page in alphabetical order.

#### Talks

Each talk has a page that includes the title, the date the talk was given, a link to the speaker's profile page and the abstract for the talk. After the event, the youtube video for the talk will be embedded too.

There's also a listing page with all the talks in alphabetical order.

#### Feedback

This was an addition that I made after we'd launched the website and sucessfully used it for an event. The website generates a feedback form for attendees to submit feedback about the event and the talks.

### Performance

I wanted the site to be quick, so I took a few steps to help this.

The easiest step was ensuring that we don't serve any huge images. As part of the build we have a script that runs to resize them all down to a maximum of 300 pixels in either width or height. This is the largest that an image will be displayed on the website.

Another step that I took was to leverage caching. While this doesn't have an impact on the initial load, it does on subsequent loads. To do this, I use a service worker to store assets in a cache, and the browser will look in the cache before then trying the network.

After reading the ["How we built the fastest conference website in the world" post from the JSConf EU blog](https://2019.jsconf.eu/news/how-we-built-the-fastest-conference-website-in-the-world/), I decided to follow the same process of building a stylesheet of styles for a particular page and then inlining it into the page. This improved our rendering time significantly.

Finally, I tried to use as little JavaScript on the website itself as possible. While I love JavaScript and we're a JavaScript group, it'd be irresponsible to add a load of page weight with unnecessary JavaScript.

## Automation

I'm lazy. I don't want to have to do a load of little tasks every time we announce a new event, or when tickets become available, or when the event, or when the event is finished...

So I set out with the goal of being able to automate as much of the site as possible. Initially I thought this was going to be something I ended up doing after we'd used the site for a bit, but the way that I'd structured the data really helped here and meant that I was able to do it fairly easily.

### Time based content

Because some of the stuff such as event announcements and ticket releases are driven by time, I want to only show those things when they should be available.

In the data, I store dates for the event announcements and ticket releases which I then check against when generating the site. If it is currently on or past the date, then it shows the content.

But this still means that I have to build the site every day, and I don't want to do that manually. Thankfully I can combine [Netlify build hooks](https://docs.netlify.com/configure-builds/build-hooks/) with a scheduled serverless function to rebuild the site daily.

### next-event.json

Because all the data is linked together, I can generate a JSON file with a load of data about the next event such as the title, talk titles, speaker information and dates like the announcement date and ticket release date. This file then sits on the site so that it can be used for other tasks.

### Emails

As I mentioned earlier, we're using Mailchimp for our emails. One of the reasons that I didn't mention for choosing them is that they have an API that we can use to create and send email campaigns. Additionally, you can provide your content as HTML through the API to go into a template.

As part of the site build process, I generate the html for the various emails that we send. I then have a scheduled serverless function that runs 15 minutes after the rebuild of the website which grabs the next-event.json, checks if it should be sending any emails and if so, grabs the relevant HTML, builds the campaign and sends it.

### Tweets

Besides email, our other main way to communicate about the event is via Twitter and we do this at about the same cadence as our emails.

I have a scheduled serverless function that I use to post through Twitter's API. The script grabs the next-event.json, determines if a tweet should be posted that day. If so, it then determines the content for the tweet and then posts it through the API.

### Tickets

We're using Tito for our tickets, and Tito also has an API that we can use as part of the automation.

In a scheduled serverless function, we grab the next-event.json and check if it's announcement day. If so, then we create the tickets through the Tito API and set the tickets to be available on the ticket release day.

### Streaming overlay

When possible, we stream our talks on YouTube. This means that people who can't make the event can watch the talks as they happen, as well as getting a recording for later. As part of this, we want to put some information about the speaker and the talk on the stream, as well as the video feeds.

As we have all the data we need in the data files, we can generate a HTML page with a fixed dimension and then put the information about the speaker and talk into the right areas.

When it comes time to stream, we can drop this page into OBS with the browser plugin and then have this as part of the stream.

### Intro slides

Another thing that gets generated as part of the website is the slides for the introductions at the start of the event. While some of the stuff on the slides is static (such as the code of conduct, social media links and mailing list info), other stuff is based on data from the event. When generating the site, we pull this information from the event, talk and speaker data and render it into a HTML page that uses CSS scroll-snap to create slides.
