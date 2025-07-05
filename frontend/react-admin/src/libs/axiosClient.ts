import axios from "axios";
import { env } from "../constants/getEnvs";
import { useAuthStore } from "../stores/useAuthStore";

const API_URL = `${env.API_URL}/v1/auth`;

const axiosClient = axios.create({
  baseURL: API_URL,
});

// REQUEST
axiosClient.interceptors.request.use(
  (config) => {
    const { tokens } = useAuthStore.getState();
    const token = tokens?.accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE
axiosClient.interceptors.response.use(
  async (response) => {
    // Nếu API trả về access_token + refresh_token sau khi login thì lưu vào store
    const { access_token, refresh_token } = response?.data?.data || {};
    if (access_token && refresh_token) {
      useAuthStore
        .getState()
        .setTokens({ accessToken: access_token, refreshToken: refresh_token });
    }
    return response;
  },
  async (error) => {
    const originalConfig = error.config;

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      const { tokens, setTokens, clearTokens, setUser } =
        useAuthStore.getState();
      const refreshToken = tokens?.refreshToken;

      if (!refreshToken) {
        clearTokens();
        setUser(null);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${API_URL}/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = res.data?.access_token;
        if (newAccessToken) {
          setTokens({ accessToken: newAccessToken, refreshToken });

          originalConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosClient(originalConfig);
        } else {
          clearTokens();
          setUser(null);
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } catch (refreshErr) {
        clearTokens();
        setUser(null);
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export { axiosClient };
