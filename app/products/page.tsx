"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useSnackbar } from "@/app/components/SnackbarProvider";
import Sidebar from "../components/Sidebar";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  rating: number | null;
  stock: number;
  quantity?: number;
  image: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await apiFetch("/products");

      const formattedProducts = data.map((product: any) => ({
        ...product,

        // Backend uses quantity
        stock: product.stock ?? product.quantity ?? 0,

        // Backend returns imageUrl
        image: product.image ?? product.imageUrl ?? "",

        rating:
          product.rating !== null && product.rating !== undefined
            ? Number(product.rating)
            : null,

        brand: product.brand ?? "",
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  const brands = [
    ...new Set(products.map((product) => product.brand).filter(Boolean)),
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = !category || product.category === category;

      const matchesBrand = !brand || product.brand === brand;

      let matchesPrice = true;

      if (price === "under10") {
        matchesPrice = product.price < 10000;
      }

      if (price === "10to50") {
        matchesPrice = product.price >= 10000 && product.price <= 50000;
      }

      if (price === "50to100") {
        matchesPrice = product.price > 50000 && product.price <= 100000;
      }

      if (price === "above100") {
        matchesPrice = product.price > 100000;
      }

      let matchesRating = true;

      if (rating) {
        matchesRating =
          product.rating !== null && product.rating >= Number(rating);
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesPrice &&
        matchesRating
      );
    });
  }, [products, search, category, brand, price, rating]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setPrice("");
    setRating("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  const handleAddToCart = async (productId: number) => {
    try {
      await apiFetch("/cart", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      showMessage("Product added to cart", "success");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      showMessage("Failed to add product to cart", "info");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MAIN LAYOUT */}

      <div className="flex">
        {/* LEFT SIDEBAR */}

        <Sidebar
          showFilters={true}
          category={category}
          brand={brand}
          price={price}
          rating={rating}
          setCategory={setCategory}
          setBrand={setBrand}
          setPrice={setPrice}
          setRating={setRating}
          clearFilters={clearFilters}
        />

        {/* RIGHT CONTENT */}

        <main className="flex-1 p-6">
          {/* PAGE TITLE */}

          <div className="mb-5">
            <h1 className="text-2xl font-bold">Products</h1>
          </div>

          {/* SEARCH */}
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* RESULT HEADER */}

          <div className="flex items-center justify-between mb-5">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold text-black">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>
          </div>

          {/* PRODUCT LIST */}

          {filteredProducts.length === 0 ? (
            <div className="bg-white border rounded-xl p-12 text-center">
              <h2 className="text-xl font-semibold">No products found</h2>

              <p className="text-gray-500 mt-2">Try changing your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  {/* IMAGE */}

                  <div className="h-32 bg-gray-100 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover p-1"
                      />
                    ) : (
                      <div className="text-gray-400">No Image</div>
                    )}
                  </div>

                  {/* PRODUCT DETAILS */}

                  <div className="p-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-semibold text-sm truncate">
                        {product.name}
                      </h2>

                      {product.rating !== null && (
                        <span className="text-sm whitespace-nowrap">
                          ⭐ {product.rating}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                      {product.description}
                    </p>

                    {/* PRICE */}

                    <div className="mt-4">
                      <span className="text-base font-bold">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* BRAND / CATEGORY */}

                    <div className="flex gap-2 mt-3 flex-wrap">
                      {product.brand && (
                        <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs">
                          {product.brand}
                        </span>
                      )}

                      {product.category && (
                        <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs">
                          {product.category}
                        </span>
                      )}
                    </div>

                    {/* STOCK */}

                    <div className="mt-3">
                      {(product.stock ?? 0) > 0 ? (
                        <span className="text-sm text-green-600">
                          ✓ In Stock: {product.stock}
                        </span>
                      ) : (
                        <span className="text-sm text-red-600">
                          ✕ Out of Stock
                        </span>
                      )}
                    </div>

                    {/* BUTTON */}

                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full bg-black text-white py-2.5 rounded-lg mt-4 hover:bg-gray-800 cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
