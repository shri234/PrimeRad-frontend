import { memo } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../logo";
import "./FooterDefault.css";

const FooterMinimal = memo(() => {
  const legalLinks = [
    { label: "Terms and conditions", path: "/termsAndConditions" },
    { label: "Privacy policy", path: "/privacyPolicy" },
    { label: "Cookie policy", path: "/cookiePolicy" },
    { label: "Refund & Cancellation policy", path: "/refundAndCancellation" },
  ];

  return (
    <footer className="footer-default-minimal">
      <Container>
        <div
          className="footer-minimal-layout"
          style={{
            padding: "10px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left Section: Logo */}
          <div className="footer-col-left">
            <div className="footer-logo">
              <Logo />
            </div>
          </div>

          <div className="footer-col-right-minimal">
            <ul
              className="legal-links"
              style={{
                display: "flex",
                gap: "20px",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    style={{
                      color: "white", // You can adjust the color
                      textDecoration: "none",
                      fontSize: "14px", // Adjust font size as needed
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="footer-divider-minimal" />
        <div
          className="footer-bottom-section footer-bottom-minimal"
          style={{ paddingBottom: "20px" }}
        >
          <span>© {new Date().getFullYear()} Powered by VIDOCTO</span>
        </div>
      </Container>
    </footer>
  );
});

FooterMinimal.displayName = "FooterMinimal";
export default FooterMinimal;
