import axios from "axios";

const lyzrManagerUrl = process.env.LYZR_MANAGER_URL;

export const lyzrManagerClient = axios.create({
  baseURL: lyzrManagerUrl,
  withCredentials: true,
});