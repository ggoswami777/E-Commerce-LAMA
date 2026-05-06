import { useCheckout } from "@clerk/nextjs/experimental";
import { ShippingFormInputs } from "@repo/types";
import { PaymentElement } from "@stripe/react-stripe-js";
import { ConfirmError } from "@stripe/stripe-js";
import React, { useState } from "react";

const CheckoutForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const checkout = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ConfirmError | null>(null);
  const handleClick = async () => {
    setLoading(true);
    await checkout.updateEmail(shippingForm.email);

    const res = await checkout.confirm();
    if (res.type == "error") {
      setError(res.error);
    }
    setLoading(false);
  };
  return (
    <form action="">
      <PaymentElement options={{ layout: "accordion" }} />
      <button disabled={loading} onClick={handleClick}>
        {loading?"loading":"Pay"}
      </button>
      {error && <div>{error.message}</div>}
    </form>
  );
};

export default CheckoutForm;
