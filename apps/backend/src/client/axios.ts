import axios from "axios";


const lyzrClient = axios.create({
  baseURL: process.env.LYZR_API_URL,
  withCredentials: true,
});

lyzrClient.interceptors.request.use((config) => {
  const token = process.env.LYZR_API_KEY;
  if (token) {
    config.headers['x-api-key'] = `${token}`;
  }
  return config;
});

export default lyzrClient;