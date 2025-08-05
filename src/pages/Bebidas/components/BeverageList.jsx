import React from 'react';
import { deleteBeverage } from '../../../services/beverageService';
import Swal from 'sweetalert2';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../../contexts/AuthContext';

const BeverageList = ({ beverages = [], onEdit, onDelete }) => {
  const { hasPermission } = useAuth();

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esto eliminará la bebida!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (res.isConfirmed) {
      await deleteBeverage(id);
      onDelete();
      Swal.fire('Eliminado', 'Bebida eliminada exitosamente', 'success');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {beverages.map((b) => (
        <div key={b.id} className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-bold mb-2">{b.type}</h3>
          <p className="text-sm"><span className="font-semibold">Tamaño:</span> {b.size}</p>
          <p className="text-sm"><span className="font-semibold">Edulcorante:</span> {b.sweetener}</p>
          <p className="text-sm">
            <span className="font-semibold">Toppings:</span>{' '}
            {Array.isArray(b.toppings) ? b.toppings.join(', ') : ''}
          </p>
          <p className="text-sm font-semibold mt-1">Q{b.price}</p>
          <div className="flex gap-2 mt-2">
            {hasPermission('Beverages.update') && (
              <button onClick={() => onEdit(b.id)} className="text-blue-500 hover:text-blue-700">
                <PencilIcon className="h-5 w-5" />
              </button>
            )}
            {hasPermission('Beverages.delete') && (
              <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700">
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BeverageList;
