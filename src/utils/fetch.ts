import axios from "axios";

const API_BASE_URL = window.location.host?.includes('localhost')
    ? ''
    : 'https://engleap-server-production.up.railway.app';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 如果需要传递 cookies
});

export default async function fetch(api: string, options?: { method?: string, data?: object }) {
    const { method = 'GET', data } = options || {};

    let func;
    if (method === 'GET') func = axiosInstance.get;
    else func = axiosInstance.post;

    try {
      const res = await func(api, {
          ...(data || {}),
      });
      return res.data;
    } catch (error) {
      return {
        code: 500,
        error,
      };
    }
}