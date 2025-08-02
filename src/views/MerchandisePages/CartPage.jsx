import React, { Fragment, memo, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BreadCrumbWidget from "../../components/BreadcrumbWidget";
import HeaderDefault from "../../components/partials/HeaderDefault";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faCreditCard,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

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
      <BreadCrumbWidget title="CME Subscription" />
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
                      <span style={{ color: THEME.text }}>
                        {planDetails.packageName}
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
                    <button
                      style={{
                        background: THEME.primary,
                        color: THEME.card,
                        fontWeight: 700,
                        fontSize: 18,
                        border: "none",
                        borderRadius: 12,
                        padding: "16px",
                        width: "100%",
                        boxShadow: "0 4px 15px rgba(25,118,210,0.2)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                      onClick={() =>
                        navigate("/payment", {
                          state: { packageId: packageId },
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faCreditCard} />
                      Pay
                    </button>
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
