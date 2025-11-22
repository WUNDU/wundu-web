import api from '@/lib/api';
import { RegisterData } from '@/types/register';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/api';
import { cache, CACHE_TAGS } from '@/lib/cache';

const USER_CACHE_KEY = `${CACHE_TAGS.USER}:me`;
const USER_CACHE_TTL = 60000; // 60 seconds

export const UserService = {
  register: async (data: RegisterData) => {
    const sanitizedPhone = data.phone?.replace(/\s+/g, "");

    const payload = {
      name: data.name,
      email: data.email,
      phoneNumber: sanitizedPhone,
      password: data.password,
      planType: 'FREE',
    };
    try {
      const response = await api.post('/users', payload, { skipAuth: true });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to register user';
      throw new Error(message);
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth', { email, password }, { skipAuth: true });
      // Invalidate user cache on login
      cache.invalidateByTag(CACHE_TAGS.USER);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to login';
      throw new Error(message);
    }
  },

  getUser: async () => {
    // Check cache first
    const cached = cache.get(USER_CACHE_KEY, USER_CACHE_TTL);
    if (cached !== null) {
      return cached;
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
      // Store in cache
      cache.set(USER_CACHE_KEY, response.data);
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      const message = axiosError.response?.data?.message || axiosError.message ||
        'Failed to get user';
      throw new Error(message)
    }
  }
};