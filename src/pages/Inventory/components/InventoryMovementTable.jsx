import React, { useEffect, useState } from 'react';
import { getRecentInventoryEntries } from '../../../services/inventoryService';
import Table, { TableHeader, TableRow } from '../../../components/ui/Table';

const operationTypeLabels = {
  0: 'Entrada',
  1: 'Salida',
  2: 'Merma',
};

const InventoryMovementTable = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getRecentInventoryEntries();
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => new Date(b.date) - new Date(a.date))
          : [];
        setEntries(sorted);
      } catch (error) {
        console.error('Error al obtener movimientos de inventario', error);
        setEntries([]);
      }
    };

    fetchEntries();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('es-MX', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Últimos movimientos</h2>
      <div className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Movimiento</th>
              <th className="px-4 py-2 text-left">Cantidad</th>
              <th className="px-4 py-2 text-left">Insumo</th>
              <th className="px-4 py-2 text-left">Usuario</th>
            </tr>
          </TableHeader>
          <tbody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <td className="px-4 py-2">{entry.id}</td>
                <td className="px-4 py-2">{formatDate(entry.date)}</td>
                <td className="px-4 py-2">
                  {operationTypeLabels[entry.operationType] || 'Desconocido'}
                </td>
                <td className="px-4 py-2">{entry.quantity}</td>
                <td className="px-4 py-2">{entry.itemName}</td>
                <td className="px-4 py-2">{entry.registeredBy}</td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryMovementTable;
