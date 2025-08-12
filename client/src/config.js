import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:4000/",
  baseURL: "https://aksera-api.vercel.app/",
});
