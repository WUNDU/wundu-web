// src/components/atoms/ProtectedRoute.tsx (or ProtectedLayout.tsx)
'use client';
import { RegisterProvider } from '@/src/contexts/RegisterContext';
import { useRegisterContext } from '@/src/hooks/useRegisterContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { ROUTES } from '@/src/constants/routes';
import LoadingSpinner from './LoadingSpinner';

const AuthChecker = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useRegisterContext();
  const router = useRouter();

  useEffect(() => {
    console.log('AuthChecker - isAuthenticated:', isAuthenticated, 'user:', user);
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Prevent rendering until authenticated
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  return (
    <RegisterProvider>
      <AuthChecker>{children}</AuthChecker>
    </RegisterProvider>
  );
}