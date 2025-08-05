import React, { useEffect, useState } from 'react';
import BranchList from './components/BranchList';
import BranchModal from './components/BranchModal';
import { getBranches } from '../../services/branchService';
import { useAuth } from '../../contexts/AuthContext';

const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { hasPermission } = useAuth();

  const fetchBranches = async () => {
    try {
      const data = await getBranches();
      setBranches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener sucursales', error);
      setBranches([]);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Sucursales</h1>
      {hasPermission('Sales.create') && (
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nueva Sucursal
        </button>
      )}
      <BranchList branches={branches} refresh={fetchBranches} />
      {showModal && (
        <BranchModal
          onClose={() => setShowModal(false)}
          onSave={() => {
            fetchBranches();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default BranchesPage;
