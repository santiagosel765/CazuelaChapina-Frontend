import React from "react";
import { deleteProduct } from "../../../services/productService";
import Swal from "sweetalert2";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import IconButton from "../../../components/ui/IconButton";
import Table, { TableHeader, TableRow } from "../../../components/ui/Table";

const ProductList = ({ products = [], onEdit, onDelete }) => {
  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esto eliminará el producto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (res.isConfirmed) {
      await deleteProduct(id);
      onDelete(); // recargar productos desde el padre
      Swal.fire("Eliminado", "Producto eliminado exitosamente", "success");
    }
  };

  return (
    <div className="overflow-auto max-h-96 mt-6">
      <Table>
        <TableHeader>
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Precio</th>
            <th className="px-4 py-2 text-left">Stock</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </TableHeader>
        <tbody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <td className="px-4 py-2">{p.id}</td>
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">Q{p.price}</td>
              <td className="px-4 py-2">{p.stock}</td>
              <td className="px-4 py-2 flex gap-2 justify-end">
                <IconButton
                  icon={PencilSquareIcon}
                  label="Editar"
                  onClick={() => onEdit(p.id)}
                />
                <IconButton
                  icon={TrashIcon}
                  label="Eliminar"
                  className="text-red-600 hover:bg-red-50 focus:ring-red-500"
                  onClick={() => handleDelete(p.id)}
                />
              </td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductList;
