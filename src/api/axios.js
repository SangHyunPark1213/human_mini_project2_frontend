import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.0.169:8111/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
