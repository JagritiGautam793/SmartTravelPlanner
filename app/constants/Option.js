export const selectTravellerList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A solo travels in exploration",
    icon: "",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two traveles in tandem",
    icon: "",
    people: "1",
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of fun loving adventures",
    icon: "",
    people: "1",
  },
  {
    id: 4,
    title: "friends",
    desc: "A bunch of thrill-seeks",
    icon: "",
    people: "4",
  },
];

export const selectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: "",
  },

  {
    id: 2,
    title: "Moderate",
    desc: "Keep Const on the average student",
    icon: "",
  },
  {
    id: 3,
    title: "luxury",
    desc: "Dont worry about cost",
    icon: "",
  },
];

export const AI_PROMPT =
  "Generate Tarvel Plan for Location : {location} for {totalDay} Days and {totalNight} Night for {traveller} with a {budget} budget with a Flight details , Flight Price with Booking url, Hotels options list with HotelName, Hotel address, Price, Hotel image url,geo coordinates, rating, descriptions and Places to visit nearby with placeName, Place details, Place Image Url,Geo Coordinates, ticket Pricing,Time to travel each of the location for {totalDays} days and {totalNight} night with each day plan with best time to visit in JSON format.";
