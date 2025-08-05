import React from 'react';

/**
 * Standardized textarea with consistent styling.
 */
const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

export default Textarea;

