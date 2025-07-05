import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1", // Đổi nếu API bạn khác
});

instance.interceptors.request.use((config) => {
  const { tokens } = useAuthStore.getState();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

export default instance;
