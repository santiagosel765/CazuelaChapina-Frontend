import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { loginRequest, logoutRequest } from '../services/authService';
import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase';
import { registerDeviceToken } from '../services/notificationService';

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const tokenRegistered = useRef(false);

  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);

      let parsedPermissions = [];
      try {
        parsedPermissions = typeof decoded.permissions === 'string'
          ? JSON.parse(decoded.permissions)
          : decoded.permissions || [];
      } catch {
        parsedPermissions = [];
      }

      setPermissions(parsedPermissions);
      setRole(decoded.role || null);
      setUser({
        name: decoded.name || decoded.username || '',
        avatar: decoded.avatar || ''
      });
    } else {
      setPermissions([]);
      setRole(null);
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        const fcmToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration
        });
        if (fcmToken) {
          await registerDeviceToken(fcmToken);
          tokenRegistered.current = true;
        }
      } catch (err) {
        console.error('FCM token registration failed', err);
      }
    };

    if (token && !tokenRegistered.current) {
      register();
    }
  }, [token]);

  const login = async (credentials) => {
    const { data } = await loginRequest(credentials);
    const jwt = data.token;
    setToken(jwt);
    localStorage.setItem('token', jwt);
  };

  const logout = async () => {
    await logoutRequest();
    setToken(null);
    localStorage.removeItem('token');
  };

  const hasPermission = (perm) => {
    if (!perm || typeof perm !== 'string') return false;
  
    const [module, action] = perm.split('.');
    if (!module || !action) return false;
  
    return permissions.some(
      (p) =>
        p.module?.toLowerCase() === module.toLowerCase() &&
        p.actions?.includes(action)
    );
  };  

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, permissions, role, user, login, logout, hasPermission, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
