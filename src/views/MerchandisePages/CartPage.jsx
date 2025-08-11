import React, { Fragment, memo, useEffect, useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Button, Card } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BreadCrumbWidget from "../../components/BreadcrumbWidget";
import HeaderDefault from "../../components/partials/HeaderDefault";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BackButton, { FixedBackButton } from "../../utilities/BackButton";
import {
  faShoppingCart,
  faCreditCard,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Stripe: Loads Stripe.js
const loadStripeScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// PayPal: Loads PayPal JS SDK
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
  secondary: "#00bfae",
  background: "#f4f8fb",
  card: "#fff",
  accent: "#ffb300",
  text: "#263238",
  border: "#e0e0e0",
};

const PLAN_DETAILS = {
  Basic: {
    price: "$49/month",
    features: [
      "Access to 10 CME courses",
      "Online support",
      "Certificate of completion",
    ],
  },
  Pro: {
    price: "$99/month",
    features: [
      "Access to all CME courses",
      "Unlimited lectures",
      "Priority support",
      "Certificate of completion",
      "Offline access to materials",
    ],
  },
  Enterprise: {
    price: "Contact Us",
    features: [
      "Customized for your institution",
      "Dedicated account manager",
      "Advanced reporting",
      "All Pro features",
    ],
  },
};

