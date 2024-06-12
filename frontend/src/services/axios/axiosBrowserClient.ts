import { HEADER_PROVIDER, HEADER_PROVIDER_TOKEN } from '@/utils';
import { errorMessageToRefreshToken } from '@/utils/getResponse';
import axios from 'axios';

export const axiosBrowserClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL
});

axiosBrowserClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      error.response?.data?.error === errorMessageToRefreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/refresh`,
        {},
        {
          headers: {
            [HEADER_PROVIDER]: originalRequest.headers[HEADER_PROVIDER]
          }
        }
      );

      if (data?.idToken) {
        originalRequest.headers[HEADER_PROVIDER_TOKEN] = data.idToken;

        return axios(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
