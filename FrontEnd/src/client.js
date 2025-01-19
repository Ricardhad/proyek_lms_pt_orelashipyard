import axios from 'axios';
const baseURL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const client = axios.create({
    baseURL, // Sesuaikan dengan alamat server backend Anda
});

export default client;
