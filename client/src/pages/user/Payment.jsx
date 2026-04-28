import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { payment } from "../../api/Stripe";
import useEcomStore from "../../store/ecom-store";
import CheckoutForm from "../../components/CheckoutForm";
const stripePromise = loadStripe("pk_test_51R6OteAhZ9iy5twDnZ6UhFHs8fLpjgPcmIy9rBXaUlvVMUduJHVpJhlsbDTb0Cp3kSvUANUuIMT2MgqV1RppsNFR00Lifx2UC6");

const Payment = () => {
  const token = useEcomStore((s) => s.token);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    payment(token)
      .then((res) => {
        console.log(res);
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const appearance = {
    theme: "stripe",
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";

  return (
    <div>
      {clientSecret && (
        <Elements
          options={{ clientSecret, appearance, loader }}
          stripe={stripePromise}
        >
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Payment;