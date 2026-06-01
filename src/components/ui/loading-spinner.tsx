"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  message = "A carregar...",
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "h-8 w-8 border-2",
    md: "h-12 w-12 border-3",
    lg: "h-16 w-16 border-4",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white/80"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        {/* Simple elegant spinner ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} rounded-full border-primary/15 border-t-primary`}
        />

        {/* Subtle center dot or small logo element if needed */}
        <div className="absolute h-1 w-1 rounded-full bg-primary/60" />
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-col items-center gap-3"
        >
          <p className="text-sm font-medium tracking-wide text-gray-500">
            {message}
          </p>
          
          {/* Refined Logotype inclusion */}
          <div className="relative h-4 w-16 opacity-30 grayscale contrast-125">
             <Image 
                src="/assets/logotype.svg" 
                alt="Wundu" 
                fill 
                className="object-contain"
             />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LoadingSpinner;
