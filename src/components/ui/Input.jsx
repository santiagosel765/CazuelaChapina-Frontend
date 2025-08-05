import React from 'react';

/**
 * Standardized input field with consistent styling across the app.
 */
const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

export default Input;

