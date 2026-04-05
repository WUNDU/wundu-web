import { unformatPhoneNumber } from "./format-phone";

export interface PasswordValidation {
  isValid: boolean;
  criteria: {
    minLength: boolean;
    maxLength: boolean;
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
  messages: string[];
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_STRONG_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
export const PASSWORD_MEDIUM_REGEX = /^.{6,}$/;
export const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]{4,}$/;

export const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email);

export const validatePassword = (password: string, strong = false): boolean =>
  strong ? PASSWORD_STRONG_REGEX.test(password) : PASSWORD_MEDIUM_REGEX.test(password);

export const validatePasswordDetailed = (password: string): PasswordValidation => {
  const criteria = {
    minLength: password.length >= 8,
    maxLength: password.length <= 12,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
  };

  const messages: string[] = [];
  if (!criteria.minLength) messages.push("Mínimo de 8 caracteres");
  if (!criteria.maxLength) messages.push("Máximo de 12 caracteres");
  if (!criteria.hasLowercase) messages.push("Pelo menos uma letra minúscula");
  if (!criteria.hasUppercase) messages.push("Pelo menos uma letra maiúscula");
  if (!criteria.hasNumber) messages.push("Pelo menos um número");
  if (!criteria.hasSpecialChar) messages.push("Pelo menos um caractere especial (@$!%*?&)");

  return { isValid: Object.values(criteria).every(Boolean), criteria, messages };
};

export const validateName = (name: string): boolean => NAME_REGEX.test(name.trim());

export const validatePhone = (phone: string): boolean => {
  const digits = unformatPhoneNumber(phone).replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("244");
};

export const validatePhoneNumber = (number: string): boolean => validatePhone(number);

export const getEmailErrorMessage = (): string =>
  "Email inválido. Use o formato: exemplo@dominio.com";

export const getPasswordErrorMessage = (strong = false): string =>
  strong
    ? "Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula e número"
    : "Senha deve ter no mínimo 6 caracteres";

export const getNameErrorMessage = (): string =>
  "Nome deve ter no mínimo 4 caracteres";

export const getPhoneErrorMessage = (): string =>
  "Número de telefone inválido. Use um número de Angola (ex: +244 9xx xxx xxx)";