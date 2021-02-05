const data = [
  {
    title: "How I Ended Up Automating My Curtains And Shouting At My Laptop",
    abstract: `Home automation has grown to be super popular recently, with things like smart light bulbs, internet connected thermostats and virtual assistants being readily available. Usually this means that you have to buy into a company’s ecosystem and hand over control, but what if we could build our own system?

When I started writing a chatbot a few years ago, I had no idea that it would grow to be my own JavaScript-based home automation system, controlling my lamps, curtains and heating. In this talk I’ll share journey and current progress, as well as things that I’d like to do with it in the future. By the end of I hope to have inspired you to try using JavaScript for some of your own automation.`,
    events: [
      {
        name: "LeedsJS",
        type: "meetup",
        date: "2016-11-30",
        location: "Leeds, England",
      },
      {
        name: "ManchesterJS",
        type: "meetup",
        date: "2017-03-01",
        location: "Manchester, England",
      },
      {
        name: "Bet Tribe Tech Talks",
        type: "meetup",
        date: "2017-03-22",
        video: "https://www.youtube.com/watch?v=-fR9lc3AKtw",
        location: "Leeds, England",
      },
      {
        name: "SheffieldJS",
        type: "meetup",
        date: "2017-06-29",
        location: "Sheffield, England",
      },
      {
        name: "JSConf Budapest",
        type: "conference",
        date: "2017-10-26",
        video: "https://www.youtube.com/watch?v=dAqKa3waNx8",
        location: "Budapest, Hungary",
      },
      {
        name: "GDG Devfest Coimbra",
        type: "conference",
        date: "2017-12-09",
        location: "Coimbra, Portugal",
      },
      {
        name: "Tech Nottingham",
        type: "meetup",
        date: "2018-05-14",
        location: "Nottingham, England",
      },
      {
        name: "Fusion Meetup",
        type: "meetup",
        date: "2018-06-21",
        location: "Birmingam, England",
      },
      {
        name: "Fullstack",
        type: "conference",
        date: "2018-07-13",
        location: "London, England",
      },
      {
        name: "ScotlandJS",
        type: "conference",
        date: "2018-07-20",
        video: "https://www.youtube.com/watch?v=iqIkUhcC9Kc",
        location: "Edinburgh, Scotland",
      },
      {
        name: "Nodeconf Argentina",
        type: "conference",
        date: "2018-10-19",
        video: "https://www.youtube.com/watch?v=GQfXTq5QUVI",
        location: "Buenos Aires, Argentina",
      },
      {
        name: "JSConf Colombia",
        type: "conference",
        date: "2018-11-17",
        video: "https://www.youtube.com/watch?v=FiJTDwCPYVw",
        location: "Medellín, Colombia",
      },
      {
        name: "FrontendNE",
        type: "meetup",
        date: "2018-12-06",
        video: "https://www.youtube.com/watch?v=EwQO7tMyr7s",
        location: "Newcastle, England",
      },
      {
        name: "NEJS Conf",
        type: "conference",
        date: "2019-08-09",
        video: "https://www.youtube.com/watch?v=P7FXrLcRMPw",
        location: "Omaha, USA",
      },
    ],
  },
  {
    title: "Painting Pixels With Web Bluetooth",
    abstract: `Bluetooth is everywhere nowadays, you can find it in door locks, heart rate monitors and even in forks. However, this usually means that we also have an app for each device taking up space on our phones, no matter how infrequently we use it. Wouldn’t it be great if we could just use the web?

With Web Bluetooth, we can control these devices through the browser! In this talk we’ll take a look at the basics of Web Bluetooth, the Bluetooth Low Energy GATT layer and how to use these through JavaScript using the practical example of how I built an interactive LED pixel display. By the end, I hope you’ll be inspired to try controlling your Bluetooth devices through the browser!`,
    events: [
      {
        name: "LeedsJS",
        type: "meetup",
        date: "2018-05-30",
        location: "Leeds, England",
      },
      {
        name: "FrontendNE",
        type: "meetup",
        date: "2018-12-06",
        video: "https://www.youtube.com/watch?v=8FADEAp8BX4",
        location: "Newcastle, England",
      },
      {
        name: "Leeds Frontend",
        type: "meetup",
        date: "2019-07-04",
        location: "Leeds, England",
      },
      {
        name: "DublinJS",
        type: "meetup",
        date: "2019-06-04",
        location: "Dublin, Ireland",
      },
      {
        name: "Front End York",
        type: "meetup",
        date: "2019-10-02",
        location: "York, England",
      },
      {
        name: "Middlesbrough FE",
        type: "meetup",
        date: "2019-04-25",
        location: "Middlesbrough, England",
      },
    ],
  },
  {
    title: "Testing with snapshots",
    abstract: `In June 2016, Facebook introduced snapshot testing into Jest, it’s JavaScript unit testing framework. Since then, snapshot testing has seen massive uptake because it makes writing tests for things like React way easier.

In this talk I’ll go through what snapshot testing is, how it works and when to use it. I’ll be covering examples using React as well as non-React uses and hopefully you’ll gain the same enthusiasm I have for snapshot testing!`,
    events: [
      {
        name: "Leeds Testing Atelier",
        type: "conference",
        date: "2017-10-16",
        video: "https://www.youtube.com/watch?v=uzfydKkSAuc",
        location: "Leeds, England",
      },
      {
        name: "LeedsJS",
        type: "meetup",
        date: "2018-08-29",
        video: "https://www.youtube.com/watch?v=0BfvJ5kwKIU",
        location: "Leeds, England",
      },
    ],
  },
  {
    title: "Coding is serious business",
    abstract: `Coding is serious business. Except it isn't. Code gives us the power to unleash our creative potential in new and interesting ways, whether that’s making interactive art, creating live music and visualisations, building games or even adding joyful flourishes on a web app.

In this talk, I’ll show that our code doesn’t just have to be for building boring applications. Using real examples, I’ll talk about some ways that we can bring creativity into our coding projects. By the end, I hope to have inspired you to bring creativity into your projects, whether that’s a few little flares in your application, or an entirely creative project.`,
    events: [
      {
        name: "LeedsJS",
        type: "meetup",
        date: "2019-02-27",
        video: "https://www.youtube.com/watch?v=CWiiKljO7D0",
        location: "Leeds, England",
      },
      {
        name: "JSNE",
        type: "meetup",
        date: "2019-05-15",
        location: "Newcastle, England",
      },
    ],
  },
  {
    title: "I reject your reality and substitute my own",
    abstract: `Virtual reality means that creators can build an immersive experience for their users, whether that means transporting them to another time or place, or building an entirely new universe. Technology advances over the past few years means that these experiences are available to more people than ever, but usually these require expensive headsets and powerful PCs to run them.

But thanks to WebXR, we can use the web to build virtual reality and mixed reality experiences that can run in the browser! In this talk, we’ll look at a few uses of WebXR, from displaying a 360 degree photo, to building our own world! By the end, I hope to have inspired you to give WebXR a try!`,
    events: [
      {
        name: "LeedsJS",
        type: "meetup",
        date: "2019-10-30",
        location: "Leeds, England",
      },
    ],
  },
  {
    title: "The cube rule of food identification",
    abstract: `For decades scholars have struggled with classification of food, but no more. The cube rule strives to bring unity to the world of food classification.`,
    events: [
      {
        name: "LeedsJS",
        type: "meetup",
        date: "2019-11-30",
        video: "https://www.youtube.com/watch?v=K_hwgXkEbOE",
        location: "Leeds, England",
      },
    ],
  },
];

module.exports = {
  futureEvents: data
    .map((talk) => {
      const now = new Date();
      const futureEvents = talk.events
        .filter((event) => {
          return new Date(event.date) > now;
        })
        .map((event) => {
          return {
            ...event,
            talk: talk.title,
          };
        });

      return futureEvents;
    })
    .reduce((acc, events) => {
      return [...acc, ...events];
    }, [])
    .sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    }),
  talks: data
    .map((talk) => {
      const now = new Date();
      const futureEvents = talk.events
        .filter((event) => {
          return new Date(event.date) > now;
        })
        .sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

      const pastEvents = talk.events
        .filter((event) => {
          return new Date(event.date) <= now;
        })
        .sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

      return {
        ...talk,
        futureEvents,
        pastEvents,
      };
    })
    .sort((talkA, talkB) => {
      return talkB.events.length - talkA.events.length;
    }),
};
