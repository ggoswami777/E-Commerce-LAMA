"use-client"
import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { CheckoutElementsProvider } from '@stripe/react-stripe-js/checkout';
import CheckoutForm from './CheckoutForm';
import { useAuth } from '@clerk/nextjs';
import { ShippingFormInputs } from '@repo/types';
import useCartStore from '@/stores/cartStore';

const stripe = loadStripe("pk_test_51SqyAgD2xnYByEpWpuGui6jkezdloiOtWc1CH1mrFsBS9uKCABUHTkcdXkcqUg78mXTfIec0NRVzDCAw2omNCfkD00AmfsxzhX");

const fetchClientSecret = async (token: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then((json) => json.clientSecret);
};

const StripePaymentForm = ({shippingForm}:{shippingForm:ShippingFormInputs}) => {
  const [token, setToken] = useState<string | null>(null);
  const {cart}=useCartStore();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { getToken } = useAuth();


  useEffect(() => {
    getToken().then(setToken);
  }, []);


  useEffect(() => {
    if (token) {
      fetchClientSecret(token).then(setClientSecret);
    }
  }, [token]);

  if (!token || !clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <CheckoutElementsProvider stripe={stripe} options={{ clientSecret }}>
      <CheckoutForm shippingForm={shippingForm}/>
    </CheckoutElementsProvider>
  );
};

export default StripePaymentForm;