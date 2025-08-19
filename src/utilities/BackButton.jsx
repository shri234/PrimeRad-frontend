import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const THEME = {
  primary: "#1976d2",
  secondary: "#00bfae",
  background: "#f4f8fb",
  card: "#fff",
  accent: "#ffb300",
  text: "#263238",
  border: "#e0e0e0",
  lightGray: "#64748b",
};

// Main BackButton Component with multiple variants
const BackButton = ({
  variant = "default",
  size = "medium",
  customText = null,
  customPath = null,
  className = "",
  style = {},
  showIcon = true,
  iconPosition = "left",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (customPath) {
      navigate(customPath);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  // Size configurations
  const sizes = {
    small: {
      padding: "8px 16px",
      fontSize: "14px",
      iconSize: "14px",
      minHeight: "36px",
    },
    medium: {
      padding: "12px 20px",
      fontSize: "16px",
      iconSize: "16px",
      minHeight: "44px",
    },
    large: {
      padding: "16px 28px",
      fontSize: "18px",
      iconSize: "18px",
      minHeight: "52px",
    },
  };

  // Variant configurations
  const variants = {
    default: {
      background: THEME.card,
      color: THEME.text,
      border: `2px solid ${THEME.border}`,
      hoverBackground: THEME.background,
      hoverColor: THEME.primary,
      hoverBorder: THEME.primary,
      shadow: "0 2px 8px rgba(0,0,0,0.08)",
      hoverShadow: "0 4px 16px rgba(0,0,0,0.12)",
    },
    primary: {
      background: THEME.primary,
      color: "#fff",
      border: `2px solid ${THEME.primary}`,
      hoverBackground: "#1565c0",
      hoverColor: "#fff",
      hoverBorder: "#1565c0",
      shadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
      hoverShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
    },
    secondary: {
      background: THEME.secondary,
      color: "#fff",
      border: `2px solid ${THEME.secondary}`,
      hoverBackground: "#00a693",
      hoverColor: "#fff",
      hoverBorder: "#00a693",
      shadow: "0 4px 12px rgba(0, 191, 174, 0.3)",
      hoverShadow: "0 6px 20px rgba(0, 191, 174, 0.4)",
    },
    ghost: {
      background: "transparent",
      color: THEME.text,
      border: "2px solid transparent",
      hoverBackground: "rgba(25, 118, 210, 0.08)",
      hoverColor: THEME.primary,
      hoverBorder: "transparent",
      shadow: "none",
      hoverShadow: "none",
    },
    minimal: {
      background: "transparent",
      color: THEME.lightGray,
      border: "none",
      hoverBackground: "transparent",
      hoverColor: THEME.primary,
      hoverBorder: "none",
      shadow: "none",
      hoverShadow: "none",
    },
    floating: {
      background: THEME.card,
      color: THEME.text,
      border: "none",
      hoverBackground: THEME.card,
      hoverColor: THEME.primary,
      hoverBorder: "none",
      shadow: "0 8px 25px rgba(0,0,0,0.15)",
      hoverShadow: "0 12px 35px rgba(0,0,0,0.2)",
    },
  };

  const currentSize = sizes[size];
  const currentVariant = variants[variant];

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: showIcon ? "8px" : "0",
    padding: currentSize.padding,
    fontSize: currentSize.fontSize,
    fontWeight: 600,
    minHeight: currentSize.minHeight,
    background: currentVariant.background,
    color: currentVariant.color,
    border: currentVariant.border,
    borderRadius: variant === "floating" ? "50px" : "12px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    textDecoration: "none",
    boxShadow: currentVariant.shadow,
    position: "relative",
    overflow: "hidden",
    userSelect: "none",
    ...style,
  };

  const getText = () => {
    if (customText) return customText;

    switch (variant) {
      case "minimal":
        return "Back";
      case "floating":
        return "";
      default:
        return "Go Back";
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "minimal":
        return faChevronLeft;
      default:
        return faArrowLeft;
    }
  };

  return (
    <button
      onClick={handleBack}
      className={className}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.target.style.background = currentVariant.hoverBackground;
        e.target.style.color = currentVariant.hoverColor;
        e.target.style.border = `2px solid ${currentVariant.hoverBorder}`;
        e.target.style.boxShadow = currentVariant.hoverShadow;
        if (variant !== "minimal" && variant !== "ghost") {
          e.target.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.background = currentVariant.background;
        e.target.style.color = currentVariant.color;
        e.target.style.border = currentVariant.border;
        e.target.style.boxShadow = currentVariant.shadow;
        e.target.style.transform = "translateY(0)";
      }}
      onMouseDown={(e) => {
        e.target.style.transform =
          variant === "floating" ? "scale(0.95)" : "translateY(0)";
      }}
      onMouseUp={(e) => {
        e.target.style.transform =
          variant === "floating" ? "scale(1)" : "translateY(-2px)";
      }}
    >
      {/* Ripple effect for floating variant */}
      {variant === "floating" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, transparent 70%)",
            opacity: 0,
            transform: "scale(0)",
            transition: "all 0.6s ease",
            pointerEvents: "none",
          }}
          className="ripple-effect"
        />
      )}

      {showIcon && iconPosition === "left" && (
        <FontAwesomeIcon
          icon={getIcon()}
          style={{
            fontSize: currentSize.iconSize,
            transition: "transform 0.3s ease",
          }}
        />
      )}

      {getText() && (
        <span
          style={{
            fontWeight: variant === "minimal" ? 500 : 600,
            letterSpacing: variant === "minimal" ? "0" : "0.5px",
          }}
        >
          {getText()}
        </span>
      )}

      {showIcon && iconPosition === "right" && (
        <FontAwesomeIcon
          icon={getIcon()}
          style={{
            fontSize: currentSize.iconSize,
            transition: "transform 0.3s ease",
          }}
        />
      )}
    </button>
  );
};

