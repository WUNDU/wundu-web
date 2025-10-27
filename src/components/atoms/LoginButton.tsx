import { ButtonProps } from "@/src/types/button";

const LoginButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  type = "button",
}) => {
  let baseClasses =
    "w-full rounded rounded-lg px-6 py-3 font-semibold shadow-lg transition-colors hover:scale-105";

  if (variant === "primary") {
    baseClasses += " bg-primary text-gray-800 hover:bg-yellow-400";
  } else if (variant === "secondary") {
    baseClasses +=
      " border border-gray-300 bg-white text-gray-800 hover:bg-gray-100";
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses}>
      {children}
    </button>
  );
};

export default LoginButton;
