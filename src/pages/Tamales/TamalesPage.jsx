import React, { useEffect, useState } from 'react';
import TamaleList from './components/TamaleList';
import TamaleModal from './components/TamaleModal';
import { getTamales } from '../../services/tamaleService';
import { useAuth } from '../../contexts/AuthContext';

const TamalesPage = () => {
  const [tamales, setTamales] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { hasPermission } = useAuth();

  const fetchTamales = async () => {
    try {
      const data = await getTamales();
      setTamales(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener tamales', error);
      setTamales([]);
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
    fetchTamales();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Tamales</h1>
      {hasPermission('Tamales.create') && (
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo Tamal
        </button>
      )}

      <TamaleList tamales={tamales} onEdit={handleEdit} onDelete={fetchTamales} />

      {showModal && (
        <TamaleModal
          id={selectedId}
          onClose={() => setShowModal(false)}
          onSave={() => {
            fetchTamales();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default TamalesPage;
