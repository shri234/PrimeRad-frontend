import { Fragment, memo, useState, useEffect } from "react"; // Add useState, useEffect
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BreadcrumbWidget from "../components/BreadcrumbWidget";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import axios for API calls

const THEME = {
  primary: "#1976d2",
  secondary: "#00bfae",
  background: "#f4f8fb",
  card: "#fff",
  accent: "#ffb300",
  text: "#263238",
  border: "#e0e0e0",
};

// PricingCard component remains largely the same, but it will now receive
// a 'package' object directly from the fetched data, and pass its _id.
const PricingCard = (
  { pkg, navigate } // Renamed 'plan' prop to 'pkg' for clarity
) => (
  <div
    style={{
      background: THEME.card,
      borderRadius: 18,
      boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
      padding: "32px",
      textAlign: "center",
      position: "relative",
      height: "100%",
      // Assuming 'popular' status is derived from pkg data or hardcoded based on name
      border:
        pkg.packageName === "Premium" || pkg.packageName === "Pro"
          ? `2px solid ${THEME.primary}`
          : "none",
    }}
  >
    {(pkg.packageName === "Premium" || pkg.packageName === "Pro") && ( // Show "Popular" badge for "Pro" or "Premium"
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 20,
          background: THEME.primary,
          color: THEME.card,
          padding: "4px 12px",
          borderRadius: "0 0 6px 6px",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        Popular
      </div>
    )}
    <h4 style={{ color: THEME.primary, fontWeight: 700, marginBottom: 16 }}>
      {pkg.packageName} {/* Display actual package name */}
    </h4>
    <h2 style={{ color: THEME.text, fontWeight: 700, marginBottom: 8 }}>
      {pkg.amount === 0 ? "Free" : `$${pkg.amount.toFixed(2)}`}{" "}
      {/* Display amount, format if needed */}
      <span style={{ fontSize: 16, color: THEME.text, fontWeight: 400 }}>
        {pkg.amount > 0 ? `/${pkg.durationUnit}` : ""}{" "}
        {/* Display durationUnit if not free */}
      </span>
    </h2>
    <ul style={{ listStyle: "none", padding: 0, margin: "24px 0" }}>
      {/* Features will likely be hardcoded or conditionally generated if not from API */}
      {/* For this example, I'll use a mock mapping based on pkg.packageName if not directly from API */}
      {(pkg.features || []).length > 0 ? (
        pkg.features.map(
          (
            feature,
            idx // If API provides features
          ) => (
            <li
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginBottom: 12,
                color: THEME.text,
              }}
            >
              <FontAwesomeIcon
                icon={faCheck}
                style={{ color: THEME.secondary }}
              />
              {feature}
            </li>
          )
        ) // Fallback mock features if API doesn't provide them
      ) : (
        <>
          {pkg.packageName === "Free" && (
            <>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Access to limited CME courses
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Online articles
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Basic support
              </li>
            </>
          )}
          {pkg.packageName === "Basic" && (
            <>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Access to 10 CME courses
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Online support
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Certificate of completion
              </li>
            </>
          )}
          {(pkg.packageName === "Pro" || pkg.packageName === "Premium") && ( // For "Pro" or "Premium"
            <>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Access to all CME courses
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Unlimited lectures
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Priority support
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Certificate of completion
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Offline access to materials
              </li>
            </>
          )}
          {pkg.packageName === "Enterprise" && (
            <>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Customized for your institution
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Dedicated account manager
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                Advanced reporting
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: THEME.secondary }}
                />{" "}
                All Pro features
              </li>
            </>
          )}
        </>
      )}
    </ul>
    <button
      style={{
        background:
          pkg.packageName === "Pro" || pkg.packageName === "Premium"
            ? THEME.primary
            : THEME.secondary,
        color: THEME.card,
        fontWeight: 700,
        fontSize: 18,
        border: "none",
        borderRadius: 12,
        padding: "16px",
        width: "100%",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      // CRITICAL CHANGE: Pass pkg._id via state to PaymentPage
      onClick={() => navigate("/cart", { state: { packageId: pkg._id } })}
    >
      {pkg.packageName === "Enterprise"
        ? "Contact Sales"
        : `Select ${pkg.packageName}`}
    </button>
  </div>
);

const PricingPage = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPricingPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/subscription/get"
        ); // Your API endpoint
        if (response.data && Array.isArray(response.data.data)) {
          // Assuming API returns { data: [...] }
          // Sort plans by amount or a custom order if needed
          const sortedPlans = response.data.data.sort(
            (a, b) => a.amount - b.amount
          );

          // If your backend doesn't provide 'features' directly, you might merge here
          const plansWithFeatures = sortedPlans.map((plan) => ({
            ...plan,
            // Example: Assign features based on packageName if not provided by backend
            features:
              plan.features ||
              (plan.packageName === "Free"
                ? [
                    "Access to limited CME courses",
                    "Online articles",
                    "Basic support",
                  ]
                : plan.packageName === "Basic"
                ? [
                    "Access to 10 CME courses",
                    "Online support",
                    "Certificate of completion",
                  ]
                : plan.packageName === "Pro" || plan.packageName === "Premium"
                ? [
                    "Access to all CME courses",
                    "Unlimited lectures",
                    "Priority support",
                    "Certificate of completion",
                    "Offline access to materials",
                  ]
                : plan.packageName === "Enterprise"
                ? [
                    "Customized for your institution",
                    "Dedicated account manager",
                    "Advanced reporting",
                    "All Pro features",
                  ]
                : []),
          }));

          setPricingPlans(plansWithFeatures);
        } else {
          setError("No pricing plans found.");
          setPricingPlans([]);
        }
      } catch (err) {
        console.error("Error fetching pricing plans:", err);
        setError("Failed to load pricing plans. Please try again later.");
        setPricingPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingPlans();
  }, []); // Run once on mount

  return (
    <Fragment>
      <BreadcrumbWidget title="Subscription" />
      <div
        className="section-padding"
        style={{ backgroundColor: THEME.background }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center mb-5">
              <h2 style={{ color: THEME.text, fontWeight: 700 }}>
                Find the Perfect Plan for Your Needs
              </h2>
              <p style={{ color: THEME.text, fontSize: 18 }}>
                Choose the subscription that best fits your professional
                development goals.
              </p>
            </Col>
          </Row>
          {loading ? (
            <Row>
              <Col className="text-center py-5">
                <p>Loading pricing plans...</p>
              </Col>
            </Row>
          ) : error ? (
            <Row>
              <Col className="text-center py-5">
                <p style={{ color: "red" }}>Error: {error}</p>
              </Col>
            </Row>
          ) : pricingPlans.length === 0 ? (
            <Row>
              <Col className="text-center py-5">
                <p>No pricing plans available at the moment.</p>
              </Col>
            </Row>
          ) : (
            <Row>
              {pricingPlans.map((pkg, idx) => (
                <Col key={pkg._id || idx} lg="4" md="6" className="mb-4">
                  {" "}
                  {/* Use pkg._id for key */}
                  <PricingCard pkg={pkg} navigate={navigate} />{" "}
                  {/* Pass 'pkg' */}
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </Fragment>
  );
});

PricingPage.displayName = "PricingPage";
export default PricingPage;
