import React from 'react';

/**
 * Basic modal layout ensuring title, body separation and footer actions.
 */
const Modal = ({ title, children, footer }) => (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
      {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
    </div>
  </div>
);

export default Modal;

