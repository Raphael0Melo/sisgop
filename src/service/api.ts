import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";

type SignOut = () => void

type APIInstanceProps = AxiosInstance & {
  registerIntercepTokenManager: (signOut: SignOut) => () => void
}

export const myApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
}) as APIInstanceProps

myApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

myApi.registerIntercepTokenManager = (signOut: SignOut) => {
  const interceptor = myApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.data.error === 'Token not provided' ||
        error.response.data.error === 'Token invalid'
      ) {
        toast.error('ATENÇÃO: Sua sessão expirou');
        signOut();
      }

      if (error.response && error.response.data) {
        return Promise.reject(error.response.data.error);
      } else {
        return Promise.reject(error);
      }
    }
  );
  return () => {
    myApi.interceptors.response.eject(interceptor);
  };
};