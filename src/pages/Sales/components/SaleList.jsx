import React from 'react';
import Table, { TableHeader, TableRow } from '../../../components/ui/Table';

const SaleList = ({ sales = [] }) => (
  <div className="overflow-auto max-h-96">
    <Table>
      <TableHeader>
        <tr>
          <th className="px-4 py-2 text-left">ID</th>
          <th className="px-4 py-2 text-left">Fecha</th>
          <th className="px-4 py-2 text-left">Total</th>
          <th className="px-4 py-2 text-left">Método de pago</th>
        </tr>
      </TableHeader>
      <tbody>
        {sales.map((s) => (
          <TableRow key={s.id}>
            <td className="px-4 py-2">{s.id}</td>
            <td className="px-4 py-2">
              {new Date(s.date).toLocaleString('es-GT', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </td>
            <td className="px-4 py-2">Q{s.total}</td>
            <td className="px-4 py-2">{s.paymentMethod}</td>
          </TableRow>
        ))}
      </tbody>
    </Table>
  </div>
);

export default SaleList;
