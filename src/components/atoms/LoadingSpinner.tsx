import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full w-full">
    <Loader className="animate-spin text-yellow-500 text-5xl" />
  </div>
);

export default LoadingSpinner;