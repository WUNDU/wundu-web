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

export const validatePassword = (password: string): boolean => {
  // Simplified validation: minimum 6 characters, at least one letter and one number
  const re = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
  return re.test(password);
};

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
  
  if (!criteria.minLength) {
    messages.push("Mínimo de 8 caracteres");
  }
  if (!criteria.maxLength) {
    messages.push("Máximo de 12 caracteres");
  }
  if (!criteria.hasLowercase) {
    messages.push("Pelo menos uma letra minúscula");
  }
  if (!criteria.hasUppercase) {
    messages.push("Pelo menos uma letra maiúscula");
  }
  if (!criteria.hasNumber) {
    messages.push("Pelo menos um número");
  }
  if (!criteria.hasSpecialChar) {
    messages.push("Pelo menos um caractere especial (@$!%*?&)");
  }

  const isValid = Object.values(criteria).every(Boolean);

  return {
    isValid,
    criteria,
    messages,
  };
};

export const validatePhoneNumber = (number: string): boolean => {
  // Remove spaces and check if it starts with + followed by digits and spaces
  const cleanNumber = number.replace(/\s/g, '');
  const re = /^\+\d+$/;
  return re.test(cleanNumber) && cleanNumber.length >= 8;
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};