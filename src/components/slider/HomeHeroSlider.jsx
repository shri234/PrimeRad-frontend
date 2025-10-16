import { Fragment, memo, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import FsLightbox from "fslightbox-react";
import { useSelector } from "react-redux";
import { theme_scheme_direction } from "../../store/setting/selectors";
import { useTranslation } from "react-i18next";
import "./HomeHeroSlider.css";

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
    image: isMobile
      ? apiObj.imageUrl_522x760
        ? `https://primerad-backend.onrender.com${apiObj.imageUrl_522x760}`
        : "https://placehold.co/522x760?text=No+Image"
      : apiObj.imageUrl_1920x1080
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
    isFree: apiObj.isFree,
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
            isFree: card.isFree,
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
                  <h3
                    className="texture-text big-font-5 letter-spacing-1 text-uppercase mb-0 fs-3 fs-md-2 fs-lg-1"
                    style={{
                      color: "ghostwhite",
                      fontWeight: 400,
                      textShadow: "0 4px 24px rgba(0,0,0,0.45)",
                    }}
                  >
                    {currentSlideContent.title}
                  </h3>
                  <div
                    className="d-flex flex-wrap align-items-center r-mb-23"
                    style={{
                      marginTop: 16,
                      gap: "0.5rem",
                      marginBottom: window.innerWidth <= 480 ? "5px" : "10px",
                    }}
                  >
                    {currentSlideContent.cmeCredits && (
                      <span className="badge hero-slider-badge-assessment text-white text-uppercase px-3 py-2">
                        {currentSlideContent.cmeCredits}
                      </span>
                    )}

                    {currentSlideContent.movieTime && (
                      <span className="badge hero-slider-badge-duration text-white text-uppercase px-3 py-2">
                        <i className="fa-regular fa-clock me-1"></i>
                        {currentSlideContent.movieTime}
                      </span>
                    )}

                    {currentSlideContent.level && (
                      <span className="badge hero-slider-badge-level text-uppercase px-3 py-2">
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
                      <span className="badge hero-slider-badge-module text-uppercase p-2">
                        {t("Module")}: {t(currentSlideContent.category)}
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
                        className="hero-slider-view-button"
                        onClick={() =>
                          handleViewContentClick(currentSlideContent)
                        }
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
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Desktop: Carousel, Mobile: Dots */}
        {totalSlides > 1 && (
          <>
            {/* Desktop Carousel with Navigation - Only show 4 items */}
            <div className="hero-carousel-container d-none d-md-flex">
              {/* Previous Arrow */}
              {canGoCarouselPrev && (
                <button
                  className="hero-carousel-nav-button"
                  onClick={handleCarouselPrev}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
              )}

              <div className="hero-carousel-thumbnails">
                {visibleCarouselItems.map((slide, visibleIndex) => {
                  const actualIndex = carouselStartIndex + visibleIndex;
                  const slideData = mapSlideData(slide);
                  const isActive = actualIndex === currentSlideIndex;

                  return (
                    <div
                      key={slide._id || actualIndex}
                      className={`hero-carousel-thumbnail ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() => handleCarouselItemClick(actualIndex)}
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
                        <div className="hero-carousel-thumbnail-indicator" />
                      )}

                      {slideData.previewVideoUrl && <div></div>}
                    </div>
                  );
                })}
              </div>

              {/* Next Arrow */}
              {canGoCarouselNext && (
                <button
                  className="hero-carousel-nav-button"
                  onClick={handleCarouselNext}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              )}
            </div>

            {/* Mobile Pagination Dots */}
            <div className="hero-pagination-dots d-md-none">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`hero-pagination-dot ${
                    currentSlideIndex === index ? "active" : ""
                  }`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <FsLightbox toggler={toggler} sources={[currentVideoSource]} />
    </Fragment>
  );
});

HomeHeroSlider.displayName = "HomeHeroSlider";
export default HomeHeroSlider;
