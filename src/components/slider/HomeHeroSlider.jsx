import { Fragment, memo, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom"; // <--- Import useNavigate
import FsLightbox from "fslightbox-react";
import { useSelector } from "react-redux";
import { theme_scheme_direction } from "../../store/setting/selectors";
import { useTranslation } from "react-i18next";

const API_URL =
  "https://primerad-backend.onrender.com/api/sessions/getTopRatedLectures";

const HomeHeroSlider = memo(() => {
  const { t } = useTranslation();
  const themeSchemeDirection = useSelector(theme_scheme_direction);
  const [toggler, setToggler] = useState(false);
  const [currentVideoSource, setCurrentVideoSource] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  /** ------ FETCHED SLIDES STATE ------ **/
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const navigate = useNavigate(); // <--- Initialize useNavigate

  /** --- Data fetching --- **/
  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setSlides(data.data);
        } else {
          setSlides([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setSlides([]);
        setLoading(false);
      });
  }, []);

  const totalSlides = slides.length;

  /** --- Autoplay --- **/
  useEffect(() => {
    let intervalId;
    if (totalSlides > 1) {
      intervalId = setInterval(() => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [totalSlides]);

  // Navigation handlers for the carousel arrows/dots (unchanged)
  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex(
      (prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides
    );
  }, [totalSlides]);

  const handleDotClick = useCallback((index) => {
    setCurrentSlideIndex(index);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleWatchPreviewClick = (videoUrl) => {
    setCurrentVideoSource(videoUrl);
    setToggler(true);
  };

  // Helper: map each API object to the shape expected by render
  // Add more original API fields to this mapped object if they are needed for navigation
  const mapSlideData = (apiObj) => ({
    id: apiObj._id, // <--- Crucial: Pass the _id for navigation
    title: apiObj.title,
    description: apiObj.description,
    cmeCredits: apiObj.isAssessment ? t("Assessment") : "",
    movieTime: apiObj.sessionDuration,
    level: apiObj.difficulty,
    category: apiObj.moduleName,
    tags: [], // Assuming tags might come from API in the future
    image: apiObj.imageUrl_1920x1080
      ? `https://primerad-backend.onrender.com${apiObj.imageUrl_1920x1080}`
      : "https://placehold.co/1920x1080?text=No+Image",
    // detailLink: `/session-detail/${apiObj._id || ""}`, // This can be removed or kept as a fallback
    previewVideoUrl: apiObj.vimeoVideoId
      ? `https://player.vimeo.com/video/${apiObj.vimeoVideoId}`
      : null,

    vimeoVideoId: apiObj.vimeoVideoId || null,
    faculty: apiObj.faculty || "Unknown Faculty", // Assuming 'faculty' might be directly on the API object
    module: apiObj.moduleName || "General",
    submodule: apiObj.subCategoryId || "General", // Assuming 'subCategoryId' exists on API object
    duration: apiObj.sessionDuration || "",
    startDate: apiObj.startDate,
    contentType:
      apiObj.sessionType === "Dicom"
        ? "Case"
        : apiObj.sessionType === "Vimeo"
        ? "Lecture"
        : apiObj.sessionType || "Other", // <--- Crucial: Map sessionType to contentType
  });

  const currentSlideContent =
    slides.length > 0 ? mapSlideData(slides[currentSlideIndex]) : null;

  // NEW: Navigation handler for "View Content" button
  const handleViewContentClick = useCallback(
    (card) => {
      // This logic is copied directly from your MainPage's handleCardClick
      if (card.contentType && card.contentType.toLowerCase() === "case") {
        navigate(`/case/${card.id}`);
      } else if (
        card.contentType &&
        card.contentType.toLowerCase() === "lecture"
      ) {
        navigate("/movies-detail", {
          state: {
            id: card.id,
            vimeoVideoId: card.vimeoVideoId,
            title: card.title, // Use card.title (mapped from API.title)
            description: card.description,
            faculty: card.faculty,
            module: card.module,
            submodule: card.submodule,
            duration: card.duration,
            startDate: card.startDate,
            contentType: card.contentType,
          },
        });
      } else if (
        card.contentType &&
        card.contentType.toLowerCase() === "live"
      ) {
        // For 'live', you might need more specific data, ensure 'card' contains it
        navigate("/live", { state: card });
      }
    },
    [navigate] // Dependency on navigate
  );

  /** --- Loading & Empty states --- **/
  if (loading) {
    return (
      <div
        style={{
          padding: "100px",
          textAlign: "center",
          color: "#666",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading hero content...
      </div>
    );
  }

  if (!currentSlideContent) {
    return (
      <div
        style={{
          padding: "100px",
          textAlign: "center",
          color: "#666",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        No hero content available.
      </div>
    );
  }

  /** --- RENDER --- **/
  return (
    <Fragment>
      {/* Custom Carousel Container */}
      <div
        id="home-banner-carousel"
        className="iq-main-slider banner-home-swiper overflow-hidden mb-0"
        style={{
          paddingTop: isMobile ? "80px" : "0",
          position: "relative",
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          direction: themeSchemeDirection,
        }}
      >
        {/* Current Slide Content */}
        <div
          className="slide-content"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transition: "opacity 0.7s ease-in-out",
            opacity: 1,
          }}
        >
          {/* Image background and overlay */}
          <div
            className="banner-home-swiper-image"
            style={{ position: "relative", width: "100%", height: "100%" }}
          >
            <img
              src={currentSlideContent.image}
              alt={currentSlideContent.title || "CME Content Banner"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.8,
                filter: "brightness(0.85)",
              }}
            />
            {/* Dark overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.45)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Content overlaying the image */}
          <div
            className="container-fluid position-absolute h-100"
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              pointerEvents: "auto",
            }}
          >
            <div className="slider-inner h-100" style={{ width: "100%" }}>
              <div className="row align-items-center iq-ltr-direction h-100">
                <div className="col-lg-7 col-md-12">
                  <h1
                    className="texture-text big-font-5 letter-spacing-1 line-count-1 text-uppercase mb-0"
                    style={{
                      color: "ghostwhite",
                      fontWeight: 400,
                      textShadow: "0 4px 24px rgba(0,0,0,0.45)",
                      fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
                    }}
                  >
                    {currentSlideContent.title}
                  </h1>
                  <div
                    className="d-flex flex-wrap align-items-center r-mb-23"
                    style={{ marginTop: 16 }}
                  >
                    {currentSlideContent.cmeCredits && (
                      <span
                        className="badge rounded-0 text-white text-uppercase p-2 mx-2"
                        style={{
                          background: "#0d47a1",
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          fontSize: "0.95rem",
                        }}
                      >
                        {currentSlideContent.cmeCredits}
                      </span>
                    )}
                    {currentSlideContent.movieTime && (
                      <span className="font-size-14 fw-500 time text-white mx-2">
                        <i className="fa-regular fa-clock me-1"></i>{" "}
                        {currentSlideContent.movieTime}
                      </span>
                    )}
                    {currentSlideContent.level && (
                      <span className="font-size-14 fw-500 time text-white mx-2">
                        <i className="fa-solid fa-layer-group me-1"></i>{" "}
                        {t(currentSlideContent.level)}
                      </span>
                    )}
                  </div>
                  {currentSlideContent.description && (
                    <p
                      className="line-count-3"
                      style={{
                        color: "#e3eaf2",
                        fontSize: "1.15rem",
                        fontWeight: 400,
                        textShadow: "0 2px 8px rgba(0,0,0,0.25)",
                      }}
                    >
                      {currentSlideContent.description}{" "}
                    </p>
                  )}
                  <div className="trending-list" style={{ marginBottom: 18 }}>
                    {currentSlideContent.category && (
                      <div
                        className="text-primary genres fw-500"
                        style={{ color: "darkslategreen" }}
                      >
                        {t("content.specialty")}:{" "}
                        <span style={{ color: "#fff", fontWeight: 500 }}>
                          {t(currentSlideContent.category)}{" "}
                        </span>
                      </div>
                    )}
                    {currentSlideContent.tags &&
                      currentSlideContent.tags.length > 0 && (
                        <div
                          className="text-primary tag fw-500"
                          style={{ color: "#b3e5fc" }}
                        >
                          {t("content.topics")}:{" "}
                          <span style={{ color: "#fff", fontWeight: 500 }}>
                            {currentSlideContent.tags
                              .map((tag) => t(tag))
                              .join(", ")}
                          </span>
                        </div>
                      )}
                  </div>
                  <div>
                    <div className="iq-button">
                      {/* <Link // REMOVED the static Link
                        to={"/movies-detail"}
                        className="btn text-uppercase position-relative"
                        style={{
                          color: "black",
                          fontWeight: 700,
                          borderRadius: 8,
                          padding: "12px 32px",
                          fontSize: "1.1rem",
                          boxShadow: "0 2px 12px rgba(25,118,210,0.18)",
                        }}
                      >
                        <span className="button-text">
                          {t("buttons.view_content")}{" "}
                        </span>
                        <i
                          className="fa-solid fa-arrow-right"
                          style={{ marginLeft: 10 }}
                        ></i>
                      </Link> */}
                      {/* NEW: Button with dynamic onClick handler */}
                      <button
                        onClick={() =>
                          handleViewContentClick(currentSlideContent)
                        }
                        className="btn text-uppercase position-relative"
                        style={{
                          color: "black",
                          fontWeight: 700,
                          borderRadius: 8,
                          padding: "12px 32px",
                          fontSize: "1.1rem",
                          boxShadow: "0 2px 12px rgba(25,118,210,0.18)",
                          background: "white", // Ensure button background is visible
                          border: "none", // Remove default button border
                          cursor: "pointer", // Indicate it's clickable
                        }}
                      >
                        <span className="button-text">
                          {t("buttons.view_content")}{" "}
                        </span>
                        <i
                          className="fa-solid fa-arrow-right"
                          style={{ marginLeft: 10 }}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Watch Preview/Trailer Section */}
                {currentSlideContent.previewVideoUrl && (
                  <div className="col-lg-5 col-md-12 trailor-video iq-slider d-none d-lg-block">
                    <Link to="#" className="video-open playbtn" tabIndex="0">
                      <svg
                        onClick={() =>
                          handleWatchPreviewClick(
                            currentSlideContent.previewVideoUrl
                          )
                        }
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="80px"
                        height="80px"
                        viewBox="0 0 213.7 213.7"
                        enableBackground="new 0 0 213.7 213.7"
                        xmlSpace="preserve"
                      >
                        <polygon
                          className="triangle"
                          fill="none"
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeiterlimit="10"
                          points="73.5,62.5 148.5,105.8 73.5,149.1 "
                        ></polygon>
                        <circle
                          className="circle"
                          fill="none"
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeiterlimit="10"
                          cx="106.8"
                          cy="106.8"
                          r="103.3"
                        ></circle>
                      </svg>
                      <span
                        className="w-trailor"
                        onClick={() =>
                          handleWatchPreviewClick(
                            currentSlideContent.previewVideoUrl
                          )
                        }
                      >
                        {t("buttons.watch_preview")}{" "}
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows (Custom) */}
        {totalSlides > 1 && (
          <Fragment>
            <div
              onClick={handlePrev}
              style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                cursor: "pointer",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.4)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.2)")
              }
            >
              &#10094;
            </div>
            <div
              onClick={handleNext}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                cursor: "pointer",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.4)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.2)")
              }
            >
              &#10095;
            </div>
          </Fragment>
        )}

        {/* Pagination Dots (Custom) */}
        {totalSlides > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <span
                key={idx}
                onClick={() => handleDotClick(idx)}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor:
                    idx === currentSlideIndex
                      ? "white"
                      : "rgba(255,255,255,0.5)",
                  margin: "0 5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
              ></span>
            ))}
          </div>
        )}
      </div>

      <FsLightbox toggler={toggler} sources={[currentVideoSource]} />

      <style>{`
        .line-count-1 {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .line-count-3 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        @media (max-width: 768px) {
            #home-banner-carousel {
                height: 70vh;
            }
            .col-lg-7, .col-lg-5 {
                flex: 0 0 100%;
                max-width: 100%;
            }
            .col-lg-7 {
                text-align: center;
            }
            .col-lg-5.d-none.d-lg-block {
                display: none !important;
            }
            .container-fluid {
                padding-left: 20px;
                padding-right: 20px;
            }
        }
        @media (max-width: 576px) {
            .text-uppercase {
                font-size: clamp(1.8rem, 8vw, 3.5rem) !important;
            }
        }
      `}</style>
    </Fragment>
  );
});

HomeHeroSlider.displayName = "HomeHeroSlider";
export default HomeHeroSlider;
