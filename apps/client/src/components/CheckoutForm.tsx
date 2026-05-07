import { ShippingFormInputs } from "@repo/types";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeError } from "@stripe/stripe-js";
import React, { useState } from "react";

const CheckoutForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StripeError | null>(null);

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError);
      setLoading(false);
      return;
    }

    const res = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
        shipping: {
          name: shippingForm.name,
          address: {
            line1: shippingForm.address,
            city: shippingForm.city,
            country: "US", 
          },
        },
      },
    });

    if (res.error) {
      setError(res.error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleClick}>
      <PaymentElement options={{ layout: "accordion" }} />
      <button disabled={loading || !stripe} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <div className="text-red-500 mt-2 text-sm">{error.message}</div>}
    </form>
  );
};

export default CheckoutForm;
