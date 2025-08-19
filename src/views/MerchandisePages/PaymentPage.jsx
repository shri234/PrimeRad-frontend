import React, { Fragment, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderDefault from "../../components/partials/HeaderDefault";
import BreadCrumbWidget from "../../components/BreadcrumbWidget";
import { Container, Button, Card } from "react-bootstrap"; // Added Card for better structure
import axios from "axios";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const loadStripeScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const loadPayPalScript = (clientId, currency) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const THEME = {
  primary: "#1976d2",
  secondary: "darkslategrey",
  background: "#f4f8fb",
  card: "#fff",
  accent: "#ffb300",
  text: "#263238",
  border: "#e0e0e0",
};

const PLAN_DETAILS_MOCK = {
  Free: {
    planName: "Free",
    price: 0,
    currency: "USD",
    durationDays: 30,
    features: ["Free content access", "Basic analytics"],
    stripeProductId: null,
    stripePriceId: null,
    razorpayPlanId: null,
    paypalPlanId: null,
  },
  Basic: {
    planName: "Basic",
    price: 19.99,
    currency: "USD",
    durationDays: 30,
    features: [
      "All Free features",
      "Premium content access",
      "Standard analytics",
    ],
    stripeProductId: "prod_ABC123", // Replace with actual Stripe Product ID
    stripePriceId: "price_XYZ456", // Replace with actual Stripe Price ID
    razorpayPlanId: "plan_ABC123", // Replace with actual Razorpay Plan ID
    paypalPlanId: "P-1234567890", // Replace with actual PayPal Plan ID
  },
  Premium: {
    planName: "Premium",
    price: 39.99,
    currency: "USD",
    durationDays: 365, // Annual plan example
    features: [
      "All Basic features",
      "HD streaming",
      "Offline access",
      "Advanced analytics",
      "Priority support",
    ],
    stripeProductId: "prod_DEF789",
    stripePriceId: "price_UVW987",
    razorpayPlanId: "plan_DEF789",
    paypalPlanId: "P-0987654321",
  },
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlanName = location.state?.plan; // Get plan name from navigation state
  const [selectedPackageDetails, setSelectedPackageDetails] = useState([]);
  const packageId = location.state?.packageId;
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState({
    razorpay: false,
    stripe: false,
    paypal: false,
  });
  const RAZORPAY_KEY_ID = "rzp_test_D6ffGs0mkGPakV";
  const STRIPE_PUBLIC_KEY = "pk_test_YOUR_STRIPE_PUBLIC_KEY";
  const PAYPAL_CLIENT_ID =
    "Aeugj_1RLQz2ju0gEpUOV3smZZaKInXpBNcP6G1BOphXp1XprESBPzNjTkrDL-zIe_W3PWZGDKA0gJgh";

  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!packageId) {
        setPaymentError(
          "No package ID provided. Please go back and choose a plan."
        );
        // setLoadingPage(false);
        return;
      }
      // setLoadingPage(true);
      setPaymentError(null);
      try {
        console.log(packageId);
        // Assume you have an endpoint to get a single package by ID
        // If not, you'd fetch all plans and filter by ID here.
        const response = await axios.get(
          `https://primerad-backend.onrender.com/api/subscription/getPackageById?packageId=${packageId}`
        ); // <--- NEW API CALL
        const fetchedPkg = response.data.data; // Assuming response is { data: packageObject }
        console.log(fetchedPkg);
        if (fetchedPkg) {
          // Merge fetched package data with local features fallback if needed
          const mergedPkg = {
            ...fetchedPkg,
            planName: fetchedPkg.packageName,
            packageId: fetchedPkg._id,
            // Ensure amount is a number and format
            amount: Number(fetchedPkg.amount),
            // Assign features from backend if available, else from fallback map
            features:
              fetchedPkg.features ||
              // PLAN_FEATURES_FALLBACK[fetchedPkg.packageName] ||
              [],
            // You might also fetch/assign stripe/paypal/razorpay specific IDs here if not part of main package model
            // For now, let's assume if it's a paid plan, payment methods are generally enabled.
            // In a real app, these IDs would be on your Package model.
            stripePriceId: "price_XYZ456", // Mock, replace with actual ID from backend
            paypalPlanId: "P-1234567890", // Mock, replace with actual ID from backend
          };
          setSelectedPlanDetails(mergedPkg);
          // Set currency for PayPal SDK if not always USD
          // loadPayPalScript(PAYPAL_CLIENT_ID, mergedPkg.currency || 'USD'); // Re-init PayPal if currency changes
        } else {
          setPaymentError("Selected package not found.");
        }
      } catch (err) {
        console.error("Error fetching package details:", err);
        setPaymentError("Failed to load package details. Please try again.");
      } finally {
        // setLoadingPage(false);
      }
    };

    fetchPackageDetails();
  }, []);
  // Load SDKs
  useEffect(() => {
    const loadAllSDKs = async () => {
      const [razorpayReady, stripeReady, paypalReady] = await Promise.all([
        loadRazorpayScript(),
        loadStripeScript(),
        loadPayPalScript(PAYPAL_CLIENT_ID, "USD"), // Pass currency
      ]);
      setSdkLoaded({
        razorpay: razorpayReady,
        stripe: stripeReady,
        paypal: paypalReady,
      });
      if (!razorpayReady || !stripeReady || !paypalReady) {
        console.error("One or more payment SDKs failed to load.");
        setPaymentError(
          "Payment services are temporarily unavailable. Please try again later."
        );
      }
    };

    if (selectedPlanDetails) {
      // Only load SDKs once plan details are available
      loadAllSDKs();
    }
  }, [selectedPlanDetails, PAYPAL_CLIENT_ID]);

  const handleRazorpayPayment = useCallback(async () => {
    if (!sdkLoaded.razorpay || !selectedPlanDetails) return;

    setLoadingPayment(true);
    setPaymentError(null);

    try {
      // 1. Create a Razorpay Order on your Backend
      const orderResponse = await axios.post(
        `https://primerad-backend.onrender.com/api/subscription/initiatePayment?packageId=${packageId}`
      );

      const {
        orderId,
        amount,
        currency,
        name: orderName,
        description: orderDescription,
      } = orderResponse.data;

      const options = {
        key: RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: amount,
        currency: currency,
        name: "PRIMERAD Subscription",
        description: `Payment for ${selectedPlanDetails.planName} Plan`,
        order_id: orderId, // Order ID from your backend
        handler: async (response) => {
          // This function is called on successful payment
          try {
            // 2. Send payment response to your backend for verification
            //    DO NOT call the webhook endpoint here. Create a separate endpoint.
            const verifyResponse = await axios.post(
              "https://primerad-backend.onrender.com/api/subscription/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                // You might want to pass notes.userId and notes.packageId if they aren't tied to the order
                userId: localStorage.getItem("userId"), // Make sure currentUserId is available here
                packageId: selectedPlanDetails.packageId, // Make sure packageId is available here
                // Ensure these match the 'notes' you plan to attach to the Razorpay order
              }
            );

            if (verifyResponse.status === 200) {
              alert(
                "Payment Successful with Razorpay! Your subscription is active."
              );
              navigate("/subscription-success"); // Redirect to success page
            } else {
              // Handle cases where backend verification might return a non-200 status
              setPaymentError(
                verifyResponse.data.message || "Payment verification failed."
              );
            }
          } catch (verifyError) {
            console.error("Razorpay verification failed:", verifyError);
            setPaymentError(
              "Payment verification failed. Please contact support."
            );
          } finally {
            setLoadingPayment(false);
          }
        },
        prefill: {
          name: "User Name", // User's name (pre-fill from auth if available)
          email: "user@example.com", // User's email
          contact: "9999999999", // User's phone number
        },
        notes: {
          plan: selectedPlanDetails.planName,
        },
        theme: {
          color: THEME.primary,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open(); // Open the Razorpay payment modal
    } catch (err) {
      console.error(
        "Error initiating Razorpay payment:",
        err.response?.data || err.message
      );
      setPaymentError(
        err.response?.data?.message || "Failed to initiate Razorpay payment."
      );
    } finally {
      setLoadingPayment(false);
    }
  }, [selectedPlanDetails, sdkLoaded.razorpay, RAZORPAY_KEY_ID, navigate]);

  // --- Stripe Integration ---
  const handleStripePayment = useCallback(async () => {
    if (!sdkLoaded.stripe || !selectedPlanDetails?.stripePriceId) return;

    setLoadingPayment(true);
    setPaymentError(null);

    try {
      // 1. Create a Stripe Checkout Session on your Backend
      const sessionResponse = await axios.post(
        "https://primerad-backend.onrender.com/api/payment/stripe-checkout",
        {
          priceId: selectedPlanDetails.stripePriceId, // Stripe Price ID from your plan details
          planName: selectedPlanDetails.planName,
          // userId: currentUserId,
        }
      );

      const { sessionId } = sessionResponse.data;

      // 2. Redirect to Stripe Checkout
      const stripe = window.Stripe(STRIPE_PUBLIC_KEY);
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error("Stripe Checkout error:", error.message);
        setPaymentError(error.message);
      }
    } catch (err) {
      console.error(
        "Error initiating Stripe payment:",
        err.response?.data || err.message
      );
      setPaymentError(
        err.response?.data?.message || "Failed to initiate Stripe payment."
      );
    } finally {
      setLoadingPayment(false); // This might not be reached if redirect happens
    }
  }, [selectedPlanDetails, sdkLoaded.stripe, STRIPE_PUBLIC_KEY]);

  // --- PayPal Integration ---
  const handlePayPalPayment = useCallback(async () => {
    if (!sdkLoaded.paypal || !selectedPlanDetails) return;

    setLoadingPayment(true);
    setPaymentError(null);

    try {
      // 1. Create a PayPal Order on your Backend
      const orderResponse = await axios.post(
        `https://primerad-backend.onrender.com/api/subscription/paypal-order?userId=${localStorage.getItem(
          "userId"
        )}`,
        {
          amount: selectedPlanDetails.amount,
          currency: "USD",
          packageName: selectedPlanDetails.planName,
          packageId: selectedPlanDetails.packageId,
          // userId: currentUserId,
        }
      );
      console.log(orderResponse.data, "orderResponse");
      const { orderId } = orderResponse.data;
      console.log(orderId);
      alert("Redirecting to PayPal for payment...");
      setTimeout(async () => {
        try {
          await axios.get(
            `https://primerad-backend.onrender.com/api/subscription/paypal-verify?token=${orderId}&PayerID=${localStorage.getItem(
              "userId"
            )}`
          );
          alert("Payment Successful with PayPal! Your subscription is active.");
          navigate("/payment");
        } catch (verifyError) {
          console.error("PayPal verification failed:", verifyError);
          setPaymentError(
            "Payment verification failed. Please contact support."
          );
        } finally {
          setLoadingPayment(false);
        }
      }, 2000); // Simulate PayPal processing time
    } catch (err) {
      console.error(
        "Error initiating PayPal payment:",
        err.response?.data || err.message
      );
      setPaymentError(
        err.response?.data?.message || "Failed to initiate PayPal payment."
      );
    } finally {
      // setLoadingPayment(false); // Don't set false if redirecting
    }
  }, [selectedPlanDetails, sdkLoaded.paypal, navigate]);

  if (!selectedPlanDetails) {
    return (
      <Fragment>
        <HeaderDefault />
        <BreadCrumbWidget title="Payment" />
        <div
          style={{
            background: THEME.background,
            minHeight: "100vh",
            padding: "48px 0",
          }}
        >
          <Container style={{ textAlign: "center", color: THEME.text }}>
            <Card
              style={{
                padding: "30px",
                borderRadius: "18px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              }}
            >
              <h3>Loading Plan Details...</h3>
              {paymentError && (
                <p style={{ color: "red", marginTop: "15px" }}>
                  {paymentError}
                </p>
              )}
              <Button
                onClick={() => navigate("/pricing")}
                style={{ marginTop: "20px" }}
              >
                Go to Pricing
              </Button>
            </Card>
          </Container>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <HeaderDefault />
      <BreadCrumbWidget title="Payment" />
      <div
        style={{
          background: THEME.background,
          minHeight: "100vh",
          padding: "0 0 48px 0",
        }}
      >
        <Container>
          <div
            style={{
              background: THEME.card,
              borderRadius: 18,
              boxShadow: "0 2px 12px rgba(25,118,210,0.07)",
              padding: "24px 32px",
              margin: "32px auto 32px auto",
              maxWidth: 600,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: THEME.primary,
                marginBottom: 8,
              }}
            >
              Selected Plan
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: THEME.text,
                marginBottom: 8,
              }}
            >
              {selectedPlanDetails.planName}
            </div>
            <>
              <div style={{ fontSize: 16, color: THEME.text, marginBottom: 8 }}>
                <b>Cost:</b>{" "}
                <span style={{ color: THEME.primary }}>
                  {selectedPlanDetails.currency} {selectedPlanDetails?.amount}
                </span>
              </div>
              <div style={{ fontSize: 16, color: THEME.text, marginBottom: 8 }}>
                <b>Duration:</b>{" "}
                <span style={{ color: THEME.primary }}>
                  {selectedPlanDetails.durationDays} days
                </span>
              </div>
              <div style={{ fontSize: 16, color: THEME.text, marginBottom: 8 }}>
                <b>Features:</b>
                <ul
                  style={{
                    margin: "8px 0 0 18px",
                    padding: 0,
                    color: THEME.text,
                    textAlign: "left",
                  }}
                >
                  {selectedPlanDetails.features.map((feature, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          </div>
          {/* Payment Options */}
          <div
            style={{
              background: THEME.card,
              borderRadius: 18,
              boxShadow: "0 2px 12px rgba(25,118,210,0.07)",
              padding: "24px 32px",
              margin: "0 auto 32px auto",
              maxWidth: 600,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: THEME.text,
                marginBottom: 18,
              }}
            >
              Choose Payment Method
            </div>

            {loadingPayment && (
              <p style={{ color: THEME.primary }}>
                Processing payment, please wait...
              </p>
            )}
            {paymentError && <p style={{ color: "red" }}>{paymentError}</p>}

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Razorpay Button */}x{" "}
            </div>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default PaymentPage;
