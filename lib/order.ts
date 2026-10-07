import { apiFetch } from "@/lib/api";

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export async function createOrder(items: OrderItemRequest[]): Promise<Order> {
  return apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify(items),
  });
}

export async function getMyOrders(): Promise<Order[]> {
  return apiFetch("/orders");
}

export async function getOrder(id: number): Promise<Order> {
  return apiFetch(`/orders/${id}`);
}
