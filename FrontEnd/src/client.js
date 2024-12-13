import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:3000', // Sesuaikan dengan alamat server backend Anda
});

export default client;
