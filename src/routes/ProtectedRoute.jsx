import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Componente encargado únicamente de verificar si el usuario está autenticado.
// La validación de permisos se delega a cada página para evitar bucles de
// redirecciones cuando un permiso es insuficiente.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
