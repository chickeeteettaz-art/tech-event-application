export type EventItem = {
  title: string;
  slug: string;
  image: string; // path under /public/images
  location: string;
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // Human readable local time
  url?: string; // optional official page or registration link
};

// A curated list of upcoming/popular developer events.
// Image paths reference files in public/images.
export const events: EventItem[] = [
  {
    title: "Google I/O 2026",
    slug: "google-io-2026",
    image: "/images/event1.png",
    location: "Shoreline Amphitheatre, Mountain View, CA + Online",
    date: "2026-05-13",
    time: "9:00 AM PDT",
    url: "https://io.google/",
  },
  {
    title: "Apple WWDC 2026",
    slug: "apple-wwdc-2026",
    image: "/images/event2.png",
    location: "Apple Park, Cupertino, CA + Online",
    date: "2026-06-08",
    time: "10:00 AM PDT",
    url: "https://developer.apple.com/wwdc/",
  },
  {
    title: "Microsoft Build 2026",
    slug: "microsoft-build-2026",
    image: "/images/event3.png",
    location: "Seattle, WA + Online",
    date: "2026-05-19",
    time: "9:00 AM PDT",
    url: "https://build.microsoft.com/",
  },
  {
    title: "PyCon US 2026",
    slug: "pycon-us-2026",
    image: "/images/event4.png",
    location: "Pittsburgh, PA, USA",
    date: "2026-04-24",
    time: "8:30 AM EDT",
    url: "https://us.pycon.org/",
  },
  {
    title: "KubeCon + CloudNativeCon Europe 2026",
    slug: "kubecon-eu-2026",
    image: "/images/event5.png",
    location: "Vienna, Austria",
    date: "2026-03-17",
    time: "9:00 AM CET",
    url: "https://www.cncf.io/kubecon-cloudnativecon/",
  },
  {
    title: "AWS re:Invent 2026",
    slug: "aws-reinvent-2026",
    image: "/images/event6.png",
    location: "Las Vegas, NV, USA",
    date: "2026-12-01",
    time: "9:00 AM PST",
    url: "https://reinvent.awsevents.com/",
  },
  {
    title: "HackMIT 2026",
    slug: "hackmit-2026",
    image: "/images/event-full.png",
    location: "MIT, Cambridge, MA, USA",
    date: "2026-09-19",
    time: "9:00 AM EDT",
    url: "https://hackmit.org/",
  },
];

export default events;
