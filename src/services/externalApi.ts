import axios from "axios";

export function axiosFactory(baseURL: string) {
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log("Request:", fullUrl);
    return config;
  });

  return axiosInstance;
}
