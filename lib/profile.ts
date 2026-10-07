import { apiFetch } from "@/lib/api";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await apiFetch("/profile", {
    method: "GET",
  });

  return response as UserProfile;
}
