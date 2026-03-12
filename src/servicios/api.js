import axios from "axios";

const API = axios.create({
  baseURL: "https://backendpedidos-gusmendez3249s-projects.vercel.app/api/v1/"
});

// Interceptor para agregar token a todas las peticiones
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
