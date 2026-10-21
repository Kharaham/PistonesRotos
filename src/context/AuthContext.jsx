import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Default admin credentials for local development & demonstration
const DEFAULT_ADMIN = {
  email: 'admin@pistonesrotos.com',
  password: 'admin'
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check localStorage session on mount
    const savedSession = localStorage.getItem('pistones_admin_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        setIsAuthenticated(true);
        setCurrentUser(user);
      } catch (e) {
        localStorage.removeItem('pistones_admin_session');
      }
    }
    setAuthLoading(false);
  }, []);

  const login = (email, password) => {
    // Validate credentials (can be swapped with Supabase supabase.auth.signInWithPassword)
    if (
      (email.trim().toLowerCase() === DEFAULT_ADMIN.email || email.trim().toLowerCase() === 'admin') &&
      password === DEFAULT_ADMIN.password
    ) {
      const user = {
        email: DEFAULT_ADMIN.email,
        name: 'Capitán General (Admin)',
        role: 'admin'
      };
      setIsAuthenticated(true);
      setCurrentUser(user);
      localStorage.setItem('pistones_admin_session', JSON.stringify(user));
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Credenciales inválidas. Usa email: admin y contraseña: admin' 
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('pistones_admin_session');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
