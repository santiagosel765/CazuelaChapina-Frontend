import React from 'react';

/**
 * Standardized select element with consistent styling across the app.
 */
const Select = ({ className = '', children, ...props }) => (
  <select
    className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  >
    {children}
  </select>
);

export default Select;

