import React, { useEffect, useState } from 'react';
import BeverageList from './components/BeverageList';
import BeverageModal from './components/BeverageModal';
import { getBeverages } from '../../services/beverageService';
import { useAuth } from '../../contexts/AuthContext';

const BebidasPage = () => {
  const [beverages, setBeverages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { hasPermission } = useAuth();

  const fetchBeverages = async () => {
    try {
      const data = await getBeverages();
      setBeverages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener bebidas', error);
      setBeverages([]);
    }
  };

  const handleEdit = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedId(null);
    setShowModal(true);
  };

  useEffect(() => {
    fetchBeverages();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Bebidas</h1>
      {hasPermission('Beverages.create') && (
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nueva Bebida
        </button>
      )}

      <BeverageList beverages={beverages} onEdit={handleEdit} onDelete={fetchBeverages} />

      {showModal && (
        <BeverageModal
          id={selectedId}
          onClose={() => setShowModal(false)}
          onSave={() => {
            fetchBeverages();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default BebidasPage;
