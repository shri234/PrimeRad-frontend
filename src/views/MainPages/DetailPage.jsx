import React from "react";

const THEME = {
  primary: "#1976d2",
  background: "#f4f8fb",
  card: "#fff",
  text: "#263238",
};

const VIMEO_URL =
  "https://player.vimeo.com/video/1079623899?h=5a6d5a0a9a&title=0&byline=0&portrait=0";

const DetailPage = () => {
  return (
    <div
      style={{
        background: THEME.background,
        minHeight: "100vh",
        paddingTop: 70,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <iframe
        src={VIMEO_URL}
        title="Vimeo Video"
        width="100%"
        height="700px"
        style={{ border: 0, borderRadius: 16, maxWidth: 1200, minHeight: 600 }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
      <footer
        style={{
          background: "#fff",
          borderTop: "1px solid #e0e0e0",
          padding: "18px 0",
          textAlign: "center",
          fontSize: "1rem",
          color: "#888",
          marginTop: 32,
        }}
      >
        <div>
          © {new Date().getFullYear()}{" "}
          <span style={{ color: "#1976d2", fontWeight: 600 }}>VIDOCTO</span>.
          All rights reserved. | Privacy Policy
        </div>
      </footer>
    </div>
  );
};

export default DetailPage;
