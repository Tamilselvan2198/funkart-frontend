import { apiFetch } from "@/lib/api";

export interface CartProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  rating: number | null;
  brand: string;
  imageUrl: string;
}

export interface CartItem {
  id: number; // CartItem ID

  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    quantity: number;
    category: string;
    brand: string;
    rating: number;
  };

  quantity: number;
}

// GET CART
export async function getCart(): Promise<CartItem[]> {
  return apiFetch("/cart");
}

// ADD TO CART
export async function addToCart(productId: number, quantity: number = 1) {
  return apiFetch("/cart", {
    method: "POST",
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });
}

// UPDATE QUANTITY
export async function updateQuantity(id: number, quantity: number) {
  return apiFetch(`/cart/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      quantity,
    }),
  });
}

// REMOVE
export async function removeFromCart(id: number) {
  return apiFetch(`/cart/${id}`, {
    method: "DELETE",
  });
}

// CLEAR
export async function clearCart() {
  // Only use this if your backend has a clear-cart endpoint.
  return apiFetch("/cart/clear", {
    method: "DELETE",
  });
}
