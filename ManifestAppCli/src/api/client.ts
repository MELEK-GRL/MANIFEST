import axios from 'axios';

export const api = axios.create({
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});
