import { apiFetch } from "@/lib/api";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  brand: string;
  rating: number;
  imageUrl: string;
}

// ==============================
// GET ALL PRODUCTS
// ==============================

export async function getAdminProducts(): Promise<Product[]> {
  return apiFetch("/products");
}

// ==============================
// CREATE PRODUCT
// ==============================

export async function createAdminProduct(formData: FormData): Promise<Product> {
  return apiFetch("/products", {
    method: "POST",
    body: formData,
  });
}

// ==============================
// UPDATE PRODUCT
// ==============================

export async function updateAdminProduct(
  id: number,
  product: Omit<Product, "id" | "imageUrl"> & { imageUrl: string },
): Promise<Product> {
  return apiFetch(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

// ==============================
// DELETE PRODUCT
// ==============================

export async function deleteAdminProduct(id: number): Promise<string> {
  return apiFetch(`/products/${id}`, {
    method: "DELETE",
  });
}
