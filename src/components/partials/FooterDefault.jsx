import { memo, Fragment, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Logo from "../logo";
import apple from "/assets/images/footer/apple.webp";
import playstore from "/assets/images/footer/google-play.webp";
import { useTranslation } from "react-i18next";
import "./FooterDefault.css";

const FooterMega = memo(() => {
  return (
    <footer
      className="footer footer-default"
      style={{
        background: "darkslategrey",
        color: "#fff",
        padding: "18px 0",
        borderTop: "1px solid #222",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 64,
        position: "relative",
        zIndex: 999,
      }}
    >
      <div style={{ marginLeft: 32 }}>
        <Logo />
      </div>
      <div
        style={{
          marginRight: 32,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span>
          © {new Date().getFullYear()} <b>VIDOCTO</b>. All rights reserved.
        </span>
        <span style={{ margin: "0 8px" }}>|</span>
        <Link
          to="/privacyPolicy"
          style={{
            color: "#fff",
            textDecoration: "underline",
            fontWeight: 500,
          }}
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
});
FooterMega.displayName = "FooterMega";
export default FooterMega;