const FixedBackButton = ({
  position = "top-left",
  variant = "floating",
  size = "small",
  customPath = null,
  topOffset = "70px",
}) => {
  const positions = {
    "top-left": { top: topOffset, left: "10px" },
    "top-right": { top: topOffset, right: "24px" },
    "bottom-left": { bottom: "24px", left: "24px" },
    "bottom-right": { bottom: "24px", right: "24px" },
  };

  return (
    <div style={{ position: "fixed", zIndex: 1000, ...positions[position] }}>
      <BackButton
        variant={variant}
        size={size}
        customPath={customPath}
        showIcon={true}
        customText=""
      />
    </div>
  );
};

// Breadcrumb-style Back Button
const BreadcrumbBack = ({
  currentPage = "Current Page",
  previousPage = "Previous Page",
  customPath = null,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (customPath) {
      navigate(customPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "24px",
        fontSize: "14px",
        color: THEME.lightGray,
      }}
    >
      <button
        onClick={handleBack}
        style={{
          background: "none",
          border: "none",
          color: THEME.primary,
          cursor: "pointer",
          padding: "4px 8px",
          borderRadius: "6px",
          transition: "all 0.2s ease",
          fontSize: "14px",
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(25, 118, 210, 0.08)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "none";
        }}
      >
        {previousPage}
      </button>
      <FontAwesomeIcon
        icon={faChevronLeft}
        style={{ fontSize: "12px", transform: "rotate(180deg)" }}
      />
      <span style={{ fontWeight: 600, color: THEME.text }}>{currentPage}</span>
    </div>
  );
};

