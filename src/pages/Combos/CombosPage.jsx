import React, { useEffect, useState } from 'react';
import { getCombos } from '../../services/comboService';
import ComboCard from './components/ComboCard';
import ComboModal from './components/ComboModal';
import { useAuth } from '../../contexts/AuthContext';

const CombosPage = () => {
  const [combos, setCombos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { hasPermission } = useAuth();

  const fetchCombos = async () => {
    try {
      const data = await getCombos();
      setCombos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener combos', error);
      setCombos([]);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const handleEdit = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedId(null);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Combos</h1>
      {hasPermission('Combos.create') && (
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo Combo
        </button>
      )}
      <div className="grid gap-4 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {combos.map((combo) => (
          <ComboCard key={combo.id} combo={combo} onEdit={handleEdit} onRefresh={fetchCombos} />
        ))}
      </div>
      {showModal && (
        <ComboModal
          id={selectedId}
          onClose={() => setShowModal(false)}
          onSave={() => {
            fetchCombos();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CombosPage;
