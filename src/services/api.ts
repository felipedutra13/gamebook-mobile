import axios, { AxiosError } from 'axios';
import config from '../../config';

const api = axios.create({
    baseURL: config.SERVER_URL
});

export default api;