import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('dieselmaps_token');
    const rawUser = localStorage.getItem('dieselmaps_user');
    if (token && rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch {
        localStorage.removeItem('dieselmaps_user');
      }
    }
    setLoading(false);
  }, []);

  const login = ({ username, role }, token) => {
    const nextUser = { username, role };
    setUser(nextUser);
    localStorage.setItem('dieselmaps_token', token);
    localStorage.setItem('dieselmaps_user', JSON.stringify(nextUser));
    navigate('/map');
  };

  const logout = () => {
    localStorage.removeItem('dieselmaps_token');
    localStorage.removeItem('dieselmaps_user');
    setUser(null);
    navigate('/login');
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
