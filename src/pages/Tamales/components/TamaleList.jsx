import React from 'react';
import { deleteTamale } from '../../../services/tamaleService';
import Swal from 'sweetalert2';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../../contexts/AuthContext';
import IconButton from '../../../components/ui/IconButton';
import Table, { TableHeader, TableRow } from '../../../components/ui/Table';

const TamaleList = ({ tamales = [], onEdit, onDelete }) => {
  const { hasPermission } = useAuth();

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esto eliminará el tamal!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (res.isConfirmed) {
      await deleteTamale(id);
      onDelete();
      Swal.fire('Eliminado', 'Tamal eliminado exitosamente', 'success');
    }
  };

  return (
    <div className="overflow-auto max-h-96 mt-6">
      <Table>
        <TableHeader>
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">Relleno</th>
            <th className="px-4 py-2 text-left">Envoltura</th>
            <th className="px-4 py-2 text-left">Picante</th>
            <th className="px-4 py-2 text-left">Precio</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </TableHeader>
        <tbody>
          {tamales.map((t) => (
            <TableRow key={t.id}>
              <td className="px-4 py-2">{t.id}</td>
              <td className="px-4 py-2">{t.name || `${t.tamaleType} ${t.filling}`}</td>
              <td className="px-4 py-2">{t.tamaleType}</td>
              <td className="px-4 py-2">{t.filling}</td>
              <td className="px-4 py-2">{t.wrapper}</td>
              <td className="px-4 py-2">{t.spiceLevel}</td>
              <td className="px-4 py-2">Q{t.price}</td>
              <td className="px-4 py-2 flex gap-2">
                {hasPermission('Tamales.update') && (
                  <IconButton
                    icon={PencilIcon}
                    label="Editar"
                    className="text-blue-500 hover:bg-blue-50 focus:ring-blue-500"
                    onClick={() => onEdit(t.id)}
                  />
                )}
                {hasPermission('Tamales.delete') && (
                  <IconButton
                    icon={TrashIcon}
                    label="Eliminar"
                    className="text-red-500 hover:bg-red-50 focus:ring-red-500"
                    onClick={() => handleDelete(t.id)}
                  />
                )}
              </td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TamaleList;
