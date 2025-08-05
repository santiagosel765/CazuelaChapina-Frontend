import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bars3Icon,
  HomeIcon,
  CubeIcon,
  XMarkIcon,
  FireIcon,
  BeakerIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  RectangleStackIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon, permission: 'dashboard.view' },
  /* { to: '/products', label: 'Products', icon: CubeIcon, permission: 'products.view' }, */
  { to: '/tamales', label: 'Tamales', icon: FireIcon, permission: 'Tamales.view' },
  { to: '/bebidas', label: 'Bebidas', icon: BeakerIcon, permission: 'Beverages.view' },
  { to: '/combos', label: 'Combos', icon: Squares2X2Icon, permission: 'Combos.view' },
  { to: '/ventas', label: 'Ventas', icon: BanknotesIcon, permission: 'Sales.view' },
  { to: '/inventario', label: 'Inventario', icon: ClipboardDocumentListIcon, permission: 'Inventory.view' },
  { to: '/sucursales', label: 'Sucursales', icon: BuildingOfficeIcon, permission: 'Sales.view' },
  { to: '/catalogos', label: 'Catálogos', icon: RectangleStackIcon, permission: 'catalogs.view' },
  { to: '/usuarios', label: 'Usuarios', icon: UserIcon, permission: 'Users.view' }
];

const Sidebar = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { hasPermission, logout } = useAuth();

  return (
    <div
      className={`fixed z-40 inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static flex flex-col bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-r ${
        collapsed ? 'w-16' : 'w-64'
      } transition-transform duration-200`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && <span className="text-lg font-semibold">Menú</span>}
        <div className="flex items-center gap-2">
          <button className="md:hidden" onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
          </button>
          <button onClick={() => setCollapsed(!collapsed)}>
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 flex flex-col">
        {menuItems.filter(m => hasPermission(m.permission)).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 ${collapsed ? 'justify-center px-2' : 'px-4'} py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive ? 'bg-blue-100 dark:bg-gray-700 border-l-4 border-blue-500 text-blue-600 font-medium' : ''
              }`
            }
            onClick={onClose}
          >
            <item.icon className="w-5 h-5" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
        <div className="mt-auto pt-4 border-t px-4">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className={`flex items-center w-full gap-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              collapsed ? 'justify-center px-2' : ''
            }`}
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            {!collapsed && <span className="text-sm">Cerrar sesión</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
