export interface PasswordValidation {
  isValid: boolean;
  criteria: {
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
  messages: string[];
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_STRONG_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;
export const PASSWORD_MEDIUM_REGEX = /^.{4,}$/;
export const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]{4,}$/;

export const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email);

export const validatePassword = (password: string, strong = false): boolean =>
  strong ? PASSWORD_STRONG_REGEX.test(password) : PASSWORD_MEDIUM_REGEX.test(password);

export const validatePasswordDetailed = (password: string): PasswordValidation => {
  const criteria = {
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
  };

  const messages: string[] = [];
  if (!criteria.hasLowercase) messages.push("Pelo menos uma letra minúscula");
  if (!criteria.hasUppercase) messages.push("Pelo menos uma letra maiúscula");
  if (!criteria.hasNumber) messages.push("Pelo menos um número");
  if (!criteria.hasSpecialChar) messages.push("Pelo menos um caractere especial (@$!%*?&)");

  return { isValid: Object.values(criteria).every(Boolean), criteria, messages };
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

export const getPasswordErrorMessage = (strong = false): string =>
  strong
    ? "Senha deve conter maiúscula, minúscula, número e caractere especial (@$!%*?&)"
    : "Senha deve ter no mínimo 4 caracteres";

export const getNameErrorMessage = (): string =>
  "Nome deve ter no mínimo 4 caracteres";

export const getPhoneErrorMessage = (): string =>
  "Número de telefone inválido. Use um número de Angola (ex: +244 9xx xxx xxx)";