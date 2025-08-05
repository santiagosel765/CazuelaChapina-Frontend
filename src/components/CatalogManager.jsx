import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Button from './ui/Button';
import IconButton from './ui/IconButton';
import Input from './ui/Input';
import Modal from './ui/Modal';
import Table, { TableHeader, TableRow } from './ui/Table';
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const CatalogManager = ({ title, columns = [], fields = [], service }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({});

  const allColumns = columns.some((c) => c.field === 'id')
    ? columns
    : [{ field: 'id', headerName: 'ID' }, ...columns];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await service.list();
      setItems(Array.isArray(data) ? data : data?.data || []);
    } catch (e) {
      console.error('Error fetching', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item = null) => {
    setCurrent(item);
    if (item) {
      setForm(fields.reduce((acc, f) => ({ ...acc, [f.name]: item[f.name] ?? '' }), {}));
    } else {
      setForm(fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {}));
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (current) {
        await service.update(current.id, form);
        Swal.fire('Actualizado', `${title} actualizado`, 'success');
      } else {
        await service.create(form);
        Swal.fire('Creado', `${title} creado`, 'success');
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo guardar', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await service.remove(id);
        Swal.fire('Eliminado', '', 'success');
        fetchItems();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    }
  };

  const filtered = items.filter((item) =>
    columns.some((c) => `${item[c.field]}`.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 bg-white rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button onClick={() => openModal()} icon={PlusIcon}>
          Agregar
        </Button>
      </div>
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="pl-10 w-full md:w-1/3"
        />
      </div>
      <div className="overflow-auto max-h-96">
        <Table>
          <TableHeader>
            <tr>
              {allColumns.map((col) => (
                <th
                  key={col.field}
                  className="px-4 py-2 text-left font-medium text-gray-700"
                >
                  {col.headerName}
                </th>
              ))}
              <th className="px-4 py-2 text-right font-medium text-gray-700">
                Acciones
              </th>
            </tr>
          </TableHeader>
          <tbody>
            {loading ? (
              <TableRow>
                <td colSpan={allColumns.length + 1} className="text-center p-4">
                  Cargando...
                </td>
              </TableRow>
            ) : filtered.length ? (
              filtered.map((item) => (
                <TableRow key={item.id}>
                  {allColumns.map((col) => (
                    <td key={col.field} className="px-4 py-2">
                      {item[col.field]}
                    </td>
                  ))}
                  <td className="px-4 py-2 flex gap-2 justify-end">
                    <IconButton
                      icon={PencilSquareIcon}
                      label="Editar"
                      onClick={() => openModal(item)}
                    />
                    <IconButton
                      icon={TrashIcon}
                      label="Eliminar"
                      className="text-red-600 hover:bg-red-50 focus:ring-red-500"
                      onClick={() => handleDelete(item.id)}
                    />
                  </td>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td colSpan={allColumns.length + 1} className="text-center p-4">
                  Sin registros
                </td>
              </TableRow>
            )}
          </tbody>
        </Table>
      </div>
      {showModal && (
        <Modal
          title={`${current ? 'Editar' : 'Agregar'} ${title}`}
          footer={
            <>
              <Button
                type="button"
                variant="secondary"
                icon={XMarkIcon}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button form="catalog-form" type="submit" icon={CheckIcon}>
                Guardar
              </Button>
            </>
          }
        >
          <form id="catalog-form" onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name} className="space-y-1">
                <label className="block text-sm font-medium" htmlFor={f.name}>
                  {f.label}
                </label>
                <Input
                  id={f.name}
                  name={f.name}
                  type={f.type || 'text'}
                  required={f.required}
                  value={form[f.name]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CatalogManager;
