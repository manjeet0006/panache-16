import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('panache_token'));
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const savedUser = localStorage.getItem('panache_user');
    let logoutTimer;
    if (savedUser && token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUser(JSON.parse(savedUser));
        const remainingTime = decodedToken.exp * 1000 - Date.now();
        logoutTimer = setTimeout(logout, remainingTime);
      }
    }
    setLoading(false);
    return () => clearTimeout(logoutTimer);
  }, [token]);


  const login = (userData, userToken) => {
    localStorage.setItem('panache_token', userToken);
    localStorage.setItem('panache_user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);