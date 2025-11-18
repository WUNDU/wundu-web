import api from '@/lib/api';
import { RegisterData } from '@/types/register';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/api';

let cachedUser: any | null = null;
let cachedUserTimestamp: number | null = null;
const USER_CACHE_TTL_MS = 60 * 1000;

export const UserService = {
  register: async (data: RegisterData) => {
    const payload = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phone,
      password: data.password,
      planType: 'FREE',
    };
    try {
      console.log('Payload enviado:', payload);
      const response = await api.post('/users', payload);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to register user';
      console.log('Erro no UserService.register:', message);
      throw new Error(message);
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth', { email, password });
      cachedUser = null;
      cachedUserTimestamp = null;
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to login';
      console.log('Erro no UserService.login:', message);
      throw new Error(message);
    }
  },

  getUser: async () => {
    if (cachedUser && cachedUserTimestamp) {
      const now = Date.now();
      if (now - cachedUserTimestamp < USER_CACHE_TTL_MS) {
        return cachedUser;
      }
    }
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado')
    }
    let config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    try {
      const response = await api.get('/users/me', config);
      cachedUser = response.data;
      cachedUserTimestamp = Date.now();
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      const message = axiosError.response?.data?.message || axiosError.message ||
        'Failed to get user';
      console.log('Error no UserService.getUser:', message)
      throw new Error(message)
    }
  }
};