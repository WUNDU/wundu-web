const LandingButton = ({ children, variant = 'primary', className = '' }: { children: React.ReactNode, variant?: 'primary' | 'secondary', className?: string }) => {
  const baseClasses = "px-6 py-3 font-semibold rounded-full transition-transform transform hover:scale-105";
  const variants = {
    primary: "bg-yellow-400 text-blue-900 hover:bg-yellow-500",
    secondary: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50"
  };
  return <button className={`${baseClasses} ${variants[variant]} ${className}`}>{children}</button>;
};

export default LandingButton;