import React from 'react';
import { assignManager, getBranchReport } from '../../../services/branchService';
import Swal from 'sweetalert2';
import { UserPlusIcon, ClipboardDocumentIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../../contexts/AuthContext';
import IconButton from '../../../components/ui/IconButton';
import Table, { TableHeader, TableRow } from '../../../components/ui/Table';

const BranchList = ({ branches = [], refresh }) => {
  const { hasPermission } = useAuth();

  const handleAssign = async (branchId) => {
    const { value: userId } = await Swal.fire({
      title: 'Asignar Encargado',
      input: 'text',
      inputLabel: 'ID de usuario',
      showCancelButton: true,
      confirmButtonText: 'Asignar',
      cancelButtonText: 'Cancelar'
    });

    if (userId) {
      try {
        await assignManager(branchId, userId);
        await Swal.fire('Asignado', 'Encargado asignado exitosamente', 'success');
        if (refresh) refresh();
      } catch (error) {
        Swal.fire('Error', 'No se pudo asignar el encargado', 'error');
      }
    }
  };

  const handleReport = async (branchId) => {
    try {
      const res = await getBranchReport(branchId);
      const data = res.data || res;
      Swal.fire(
        'Reporte de Ventas',
        `Sucursal: ${data.branchName}\nVentas: ${data.salesCount}\nTotal: Q${data.totalAmount}`,
        'info'
      );
    } catch (error) {
      Swal.fire('Error', 'No se pudo obtener el reporte', 'error');
    }
  };

  return (
    <div className="overflow-auto max-h-96 mt-6">
      <Table>
        <TableHeader>
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Dirección</th>
            <th className="px-4 py-2 text-left">Encargado</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </TableHeader>
        <tbody>
          {branches.map((b) => (
            <TableRow key={b.id}>
              <td className="px-4 py-2">{b.id}</td>
              <td className="px-4 py-2">{b.name}</td>
              <td className="px-4 py-2">{b.address}</td>
              <td className="px-4 py-2">{b.manager}</td>
              <td className="px-4 py-2 flex gap-2">
                {hasPermission('Sales.update') && (
                  <IconButton
                    icon={UserPlusIcon}
                    label="Asignar"
                    className="text-blue-500 hover:bg-blue-50 focus:ring-blue-500"
                    onClick={() => handleAssign(b.id)}
                  />
                )}
                {hasPermission('Sales.view') && (
                  <IconButton
                    icon={ClipboardDocumentIcon}
                    label="Reporte"
                    className="text-green-500 hover:bg-green-50 focus:ring-green-500"
                    onClick={() => handleReport(b.id)}
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

export default BranchList;
