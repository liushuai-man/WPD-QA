import { useState } from 'react';

export function useAdminAuth() {
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      console.log('Admin login:', username, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('Admin logout');
  };

  return { login, logout, loading };
}
