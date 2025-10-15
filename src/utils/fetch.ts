import axios from "axios";

export default async function fetch(api: string, options?: { method?: string, data?: object }) {
    const { method = 'GET', data } = options || {};

    let func;
    if (method === 'GET') func = axios.get;
    else func = axios.post;

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