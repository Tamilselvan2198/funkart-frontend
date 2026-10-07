"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../components/SnackbarProvider";

import { createPaymentOrder, verifyPayment } from "@/lib/payment";
import Sidebar from "../components/Sidebar";

interface Product {
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

interface BackendCartItem {
  id: number;
  quantity: number;
  product: Product;
}

interface CartItem {
  id: number; // Cart item ID
  productId: number; // Product ID

  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();

  const { showMessage } = useSnackbar();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // =====================================================
  // LOAD RAZORPAY SCRIPT
  // =====================================================

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }

      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =====================================================
  // GET CART FROM BACKEND
  // =====================================================

  const loadCart = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch("http://localhost:8080/api/cart", {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");

          router.replace("/login");

          return;
        }

        const errorText = await response.text();

        console.error("Load cart failed:", response.status, errorText);

        throw new Error("Failed to load cart");
      }

      const data: BackendCartItem[] = await response.json();

      console.log("CART FROM BACKEND:", data);

      // =====================================================
      // CONVERT BACKEND CART TO FRONTEND CART
      // =====================================================

      const formattedCart: CartItem[] = data.map((item) => ({
        // Cart item ID
        id: item.id,

        // Product ID
        productId: item.product.id,

        name: item.product.name,

        description: item.product.description,

        price: Number(item.product.price) || 0,

        imageUrl: item.product.imageUrl || "",

        quantity: Number(item.quantity) || 1,
      }));

