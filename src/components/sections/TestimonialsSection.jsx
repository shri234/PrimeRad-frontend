import React, { useEffect } from "react";
import AOS from "aos";

const testimonials = [
  {
    text: "“PrimeRad Academy has revolutionized my CME. The content is top-notch and the assessments are invaluable.”",
    name: "Dr. Emily White",
    title: "Radiologist",
  },
  {
    text: "“The interactive cases and expert lectures have helped me stay updated and confident in my practice.”",
    name: "Dr. Michael Chen",
    title: "Orthopedic Surgeon",
  },
  {
    text: "“The platform is user-friendly and the community support is fantastic. Highly recommended!”",
    name: "Dr. Sarah Johnson",
    title: "Pediatrician",
  },
];

export default function TestimonialsSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section style={{ background: "#f4f8ff", padding: "48px 0" }}>
      <h2
        data-aos="fade-up"
        style={{
          textAlign: "center",
          fontWeight: 900,
          fontSize: 38,
          marginBottom: 36,
          color: "#111",
          letterSpacing: -1,
        }}
      >
        What Our Users Say
      </h2>
      <div
        className="testimonials-row"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 32,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            data-aos="fade-up"
            data-aos-delay={100 * (idx + 1)}
            style={{
              background: "#eaf3ff",
              borderRadius: 18,
              boxShadow: "0 2px 12px rgba(33, 150, 243, 0.06)",
              padding: "36px 32px",
              width: 340,
              minWidth: 0,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Quote Icon */}
            <div style={{ marginBottom: 18 }}>
              <svg
                width="48"
                height="48"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="4"
                  stroke="#2563eb"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M8 12h8M8 16h4"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div
              style={{
                fontStyle: "italic",
                color: "#444",
                fontSize: 18,
                marginBottom: 18,
              }}
            >
              {t.text}
            </div>
            <div style={{ fontWeight: 700, color: "#2563eb", fontSize: 18 }}>
              - {t.name}
            </div>
            <div style={{ color: "#888", fontSize: 16 }}>{t.title}</div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 1100px) {
          .testimonials-row { flex-direction: column !important; align-items: center !important; }
        }
        @media (max-width: 900px) {
          .testimonials-row { flex-direction: column !important; align-items: center !important; }
        }
        @media (max-width: 700px) {
          .testimonials-row { flex-direction: column !important; align-items: center !important; }
        }
      `}</style>
    </section>
  );
}
