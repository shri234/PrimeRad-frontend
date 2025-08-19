import { memo, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import { useSelector } from "react-redux";
import { theme_scheme_direction } from "../../store/setting/selectors";
import { useTranslation } from "react-i18next";
import "./SectionSlider.css";
const modules = [Autoplay, Navigation];

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const SectionSlider = memo(
  ({
    children,
    title,
    list,
    slidesPerView = 6,
    loop = false,
    spaceBetween = 20,
    className = "",
    link,
    titleLink,
  }) => {
    const { t } = useTranslation();
    const themeSchemeDirection = useSelector(theme_scheme_direction);
    const [firstVisibleIndex, setFirstVisibleIndex] = useState(0);
    const navigate = useNavigate();

    const slider = useRef(null);
    const uniqueId = generateUUID();

    const initSwiper = (swiper) => {
      addCustomClassToVisibleSlides(swiper);
    };

    const addCustomClassToVisibleSlides = (swiper) => {
      if (slider.current) {
        if (swiper) {
          slider.current
            .querySelectorAll(".swiper-slide")
            .forEach((separateSlide) => separateSlide.classList.remove("last"));

          const swiperSlide = slider.current.querySelectorAll(
            ".swiper-slide-visible"
          );

          const lastVisibleSlide = swiperSlide[swiperSlide.length - 1];

          setTimeout(() => {
            if (lastVisibleSlide) {
              lastVisibleSlide.classList.add("swiper-active", "last");
            }
          }, 0);
        }
      }
    };

    return (
      <div className={className}>
        <Container fluid>
          <div
            className="overflow-hidden card-style-slider"
            style={{ width: "100%", position: "relative" }}
            ref={slider}
          >
            <div className="d-flex align-items-center justify-content-between px-3 my-4 flex-wrap">
              <h5
                className="main-title text-capitalize mb-0 section-slider-title"
                style={{
                  color: "#003366",
                  fontWeight: "bold",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                }}
              >
                {title}
              </h5>
              <Link
                to={titleLink || "/view-all"}
                state={{ sectionTitle: title }}
                className="iq-view-all custom-hover"
                style={{
                  color: "darkslategray",
                  fontSize: "clamp(0.875rem, 2vw, 1rem)",
                  whiteSpace: "nowrap",
                  marginTop: "0.5rem",
                }}
              >
                View All
              </Link>
            </div>
            <Swiper
              key={themeSchemeDirection}
              dir={themeSchemeDirection}
              className="position-relative swiper swiper-card"
              slidesPerView={slidesPerView}
              slidesPerGroup={slidesPerView}
              loop={loop}
              watchSlidesProgress
              spaceBetween={spaceBetween}
              speed={900}
              navigation={{
                prevEl: `.swiper-button-prev-${uniqueId}`,
                nextEl: `.swiper-button-next-${uniqueId}`,
              }}
              breakpoints={{
                // Extra small devices (phones, 320px and up)
                320: {
                  slidesPerView: 1.2,
                  spaceBetween: 10,
                },
                // Small devices (landscape phones, 576px and up)
                576: {
                  slidesPerView: 2.2,
                  spaceBetween: 15,
                },
                768: {
                  slidesPerView: 3.2,
                  spaceBetween: 20,
                },
                // Large devices (desktops, 992px and up)
                992: {
                  slidesPerView: 4.2,
                  spaceBetween: 20,
                },

                1200: {
                  slidesPerView: 5.2,
                  spaceBetween: 20,
                },
                // Extra extra large devices (1500px and up)
                1500: {
                  slidesPerView: slidesPerView,
                  spaceBetween: spaceBetween,
                },
              }}
              onSwiper={initSwiper}
              onSlideChange={initSwiper}
              modules={modules}
            >
              {list.map((data, index) => (
                <SwiperSlide tag="li" key={index + generateUUID() + "slider"}>
                  {children(data)}
                </SwiperSlide>
              ))}

              {/* Custom Navigation Buttons */}
              <div
                className={`swiper-button-next-${uniqueId}`}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  zIndex: 10,
                  width: "45px",
                  height: "45px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                  transform: "translateY(-50%)",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  color: "#333",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 1)";
                  e.target.style.transform = "translateY(-50%) scale(1.1)";
                  e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                  e.target.style.transform = "translateY(-50%) scale(1)";
                  e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.15)";
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </div>

              <div
                className={`swiper-button-prev-${uniqueId}`}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  zIndex: 10,
                  width: "45px",
                  height: "45px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                  transform: "translateY(-50%)",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  color: "#333",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 1)";
                  e.target.style.transform = "translateY(-50%) scale(1.1)";
                  e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                  e.target.style.transform = "translateY(-50%) scale(1)";
                  e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.15)";
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </div>
            </Swiper>
          </div>
        </Container>
      </div>
    );
  }
);

SectionSlider.displayName = "SectionSlider";

export default SectionSlider;
