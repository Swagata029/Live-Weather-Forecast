import axios from "axios";

const API_KEY = "67bec6c29098493292b164701262106";
const BASE_URL = "https://api.weatherapi.com/v1/forecast.json";

export const getWeather = async (location) => {
  const response = await axios.get(
    BASE_URL,
    {
      params: {
        key: API_KEY,
        q: location,
        days: 3,
        aqi: "yes",
        alerts: "yes",
      },
    },
  );

  return response.data;
};
