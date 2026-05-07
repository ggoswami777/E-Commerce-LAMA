"use client"
import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useAuth } from '@clerk/nextjs';
import { CartItemsType, ShippingFormInputs } from '@repo/types';
import useCartStore from '@/stores/cartStore';

const stripe = loadStripe("pk_test_51SqyAgD2xnYByEpWpuGui6jkezdloiOtWc1CH1mrFsBS9uKCABUHTkcdXkcqUg78mXTfIec0NRVzDCAw2omNCfkD00AmfsxzhX");

const fetchClientSecret = async (cart: CartItemsType, token: string) => {
  console.log("Fetching client secret...", { cart, url: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL });
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`, {
      method: "POST",
      body: JSON.stringify({ cart }),
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Payment service error:", errorText);
      throw new Error(`Failed to fetch client secret: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    console.log("Received response:", json);
    return json.clientSecret;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};

const StripePaymentForm = ({ shippingForm }: { shippingForm: ShippingFormInputs }) => {
  const [token, setToken] = useState<string | null>(null);
  const { cart } = useCartStore();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((t) => {
      console.log("Token received:", t ? "Yes" : "No");
      setToken(t);
    }).catch(err => {
      console.error("Error getting token:", err);
      setError("Failed to authenticate.");
    });
  }, []);

  useEffect(() => {
    if (token) {
      fetchClientSecret(cart, token)
        .then((secret) => {
          if (secret) {
            setClientSecret(secret);
          } else {
            setError("No client secret received from server.");
          }
        })
        .catch((err) => {
          setError(err.message || "Failed to fetch payment details.");
        });
    }
  }, [token, cart]);

  if (error) {
    return <div className="text-red-500 p-4 border border-red-200 rounded">Error: {error}</div>;
  }

  if (!token || !clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Preparing secure checkout...</p>
        <p className="text-xs text-gray-400 mt-2">URL: {process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}</p>
      </div>
    );
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripe} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default StripePaymentForm;