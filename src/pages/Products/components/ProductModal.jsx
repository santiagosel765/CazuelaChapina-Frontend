import React, { useEffect, useState } from "react";
import { createProduct, getProduct, updateProduct } from "../../../services/productService";
import Swal from "sweetalert2";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

const ProductModal = ({ id, onClose, onSave }) => {
  const [product, setProduct] = useState({ name: "", price: 0, stock: 0 });

  useEffect(() => {
    if (id) {
      getProduct(id).then((res) => setProduct(res.data));
    }
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateProduct(id, product);
        Swal.fire("Actualizado", "Producto actualizado exitosamente", "success");
      } else {
        await createProduct(product);
        Swal.fire("Creado", "Producto creado exitosamente", "success");
      }
      onClose();     // cierra modal
      if (onSave) onSave(); // recarga tabla
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    }
  };

  return (
    <Modal
      title={id ? "Editar Producto" : "Nuevo Producto"}
      footer={
        <>
          <Button type="button" variant="secondary" icon={XMarkIcon} onClick={onClose}>
            Cancelar
          </Button>
          <Button form="product-form" type="submit" icon={CheckIcon}>
            Guardar
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Nombre</label>
          <Input
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="price">Precio</label>
          <Input
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            placeholder="Precio"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="stock">Stock</label>
          <Input
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleChange}
            placeholder="Stock"
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;
