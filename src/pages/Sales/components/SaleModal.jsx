import React, { useEffect, useState } from 'react';
import { getTamales } from '../../../services/tamaleService';
import { getBeverages } from '../../../services/beverageService';
import { createSale } from '../../../services/salesService';
import { getCombos } from '../../../services/comboService';
import { saveSaleOffline } from '../../../utils/offlineSales';
import { formatBeverage } from '../../../utils/formatBeverage';
import Swal from 'sweetalert2';
import { TrashIcon, PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import IconButton from '../../../components/ui/IconButton';
import Modal from '../../../components/ui/Modal';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SaleModal = ({ onClose, onSaved }) => {
  const [tamales, setTamales] = useState([]);
  const [beverages, setBeverages] = useState([]);
  const [combos, setCombos] = useState([]);
  const [tamaleSel, setTamaleSel] = useState({ id: '', quantity: 1 });
  const [bevSel, setBevSel] = useState({ id: '', quantity: 1 });
  const [comboSel, setComboSel] = useState({ id: '', quantity: 1 });
  const [items, setItems] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [date, setDate] = useState(() => {
    const now = new Date();
    const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  });
  

  const getItemSubtotal = (item) => (item.price * item.quantity).toFixed(2);

  useEffect(() => {
    getTamales().then((d) => setTamales(Array.isArray(d) ? d : []));
    getBeverages().then((d) => setBeverages(Array.isArray(d) ? d : []));
    getCombos().then((d) =>
      setCombos(Array.isArray(d) ? d.filter((c) => c.isActive) : [])
    );
  }, []);

  const addTamale = () => {
    if (!tamaleSel.id) return;
    const tamale = tamales.find((t) => t.id === Number(tamaleSel.id));
    if (!tamale) return;
    setItems([
      ...items,
      {
        tamaleId: tamale.id,
        quantity: Number(tamaleSel.quantity),
        price: tamale.price,
        name: tamale.name || `${tamale.tamaleType} ${tamale.filling}`,
      },
    ]);
    setTamaleSel({ id: '', quantity: 1 });
  };

  const addBeverage = () => {
    if (!bevSel.id) return;
    const beverage = beverages.find((b) => b.id === Number(bevSel.id));
    if (!beverage) return;
    setItems([
      ...items,
      {
        beverageId: beverage.id,
        quantity: Number(bevSel.quantity),
        price: beverage.price,
        name: formatBeverage(beverage),
      },
    ]);
    setBevSel({ id: '', quantity: 1 });
  };

  const addCombo = () => {
    if (!comboSel.id) return;
    const combo = combos.find((c) => c.id === Number(comboSel.id));
    if (!combo) return;
    const comboKey = `${combo.id}-${Date.now()}`;
    const quantity = Number(comboSel.quantity);

    const comboItems = [];
    combo.tamales?.forEach((t) => {
      comboItems.push({
        tamaleId: t.tamaleId,
        quantity: t.quantity * quantity,
        price: t.tamale?.price ?? 0,
        name:
          (t.tamale &&
            (t.tamale.name || `${t.tamale.tamaleType} ${t.tamale.filling}`)) ||
          `ID ${t.tamaleId}`,
        comboId: comboKey,
      });
    });
    combo.beverages?.forEach((b) => {
      comboItems.push({
        beverageId: b.beverageId,
        quantity: b.quantity * quantity,
        price: b.beverage?.price ?? 0,
        name: (b.beverage && formatBeverage(b.beverage)) || `ID ${b.beverageId}`,
        comboId: comboKey,
      });
    });

    setItems([...items, ...comboItems]);
    setSelectedCombos([
      ...selectedCombos,
      {
        key: comboKey,
        comboId: combo.id,
        quantity,
        price: combo.total ?? combo.price,
      },
    ]);
    setComboSel({ id: '', quantity: 1 });
  };

  const removeItem = (idx) => {
    const item = items[idx];
    if (item.comboId) {
      setItems(items.filter((i) => i.comboId !== item.comboId));
      setSelectedCombos(selectedCombos.filter((c) => c.key !== item.comboId));
    } else {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  const totalItems = items
    .filter((i) => !i.comboId)
    .reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalCombos = selectedCombos.reduce(
    (sum, c) => sum + c.price * c.quantity,
    0
  );
  const total = totalItems + totalCombos;

  const handleSubmit = async (e) => {
    const localDate = new Date();
    localDate.setSeconds(0, 0);
    const isoLocal = localDate.toISOString();
    
    e.preventDefault();
    const sale = {
      branchId: 1,
      paymentMethod,
      date: isoLocal,
      items: items
        .filter((i) => !i.comboId)
        .map((i) =>
          i.tamaleId
            ? { tamaleId: i.tamaleId, quantity: i.quantity }
            : { beverageId: i.beverageId, quantity: i.quantity }
        ),
      combos: selectedCombos.map((c) => ({
        comboId: c.comboId,
        quantity: c.quantity,
      })),
    };
    try {
      await createSale(sale);
      Swal.fire('Éxito', 'Venta registrada', 'success');
      onSaved();
    } catch (err) {
      const message = err.response?.data?.message;
      if (message?.includes('Insufficient stock')) {
        const ingredient = message
          .replace('Insufficient stock for ', '')
          .replace(/\.$/, '');
        Swal.fire(
          'Error',
          `No se pudo completar la venta. Ingrediente faltante: ${ingredient}`,
          'error'
        );
      } else {
        await saveSaleOffline(sale);
        Swal.fire('Offline', 'Venta guardada offline', 'info');
        onSaved();
      }
    }
  };

  return (
    <Modal
      title="Nueva Venta"
      footer={
        <>
          <Button type="button" variant="secondary" icon={XMarkIcon} onClick={onClose}>
            Cancelar
          </Button>
          <Button form="sale-form" type="submit" icon={CheckIcon}>
            Guardar
          </Button>
        </>
      }
    >
      <form id="sale-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Tamales</h3>
          <div className="flex gap-2 mb-2">
            <Select
              value={tamaleSel.id}
              onChange={(e) => setTamaleSel({ ...tamaleSel, id: e.target.value })}
              className="w-full"
            >
              <option value="">Seleccionar tamal</option>
              {tamales.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name || `${t.tamaleType} ${t.filling}`}
                </option>
              ))}
            </Select>
            <Input
              type="number"
              min="1"
              value={tamaleSel.quantity}
              onChange={(e) => setTamaleSel({ ...tamaleSel, quantity: e.target.value })}
              className="w-24"
            />
            <Button type="button" icon={PlusIcon} onClick={addTamale}>
              Agregar
            </Button>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Bebidas</h3>
          <div className="flex gap-2 mb-2">
            <Select
              value={bevSel.id}
              onChange={(e) => setBevSel({ ...bevSel, id: e.target.value })}
              className="w-full"
            >
              <option value="">Seleccionar bebida</option>
              {beverages.map((b) => (
                <option key={b.id} value={b.id}>
                  {formatBeverage(b)}
                </option>
              ))}
            </Select>
            <Input
              type="number"
              min="1"
              value={bevSel.quantity}
              onChange={(e) => setBevSel({ ...bevSel, quantity: e.target.value })}
              className="w-24"
            />
            <Button type="button" icon={PlusIcon} onClick={addBeverage}>
              Agregar
            </Button>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Combos</h3>
          <div className="flex gap-2 mb-2">
            <Select
              value={comboSel.id}
              onChange={(e) =>
                setComboSel({ ...comboSel, id: e.target.value })
              }
              className="w-full"
            >
              <option value="">Seleccionar combo</option>
              {combos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - Q{Number(c.total ?? c.price).toFixed(2)}
                </option>
              ))}
            </Select>
            <Input
              type="number"
              min="1"
              value={comboSel.quantity}
              onChange={(e) =>
                setComboSel({ ...comboSel, quantity: e.target.value })
              }
              className="w-24"
            />
            <Button type="button" icon={PlusIcon} onClick={addCombo}>
              Agregar
            </Button>
          </div>
          {comboSel.id && (
            <p className="text-sm text-gray-600">
              {
                combos.find((c) => c.id === Number(comboSel.id))?.description
              }
            </p>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Items</h3>
          <ul className="space-y-1">
            {items.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>
                  {item.name} {item.comboId && '(combo)'} × {item.quantity} = Q
                  {getItemSubtotal(item)}
                </span>
                <IconButton
                  icon={TrashIcon}
                  label="Eliminar"
                  className="text-red-600 hover:bg-red-50 focus:ring-red-500"
                  onClick={() => removeItem(idx)}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Método de pago</label>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <Input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="font-semibold">Total: Q{total.toFixed(2)}</div>
      </form>
    </Modal>
  );
};

export default SaleModal;
