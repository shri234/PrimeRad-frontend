import { memo, Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../logo";
import {
  FaFacebookSquare,
  FaTwitterSquare,
  FaYoutubeSquare,
  FaInstagramSquare,
  FaLinkedin,
} from "react-icons/fa";
import "./FooterDefault.css";

const FooterMega = memo(() => {
  const socialMediaLinks = [
    {
      icon: <FaFacebookSquare size={24} />,
      label: "Facebook",
      url: "https://www.facebook.com/primerad/",
    },
    {
      icon: <FaTwitterSquare size={24} />,
      label: "Twitter / X",
      url: "https://twitter.com/primerad",
    },
    {
      icon: <FaYoutubeSquare size={24} />,
      label: "YouTube",
      url: "https://www.youtube.com/channel/UC-P1D2kFp_tFp-G4-sHj_1g",
    },
    {
      icon: <FaInstagramSquare size={24} />,
      label: "Instagram",
      url: "https://www.instagram.com/primerad/",
    },
    {
      icon: <FaLinkedin size={24} />,
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/primerad/",
    },
  ];

  const legalLinks = [
    { label: "Terms and conditions", path: "/termsAndConditions" },
    { label: "Privacy policy", path: "/privacyPolicy" },
    { label: "Cookie policy", path: "/cookiePolicy" },
    { label: "Refund & Cancellation policy", path: "/refundAndCancellation" },
  ];

  return (
    <footer className="footer-default">
      <Container>
        <div className="footer-top-section">
          {/* Left Section: Logo and Description */}
          <div className="footer-col-left">
            <div className="footer-logo">
              <Logo />
            </div>
            <p>
              A world-class platform dedicated to advancing radiology education
              through innovative learning modules, interactive case studies, and
              expert-led sessions
            </p>
          </div>

          {/* Middle Section: Social Media */}
          <div className="footer-col-middle">
            <h5>Social Media</h5>
            <ul className="social-links">
              {socialMediaLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.icon} {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Section: Legal */}
          <div className="footer-col-right">
            <h5>Legal</h5>
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
        <div className="footer-bottom-section">
          <span>© {new Date().getFullYear()} Powered by VIDOCTO</span>
        </div>
      </Container>
    </footer>
  );
});

FooterMega.displayName = "FooterMega";
export default FooterMega;
