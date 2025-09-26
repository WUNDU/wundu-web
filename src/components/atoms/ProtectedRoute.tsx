'use client'
import { ROUTES } from '@/src/constants/routes';
import { useRegisterContext } from '@/src/hooks/useRegisterContext';
import { ProtectedRouteProps } from '@/src/types/route';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useRegisterContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }
  return <>{children}</>;
};

export default ProtectedRoute;