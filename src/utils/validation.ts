export interface PasswordValidation {
  isValid: boolean;
  messages: string[];
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Regra única: pelo menos 6 caracteres. Sem exigência de maiúsculas, minúsculas,
// números ou caracteres especiais.
export const PASSWORD_MIN_REGEX = /^.{6,}$/;
/** @deprecated use PASSWORD_MIN_REGEX */
export const PASSWORD_MEDIUM_REGEX = PASSWORD_MIN_REGEX;
export const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]{4,}$/;

export const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email);

export const validatePassword = (password: string): boolean =>
  PASSWORD_MIN_REGEX.test(password);

export const validatePasswordDetailed = (password: string): PasswordValidation => {
  // Único requisito: 6 ou mais caracteres.
  const minLength = password.length >= 6;

  const messages: string[] = [];
  if (!minLength) messages.push("Pelo menos 6 caracteres");

  return {
    isValid: minLength,
    messages,
  };
};

export const validateName = (name: string): boolean => NAME_REGEX.test(name.trim());

export const validatePhone = (phone: string): boolean => {
  // Strip +244 or 244 prefix (with optional space) then validate 9-digit local number
  const cleaned = phone.trim().replace(/^\+?244\s?/, "").replace(/\s/g, "");
  return /^(9\d{8}|2\d{8})$/.test(cleaned);
};

export const validatePhoneNumber = (number: string): boolean => validatePhone(number);

export const getEmailErrorMessage = (): string =>
  "Email inválido. Use o formato: exemplo@dominio.com";

export const getPasswordErrorMessage = (): string =>
  "Senha deve ter pelo menos 6 caracteres";

export const getNameErrorMessage = (): string =>
  "Nome deve ter no mínimo 4 caracteres";

export const getPhoneErrorMessage = (): string =>
  "Número de telefone inválido. Use um número de Angola (ex: +244 9xx xxx xxx)";