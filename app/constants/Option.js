export const selectTravellerList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A solo traveler in exploration",
    icon: "",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two travelers in tandem",
    icon: "",
    people: "2",
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of fun-loving adventurers",
    icon: "",
    people: "4",
  },
  {
    id: 4,
    title: "Friends",
    desc: "A bunch of thrill-seekers",
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
    desc: "Keep costs moderate for the average traveler",
    icon: "",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Don't worry about cost",
    icon: "",
  },
];

export const AI_PROMPT =
  "Generate a Travel Plan for Location: {location} for {totalDays} Days and {totalNights} Nights " +
  "for {traveller} with a {budget} budget. The plan should include:\n\n" +
  "1. Flight details, including flight price and booking URL.\n" +
  "2. Hotel options with:\n" +
  "   - Hotel name\n" +
  "   - Hotel address\n" +
  "   - Price\n" +
  "   - Hotel image URL\n" +
  "   - Geo-coordinates\n" +
  "   - Rating\n" +
  "   - Description\n" +
  "3. Nearby places to visit with:\n" +
  "   - Place name\n" +
  "   - Place details\n" +
  "   - Place image URL\n" +
  "   - Geo-coordinates\n" +
  "   - Ticket pricing\n" +
  "   - Time required to travel to each location\n" +
  "4. A detailed daily itinerary for {totalDays} days and {totalNights} nights, including the best times to visit.\n\n" +
  "The output should be in JSON format.";
