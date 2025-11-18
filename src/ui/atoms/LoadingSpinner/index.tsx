import React from "react";
import Image from "next/image";
import { logo } from "@/constants/images";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Carregando...' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  };

  const logoSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      {/* Modern Spinner with Multiple Rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className={`absolute animate-spin rounded-full ${sizeClasses[size]} border-4 border-transparent bg-gradient-to-r from-yellow-400 via-blue-500 to-yellow-400 bg-clip-border`}>
          <div className={`rounded-full ${sizeClasses[size]} bg-white`}></div>
        </div>
        
        {/* Middle Ring */}
        <div className={`absolute animate-spin rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 to-yellow-400 bg-clip-border`} 
             style={{ 
               width: `calc(${sizeClasses[size].split(' ')[0].replace('w-', '')} * 0.75 * 0.25rem)`,
               height: `calc(${sizeClasses[size].split(' ')[1].replace('h-', '')} * 0.75 * 0.25rem)`,
               animationDirection: 'reverse',
               animationDuration: '1.5s'
             }}>
          <div className="rounded-full w-full h-full bg-white"></div>
        </div>
        
        {/* Logo in Center */}
        <div className="relative z-10 animate-pulse">
          <Image 
            src={logo} 
            alt="Loading" 
            className={`${logoSizes[size]} drop-shadow-lg`}
          />
        </div>
        
        {/* Glow Effect */}
        <div className={`absolute rounded-full ${sizeClasses[size]} bg-gradient-to-r from-yellow-400/20 to-blue-500/20 blur-xl animate-pulse`}></div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center">
        <p className="text-gray-600 font-medium animate-pulse">{message}</p>
        <div className="flex justify-center space-x-1 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
