import React, { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import ProductModal from "./components/ProductModal";
import { getProducts } from "../../services/productService";
import Button from "../../components/ui/Button";
import { PlusIcon } from "@heroicons/react/24/outline";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener productos", error);
      setProducts([]); 
    }
  };  

  const handleEdit = (id) => {
    setSelectedProductId(id);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedProductId(null);
    setShowModal(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white rounded-md shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>
        <Button onClick={handleCreate} icon={PlusIcon}>
          Nuevo Producto
        </Button>

        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={fetchProducts}
        />

        {showModal && (
          <ProductModal
            id={selectedProductId}
            onClose={() => setShowModal(false)}
            onSave={() => {
              fetchProducts(); // Actualiza tabla
              setShowModal(false); // Cierra modal
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
