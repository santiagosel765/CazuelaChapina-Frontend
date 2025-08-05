import React, { useEffect, useState } from 'react';
import { createBeverage, getBeverage, updateBeverage } from '../../../services/beverageService';
import {
  beverageTypeService,
  beverageSizeService,
  sweetenerService,
  toppingService,
} from '../../../services/catalogServices';
import Swal from 'sweetalert2';

const BeverageModal = ({ id, onClose, onSave }) => {
  const [beverage, setBeverage] = useState({
    typeId: '',
    sizeId: '',
    sweetenerId: '',
    toppingIds: [],
    price: 0,
  });
  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sweeteners, setSweeteners] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    beverageTypeService.list().then(setTypes);
    beverageSizeService.list().then(setSizes);
    sweetenerService.list().then(setSweeteners);
    toppingService.list().then(setToppings);
    if (id) {
      getBeverage(id).then((res) => {
        const data = res.data || res;
        setBeverage({
          typeId: data.typeId,
          sizeId: data.sizeId,
          sweetenerId: data.sweetenerId,
          toppingIds: data.toppingIds || [],
          price: data.price,
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setBeverage({ ...beverage, [e.target.name]: e.target.value });
  };

  const handleToppingsChange = (e) => {
    const values = Array.from(e.target.options)
      .filter((o) => o.selected)
      .map((o) => o.value);
    setBeverage({ ...beverage, toppingIds: values });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (beverage.price <= 0) {
      Swal.fire('Error', 'El precio debe ser mayor que 0', 'error');
      return;
    }
    try {
      const payload = {
        typeId: Number(beverage.typeId),
        sizeId: Number(beverage.sizeId),
        sweetenerId: Number(beverage.sweetenerId),
        toppingIds: beverage.toppingIds.map(Number),
        price: Number(beverage.price),
      };
      if (id) {
        await updateBeverage(id, payload);
        Swal.fire('Actualizado', 'Bebida actualizada exitosamente', 'success');
      } else {
        await createBeverage(payload);
        Swal.fire('Creado', 'Bebida creada exitosamente', 'success');
      }
      setErrors({});
      onClose();
      if (onSave) onSave();
    } catch (error) {
      const backendErrors = error.response?.data?.errors || {};
      setErrors(backendErrors);
      Swal.fire('Error', error.response?.data?.message || 'No se pudo guardar la bebida', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          {id ? 'Editar Bebida' : 'Nueva Bebida'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="typeId">
              Tipo
            </label>
            <select
              name="typeId"
              value={beverage.typeId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Seleccione tipo</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.typeId && <p className="text-red-500 text-xs">{errors.typeId}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="sizeId">
              Tamaño
            </label>
            <select
              name="sizeId"
              value={beverage.sizeId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Seleccione tamaño</option>
              {sizes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.sizeId && <p className="text-red-500 text-xs">{errors.sizeId}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="sweetenerId">
              Edulcorante
            </label>
            <select
              name="sweetenerId"
              value={beverage.sweetenerId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Seleccione edulcorante</option>
              {sweeteners.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.sweetenerId && (
              <p className="text-red-500 text-xs">{errors.sweetenerId}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="toppingIds">
              Toppings
            </label>
            <select
              multiple
              name="toppingIds"
              value={beverage.toppingIds}
              onChange={handleToppingsChange}
              className="w-full border px-3 py-2 rounded h-32"
            >
              {toppings.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.toppingIds && (
              <p className="text-red-500 text-xs">{errors.toppingIds}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="price">
              Precio
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={beverage.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeverageModal;
