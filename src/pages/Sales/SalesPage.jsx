import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSales, syncSale } from '../../services/salesService';
import { getOfflineSales, deleteOfflineSale } from '../../utils/offlineSales';
import SaleList from './components/SaleList';
import SaleModal from './components/SaleModal';
import Swal from 'sweetalert2';

const SalesPage = () => {
  const { hasPermission } = useAuth();
  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchSales = async () => {
    try {
      const data = await getSales();
      setSales(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching sales', e);
      setSales([]);
    }
  };

  const handleSync = async () => {
    try {
      const offline = await getOfflineSales();
      if (!offline.length) {
        Swal.fire('Sin datos', 'No hay ventas offline para sincronizar', 'info');
        return;
      }
      for (const sale of offline) {
        const { id, ...payload } = sale;
        await syncSale(payload);
        await deleteOfflineSale(id);
      }
      Swal.fire('Sincronizado', 'Ventas offline sincronizadas', 'success');
      fetchSales();
    } catch (e) {
      console.error('Sync error', e);
      Swal.fire('Error', 'No se pudieron sincronizar todas las ventas', 'error');
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ventas</h1>
      <div className="flex gap-2 mb-4">
        {hasPermission('Sales.create') && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Nueva Venta
          </button>
        )}
        <button
          onClick={handleSync}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Sincronizar ventas offline
        </button>
      </div>
      <SaleList sales={sales} />
      {showModal && (
        <SaleModal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchSales();
          }}
        />
      )}
    </div>
  );
};

export default SalesPage;
