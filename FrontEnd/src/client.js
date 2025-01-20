import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL||"http://localhost:3000";
// console.log(baseURL)

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
      // Check for CORS errors or handle other errors globally
      if (error.response) {
        // If the error is from the server (not network issues)
        if (error.response.status === 401) {
          // Unauthorized access, perhaps handle token expiry
          console.error('Unauthorized access - token may have expired');
        }
        else if (error.response.status === 403) {
          // Forbidden access
          console.error('Forbidden access - you do not have permission');
        }
        else if (error.response.status === 500) {
          // Internal server error
          console.error('Internal server error on the backend');
        }
        else {
          // Handle other errors
          console.error('Error response from backend:', error.response);
        }
      } else if (error.request) {
        // No response from the server (could be network issues or CORS)
        if (error.message.includes('Network Error')) {
          console.error('Network error or CORS issue');
        }
      } else {
        // Other errors (configuration issues)
        console.error('Error configuring request:', error.message);
      }
  
      return Promise.reject(error);
    }
  );
export default client;
