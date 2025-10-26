'use client';
import ProtectedRoute from '@/src/components/atoms/ProtectedRoute';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}