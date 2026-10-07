import { apiFetch } from "@/lib/api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "CUSTOMER";
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return apiFetch("/admin/users");
}

export async function getAdminUser(id: number): Promise<AdminUser> {
  return apiFetch(`/admin/users/${id}`);
}

export async function createAdminUser(
  data: CreateUserRequest,
): Promise<AdminUser> {
  return apiFetch("/admin/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminUser(
  id: number,
  data: UpdateUserRequest,
): Promise<AdminUser> {
  return apiFetch(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAdminUser(id: number): Promise<string> {
  return apiFetch(`/admin/users/${id}`, {
    method: "DELETE",
  });
}
