import { useState } from 'react';
import { Bars3Icon, MoonIcon, SunIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = user?.name?.charAt(0)?.toUpperCase() || '';

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 border-b px-6 h-16">
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={onMenuClick}>
          <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">CazuelaChapina</div>
      </div>
      <div className="relative flex items-center gap-4">
        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md">SPU</button>
          <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
          <button className="text-gray-600 dark:text-gray-300">
            <Squares2X2Icon className="w-6 h-6" />
          </button>
        </div>
        {/* Mobile dropdown */}
        <div className="md:hidden relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 dark:text-gray-300">
            <Squares2X2Icon className="w-6 h-6" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-md bg-white dark:bg-gray-700 shadow-lg p-2 flex flex-col gap-2">
              <button className="w-full px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md">SPU</button>
              <button
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              </button>
            </div>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 dark:bg-gray-600 dark:text-gray-200 overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
          ) : (
            initial
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
