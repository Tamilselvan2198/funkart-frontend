"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";

import {
  Product,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "@/lib/adminProductApi";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // FORM
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [saving, setSaving] = useState(false);

  // =====================================
  // LOAD PRODUCTS
  // =====================================

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getAdminProducts();

      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // =====================================
  // OPEN ADD
  // =====================================

  const openAddModal = () => {
    setEditingProduct(null);

    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setBrand("");
    setRating("");

    setImage(null);
    setImagePreview("");

    setShowModal(true);
  };

  // =====================================
  // OPEN EDIT
  // =====================================

  const openEditModal = (product: Product) => {
    setEditingProduct(product);

    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setQuantity(String(product.quantity));
    setCategory(product.category);
    setBrand(product.brand);
    setRating(String(product.rating));

    setImage(null);
    setImagePreview(product.imageUrl);

    setShowModal(true);
  };

  // =====================================
  // IMAGE CHANGE
  // =====================================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);

    const preview = URL.createObjectURL(file);

    setImagePreview(preview);
  };

  // =====================================
  // SAVE PRODUCT
  // =====================================

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!description.trim()) {
      alert("Description is required");
      return;
    }

    if (!price || Number(price) < 0) {
      alert("Enter a valid price");
      return;
    }

    if (!quantity || Number(quantity) < 0) {
      alert("Enter a valid quantity");
      return;
    }

    if (!category.trim()) {
      alert("Category is required");
      return;
    }

    if (!brand.trim()) {
      alert("Brand is required");
      return;
    }

    if (!rating || Number(rating) < 0 || Number(rating) > 5) {
      alert("Rating must be between 0 and 5");
      return;
    }

    // Image required only for CREATE
    if (!editingProduct && !image) {
      alert("Product image is required");
      return;
    }

    try {
      setSaving(true);

      // =================================
      // CREATE
      // =================================

      if (!editingProduct) {
        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("category", category);
        formData.append("brand", brand);
        formData.append("rating", rating);

        if (image) {
          formData.append("image", image);
        }

        await createAdminProduct(formData);
      }

      // =================================
      // UPDATE
      // =================================
      else {
        await updateAdminProduct(editingProduct.id, {
          name,
          description,
          price: Number(price),
          quantity: Number(quantity),
          category,
          brand,
          rating: Number(rating),
          imageUrl: editingProduct.imageUrl,
        });
      }

      setShowModal(false);

      await loadProducts();
    } catch (error) {
      console.error("Failed to save product:", error);

      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // DELETE
  // =====================================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminProduct(id);

      await loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);

      alert("Failed to delete product");
    }
  };

  // =====================================
  // SEARCH
  // =====================================

  const filteredProducts = products.filter((product) => {
    const value = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(value) ||
      product.brand.toLowerCase().includes(value) ||
      product.category.toLowerCase().includes(value)
    );
  });

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* SIDEBAR */}

        <Sidebar showFilters={false} />

        {/* MAIN */}

        <main className="flex-1 min-w-0 p-6">
          {/* HEADER */}

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Management
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage Funkart products
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              + Add Product
            </button>
          </div>

          {/* SEARCH */}

          <div className="bg-white border rounded-xl p-4 mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* TABLE */}

          <div className="bg-white border rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-gray-500">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No products found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold">
                        Product
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold">
                        Brand
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold">
                        Category
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold">
                        Price
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold">
                        Stock
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold">
                        Rating
                      </th>

                      <th className="text-right px-6 py-4 text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-t hover:bg-gray-50"
                      >
                        {/* PRODUCT */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover border"
                            />

                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>

                              <p className="text-xs text-gray-500">
                                ID: {product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* BRAND */}

                        <td className="px-6 py-4">{product.brand}</td>

                        {/* CATEGORY */}

                        <td className="px-6 py-4">{product.category}</td>

                        {/* PRICE */}

                        <td className="px-6 py-4 font-medium">
                          ₹{product.price.toLocaleString("en-IN")}
                        </td>

                        {/* STOCK */}

                        <td className="px-6 py-4">
                          <span
                            className={
                              product.quantity > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {product.quantity}
                          </span>
                        </td>

                        {/* RATING */}

                        <td className="px-6 py-4">⭐ {product.rating}</td>

                        {/* ACTIONS */}

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-100"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(product.id)}
                              className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NAME */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product name"
                  className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* BRAND */}

              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>

                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Brand"
                  className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category"
                  className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* PRICE */}

              <div>
                <label className="block text-sm font-medium mb-1">Price</label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  min="0"
                  className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* QUANTITY */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantity
                </label>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantity"
                  min="0"
                  className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* RATING */}

              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>

                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="0 - 5"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description"
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* IMAGE */}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Product Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* PREVIEW */}

              {imagePreview && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium mb-2">Image Preview</p>

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
