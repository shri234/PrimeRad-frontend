import { Fragment, memo, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  /** ------ CAROUSEL PAGINATION STATE ------ **/
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const CAROUSEL_ITEMS_PER_VIEW = 4;

  const navigate = useNavigate();

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

  // Navigation handlers for the carousel arrows/dots
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

  const handleCarouselItemClick = useCallback((index) => {
    setCurrentSlideIndex(index);
  }, []);

  /** --- Carousel Navigation Handlers --- **/
  const handleCarouselNext = useCallback(() => {
    if (carouselStartIndex + CAROUSEL_ITEMS_PER_VIEW < totalSlides) {
      setCarouselStartIndex((prev) => prev + 1);
    }
  }, [carouselStartIndex, totalSlides]);

  const handleCarouselPrev = useCallback(() => {
    if (carouselStartIndex > 0) {
      setCarouselStartIndex((prev) => prev - 1);
    }
  }, [carouselStartIndex]);

  // Auto-adjust carousel view when current slide changes
  useEffect(() => {
    if (currentSlideIndex < carouselStartIndex) {
      setCarouselStartIndex(currentSlideIndex);
    } else if (
      currentSlideIndex >=
      carouselStartIndex + CAROUSEL_ITEMS_PER_VIEW
    ) {
      setCarouselStartIndex(currentSlideIndex - CAROUSEL_ITEMS_PER_VIEW + 1);
    }
  }, [currentSlideIndex, carouselStartIndex]);

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

  const mapSlideData = (apiObj) => ({
    id: apiObj._id,
    title: apiObj.title,
    description: apiObj.description,
    cmeCredits: apiObj.isAssessment ? t("Assessment") : "",
    movieTime: apiObj.sessionDuration,
    level: apiObj.difficulty,
    category: apiObj.moduleName,
    tags: [],
    image: apiObj.imageUrl_1920x1080
      ? `https://primerad-backend.onrender.com${apiObj.imageUrl_1920x1080}`
      : "https://placehold.co/1920x1080?text=No+Image",
    previewVideoUrl: apiObj.vimeoVideoId
      ? `https://player.vimeo.com/video/${apiObj.vimeoVideoId}`
      : null,
    vimeoVideoId: apiObj.vimeoVideoId || null,
    faculty: apiObj.faculty || "Unknown Faculty",
    module: apiObj.moduleName || "General",
    submodule: apiObj.subCategoryId || "General",
    duration: apiObj.sessionDuration || "",
    startDate: apiObj.startDate,
    contentType:
      apiObj.sessionType === "Dicom"
        ? "Case"
        : apiObj.sessionType === "Vimeo"
        ? "Lecture"
        : apiObj.sessionType || "Other",
  });

  const currentSlideContent =
    slides.length > 0 ? mapSlideData(slides[currentSlideIndex]) : null;

  // Navigation handler for "View Content" button
  const handleViewContentClick = useCallback(
    (card) => {
      if (card.contentType && card.contentType.toLowerCase() === "case") {
        navigate(`/case/${card.id}`);
      } else if (
        card.contentType &&
        card.contentType.toLowerCase() === "lecture"
      ) {
        navigate("/lecture-detail", {
          state: {
            id: card.id,
            vimeoVideoId: card.vimeoVideoId,
            title: card.title,
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
        navigate("/live", { state: card });
      }
    },
    [navigate]
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

  const visibleCarouselItems = slides.slice(
    carouselStartIndex,
    carouselStartIndex + CAROUSEL_ITEMS_PER_VIEW
  );

  const canGoCarouselPrev = carouselStartIndex > 0;
  const canGoCarouselNext =
    carouselStartIndex + CAROUSEL_ITEMS_PER_VIEW < totalSlides;

  return (
    <Fragment>
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
              <div className="row align-items-center mr-7 iq-ltr-direction h-100">
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
                    style={{
                      marginTop: 16,
                      gap: "0.5rem",
                      marginBottom: window.innerWidth <= 480 ? "5px" : "10px",
                    }}
                  >
                    {/* CME / Assessment */}
                    {currentSlideContent.cmeCredits && (
                      <span
                        className="badge  text-white text-uppercase px-3 py-2"
                        style={{
                          background: "#0d47a1",
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          borderRadius: "10px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {currentSlideContent.cmeCredits}
                      </span>
                    )}

                    {/* Duration */}
                    {currentSlideContent.movieTime && (
                      <span
                        className="badge  text-white text-uppercase px-3 py-2"
                        style={{
                          background: "#6a1b9a", // Purple
                          fontWeight: 500,
                          borderRadius: "10px",
                          fontSize: "0.8rem",
                        }}
                      >
                        <i className="fa-regular fa-clock me-1"></i>
                        {currentSlideContent.movieTime}
                      </span>
                    )}

                    {/* Difficulty Level */}
                    {currentSlideContent.level && (
                      <span
                        className="badge text-black text-uppercase px-3 py-2"
                        style={{
                          background: "lightblue", // Orange
                          fontWeight: 500,
                          fontSize: "0.8rem",
                          borderRadius: "10px",
                        }}
                      >
                        <i className="fa-solid fa-layer-group me-1"></i>
                        {t(currentSlideContent.level)}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      marginBottom: window.innerWidth <= 480 ? "10px" : "10px",
                    }}
                  >
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
                  </div>
                  <div
                    className="trending-list"
                    style={{
                      marginBottom: 18,
                      marginBottom: window.innerWidth <= 480 ? "10px" : "10px",
                    }}
                  >
                    {currentSlideContent.category && (
                      <span
                        className="badge  text-white text-uppercase p-2 mx-2"
                        style={{
                          background: "#4caf50", // Green background for specialty
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          color: "black",
                          borderRadius: "10px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {t("content.specialty")}:{" "}
                        {t(currentSlideContent.category)}
                      </span>
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
                      <button
                        onClick={() =>
                          handleViewContentClick(currentSlideContent)
                        }
                        style={{
                          color: "black",
                          fontWeight: 700,
                          borderRadius: "8px",
                          padding: "10px 12px",
                          fontSize: "1.1rem",
                          boxShadow: "0 2px 12px rgba(25,118,210,0.18)",
                          background: "lightblue",
                          border: "none",
                          cursor: "pointer",
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

        {/* Bottom Navigation - Desktop: Carousel, Mobile: Dots */}
        {totalSlides > 1 && (
          <>
            {/* Desktop Carousel with Navigation - Only show 4 items */}
            <div
              className="hero-carousel-container d-none d-md-flex"
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 24px",
                background: "rgba(0,0,0,0.7)",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                maxWidth: "90vw",
              }}
            >
              {/* Previous Arrow */}
              {canGoCarouselPrev && (
                <button
                  onClick={handleCarouselPrev}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  }}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
              )}

              <div
                className="hero-carousel-thumbnails"
                style={{
                  display: "flex",
                  gap: "12px",
                  transition: "all 0.3s ease",
                }}
              >
                {visibleCarouselItems.map((slide, visibleIndex) => {
                  const actualIndex = carouselStartIndex + visibleIndex;
                  const slideData = mapSlideData(slide);
                  const isActive = actualIndex === currentSlideIndex;

                  return (
                    <div
                      key={slide._id || actualIndex}
                      onClick={() => handleCarouselItemClick(actualIndex)}
                      style={{
                        cursor: "pointer",
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: isActive
                          ? "rgba(0, 123, 255, 0.8)"
                          : "3px solid transparent",
                        transition: "all 0.3s ease",
                        transform: isActive ? "scale(1.05)" : "scale(1)",
                        opacity: isActive ? 1 : 0.7,
                        minWidth: "120px",
                        boxShadow: isActive
                          ? "0 0 8px rgba(0, 123, 255, 0.8)"
                          : "",
                        width: "120px",
                        height: "68px",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.opacity = "0.9";
                          e.currentTarget.style.transform = "scale(1.02)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.opacity = "0.7";
                          e.currentTarget.style.transform = "scale(1)";
                        }
                      }}
                    >
                      <img
                        src={slideData.image}
                        alt={slideData.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/120x68?text=No+Image";
                        }}
                      />

                      {/* Active indicator */}
                      {isActive && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "2px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "20px",
                            height: "3px",
                            background: "#fff",
                            borderRadius: "2px",
                          }}
                        />
                      )}

                      {slideData.previewVideoUrl && (
                        <div
                        // style={{
                        //   position: "absolute",
                        //   top: "50%",
                        //   left: "50%",
                        //   transform: "translate(-50%, -50%)",
                        //   color: "white",
                        //   fontSize: "16px",
                        //   opacity: 0.8,
                        // }}
                        >
                          {/* ▶ */}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Next Arrow */}
              {canGoCarouselNext && (
                <button
                  onClick={handleCarouselNext}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  }}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              )}
            </div>

            {/* Mobile Pagination Dots */}
            <div
              className="hero-pagination-dots d-md-none"
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                // height: "10px",
                gap: "6px",
                // padding: "8px 12px",
                // background: "rgba(0, 0, 0, 0.6)",
                borderRadius: "50%",
                backdropFilter: "blur(8px)",
              }}
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  style={{
                    minWidth: "10px",
                    minHeight: "10px",
                    borderRadius: "50%",
                    border: "none",
                    background:
                      currentSlideIndex === index ? "lightgreen" : "gray",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0,
                    // minWidth: "8px",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <FsLightbox toggler={toggler} sources={[currentVideoSource]} />

      <style>{`
    #home-banner-carousel {
      height: 100vh;
      min-height: 560px;
      padding-top: 0;
      overflow: hidden;
    }
    .slide-content {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .slider-inner {
      width: 100%;
      max-width: 1450px;
      margin: 0 auto;
    }
.row.align-items-center {
    display: flex;
    flex-wrap: wrap;
}
.col-lg-7,
.col-lg-5 {
    flex: 0 0 58%;
    max-width: 58%;
}
.col-lg-5 {
    flex: 0 0 42%;
    max-width: 42%;
}

/* Carousel navigation button styles */
.hero-carousel-container button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
}

.hero-carousel-container button:active {
    transform: scale(0.95);
}

/* Mobile pagination dots styles */
.hero-pagination-dots button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
}

.hero-pagination-dots button:active {
    transform: scale(0.9);
}

/* Tablet Styles */
@media (max-width: 1024px) {
    #home-banner-carousel {
        height: 70vh;
        min-height: 400px;

    }
    .slider-inner {
        max-width: 1000px;
        padding-left: 16px;
        padding-right: 16px;
    }
    .row.align-items-center {
        flex-direction: column;
    }
    .col-lg-7,
    .col-lg-5 {
        flex: 0 0 100%;
        max-width: 100%;
    }
    h1.texture-text {
        font-size: clamp(2rem, 7vw, 3.2rem);
    }
    .line-count-3 {
        font-size: 1rem;
        line-height: 1.3;
    }
    .hero-carousel-container {
        bottom: 15px;
        padding: 12px 16px;
        gap: 8px;
    }
    .hero-carousel-thumbnails {
        gap: 8px;
    }
}

/* Mobile Styles */
@media (max-width: 768px) {
    #home-banner-carousel {
        height: 52vh;
        min-height: 320px;
        padding-top: 45px;
    }
    .slide-content, .slider-inner, .row.align-items-center, .container-fluid {
        padding: 0 !important;
        margin: 0 !important;
        min-width: 0 !important;
        width: 100% !important;
        box-sizing: border-box;
    }
    .col-lg-7, .col-lg-5 {
        flex: 0 0 100%;
        max-width: 100%;
        align-items: center !important;
        align-content: center !important;
        // text-align: center !important;
    }
    .col-lg-7 {
        margin-bottom: 0;
    }
    h1.texture-text {
        font-size: clamp(1.7rem, 16vw, 2.6rem) !important;
        padding-left: 4px;
        padding-right: 4px;
    }
    .line-count-3 {
        font-size: 0.95rem !important;
        line-height: 1.7 !important;
        margin: 0 2vw !important;
    }
    .iq-button button, .iq-button .btn {
        font-size: 0.8rem !important;
        // height: 5px !important;
        // padding: 5px 8px !important;
        border-radius: 6px !important;
    }
    .badge {
        font-size: 0.8rem !important;
        padding: 6px 10px !important;
        border-radius: 8px !important;
        margin: 2px 4px !important;
        display: inline-block !important;
    }
    /* Hide video preview area on small screens to save space */
    .trailor-video.iq-slider, .col-lg-5.d-none.d-lg-block {
        display: none !important;
    }
    
    /* Mobile pagination dots positioning */
    .hero-pagination-dots {
        bottom: 15px !important;
        // padding: 10px 16px !important;
    }
}

/* Extra mobile tweaks for portrait phones */
@media (max-width: 480px) {
    #home-banner-carousel {
        // height: 36vh;
        min-height: 120px;
        max-height: 800px
    }
    h1.texture-text {
        font-size: 2.1rem !important;
    }
    .slide-content {
        min-height: 210px !important;
    }
    .hero-pagination-dots {
        bottom: 12px !important;
        // padding: 8px 14px !important;
        gap: 6px !important;
    }
}

/* Utility styles */
.line-count-1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.line-count-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
`}</style>
    </Fragment>
  );
});

HomeHeroSlider.displayName = "HomeHeroSlider";
export default HomeHeroSlider;
