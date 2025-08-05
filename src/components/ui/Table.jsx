import React from 'react';

/**
 * Consistent table with sticky header, borders and row alternation.
 * Wrapped in a responsive container to allow horizontal scrolling on small screens.
 */
export const Table = ({ className = '', children }) => (
  <div className="w-full overflow-x-auto">
    <table className={`min-w-full bg-white border rounded-md overflow-hidden text-sm text-left text-gray-600 ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-100 sticky top-0">{children}</thead>
);

export const TableRow = ({ className = '', children }) => (
  <tr className={`border-t even:bg-gray-50 ${className}`}>{children}</tr>
);

export default Table;