const CartPage = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const packageId = location.state?.packageId;
  const [planDetails, setPlanDetails] = useState([]);
  const selectedPlanName = location.state?.plan; // Get plan name from navigation state
  const [selectedPackageDetails, setSelectedPackageDetails] = useState([]);

  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState({
    razorpay: false,
    stripe: false,
    paypal: false,
  });

  const RAZORPAY_KEY_ID = "rzp_test_D6ffGs0mkGPakV"; // Replace with your test/live Key ID
  const STRIPE_PUBLIC_KEY = "pk_test_YOUR_STRIPE_PUBLIC_KEY"; // Replace with your test/live Public Key
  const PAYPAL_CLIENT_ID =
    "Aeugj_1RLQz2ju0gEpUOV3smZZaKInXpBNcP6G1BOphXp1XprESBPzNjTkrDL-zIe_W3PWZGDKA0gJgh"; // Replace with your test/live Client ID

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
  }, []); // Re-fetch if packageId changes
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

  // --- Razorpay Integration ---
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

  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!packageId) {
        // setPaymentError(
        //   "No package ID provided. Please go back and choose a plan."
        // );
        // setLoadingPage(false);
        return;
      }
      // setLoadingPage(true);
      // setPaymentError(null);
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
              PLAN_DETAILS[fetchedPkg.packageName] ||
              // PLAN_FEATURES_FALLBACK[fetchedPkg.packageName] ||
              [],
            // You might also fetch/assign stripe/paypal/razorpay specific IDs here if not part of main package model
            // For now, let's assume if it's a paid plan, payment methods are generally enabled.
            // In a real app, these IDs would be on your Package model.
            stripePriceId: "price_XYZ456", // Mock, replace with actual ID from backend
            paypalPlanId: "P-1234567890", // Mock, replace with actual ID from backend
          };
          setPlanDetails(mergedPkg);
          // Set currency for PayPal SDK if not always USD
          // loadPayPalScript(PAYPAL_CLIENT_ID, mergedPkg.currency || 'USD'); // Re-init PayPal if currency changes
        }
      } catch (err) {
        console.error("Error fetching package details:", err);
        // setPaymentError("Failed to load package details. Please try again.");
      } finally {
        // setLoadingPage(false);
      }
    };

    fetchPackageDetails();
  }, []);

  const handlePayment = () => {
    // Razorpay integration logic goes here
    console.log(`Initiating Razorpay payment for ${selectedPlan} plan`);
    // Example:
    // const options = {
    //   key: "YOUR_RAZORPAY_KEY",
    //   amount: 100, // Amount in paise
    //   name: "CME Subscription",
    //   description: `${selectedPlan} Plan`,
    //   handler: function (response) {
    //     alert(response.razorpay_payment_id);
    //   },
    // };
    // const rzp = new window.Razorpay(options);
    // rzp.open();
  };

  return (
    <Fragment>
      <HeaderDefault />
      <FixedBackButton customPath="/pricing" />
      <div
        className="cart-page section-padding"
        style={{ background: THEME.background, minHeight: "100vh" }}
      >
        <Container>
          <Row>
            <Col lg={8}>
              <div
                style={{
                  background: THEME.card,
                  borderRadius: 18,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  padding: "32px",
                }}
              >
                <h4
                  style={{
                    color: THEME.primary,
                    fontWeight: 700,
                    marginBottom: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> Your Subscription
                </h4>
                {planDetails ? (
                  <div>
                    <h5 style={{ fontWeight: 600, color: THEME.text }}>
                      {planDetails.packageName} Subscription
                    </h5>
                    <p style={{ color: THEME.text, marginBottom: 24 }}>
                      Review your selected subscription before proceeding to
                      payment.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 0",
                      color: THEME.text,
                    }}
                  >
                    <p>No plan selected.</p>
                    <Link to="/pricing" className="btn btn-primary">
                      View Pricing Plans
                    </Link>
                  </div>
                )}
              </div>
            </Col>
            <Col lg={4}>
              <div
                style={{
                  background: THEME.card,
                  borderRadius: 18,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  padding: "32px",
                }}
              >
                <h5
                  style={{
                    color: THEME.primary,
                    fontWeight: 700,
                    marginBottom: 24,
                  }}
                >
                  Order Summary
                </h5>
                {planDetails && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          color: "black",
                          fontSize: "20px",
                          fontWeight: "600",
                        }}
                      >
                        {planDetails.packageName} - {"$"}
                        {planDetails.amount}
                      </span>
                      <span style={{ fontWeight: 600, color: THEME.primary }}>
                        {planDetails.price}
                      </span>
                    </div>
                    <hr style={{ borderColor: THEME.border }} />
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: "16px 0",
                      }}
                    >
                      {planDetails?.features?.features.map((feature, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                            color: THEME.text,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            style={{ color: THEME.secondary }}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <hr style={{ borderColor: THEME.border }} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <Button
                        onClick={handleRazorpayPayment}
                        disabled={
                          loadingPayment || !sdkLoaded.razorpay
                          // !selectedPlanDetails.razorpayPlanId
                        }
                        style={{
                          background: "#0d9d58", // Razorpay green
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 18,
                          border: "none",
                          borderRadius: 12,
                          padding: "16px 0",
                          boxShadow: "0 2px 12px rgba(13,157,88,0.10)",
                          cursor: "pointer",
                          transition: "background 0.2s",
                          opacity:
                            loadingPayment ||
                            !sdkLoaded.razorpay ||
                            !selectedPlanDetails.razorpayPlanId
                              ? 0.6
                              : 1,
                        }}
                      >
                        Pay with Razorpay
                      </Button>

                      {/* Stripe Button */}
                      <Button
                        onClick={handleStripePayment}
                        disabled={
                          loadingPayment ||
                          !sdkLoaded.stripe ||
                          !selectedPlanDetails.stripePriceId
                        }
                        style={{
                          background: "#6772E5", // Stripe purple
                          color: THEME.card,
                          fontWeight: 700,
                          fontSize: 18,
                          border: "none",
                          borderRadius: 12,
                          padding: "16px 0",
                          boxShadow: "0 2px 12px rgba(103,114,229,0.10)",
                          cursor: "pointer",
                          transition: "background 0.2s",
                          opacity:
                            loadingPayment ||
                            !sdkLoaded.stripe ||
                            !selectedPlanDetails.stripePriceId
                              ? 0.6
                              : 1,
                        }}
                      >
                        Pay with Stripe
                      </Button>

                      {/* PayPal Button */}
                      <Button
                        onClick={handlePayPalPayment}
                        disabled={
                          loadingPayment ||
                          !sdkLoaded.paypal ||
                          !selectedPlanDetails.paypalPlanId
                        }
                        style={{
                          background: "#0070BA", // PayPal blue
                          color: THEME.card,
                          fontWeight: 700,
                          fontSize: 18,
                          border: "none",
                          borderRadius: 12,
                          padding: "16px 0",
                          boxShadow: "0 2px 12px rgba(0,112,186,0.10)",
                          cursor: "pointer",
                          transition: "background 0.2s",
                          opacity:
                            loadingPayment ||
                            !sdkLoaded.paypal ||
                            !selectedPlanDetails.paypalPlanId
                              ? 0.6
                              : 1,
                        }}
                      >
                        Pay with PayPal
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
});

CartPage.displayName = "CartPage";
export default CartPage;
