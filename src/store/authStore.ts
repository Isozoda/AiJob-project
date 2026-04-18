import axios from "axios";

export function saveToken(token: string) {
  localStorage.setItem("store_token", token);
}

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("store_token");
  }
  return null;
};

export const axiosRequest = axios.create({
  baseURL: '/api',
});

axiosRequest.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const getUserIdFromToken = (): number | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return parseInt(payload.UserId || payload.sub || '0');
  } catch {
    return null;
  }
};
