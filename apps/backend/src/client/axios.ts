import axios from "axios";


export const lyzrClient = axios.create({
  baseURL: process.env.LYZR_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.LYZR_API_KEY
  }
});

export const ragClient = axios.create({
  baseURL: 'https://rag-prod.studio.lyzr.ai',
  headers: {
    'x-api-key': process.env.LYZR_API_KEY
  }
});
