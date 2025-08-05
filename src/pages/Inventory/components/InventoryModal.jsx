import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createInventoryItem } from '../../../services/inventoryService';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

const InventoryModal = ({ onClose, onSave }) => {
  const [item, setItem] = useState({ name: '', stock: 0, unitCost: 0, isCritical: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItem((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInventoryItem(item);
      Swal.fire('Creado', 'Insumo creado exitosamente', 'success');
      if (onSave) onSave();
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el insumo', 'error');
    }
  };

  return (
    <Modal
      title="Nuevo Insumo"
      footer={
        <>
          <Button type="button" variant="secondary" icon={XMarkIcon} onClick={onClose}>
            Cancelar
          </Button>
          <Button form="inventory-form" type="submit" icon={CheckIcon}>
            Guardar
          </Button>
        </>
      }
    >
      <form id="inventory-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Nombre</label>
          <Input name="name" value={item.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="stock">Existencias</label>
          <Input name="stock" type="number" value={item.stock} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="unitCost">Costo Unitario</label>
          <Input name="unitCost" type="number" step="0.01" value={item.unitCost} onChange={handleChange} required />
        </div>
        <div className="flex items-center gap-2">
          <input id="isCritical" name="isCritical" type="checkbox" checked={item.isCritical} onChange={handleChange} />
          <label htmlFor="isCritical" className="text-sm">Crítico</label>
        </div>
      </form>
    </Modal>
  );
};

export default InventoryModal;
