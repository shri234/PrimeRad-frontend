import { memo } from "react";
import { Container, Row, Col } from "react-bootstrap";
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
    <footer className="footer-default">
      <Container>
        <div className="footer-minimal-layout">
          {/* Left Section: Logo */}
          <div className="footer-col-left">
            <div className="footer-logo">
              <Logo />
            </div>
          </div>

          {/* Right Section: Legal */}
          <div className="footer-col-right-minimal">
            <ul className="legal-links">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section: Separator and Copyright */}
        <hr className="footer-divider" />
        <div className="footer-bottom-section footer-bottom-minimal">
          <span>© {new Date().getFullYear()} Powered by VIDOCTO</span>
        </div>
      </Container>
    </footer>
  );
});

FooterMinimal.displayName = "FooterMinimal";
export default FooterMinimal;
