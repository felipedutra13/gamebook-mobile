import axios, { AxiosError } from 'axios';
import config from '../../config';

console.log("api.ts", config.SERVER_URL);
const api = axios.create({
    baseURL: config.SERVER_URL
});

export default api;