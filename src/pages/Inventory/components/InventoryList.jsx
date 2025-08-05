import React from 'react';
import { ArrowDownCircleIcon, ArrowUpCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../../contexts/AuthContext';
import IconButton from '../../../components/ui/IconButton';
import Table, { TableHeader, TableRow } from '../../../components/ui/Table';

const InventoryList = ({ items = [], onEntry, onExit, onWaste }) => {
  const { hasPermission } = useAuth();

  return (
    <div className="overflow-auto max-h-96 mt-6">
      <Table>
        <TableHeader>
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Stock</th>
            <th className="px-4 py-2 text-left">Costo</th>
            <th className="px-4 py-2 text-left">Crítico</th>
            {hasPermission('Inventory.update') && <th className="px-4 py-2 text-left">Acciones</th>}
          </tr>
        </TableHeader>
        <tbody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <td className="px-4 py-2">{item.id}</td>
              <td className="px-4 py-2">{item.name}</td>
              <td className={`px-4 py-2 ${item.isCritical ? 'text-red-600 font-bold' : ''}`}>{item.stock}</td>
              <td className="px-4 py-2">Q{item.unitCost}</td>
              <td className="px-4 py-2">{item.isCritical ? 'Sí' : 'No'}</td>
              {hasPermission('Inventory.update') && (
                <td className="px-4 py-2 flex gap-2">
                  <IconButton
                    icon={ArrowDownCircleIcon}
                    label="Entrada"
                    className="text-green-600 hover:bg-green-50 focus:ring-green-500"
                    onClick={() => onEntry(item.id)}
                  />
                  <IconButton
                    icon={ArrowUpCircleIcon}
                    label="Salida"
                    className="text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
                    onClick={() => onExit(item.id)}
                  />
                  <IconButton
                    icon={XCircleIcon}
                    label="Merma"
                    className="text-red-600 hover:bg-red-50 focus:ring-red-500"
                    onClick={() => onWaste(item.id)}
                  />
                </td>
              )}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default InventoryList;
