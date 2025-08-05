import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * Generic button used across the application. It provides
 * a set of visual variants and supports optional icons and
 * loading state.
 */
const Button = ({
  icon: Icon,
  children,
  variant = 'primary',
  loading = false,
  className = '',
  ...props
}) => {
  const baseClasses =
    'flex items-center gap-2 px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';

  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary:
      'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <ArrowPathIcon className="w-5 h-5 animate-spin" />
      ) : (
        Icon && <Icon className="w-5 h-5" />
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;

