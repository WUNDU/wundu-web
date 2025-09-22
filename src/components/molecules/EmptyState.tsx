import React from 'react';
import NoMovement from '../icons/NoMovement';


interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col flex-1 border border-gray-400 px-10 rounded-2xl items-center justify-center">
      <div className='bg-gray-200 mb-4 p-1 rounded-full'>
        <NoMovement className='w-10 h-10' />
      </div>
      <p className="text-gray-500 text-center text-sm max-w-xs">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
