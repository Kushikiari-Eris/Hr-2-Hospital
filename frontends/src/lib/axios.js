import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:7684/api"
      : "https://backend-core2.jjm-manufacturing.com/api",
  withCredentials: true,
});

export default axiosInstance;
