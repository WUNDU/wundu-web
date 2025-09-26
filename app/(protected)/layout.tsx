'use client'
import { RegisterProvider } from '@/src/contexts/RegisterContext';
import { useRegisterContext } from '@/src/hooks/useRegisterContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { ROUTES } from '@/src/constants/routes';

const AuthChecker = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useRegisterContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Or a loading component
  }

  return <>{children}</>;
};

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <RegisterProvider>
      <AuthChecker>
        {children}
      </AuthChecker>
    </RegisterProvider>
  );
}