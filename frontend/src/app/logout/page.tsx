'use client';

import { useEffect } from 'react';
import { useLogout } from '@/hooks';

export default function LogoutPage() {
  const logout = useLogout();

  useEffect(() => {
    logout();
  }, [logout]);

  return null;
}
