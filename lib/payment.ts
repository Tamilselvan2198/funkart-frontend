import { apiFetch } from "@/lib/api";

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface RazorpayOrderResponse {
  razorpayOrderId: string;
  keyId: string;
  amount: number;
  currency: string;
}

export interface PaymentVerifyResponse {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export async function createPaymentOrder(
  items: OrderItemRequest[],
): Promise<RazorpayOrderResponse> {
  return apiFetch("/payment/create-order", {
    method: "POST",
    body: JSON.stringify(items),
  });
}

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  items: any[],
) {
  const params = new URLSearchParams({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  const response = await apiFetch(`/payment/verify?${params.toString()}`, {
    method: "POST",
  });

  return response;
}
