import React, { useEffect, useState } from 'react';
import InventoryList from './components/InventoryList';
import InventoryModal from './components/InventoryModal';
import InventoryActionModal from './components/InventoryActionModal';
import InventoryMovementTable from './components/InventoryMovementTable';
import { getInventoryItems } from '../../services/inventoryService';
import { useAuth } from '../../contexts/AuthContext';

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [action, setAction] = useState({ type: '', id: null });
  const { hasPermission } = useAuth();

  const fetchItems = async () => {
    try {
      const data = await getInventoryItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener inventario', error);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAction = (type, id) => {
    setAction({ type, id });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Inventario</h1>
      {hasPermission('Inventory.update') && (
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo Insumo
        </button>
      )}
      <InventoryList
        items={items}
        onEntry={(id) => handleAction('entry', id)}
        onExit={(id) => handleAction('exit', id)}
        onWaste={(id) => handleAction('waste', id)}
      />
      <InventoryMovementTable />
      {showCreate && (
        <InventoryModal
          onClose={() => setShowCreate(false)}
          onSave={() => {
            fetchItems();
            setShowCreate(false);
          }}
        />
      )}
      {action.id && (
        <InventoryActionModal
          id={action.id}
          type={action.type}
          onClose={() => setAction({ type: '', id: null })}
          onSave={() => {
            fetchItems();
            setAction({ type: '', id: null });
          }}
        />
      )}
    </div>
  );
};

export default InventoryPage;
