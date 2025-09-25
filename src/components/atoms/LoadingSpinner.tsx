import React from 'react';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import { logo } from '@/src/constants/images';

const LoadingSpinner = () => (
  <div className="relative flex justify-center items-center">
    <div className="absolute animate-spin rounded-full h-25 w-25 border-b-2 border-yellow-500"></div>
    <Image src={logo} alt={''} />
  </div>
);

export default LoadingSpinner;