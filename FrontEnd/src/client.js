import axios from 'axios';
const baseURL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const client = axios.create({
    baseURL, // Sesuaikan dengan alamat server backend Anda
});

client.interceptors.request.use(
    (config) => {
      // Add token or other custom logic
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle errors globally
      console.error("Axios error:", error);
      return Promise.reject(error);
    }
  );
  
export default client;
