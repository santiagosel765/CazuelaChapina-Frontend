import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import FAQ from '../pages/FAQ';
import Dashboard from '../pages/Dashboard';
import ProductPage from '../pages/Products/ProductPage';
import TamalesPage from '../pages/Tamales/TamalesPage';
import BebidasPage from '../pages/Bebidas/BebidasPage';
import CombosPage from '../pages/Combos/CombosPage';
import InventoryPage from '../pages/Inventory/InventoryPage';
import SalesPage from '../pages/Sales/SalesPage';
import BranchesPage from '../pages/Branches/BranchesPage';
import CatalogosPage from '../pages/Catalogos/CatalogosPage';
import UsersPage from '../pages/Users/UsersPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/faq" element={<FAQ />} />
    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products" element={<ProductPage />} />
      <Route path="tamales" element={<TamalesPage />} />
      <Route path="bebidas" element={<BebidasPage />} />
      <Route path="combos" element={<CombosPage />} />
      <Route path="ventas" element={<SalesPage />} />
      <Route path="sucursales" element={<BranchesPage />} />
      <Route path="inventario" element={<InventoryPage />} />
      <Route path="catalogos" element={<CatalogosPage />} />
      <Route path="usuarios" element={<UsersPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
