// src/utils/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // FastAPI base URL
});

export default axiosInstance;