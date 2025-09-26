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
    if (isAuthenticated) {
      console.log('Usuário autenticado, redirecionando para:', ROUTES.HOME);
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Ou um loading spinner
  }

  return <>{children}</>;
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <RegisterProvider>
      <AuthChecker>
        {children}
      </AuthChecker>
    </RegisterProvider>
  );
}