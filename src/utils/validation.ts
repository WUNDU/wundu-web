// Validação de senha:
// - Pelo menos 8 caracteres
// - Pelo menos uma letra maiúscula
// - Pelo menos uma letra minúscula
// - Pelo menos um número
// - Pelo menos um caractere especial
export const validatePassword = (password: string): boolean => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

// Validação de número de telefone:
// Para uma melhor experiência do utilizador, a validação deve ser feita em
// conjunto com um seletor de país (dropdown).
// A função abaixo é uma validação básica que aceita apenas dígitos.
export const validatePhoneNumber = (number: string): boolean => {
  const re = /^\d+$/;
  return re.test(number);
};

// Validação de e-mail (exemplo):
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};