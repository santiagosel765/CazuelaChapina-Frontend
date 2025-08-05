import React, { useState } from 'react';
import { createBranch } from '../../../services/branchService';
import Swal from 'sweetalert2';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

const BranchModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({ name: '', address: '', manager: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBranch(form);
      await Swal.fire('Creada', 'Sucursal creada exitosamente', 'success');
      if (onSave) onSave();
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear la sucursal', 'error');
    }
  };

  return (
    <Modal
      title="Nueva Sucursal"
      footer={
        <>
          <Button type="button" variant="secondary" icon={XMarkIcon} onClick={onClose}>
            Cancelar
          </Button>
          <Button form="branch-form" type="submit" icon={CheckIcon}>
            Guardar
          </Button>
        </>
      }
    >
      <form id="branch-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <Input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <Input name="address" value={form.address} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gerente</label>
          <Input name="manager" value={form.manager} onChange={handleChange} />
        </div>
      </form>
    </Modal>
  );
};

export default BranchModal;
