// src/Api/Axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://amazonbackend-zert.onrender.com", // Matches Express backend routes
});

export default axiosInstance;
