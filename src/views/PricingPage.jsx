import { Fragment, memo, useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BreadcrumbWidget from "../components/BreadcrumbWidget";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FixedBackButton } from "../utilities/BackButton";
import axios from "axios";

const THEME = {
  primary: "#1976d2",
  secondary: "#00bfae",
  background: "#f4f8fb",
  card: "#fff",
  accent: "#ffb300",
  text: "#263238",
  border: "#e0e0e0",
};

// Enhanced Tab Component with modern styling
const TabSelector = ({ options, activeTab, onTabChange, label }) => (
  <div
    style={
      {
        // marginBottom: "4px"
      }
    }
  >
    <h5
      style={{
        color: THEME.text,
        marginBottom: "12px",
        fontWeight: 600,
        fontSize: "16px",
      }}
    >
      {label}
    </h5>
    <div
      style={{
        display: "flex",
        background: "#f8fafc",
        borderRadius: "12px",
        // padding: "4px",
        border: `1px solid ${THEME.border}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        gap: "2px",
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onTabChange(option.value)}
          style={{
            flex: 1,
            padding: "10px 10px",
            border: "none",
            borderRadius: "10px",
            background:
              activeTab === option.value ? THEME.primary : "transparent",
            color: activeTab === option.value ? "#fff" : THEME.text,
            fontWeight: activeTab === option.value ? 700 : 500,
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== option.value) {
              e.target.style.background = "#e2e8f0";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== option.value) {
              e.target.style.background = "transparent";
            }
          }}
        >
          {option.label}
          {activeTab === option.value && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "#fff",
                borderRadius: "1px",
              }}
            />
          )}
        </button>
      ))}
    </div>
  </div>
);

// Enhanced Pricing Card with billing period adjustments
const PricingCard = ({ pkg, navigate, billingPeriod, userType }) => {
  // Calculate price based on billing period
  const getAdjustedPrice = () => {
    if (pkg.amount === 0) return 0;

    // If the package is monthly and we want annual, multiply by 12 with discount
    if (pkg.durationUnit === "month" && billingPeriod === "annually") {
      return Math.round(pkg.amount * 12 * 0.83); // 17% annual discount
    }

    // If the package is annual and we want monthly, divide by 12
    if (pkg.durationUnit === "year" && billingPeriod === "monthly") {
      return Math.round((pkg.amount / 12) * 100) / 100;
    }

    return pkg.amount;
  };

  const getPeriodLabel = () => {
    return billingPeriod === "annually" ? "/year" : "/month";
  };

  const adjustedPrice = getAdjustedPrice();
  const originalMonthlyPrice =
    pkg.durationUnit === "month" ? pkg.amount : pkg.amount / 12;

  return (
    <div
      style={{
        background: THEME.card,
        borderRadius: 18,
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        padding: "32px",
        textAlign: "center",
        position: "relative",
        height: "100%",
        border:
          pkg.packageName === "Premium" || pkg.packageName === "Pro"
            ? `2px solid ${THEME.primary}`
            : "none",
        transform: "translateY(0)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)";
      }}
    >
      {(pkg.packageName === "Premium" || pkg.packageName === "Pro") && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 20,
            background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
            color: THEME.card,
            padding: "6px 16px",
            borderRadius: "0 0 12px 12px",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Most Popular
        </div>
      )}

      {billingPeriod === "annually" && pkg.amount > 0 && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: THEME.accent,
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          Save 17%
        </div>
      )}

      <h4 style={{ color: THEME.primary, fontWeight: 700, marginBottom: 16 }}>
        {pkg.packageName}
      </h4>

      <div style={{ marginBottom: 8 }}>
        <h2 style={{ color: THEME.text, fontWeight: 700, marginBottom: 4 }}>
          {adjustedPrice === 0 ? "Free" : `$${adjustedPrice.toFixed(2)}`}
          <span style={{ fontSize: 16, color: THEME.text, fontWeight: 400 }}>
            {adjustedPrice > 0 ? getPeriodLabel() : ""}
          </span>
        </h2>
        {billingPeriod === "annually" && adjustedPrice > 0 && (
          <p
            style={{
              fontSize: 14,
              color: "#64748b",
              margin: 0,
              textDecoration: "line-through",
            }}
          >
            ${(originalMonthlyPrice * 12).toFixed(2)}/year
          </p>
        )}
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "24px 0" }}>
        {(pkg.features || []).length > 0 ? (
          pkg.features.map((feature, idx) => (
            <li
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 12,
                marginBottom: 14,
                color: THEME.text,
                fontSize: 14,
                textAlign: "left",
              }}
            >
              <FontAwesomeIcon
                icon={faCheck}
                style={{
                  color: THEME.secondary,
                  fontSize: 12,
                  minWidth: 16,
                }}
              />
              {feature}
            </li>
          ))
        ) : (
          <>
            {pkg.packageName === "Free" && (
              <>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Access to limited CME courses
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Online articles
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Basic support
                </li>
              </>
            )}
            {pkg.packageName === "Basic" && (
              <>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Access to 10 CME courses
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Online support
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Certificate of completion
                </li>
              </>
            )}
            {(pkg.packageName === "Pro" || pkg.packageName === "Premium") && (
              <>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Access to all CME courses
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Unlimited lectures
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Priority support
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Certificate of completion
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Offline access to materials
                </li>
              </>
            )}
            {pkg.packageName === "Enterprise" && (
              <>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Customized for your institution
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Dedicated account manager
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
                  Advanced reporting
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: THEME.secondary, fontSize: 12 }}
                  />
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
              ? `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`
              : THEME.secondary,
          color: THEME.card,
          fontWeight: 700,
          fontSize: 16,
          border: "none",
          borderRadius: 12,
          padding: "16px 24px",
          width: "100%",
          cursor: "pointer",
          transition: "all 0.3s ease",
          textTransform: "capitalize",
          letterSpacing: "0.5px",
        }}
        onClick={() =>
          navigate("/cart", {
            state: {
              packageId: pkg._id,
              billingPeriod: billingPeriod,
              userType: userType,
              amount: pkg.amount,
              adjustedPrice: adjustedPrice,
            },
          })
        }
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "none";
        }}
      >
        {pkg.packageName === "Enterprise"
          ? "Contact Sales"
          : `Choose ${pkg.packageName}`}
      </button>
    </div>
  );
};

const PricingPage = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState("student"); // Default to student
  const [billingPeriod, setBillingPeriod] = useState("annually"); // Default to annually

  const userTypeOptions = [
    { value: "student", label: "Student" },
    { value: "consultant", label: "Consultant" },
  ];

  const billingPeriodOptions = [
    { value: "annually", label: "Annual" },
    { value: "monthly", label: "Monthly" },
  ];

  useEffect(() => {
    const fetchPricingPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://primerad-backend.onrender.com/api/subscription/get"
        );
        if (response.data && Array.isArray(response.data.data)) {
          const sortedPlans = response.data.data.sort(
            (a, b) => a.amount - b.amount
          );

          const plansWithFeatures = sortedPlans.map((plan) => ({
            ...plan,
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
  }, []);

  return (
    <Fragment>
      <div
        className="section-padding"
        style={{
          backgroundColor: THEME.background,
          minHeight: "100vh",
        }}
      >
        <FixedBackButton customPath="/home" />
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center mb-5">
              <h1
                style={{
                  color: THEME.text,
                  fontWeight: 700,
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                }}
              >
                Find the Perfect Plan for Your Needs
              </h1>
              <p
                style={{
                  color: THEME.text,
                  fontSize: 18,
                  opacity: 0.8,
                  lineHeight: 1.6,
                }}
              >
                Choose the subscription that best fits your professional
                development goals and start learning today.
              </p>
            </Col>
          </Row>

          {/* Tab Selectors */}
          <Row className="justify-content-center mb-5">
            <Col lg={8}>
              <div
                style={{
                  background: THEME.card,
                  borderRadius: 20,
                  padding: "32px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  border: `1px solid ${THEME.border}`,
                }}
              >
                <Row>
                  <Col md={6}>
                    <TabSelector
                      options={userTypeOptions}
                      activeTab={userType}
                      onTabChange={setUserType}
                      label="Account Type"
                    />
                  </Col>
                  <Col md={6}>
                    <TabSelector
                      options={billingPeriodOptions}
                      activeTab={billingPeriod}
                      onTabChange={setBillingPeriod}
                      label="Billing Period"
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {loading ? (
            <Row>
              <Col className="text-center py-5">
                <div
                  style={{
                    display: "inline-block",
                    width: 40,
                    height: 40,
                    border: `4px solid ${THEME.border}`,
                    borderTop: `4px solid ${THEME.primary}`,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <p style={{ marginTop: 20, color: THEME.text }}>
                  Loading pricing plans...
                </p>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </Col>
            </Row>
          ) : error ? (
            <Row>
              <Col className="text-center py-5">
                <div
                  style={{
                    background: "#fef2f2",
                    color: "#dc2626",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #fecaca",
                  }}
                >
                  <strong>Error:</strong> {error}
                </div>
              </Col>
            </Row>
          ) : pricingPlans.length === 0 ? (
            <Row>
              <Col className="text-center py-5">
                <p style={{ color: THEME.text }}>
                  No pricing plans available at the moment.
                </p>
              </Col>
            </Row>
          ) : (
            <Row className="justify-content-center">
              {pricingPlans.map((pkg, idx) => (
                <Col key={pkg._id || idx} lg="4" md="6" className="mb-4">
                  <PricingCard
                    pkg={pkg}
                    navigate={navigate}
                    billingPeriod={billingPeriod}
                    userType={userType}
                  />
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
