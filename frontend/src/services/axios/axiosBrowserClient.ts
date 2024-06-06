import axios from 'axios';

export const axiosBrowserClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL
});

axiosBrowserClient.interceptors.request.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const idToken = await axios.post(
        `${process.env.SITE_URL}/api/auth/refresh`
      );

      if (idToken) {
        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);
