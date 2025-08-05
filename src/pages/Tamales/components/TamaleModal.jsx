import React, { useEffect, useState } from 'react';
import { createTamale, getTamale, updateTamale } from '../../../services/tamaleService';
import {
  tamaleTypeService,
  fillingService,
  wrapperService,
  spiceLevelService,
} from '../../../services/catalogServices';
import Swal from 'sweetalert2';
import Modal from '../../../components/ui/Modal';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

const TamaleModal = ({ id, onClose, onSave }) => {
  const [tamale, setTamale] = useState({
    tamaleTypeId: '',
    fillingId: '',
    wrapperId: '',
    spiceLevelId: '',
    price: 0,
  });
  const [types, setTypes] = useState([]);
  const [fillings, setFillings] = useState([]);
  const [wrappers, setWrappers] = useState([]);
  const [spiceLevels, setSpiceLevels] = useState([]);

  useEffect(() => {
    tamaleTypeService.list().then(setTypes);
    fillingService.list().then(setFillings);
    wrapperService.list().then(setWrappers);
    spiceLevelService.list().then(setSpiceLevels);
    if (id) {
      getTamale(id).then((res) =>
        setTamale({
          tamaleTypeId: res.data.tamaleTypeId,
          fillingId: res.data.fillingId,
          wrapperId: res.data.wrapperId,
          spiceLevelId: res.data.spiceLevelId,
          price: res.data.price,
        })
      );
    }
  }, [id]);

  const handleChange = (e) => {
    setTamale({ ...tamale, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tamale.price <= 0) {
      Swal.fire('Error', 'El precio debe ser mayor que 0', 'error');
      return;
    }
    try {
      const payload = {
        tamaleTypeId: tamale.tamaleTypeId,
        fillingId: tamale.fillingId,
        wrapperId: tamale.wrapperId,
        spiceLevelId: tamale.spiceLevelId,
        price: tamale.price,
      };
      if (id) {
        await updateTamale(id, payload);
        Swal.fire('Actualizado', 'Tamal actualizado exitosamente', 'success');
      } else {
        await createTamale(payload);
        Swal.fire('Creado', 'Tamal creado exitosamente', 'success');
      }
      onClose();
      if (onSave) onSave();
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el tamal', 'error');
    }
  };

  return (
    <Modal
      title={id ? 'Editar Tamal' : 'Nuevo Tamal'}
      footer={
        <>
          <Button type="button" variant="secondary" icon={XMarkIcon} onClick={onClose}>
            Cancelar
          </Button>
          <Button form="tamale-form" type="submit" icon={CheckIcon}>
            Guardar
          </Button>
        </>
      }
    >
      <form id="tamale-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="tamaleTypeId">
            Tipo
          </label>
          <Select
            name="tamaleTypeId"
            value={tamale.tamaleTypeId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione tipo</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="fillingId">
            Relleno
          </label>
          <Select
            name="fillingId"
            value={tamale.fillingId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione relleno</option>
            {fillings.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="wrapperId">
            Envoltura
          </label>
          <Select
            name="wrapperId"
            value={tamale.wrapperId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione envoltura</option>
            {wrappers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="spiceLevelId">
            Picante
          </label>
          <Select
            name="spiceLevelId"
            value={tamale.spiceLevelId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione picante</option>
            {spiceLevels.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="price">
            Precio
          </label>
          <Input
            name="price"
            type="number"
            step="0.01"
            value={tamale.price}
            onChange={handleChange}
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default TamaleModal;
