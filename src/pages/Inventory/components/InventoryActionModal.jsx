import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
  registerInventoryEntry,
  registerInventoryExit,
  registerInventoryWaste,
} from '../../../services/inventoryService';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

const actionTitles = {
  entry: 'Registrar Entrada',
  exit: 'Registrar Salida',
  waste: 'Registrar Desperdicio',
};

const InventoryActionModal = ({ id, type, onClose, onSave }) => {
  const [payload, setPayload] = useState({ quantity: 0, reason: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === 'entry') {
        await registerInventoryEntry(id, payload);
      } else if (type === 'exit') {
        await registerInventoryExit(id, payload);
      } else if (type === 'waste') {
        await registerInventoryWaste(id, payload);
      }
      Swal.fire('Registrado', 'Operación realizada exitosamente', 'success');
      if (onSave) onSave();
    } catch (error) {
      Swal.fire('Error', 'No se pudo registrar la operación', 'error');
    }
  };

  return (
    <Modal
      title={actionTitles[type]}
      footer={
        <>
          <Button type="button" variant="secondary" icon={XMarkIcon} onClick={onClose}>
            Cancelar
          </Button>
          <Button form="inv-action-form" type="submit" icon={CheckIcon}>
            Guardar
          </Button>
        </>
      }
    >
      <form id="inv-action-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="quantity">Cantidad</label>
          <Input name="quantity" type="number" value={payload.quantity} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="reason">Razón</label>
          <Textarea name="reason" value={payload.reason} onChange={handleChange} required />
        </div>
      </form>
    </Modal>
  );
};

export default InventoryActionModal;
