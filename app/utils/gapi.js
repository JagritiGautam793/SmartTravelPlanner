import axios from "axios";

const BASE_URL = "https://maps.googleapis.com/maps/api/place";
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

const nearByPlace = () =>
  axios.get(
    BASE_URL +
      "/nearbysearch/json?" +
      "&location=15.2993,74.1240&radius=5000" +
      "&key=" +
      API_KEY
  );

const placeDetail = async (placeId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/details/json?place_id=${placeId}&key=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching place details:", error);
  }
};

export default {
  nearByPlace,
  placeDetail,
};
