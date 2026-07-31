export interface UserRequest {
  name: string; // minLength: 2, maxLength: 100
  email: string;
  phoneNumber: string; // pattern: ^(\+244)?\s?(9\d{8}|2\d{8})$
  password: string; // minLength: 8, maxLength: 12
  planType?: "FREE" | "PREMIUM";
}

/** PATCH /users/me/profile — todos os campos opcionais (semântica PATCH). */
export interface ProfileUpdateRequest {
  province?: string;
  municipality?: string;
  birthDate?: string; // date, formato YYYY-MM-DD
  gender?: string;
  maritalStatus?: string;
  dependents?: number;
  employmentStatus?: string;
  expectedMonthlyIncome?: number;
}
