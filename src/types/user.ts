export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  planType: string;
  createdAt: number[];
  updatedAt: number[];
  isActive: boolean;
  planStart: null | string;
  planEnd: null | string;
  isTrial: boolean;
}