      setCart(formattedCart);
    } catch (error) {
      console.error("Failed to load cart:", error);

      showMessage("Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD CART
  // =====================================================

  useEffect(() => {
    loadCart();
  }, []);

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const increase = async (item: CartItem) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const newQuantity = item.quantity + 1;

      const response = await fetch(
        `http://localhost:8080/api/cart/${item.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            quantity: newQuantity,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Update quantity failed:", response.status, errorText);

        throw new Error("Failed to update quantity");
      }

      await loadCart();

      showMessage("Quantity updated", "success");
    } catch (error) {
      console.error("Failed to increase quantity:", error);

      showMessage("Failed to update quantity", "error");
    }
  };

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const decrease = async (item: CartItem) => {
    try {
      if (item.quantity <= 1) {
        showMessage("Quantity cannot be less than 1", "warning");

        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const newQuantity = item.quantity - 1;

      const response = await fetch(
        `http://localhost:8080/api/cart/${item.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            quantity: newQuantity,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Update quantity failed:", response.status, errorText);

        throw new Error("Failed to update quantity");
      }

      await loadCart();

      showMessage("Quantity updated", "success");
    } catch (error) {
      console.error("Failed to decrease quantity:", error);

      showMessage("Failed to update quantity", "error");
    }
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const remove = async (item: CartItem) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/cart/${item.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Remove cart item failed:", response.status, errorText);

        throw new Error("Failed to remove item");
      }

      await loadCart();

      showMessage("Product removed from cart", "success");
    } catch (error) {
      console.error("Remove cart item failed:", error);

      showMessage("Failed to remove item", "error");
    }
  };

  // =====================================================
  // PAY NOW
  // =====================================================

  const handleCheckout = async () => {
    if (paying) {
      return;
    }

    try {
      if (cart.length === 0) {
        showMessage("Your cart is empty", "warning");

        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      setPaying(true);

      // =================================================
      // LOAD RAZORPAY
      // =================================================

      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        showMessage("Failed to load Razorpay", "error");

        setPaying(false);

        return;
      }

      // =================================================
      // CREATE PAYMENT ITEMS
      // =================================================

      const orderItems = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      console.log("PAYMENT ITEMS:", orderItems);

      // =================================================
      // CREATE RAZORPAY ORDER
      // =================================================

      const paymentOrder = await createPaymentOrder(orderItems);

      console.log("RAZORPAY ORDER:", paymentOrder);

      if (!paymentOrder || !paymentOrder.razorpayOrderId) {
        throw new Error("Invalid Razorpay order response");
      }

      if (!paymentOrder.keyId) {
        throw new Error("Razorpay key ID is missing");
      }

      // =================================================
      // RAZORPAY CHECKOUT OPTIONS
      // =================================================

      const options = {
        key: paymentOrder.keyId,

        amount: paymentOrder.amount,

        currency: paymentOrder.currency,

        name: "Funkart",

        description: "Funkart Order",

        order_id: paymentOrder.razorpayOrderId,

        handler: async function (response: any) {
          try {
            console.log("RAZORPAY PAYMENT RESPONSE:", response);

            // =========================================
            // VERIFY PAYMENT
            // =========================================

            await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              orderItems,
            );

            console.log("PAYMENT VERIFIED");

            showMessage("Payment successful!", "success");

            // =========================================
            // RELOAD BACKEND CART
            // =========================================

            await loadCart();

            // =========================================
            // GO TO ORDERS
            // =========================================

            router.push("/orders");
          } catch (error) {
            console.error("Payment verification failed:", error);

            showMessage(
              error instanceof Error
                ? error.message
                : "Payment verification failed",
              "error",
            );
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Razorpay checkout closed");

            setPaying(false);

            showMessage("Payment cancelled", "warning");
          },
        },

        theme: {
          color: "#000000",
        },
      };

      // =================================================
      // CREATE RAZORPAY INSTANCE
      // =================================================

      const razorpay = new window.Razorpay(options);

      // =================================================
      // PAYMENT FAILED
      // =================================================

      razorpay.on("payment.failed", function (response: any) {
        console.error("RAZORPAY PAYMENT FAILED:", response);

        setPaying(false);

        showMessage(response?.error?.description || "Payment failed", "error");
      });

      // =================================================
      // OPEN RAZORPAY
      // =================================================

      razorpay.open();
    } catch (error) {
      console.error("Checkout failed:", error);

      setPaying(false);

      showMessage(
        error instanceof Error ? error.message : "Unable to start payment",
        "error",
      );
    }
  };

  // =====================================================
  // TOTAL
  // =====================================================

  const total = cart.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);

  // =====================================================
  // TOTAL ITEMS
  // =====================================================

  const totalItems = cart.reduce((sum, item) => {
    return sum + Number(item.quantity);
  }, 0);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* LEFT SIDEBAR */}
        <Sidebar showFilters={false} />

        {/* MAIN CONTENT */}
        <main className="flex-1 px-8 py-6">
          <div className="max-w-5xl mx-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Shopping Cart 🛒</h1>

              <button
                onClick={() => router.push("/products")}
                className="border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Products
              </button>
            </div>

            {/* EMPTY CART */}
            {cart.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                <div className="text-5xl mb-4">🛒</div>

                <h2 className="text-xl font-semibold mb-2">
                  Your cart is empty
                </h2>

                <p className="text-gray-500 mb-6">
                  Add some products to your cart.
                </p>

                <button
                  onClick={() => router.push("/products")}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ==========================================
                  CART ITEMS
              ========================================== */}

                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item) => {
                    const price = Number(item.price) || 0;
                    const quantity = Number(item.quantity) || 0;
                    const itemTotal = price * quantity;

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-sm p-5 flex gap-5"
                      >
                        {/* IMAGE */}
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-28 h-28 object-cover rounded-lg shrink-0"
                          />
                        ) : (
                          <div className="w-28 h-28 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-gray-500 text-xs">
                              No Image
                            </span>
                          </div>
                        )}

                        {/* DETAILS */}
                        <div className="flex-1">
                          <h2 className="text-lg font-semibold">{item.name}</h2>

                          <p className="text-gray-500 text-sm mt-1">
                            {item.description}
                          </p>

                          <p className="font-bold mt-2">
                            ₹{price.toLocaleString("en-IN")}
                          </p>

                          {/* QUANTITY */}
                          <div className="flex items-center gap-3 mt-4">
                            {/* DECREASE */}
                            <button
                              onClick={() => decrease(item)}
                              disabled={quantity <= 1}
                              className={`w-8 h-8 border rounded-lg transition ${
                                quantity <= 1
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              -
                            </button>

                            {/* QUANTITY */}
                            <span className="font-semibold min-w-[20px] text-center">
                              {quantity}
                            </span>

                            {/* INCREASE */}
                            <button
                              onClick={() => increase(item)}
                              className="w-8 h-8 border rounded-lg hover:bg-gray-100 transition"
                            >
                              +
                            </button>

                            {/* REMOVE */}
                            <button
                              onClick={() => remove(item)}
                              className="ml-4 text-red-500 text-sm hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* ITEM TOTAL */}
                        <div className="font-bold whitespace-nowrap">
                          ₹{itemTotal.toLocaleString("en-IN")}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ==========================================
                  ORDER SUMMARY
              ========================================== */}

                <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  {/* ITEMS */}
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Items</span>

                    <span>{totalItems}</span>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Subtotal</span>

                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>

                  {/* TOTAL */}
                  <div className="border-t pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>

                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>

                  {/* CHECKOUT */}
                  <button
                    onClick={handleCheckout}
                    disabled={paying}
                    className={`w-full text-white py-3 rounded-lg mt-6 transition ${
                      paying
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                    }`}
                  >
                    {paying ? "Processing..." : "Pay Now"}
                  </button>

                  {/* CONTINUE SHOPPING */}
                  <button
                    onClick={() => router.push("/products")}
                    className="w-full border py-3 rounded-lg mt-3 hover:bg-gray-50 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
