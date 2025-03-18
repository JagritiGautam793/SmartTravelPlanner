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

// export const RECOMMENDATION_AI_PROMPT =
//   "Generate personalized travel recommendations for a user based on their profile data:\n\nUser's Past Trips: Paris at Eiffel Tower, Rome at Colosseum\nUser's Past Searches: Eiffel Tower, Colosseum\nUser's Selected Categories of Interest: Adventure, Nature\nUser's Budget Range: $1000 - $3000\nUser's Preferred Trip Duration: 7-10 days\n\nBased on this data, recommend 3-5 destinations that this user would likely enjoy. For each recommendation, include:\n\n1. Destination name and brief overview\n2. Why this destination is recommended (connections to past trips and searches)\n3. Best time to visit based on their preferences\n4. Estimated budget range for this destination\n5. Top 3 activities or attractions they would likely enjoy based on their profile\n6. Suggested trip duration\n7. A specific accommodation recommendation that matches their past preferences\n8. A compelling image description or URL for this destination\n\nThe recommendations should prioritize:\n- Similar destinations to ones they've visited or searched for\n- Destinations that strongly match their selected categories\n- Options that fit within their budget range\n- A mix of popular and lesser-known destinations that match their apparent travel style\n\nThe output should be in JSON format with each recommendation as a separate object in an array.";

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
