import api from '@/src/lib/api';
import { RegisterData } from '@/src/types/register';

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
      const response = await api.post('/users', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to register user');
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data.token;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login');
    }
  },
};