// Usage Examples Component
const BackButtonExamples = () => {
  return (
    <div
      style={{
        padding: "40px",
        background: THEME.background,
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: THEME.text, marginBottom: "40px" }}>
          Back Button Examples
        </h1>

        <div
          style={{
            display: "grid",
            gap: "32px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {/* Default Variants */}
          <div
            style={{
              background: THEME.card,
              padding: "24px",
              borderRadius: "16px",
            }}
          >
            <h3 style={{ marginBottom: "20px", color: THEME.text }}>
              Default Variants
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <BackButton variant="default" />
              <BackButton variant="primary" />
              <BackButton variant="secondary" />
              <BackButton variant="ghost" />
              <BackButton variant="minimal" />
              <BackButton variant="floating" />
            </div>
          </div>

          {/* Different Sizes */}
          <div
            style={{
              background: THEME.card,
              padding: "24px",
              borderRadius: "16px",
            }}
          >
            <h3 style={{ marginBottom: "20px", color: THEME.text }}>
              Different Sizes
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <BackButton
                variant="primary"
                size="small"
                customText="Small Back"
              />
              <BackButton
                variant="primary"
                size="medium"
                customText="Medium Back"
              />
              <BackButton
                variant="primary"
                size="large"
                customText="Large Back"
              />
            </div>
          </div>

          {/* Custom Text & Icons */}
          <div
            style={{
              background: THEME.card,
              padding: "24px",
              borderRadius: "16px",
            }}
          >
            <h3 style={{ marginBottom: "20px", color: THEME.text }}>
              Custom Options
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <BackButton
                customText="← Return to Dashboard"
                variant="ghost"
                showIcon={false}
              />
              <BackButton customText="Back to Products" variant="default" />
              <BackButton
                customText="Previous Step"
                variant="secondary"
                iconPosition="right"
              />
              <BackButton customText="" variant="floating" size="large" />
            </div>
          </div>

          {/* Breadcrumb Style */}
          <div
            style={{
              background: THEME.card,
              padding: "24px",
              borderRadius: "16px",
            }}
          >
            <h3 style={{ marginBottom: "20px", color: THEME.text }}>
              Breadcrumb Style
            </h3>
            <BreadcrumbBack
              previousPage="Dashboard"
              currentPage="Pricing Plans"
            />
            <BreadcrumbBack
              previousPage="Products"
              currentPage="Product Details"
            />
          </div>
        </div>

        {/* Usage Instructions */}
        <div
          style={{
            background: THEME.card,
            padding: "32px",
            borderRadius: "16px",
            marginTop: "40px",
            border: `1px solid ${THEME.border}`,
          }}
        >
          <h3 style={{ color: THEME.text, marginBottom: "20px" }}>
            How to Use
          </h3>
          <div
            style={{
              background: THEME.background,
              padding: "20px",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "14px",
              color: THEME.text,
              marginBottom: "20px",
            }}
          >
            {`// Import the component
import BackButton, { FixedBackButton, BreadcrumbBack } from './BackButton';

// Basic usage
<BackButton />

// With custom variant and size
<BackButton variant="primary" size="large" />

// With custom text and path
<BackButton 
  customText="Back to Home" 
  customPath="/dashboard" 
  variant="secondary" 
/>

// Fixed position (floating over content)
<FixedBackButton position="top-left" topOffset="100px" />

// With custom top offset for different nav heights
<FixedBackButton position="top-right" topOffset="120px" />

// Breadcrumb style
<BreadcrumbBack 
  previousPage="Dashboard" 
  currentPage="Settings" 
/>`}
          </div>

          <h4 style={{ color: THEME.text, marginBottom: "12px" }}>
            Available Props:
          </h4>
          <ul style={{ color: THEME.lightGray, lineHeight: 1.6 }}>
            <li>
              <code>variant</code>: "default" | "primary" | "secondary" |
              "ghost" | "minimal" | "floating"
            </li>
            <li>
              <code>size</code>: "small" | "medium" | "large"
            </li>
            <li>
              <code>customText</code>: Custom button text
            </li>
            <li>
              <code>customPath</code>: Custom navigation path (instead of going
              back)
            </li>
            <li>
              <code>showIcon</code>: Show/hide the back arrow icon
            </li>
            <li>
              <code>iconPosition</code>: "left" | "right"
            </li>
            <li>
              <code>className</code>: Additional CSS classes
            </li>
            <li>
              <code>style</code>: Additional inline styles
            </li>
            <li>
              <code>topOffset</code>: Custom top spacing for FixedBackButton
              (e.g., "100px")
            </li>
          </ul>
        </div>
      </div>

      {/* Fixed Back Button Demo */}
      <FixedBackButton position="top-right" />
    </div>
  );
};

export default BackButton;
export { FixedBackButton, BreadcrumbBack, BackButtonExamples };
