import React from 'react';
import {
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  PowerIcon
} from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import {
  deleteCombo,
  cloneCombo,
  activateCombo,
  deactivateCombo
} from '../../../services/comboService';
import { useAuth } from '../../../contexts/AuthContext';
import { formatBeverage } from '../../../utils/formatBeverage';

const ComboCard = ({ combo, onEdit, onRefresh }) => {
  const { hasPermission } = useAuth();

  const handleDelete = async () => {
    const res = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esto eliminará el combo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (res.isConfirmed) {
      await deleteCombo(combo.id);
      onRefresh();
      Swal.fire('Eliminado', 'Combo eliminado exitosamente', 'success');
    }
  };

  const handleClone = async () => {
    await cloneCombo(combo.id);
    onRefresh();
    Swal.fire('Clonado', 'Combo duplicado exitosamente', 'success');
  };

  const handleToggle = async () => {
    if (combo.isActive) {
      await deactivateCombo(combo.id);
      Swal.fire('Desactivado', 'Combo desactivado', 'success');
    } else {
      await activateCombo(combo.id);
      Swal.fire('Activado', 'Combo activado', 'success');
    }
    onRefresh();
  };

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold">{combo.name}</h2>
            <p className="text-xs text-gray-500">ID: {combo.id}</p>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded ${
              combo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {combo.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{combo.description}</p>
        <p className="text-sm mb-1">
          <span className="font-semibold">Temporada:</span> {combo.season}
        </p>
        <p className="text-sm mb-2">
          <span className="font-semibold">Precio:</span> Q{combo.total ?? combo.price}
        </p>
        <div className="mt-2">
          <p className="font-semibold">Tamales:</p>
          <ul className="list-disc list-inside text-sm">
            {combo.tamales?.map((t) => (
              <li key={t.tamaleId}>
                {(t.tamale && (t.tamale.name || `${t.tamale.tamaleType} ${t.tamale.filling}`)) ||
                  `ID ${t.tamaleId}`} ×{t.quantity}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-2">
          <p className="font-semibold">Bebidas:</p>
          <ul className="list-disc list-inside text-sm">
            {combo.beverages?.map((b) => (
              <li key={b.beverageId}>
                {(b.beverage && formatBeverage(b.beverage)) || `ID ${b.beverageId}`} ×{b.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        {hasPermission('Combos.update') && (
          <button onClick={() => onEdit(combo.id)} className="text-blue-500 hover:text-blue-700">
            <PencilIcon className="h-5 w-5" />
          </button>
        )}
        {hasPermission('Combos.delete') && (
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
        {hasPermission('Combos.create') && (
          <button onClick={handleClone} className="text-green-500 hover:text-green-700">
            <DocumentDuplicateIcon className="h-5 w-5" />
          </button>
        )}
        {hasPermission('Combos.update') && (
          <button onClick={handleToggle} className="text-yellow-500 hover:text-yellow-700">
            <PowerIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ComboCard;
