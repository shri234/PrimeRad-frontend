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
            padding: "5px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "40px",
          }}
        >
          <div className="footer-col-left">
            <div className="footer-logo" style={{ maxHeight: "20px" }}>
              <Logo />
            </div>
          </div>

          <div className="footer-col-right-minimal">
            <ul
              className="legal-links"
              style={{
                display: "flex",
                gap: "15px", // slightly reduced gap
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
                      color: "white",
                      textDecoration: "none",
                      fontSize: "13px", // slightly smaller font
                      lineHeight: "1", // compact line-height
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr
          className="footer-divider-minimal"
          style={{ margin: "8px 0" }} // tighter divider spacing
        />

        <div
          className="footer-bottom-section footer-bottom-minimal"
          style={{
            paddingBottom: "4px", // reduced bottom padding
            fontSize: "13px",
            lineHeight: "1",
          }}
        >
          <span>© {new Date().getFullYear()} Powered by VIDOCTO</span>
        </div>
      </Container>
    </footer>
  );
});

FooterMinimal.displayName = "FooterMinimal";
export default FooterMinimal;
