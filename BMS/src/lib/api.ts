// lib/api.ts
import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
});


api.interceptors.request.use((config) => {
  const accessToken = Cookies.get('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
