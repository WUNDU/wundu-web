import React from "react";

interface ActionButtonProps {
  label: string;
  variant: "primary" | "secondary";
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  variant,
  onClick,
  disabled = false,
}) => {
  const baseClasses =
    "px-8 py-3 rounded-lg font-medium text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses =
    variant === "primary"
      ? "bg-green-400 text-white hover:bg-green-600"
      : "bg-red-400 text-white hover:bg-red-600";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses}`}
    >
      {label}
    </button>
  );
};

export default ActionButton;
