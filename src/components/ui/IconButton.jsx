import React from 'react';

/**
 * Icon-only button with tooltip support used for table actions
 * such as edit/delete. Provides a minimalistic round style.
 */
const IconButton = ({ icon: Icon, label, className = '', ...props }) => {
  return (
    <button
      title={label}
      className={`p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
    </button>
  );
};

export default IconButton;
