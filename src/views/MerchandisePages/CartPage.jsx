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
  faSpinner,
  faLock,
  faShieldAlt,
  faTicket,
  faCheck,
  faTimes,
  faTag,
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

// Payment Animation Component
const PaymentAnimation = ({ isVisible, paymentMethod }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationPhase, setAnimationPhase] = useState("processing");

  const steps = [
    { icon: faLock, text: "Securing connection...", color: "#ff6b6b" },
    { icon: faCreditCard, text: "Processing payment...", color: "#4ecdc4" },
    { icon: faShieldAlt, text: "Verifying transaction...", color: "#45b7d1" },
    { icon: faCheckCircle, text: "Payment successful!", color: "#96ceb4" },
  ];

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setAnimationPhase("success");
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [isVisible, steps.length]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "48px",
          maxWidth: "500px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          transform: animationPhase === "success" ? "scale(1.05)" : "scale(1)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Main Animation Circle */}
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${
              steps[currentStep]?.color || "#4ecdc4"
            }, ${steps[currentStep]?.color || "#4ecdc4"}40)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Rotating border */}
          <div
            style={{
              position: "absolute",
              top: "-4px",
              left: "-4px",
              right: "-4px",
              bottom: "-4px",
              borderRadius: "50%",
              background: `linear-gradient(45deg, ${
                steps[currentStep]?.color || "#4ecdc4"
              }, transparent, ${steps[currentStep]?.color || "#4ecdc4"})`,
              animation:
                animationPhase === "processing"
                  ? "rotate 2s linear infinite"
                  : "none",
            }}
          />

          {/* Inner circle */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <FontAwesomeIcon
              icon={steps[currentStep]?.icon || faSpinner}
              style={{
                fontSize: "48px",
                color: steps[currentStep]?.color || "#4ecdc4",
                animation:
                  steps[currentStep]?.icon === faSpinner
                    ? "spin 1s linear infinite"
                    : "none",
              }}
            />
          </div>
        </div>

        {/* Payment Method Badge */}
        <div
          style={{
            display: "inline-block",
            background: "#f8f9fa",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "600",
            color: THEME.text,
            marginBottom: "24px",
            textTransform: "capitalize",
          }}
        >
          {paymentMethod} Payment
        </div>

        {/* Current Step Text */}
        <h3
          style={{
            color: THEME.text,
            fontWeight: "700",
            marginBottom: "16px",
            fontSize: "24px",
          }}
        >
          {steps[currentStep]?.text || "Processing..."}
        </h3>

        {/* Progress Steps */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginTop: "32px",
          }}
        >
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: index <= currentStep ? step.color : "#e9ecef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  transform: index === currentStep ? "scale(1.2)" : "scale(1)",
                }}
              >
                <FontAwesomeIcon
                  icon={index < currentStep ? faCheckCircle : step.icon}
                  style={{
                    fontSize: "16px",
                    color: index <= currentStep ? "#fff" : "#adb5bd",
                  }}
                />
              </div>
              {index < steps.length - 1 && (
                <div
                  style={{
                    width: "24px",
                    height: "2px",
                    background: index < currentStep ? step.color : "#e9ecef",
                    transition: "all 0.3s ease",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Security Badge */}
        <div
          style={{
            marginTop: "24px",
            padding: "12px",
            background: "#f8f9fa",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "12px",
            color: "#6c757d",
          }}
        >
          <FontAwesomeIcon icon={faLock} />
          256-bit SSL Encrypted Transaction
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
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
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState("");
  const [sdkLoaded, setSdkLoaded] = useState({
    razorpay: false,
    stripe: false,
    paypal: false,
  });

  // New state variables for GST and coupons
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [gstRate, setGstRate] = useState(18); // Default GST rate 18%
  const [baseAmount, setBaseAmount] = useState(0);

  const RAZORPAY_KEY_ID = "rzp_test_D6ffGs0mkGPakV"; // Replace with your test/live Key ID
  const STRIPE_PUBLIC_KEY = "pk_test_YOUR_STRIPE_PUBLIC_KEY"; // Replace with your test/live Public Key
  const PAYPAL_CLIENT_ID =
    "Aeugj_1RLQz2ju0gEpUOV3smZZaKInXpBNcP6G1BOphXp1XprESBPzNjTkrDL-zIe_W3PWZGDKA0gJgh"; // Replace with your test/live Client ID

  // Helper functions for calculations
  const calculateDiscount = () => {
    if (!appliedCoupon || !baseAmount) return 0;
    const discountAmount =
      appliedCoupon.type === "percentage"
        ? (baseAmount * appliedCoupon.value) / 100
        : appliedCoupon.value;
    return Math.min(
      discountAmount,
      appliedCoupon.maxDiscount || discountAmount
    );
  };

  const calculateSubtotal = () => {
    return baseAmount - calculateDiscount();
  };

  const calculateGst = () => {
    return (calculateSubtotal() * gstRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGst();
  };

  // Coupon validation function
  const validateCoupon = async (code) => {
    setCouponLoading(true);
    setCouponError("");

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        "https://primerad-backend.onrender.com/api/coupons/validate",
        {
          couponCode: code,
          packageId: packageId,
          amount: baseAmount,
        }
      );

      if (response.data.valid) {
        setAppliedCoupon({
          code: code,
          type: response.data.type, // 'percentage' or 'fixed'
          value: response.data.value,
          maxDiscount: response.data.maxDiscount,
          description: response.data.description,
        });
        setCouponError("");
      } else {
        setCouponError(response.data.message || "Invalid coupon code");
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError(
        error.response?.data?.message || "Failed to validate coupon"
      );
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      validateCoupon(couponCode.trim());
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

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
          setBaseAmount(mergedPkg.amount); // Set base amount for calculations
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
    setCurrentPaymentMethod("razorpay");
    setPaymentError(null);

    try {
      // 1. Create a Razorpay Order on your Backend with final amount including GST and discount
      const finalAmount = calculateTotal();
      const orderResponse = await axios.post(
        `https://primerad-backend.onrender.com/api/subscription/initiatePayment?packageId=${packageId}`,
        {
          finalAmount,
          couponCode: appliedCoupon?.code,
          gstAmount: calculateGst(),
          discountAmount: calculateDiscount(),
        }
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
                couponCode: appliedCoupon?.code,
                finalAmount,
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
            setCurrentPaymentMethod("");
          }
        },
        prefill: {
          name: "User Name", // User's name (pre-fill from auth if available)
          email: "user@example.com", // User's email
          contact: "9999999999", // User's phone number
        },
        notes: {
          plan: selectedPlanDetails.planName,
          couponCode: appliedCoupon?.code || "",
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
      setCurrentPaymentMethod("");
    }
  }, [
    selectedPlanDetails,
    sdkLoaded.razorpay,
    RAZORPAY_KEY_ID,
    navigate,
    appliedCoupon,
    calculateTotal,
    calculateGst,
    calculateDiscount,
  ]);

  // --- Stripe Integration ---
  const handleStripePayment = useCallback(async () => {
    if (!sdkLoaded.stripe || !selectedPlanDetails?.stripePriceId) return;

    setLoadingPayment(true);
    setCurrentPaymentMethod("stripe");
    setPaymentError(null);

    try {
      // 1. Create a Stripe Checkout Session on your Backend with final amount
      const finalAmount = calculateTotal();
      const sessionResponse = await axios.post(
        "https://primerad-backend.onrender.com/api/payment/stripe-checkout",
        {
          priceId: selectedPlanDetails.stripePriceId, // Stripe Price ID from your plan details
          planName: selectedPlanDetails.planName,
          finalAmount,
          couponCode: appliedCoupon?.code,
          gstAmount: calculateGst(),
          discountAmount: calculateDiscount(),
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
      setCurrentPaymentMethod("");
    }
  }, [
    selectedPlanDetails,
    sdkLoaded.stripe,
    STRIPE_PUBLIC_KEY,
    appliedCoupon,
    calculateTotal,
    calculateGst,
    calculateDiscount,
  ]);

  // --- PayPal Integration ---
  const handlePayPalPayment = useCallback(async () => {
    if (!sdkLoaded.paypal || !selectedPlanDetails) return;

    setLoadingPayment(true);
    setCurrentPaymentMethod("paypal");
    setPaymentError(null);

    try {
      // 1. Create a PayPal Order on your Backend with final amount
      const finalAmount = calculateTotal();
      const orderResponse = await axios.post(
        `https://primerad-backend.onrender.com/api/subscription/paypal-order?userId=${localStorage.getItem(
          "userId"
        )}`,
        {
          amount: finalAmount,
          currency: "USD",
          packageName: selectedPlanDetails.planName,
          packageId: selectedPlanDetails.packageId,
          couponCode: appliedCoupon?.code,
          gstAmount: calculateGst(),
          discountAmount: calculateDiscount(),
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
          setCurrentPaymentMethod("");
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
  }, [
    selectedPlanDetails,
    sdkLoaded.paypal,
    navigate,
    appliedCoupon,
    calculateTotal,
    calculateGst,
    calculateDiscount,
  ]);

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
          setBaseAmount(mergedPkg.amount); // Set base amount for calculations
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

      {/* Payment Animation Modal */}
      <PaymentAnimation
        isVisible={loadingPayment}
        paymentMethod={currentPaymentMethod}
      />

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

              {/* Coupon Section */}
              <div
                style={{
                  background: THEME.card,
                  borderRadius: 18,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  padding: "32px",
                  marginTop: "20px",
                }}
              >
                <h5
                  style={{
                    color: THEME.primary,
                    fontWeight: 700,
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <FontAwesomeIcon icon={faTicket} /> Promo Code
                </h5>

                {!appliedCoupon ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon code"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: `2px solid ${
                            couponError ? "#dc3545" : THEME.border
                          }`,
                          borderRadius: "8px",
                          fontSize: "16px",
                          outline: "none",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={(e) => {
                          if (!couponError) {
                            e.target.style.borderColor = THEME.primary;
                          }
                        }}
                        onBlur={(e) => {
                          if (!couponError) {
                            e.target.style.borderColor = THEME.border;
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleApplyCoupon();
                          }
                        }}
                      />
                      {couponError && (
                        <div
                          style={{
                            color: "#dc3545",
                            fontSize: "12px",
                            marginTop: "4px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                          {couponError}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || couponLoading}
                      style={{
                        background: THEME.secondary,
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 24px",
                        fontWeight: "600",
                        minWidth: "100px",
                        opacity: !couponCode.trim() || couponLoading ? 0.6 : 1,
                      }}
                    >
                      {couponLoading ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div
                    style={{
                      background: "rgba(40, 167, 69, 0.1)",
                      border: "2px solid #28a745",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ color: "#28a745", fontSize: "18px" }}
                      />
                      <div>
                        <div style={{ fontWeight: "600", color: "#28a745" }}>
                          {appliedCoupon.code} Applied!
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {appliedCoupon.description ||
                            `Save ${
                              appliedCoupon.type === "percentage"
                                ? `${appliedCoupon.value}%`
                                : `${appliedCoupon.value}`
                            }`}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={removeCoupon}
                      style={{
                        background: "transparent",
                        border: "1px solid #dc3545",
                        color: "#dc3545",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "12px",
                      }}
                    >
                      Remove
                    </Button>
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
                    {/* Base Amount */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 12,
                        fontSize: "16px",
                      }}
                    >
                      <span style={{ color: THEME.text }}>
                        {planDetails.packageName} Plan
                      </span>
                      <span style={{ fontWeight: 600, color: THEME.text }}>
                        ${baseAmount}
                      </span>
                    </div>

                    {/* Discount Row */}
                    {appliedCoupon && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 12,
                          fontSize: "14px",
                        }}
                      >
                        <span
                          style={{
                            color: "#28a745",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FontAwesomeIcon icon={faTag} />
                          Discount ({appliedCoupon.code})
                        </span>
                        <span style={{ fontWeight: 600, color: "#28a745" }}>
                          -${calculateDiscount().toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Subtotal */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 12,
                        fontSize: "14px",
                      }}
                    >
                      <span style={{ color: THEME.text }}>Subtotal</span>
                      <span style={{ fontWeight: 600, color: THEME.text }}>
                        ${calculateSubtotal().toFixed(2)}
                      </span>
                    </div>

                    {/* GST */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 16,
                        fontSize: "14px",
                      }}
                    >
                      <span style={{ color: THEME.text }}>
                        GST ({gstRate}%)
                      </span>
                      <span style={{ fontWeight: 600, color: THEME.text }}>
                        ${calculateGst().toFixed(2)}
                      </span>
                    </div>

                    <hr
                      style={{ borderColor: THEME.border, margin: "16px 0" }}
                    />

                    {/* Total */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 24,
                        fontSize: "18px",
                      }}
                    >
                      <span style={{ fontWeight: 700, color: THEME.text }}>
                        Total Amount
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: THEME.primary,
                          fontSize: "20px",
                        }}
                      >
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>

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
                            !selectedPlanDetails?.razorpayPlanId
                              ? 0.6
                              : 1,
                        }}
                      >
                        {loadingPayment &&
                        currentPaymentMethod === "razorpay" ? (
                          <>
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              style={{ marginRight: 8 }}
                            />
                            Processing...
                          </>
                        ) : (
                          "Pay with Razorpay"
                        )}
                      </Button>

                      {/* Stripe Button */}
                      <Button
                        onClick={handleStripePayment}
                        disabled={
                          loadingPayment ||
                          !sdkLoaded.stripe ||
                          !selectedPlanDetails?.stripePriceId
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
                            !selectedPlanDetails?.stripePriceId
                              ? 0.6
                              : 1,
                        }}
                      >
                        {loadingPayment && currentPaymentMethod === "stripe" ? (
                          <>
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              style={{ marginRight: 8 }}
                            />
                            Processing...
                          </>
                        ) : (
                          "Pay with Stripe"
                        )}
                      </Button>

                      {/* PayPal Button */}
                      <Button
                        onClick={handlePayPalPayment}
                        disabled={
                          loadingPayment ||
                          !sdkLoaded.paypal ||
                          !selectedPlanDetails?.paypalPlanId
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
                            !selectedPlanDetails?.paypalPlanId
                              ? 0.6
                              : 1,
                        }}
                      >
                        {loadingPayment && currentPaymentMethod === "paypal" ? (
                          <>
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              style={{ marginRight: 8 }}
                            />
                            Processing...
                          </>
                        ) : (
                          "Pay with PayPal"
                        )}
                      </Button>
                    </div>

                    {/* Security Information */}
                    <div
                      style={{
                        marginTop: "24px",
                        padding: "16px",
                        background: "rgba(25, 118, 210, 0.05)",
                        borderRadius: "12px",
                        border: `1px solid ${THEME.border}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                          color: THEME.primary,
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        <FontAwesomeIcon icon={faShieldAlt} />
                        Secure Payment
                      </div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          margin: 0,
                          lineHeight: "1.4",
                        }}
                      >
                        Your payment information is encrypted and secure. We use
                        industry-standard SSL encryption to protect your data.
                      </p>
                    </div>

                    {/* GST Information */}
                    <div
                      style={{
                        marginTop: "16px",
                        padding: "12px",
                        background: "rgba(255, 179, 0, 0.05)",
                        borderRadius: "8px",
                        border: `1px solid ${THEME.border}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          lineHeight: "1.4",
                        }}
                      >
                        <strong>GST Details:</strong> GST @ {gstRate}% is
                        applicable as per Indian tax regulations. GST
                        registration details will be included in your invoice.
                      </div>
                    </div>

                    {/* Payment Error Display */}
                    {paymentError && (
                      <div
                        style={{
                          marginTop: "16px",
                          padding: "12px",
                          background: "#fee",
                          border: "1px solid #fcc",
                          borderRadius: "8px",
                          color: "#c33",
                          fontSize: "14px",
                        }}
                      >
                        {paymentError}
                      </div>
                    )}
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
