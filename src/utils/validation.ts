export interface PasswordValidation {
  isValid: boolean;
  messages: string[];
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 6 caracteres, com pelo menos uma minúscula, uma maiúscula, um número e um símbolo.
export const PASSWORD_MIN_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/;
/** @deprecated use PASSWORD_MIN_REGEX */
export const PASSWORD_MEDIUM_REGEX = PASSWORD_MIN_REGEX;
export const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]{4,}$/;

export const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email);

export const validatePassword = (password: string): boolean =>
  PASSWORD_MIN_REGEX.test(password);

export const validatePasswordDetailed = (password: string): PasswordValidation => {
  const hasMinLength = password.length >= 6;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^da-zA-Z]/.test(password);
  const isValid = hasMinLength && hasLower && hasUpper && hasNumber && hasSymbol;

  const messages: string[] = [];
  if (!hasMinLength) messages.push("Pelo menos 6 caracteres");
  if (!hasLower) messages.push("Pelo menos uma letra minúscula");
  if (!hasUpper) messages.push("Pelo menos uma letra maiúscula");
  if (!hasNumber) messages.push("Pelo menos um número");
  if (!hasSymbol) messages.push("Pelo menos um símbolo");

  return { isValid, messages };
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
  "Senha deve ter pelo menos 6 caracteres, com minúscula, maiúscula, número e símbolo";

export const getNameErrorMessage = (): string =>
  "Nome deve ter no mínimo 4 caracteres";

export const getPhoneErrorMessage = (): string =>
  "Número de telefone inválido. Use um número de Angola (ex: +244 9xx xxx xxx)";

/**
 * Valida se a data de nascimento corresponde a uma idade >= 18 anos.
 * Preflight client-side do erro `isAgeAllowed` que o backend devolve em
 * PATCH /users/me/profile.
 */
export const validateAge18 = (birthDate: Date): boolean => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return age >= 18;
};

export const getAgeErrorMessage = (): string => "É necessário ter pelo menos 18 anos";