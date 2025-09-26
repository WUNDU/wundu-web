export const validatePassword = (password: string): boolean => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
  return re.test(password);
};

export const validatePhoneNumber = (number: string): boolean => {
  const re = /^\d+$/;
  return re.test(number);
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};