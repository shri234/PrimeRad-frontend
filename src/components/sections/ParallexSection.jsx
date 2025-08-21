import { Fragment, memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ParallexSection = memo((props) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <section
        id="parallex"
        className="parallax-window "
        style={{
          background: "lightgray",
          //   position: "relative",
          //   overflow: "hidden",
          //   padding: "48px 0",
          //   display: "flex",
          //   flexDirection: "row",
          //   justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: 24,
              boxShadow: "0 4px 32px rgba(76,175,80,0.08)",
              padding: "40px 32px",
              marginRight: 24,
              minHeight: 420,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="text-start">
              <h2
                className="big-font-5 text-uppercase texture-text mb-0"
                style={{
                  color: "#2e7d32",
                  fontWeight: 800,
                  textShadow: "0 2px 8px rgba(76,175,80,0.08)",
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                }}
              >
                KNEE MRI CASE
              </h2>
              <div className="d-flex flex-wrap align-items-center r-mb-23 my-4">
                <div className="slider-ratting d-flex align-items-center">
                  <ul className="ratting-start p-0 m-0 list-inline text-warning d-flex align-items-center justify-content-left">
                    <li>
                      <i className="fa fa-star" aria-hidden="true"></i>
                    </li>
                    <li>
                      <i className="fa fa-star" aria-hidden="true"></i>
                    </li>
                    <li>
                      <i className="fa fa-star" aria-hidden="true"></i>
                    </li>
                    <li>
                      <i className="fa fa-star" aria-hidden="true"></i>
                    </li>
                    <li>
                      <i className="fa fa-star-half" aria-hidden="true"></i>
                    </li>
                  </ul>
                  <span className="ms-2 font-size-14 fw-500 text-dark">
                    4.8
                  </span>
                  <span
                    className="ms-2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#e0f7e9",
                      borderRadius: 6,
                      padding: "2px 10px",
                    }}
                  >
                    <i
                      className="fas fa-stethoscope"
                      style={{ color: "#388e3c", fontSize: 18, marginRight: 6 }}
                    ></i>
                    <span style={{ color: "#388e3c", fontWeight: 600 }}>
                      MEDICAL
                    </span>
                  </span>
                </div>
                <span
                  className="badge rounded-0 text-white text-uppercase p-2 mx-3"
                  style={{
                    background: "#43a047",
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                >
                  15+
                </span>
                <span className="font-size-14 fw-500 text-dark">45 Mins</span>
              </div>
              <h4
                className="iq-title mb-2 fw-bold"
                style={{ color: "#388e3c", fontSize: "1.15rem" }}
              >
                Case Overview
              </h4>
              <p
                className="line-count-2 w-75 mb-5"
                style={{
                  color: "#333",
                  fontSize: "1.15rem",
                  fontWeight: 400,
                }}
              >
                A 32-year-old male presents with knee pain and swelling after a
                sports injury. MRI reveals a complex meniscal tear and joint
                effusion. Discuss diagnosis, imaging findings, and management
                options for optimal recovery.
              </p>
              <div className="iq-button">
                <Link
                  to="/lecture-detail"
                  className="btn text-uppercase position-relative"
                  style={{
                    background: "#e0f7e9",
                    color: "#2e7d32",
                    fontWeight: 700,
                    borderRadius: 8,
                    padding: "12px 32px",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    boxShadow: "0 2px 12px rgba(76,175,80,0.08)",
                  }}
                >
                  <span
                    className="button-text"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {t("ott_home.play_now")}
                  </span>
                  <i
                    className="fa-solid fa-play"
                    style={{ marginLeft: 10 }}
                  ></i>
                </Link>
              </div>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#e0f7e9",
              borderRadius: 24,
              minHeight: 420,
            }}
            data-aos="fade-up"
            data-aos-duration="900"
          >
            <div
              className="parallax-img"
              style={{ width: "100%", maxWidth: 600 }}
            >
              <Link to="">
                <img
                  src={props.randomImage}
                  className="img-fluid w-100"
                  loading="lazy"
                  alt="bailey"
                  style={{
                    borderRadius: 16,
                    boxShadow: "0 4px 32px rgba(76,175,80,0.10)",
                  }}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
});

ParallexSection.displayName = "ParallexSection";
export default ParallexSection;
