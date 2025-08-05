import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/",
  // baseURL: "https://lumma-api.vercel.app/",
});
