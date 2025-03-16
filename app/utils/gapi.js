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

const placeDetail = () => {
  axios.get(
    BASE_URL +
      "fields=name%2Crating%2Cformatted_phone_number&place_id=ChIJN1t_tDeuEmsRUsoyG83frY4" +
      "&key=" +
      API_KEY
  );
};

export default {
  nearByPlace,
  placeDetail,
};
