import { ButtonProps } from "@/src/types/button";

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  let baseClasses =
    'w-full rounded rounded-lg px-6 py-3 font-semibold shadow-lg transition-colors hover:scale-105';

  if (variant === 'primary') {
    baseClasses += ' bg-gray-800 text-white hover:bg-gray-700';
  } else if (variant === 'secondary') {
    baseClasses += ' border border-gray-300 bg-white text-gray-800 hover:bg-gray-100';
  } else if (variant === 'google') {
    baseClasses += ' border border-gray-300 bg-white text-gray-800 hover:bg-gray-100';
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {children}
    </button>
  );
};

export default Button