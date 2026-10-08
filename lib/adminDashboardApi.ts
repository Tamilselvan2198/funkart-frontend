import { apiFetch } from "@/lib/api";

export interface DashboardStats {
  users: number;
  products: number;
  orders: number;
  revenue: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [users, products] = await Promise.all([
    apiFetch("/admin/users"),
    apiFetch("/products"),
  ]);

  return {
    users: users.length,
    products: products.length,

    // We don't have Order API yet
    orders: 0,
    revenue: 0,
  };
}
