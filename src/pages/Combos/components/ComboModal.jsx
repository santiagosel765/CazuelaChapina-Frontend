import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  createCombo,
  updateCombo,
  getCombo
} from '../../../services/comboService';
import { getTamales } from '../../../services/tamaleService';
import { getBeverages } from '../../../services/beverageService';
import { formatBeverage } from '../../../utils/formatBeverage';

const seasons = [
  { id: 1, name: 'Invierno' },
  { id: 2, name: 'Primavera' },
  { id: 3, name: 'Verano' },
  { id: 4, name: 'Otoño' }
];

const ComboModal = ({ id, onClose, onSave }) => {
  const [combo, setCombo] = useState({
    name: '',
    description: '',
    season: '',
    isActive: true,
    isEditable: true,
    tamales: [{ tamaleId: '', quantity: 1 }],
    beverages: [{ beverageId: '', quantity: 1 }]
  });
  const [tamales, setTamales] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getTamales().then((data) => setTamales(Array.isArray(data) ? data : []));
    getBeverages().then((data) => setBebidas(Array.isArray(data) ? data : []));
    if (id) {
      getCombo(id).then((res) => {
        const c = res.data || res;
        setCombo({
          name: c.name,
          description: c.description,
          season: c.seasonId || c.season || '',
          isActive: c.isActive,
          isEditable: c.isEditable,
          tamales:
            c.tamales?.map((t) => ({ tamaleId: t.tamaleId, quantity: t.quantity })) || [
              { tamaleId: '', quantity: 1 }
            ],
          beverages:
            c.beverages?.map((b) => ({ beverageId: b.beverageId, quantity: b.quantity })) || [
              { beverageId: '', quantity: 1 }
            ]
        });
      });
    }
  }, [id]);

  useEffect(() => {
    let sum = 0;
    combo.tamales.forEach((t) => {
      const item = tamales.find((tm) => tm.id === Number(t.tamaleId));
      if (item) sum += Number(t.quantity) * (item.price || 0);
    });
    combo.beverages.forEach((b) => {
      const item = bebidas.find((be) => be.id === Number(b.beverageId));
      if (item) sum += Number(b.quantity) * (item.price || 0);
    });
    setTotal(sum);
  }, [combo, tamales, bebidas]);

  const handleChange = (e) => {
    setCombo({ ...combo, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  };

  const handleTamaleChange = (index, field, value) => {
    const newTamales = [...combo.tamales];
    newTamales[index][field] = value;
    setCombo({ ...combo, tamales: newTamales });
  };

  const handleBeverageChange = (index, field, value) => {
    const newBeverages = [...combo.beverages];
    newBeverages[index][field] = value;
    setCombo({ ...combo, beverages: newBeverages });
  };

  const addTamale = () =>
    setCombo({ ...combo, tamales: [...combo.tamales, { tamaleId: '', quantity: 1 }] });
  const removeTamale = (index) => {
    const newTamales = combo.tamales.filter((_, i) => i !== index);
    setCombo({
      ...combo,
      tamales: newTamales.length ? newTamales : [{ tamaleId: '', quantity: 1 }]
    });
  };

  const addBebida = () =>
    setCombo({ ...combo, beverages: [...combo.beverages, { beverageId: '', quantity: 1 }] });
  const removeBebida = (index) => {
    const newBebidas = combo.beverages.filter((_, i) => i !== index);
    setCombo({
      ...combo,
      beverages: newBebidas.length ? newBebidas : [{ beverageId: '', quantity: 1 }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: combo.name,
        description: combo.description,
        season: Number(combo.season),
        isActive: combo.isActive,
        isEditable: combo.isEditable,
        price: total,
        total,
        tamales: combo.tamales.map((t) => ({
          tamaleId: Number(t.tamaleId),
          quantity: Number(t.quantity)
        })),
        beverages: combo.beverages.map((b) => ({
          beverageId: Number(b.beverageId),
          quantity: Number(b.quantity)
        }))
      };
      if (id) {
        await updateCombo(id, payload);
        Swal.fire('Actualizado', 'Combo actualizado exitosamente', 'success');
      } else {
        await createCombo(payload);
        Swal.fire('Creado', 'Combo creado exitosamente', 'success');
      }
      onClose();
      if (onSave) onSave();
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el combo', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-full">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          {id ? 'Editar Combo' : 'Nuevo Combo'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={combo.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              Descripción
            </label>
            <textarea
              name="description"
              value={combo.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="season">
              Temporada
            </label>
            <select
              name="season"
              value={combo.season}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Seleccione temporada</option>
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tamales</label>
            <div className="space-y-2">
              {combo.tamales.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={t.tamaleId}
                    onChange={(e) => handleTamaleChange(i, 'tamaleId', e.target.value)}
                    className="flex-1 border px-2 py-1 rounded"
                    required
                  >
                    <option value="">Seleccione tamal</option>
                    {tamales.map((tm) => (
                      <option key={tm.id} value={tm.id}>
                        {tm.name || `${tm.tamaleType} ${tm.filling}`}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={t.quantity}
                    onChange={(e) => handleTamaleChange(i, 'quantity', e.target.value)}
                    className="w-20 border px-2 py-1 rounded"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeTamale(i)}
                    className="text-red-500 px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={addTamale} className="text-blue-500 text-sm">
                + Agregar tamal
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bebidas</label>
            <div className="space-y-2">
              {combo.beverages.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={b.beverageId}
                    onChange={(e) => handleBeverageChange(i, 'beverageId', e.target.value)}
                    className="flex-1 border px-2 py-1 rounded"
                    required
                  >
                    <option value="">Seleccione bebida</option>
                    {bebidas.map((be) => (
                      <option key={be.id} value={be.id}>
                        {formatBeverage(be)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={b.quantity}
                    onChange={(e) => handleBeverageChange(i, 'quantity', e.target.value)}
                    className="w-20 border px-2 py-1 rounded"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeBebida(i)}
                    className="text-red-500 px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={addBebida} className="text-blue-500 text-sm">
                + Agregar bebida
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={combo.isActive}
                  onChange={handleChange}
                />
                Activo
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isEditable"
                  checked={combo.isEditable}
                  onChange={handleChange}
                />
                Editable
              </label>
            </div>
            <span className="font-bold">Total: Q{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
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

export default ComboModal;
