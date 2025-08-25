import { memo, useEffect, useState } from "react";
import AOS from "aos";
import HomeHeroSlider from "../../components/slider/HomeHeroSlider";
import ContinueWatching from "../../components/sections/ContinueWatching";
import LatestMovies from "../../components/sections/LatestMovies";
import ParallexSection from "../../components/sections/ParallexSection";
import { getRandomImage } from "../../utilities/random-image";
import { latestMovie } from "../../StaticData/data";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/auth/selectors";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper";
import "swiper/css";
import "./IndexPage.css";
import "swiper/css/navigation";
import TestimonialsSection from "../../components/sections/TestimonialsSection";

const sectionBg = ["#fff", "#f5f7fa"];
const THEME = {
  primary: "#1976d2", // blue
  secondary: "#00bfae", // teal
  background: "#f4f8fb", // light blue/gray
  card: "#fff",
  accent: "#ffb300", // amber
  text: "#263238", // dark blue-gray
  border: "#e0e0e0",
  headingColor: "#222",
  textColor: "#555",
};
const HomePage = memo(() => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
  }, [isMobile]);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axios.get(
          "https://primerad-backend.onrender.com/api/faculty/get"
        );
        // Map the API response data to match your Swiper's expected structure
        const mappedFaculty = response.data.data.map((faculty) => ({
          _id: faculty._id,
          name: faculty.name, // Use 'name' from API for 'instructor' equivalent
          title: faculty.description, // Use 'description' from API for 'title' equivalent
          // Construct the image URL: prepend base URL and fix backslashes
          image: `https://primerad-backend.onrender.com/${faculty.image.replace(
            /\\/g,
            "/"
          )}`,
          // Add other fields if needed
        }));
        setFacultyList(mappedFaculty);
      } catch (err) {
        console.error("Error fetching faculty data:", err);
        setError("Failed to load faculty members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        Loading Faculty...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "red" }}>
        {error}
      </div>
    );
  }

  if (facultyList.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          color: THEME.textColor,
        }}
      >
        No faculty members found.
      </div>
    );
  }

  const whyChooseSection = (
    <div
      style={{
        background: "#2A2F42",
        padding: "48px 20px 32px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2
        data-aos="fade-up"
        style={{
          fontWeight: 430,
          fontSize: "clamp(24px, 5vw, 34px)",
          marginBottom: 36,
          color: "ghostwhite",
          letterSpacing: -1,
          textAlign: "center",
          padding: "0 10px",
        }}
      >
        Why Choose PrimeRad?
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          width: "100%",
          maxWidth: 1200,
          padding: "0 10px",
        }}
        className="why-choose-grid"
      >
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          style={{
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 2px 12px rgba(33, 150, 243, 0.06)",
            padding: "36px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <span style={{ fontSize: 38, color: "#8e24aa", marginBottom: 18 }}>
            ✔️
          </span>
          <div
            style={{
              fontWeight: 700,
              fontSize: "clamp(18px, 3vw, 22px)",
              color: "#222",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Accredited CME/CE
          </div>
          <div
            style={{
              color: "#555",
              fontSize: "clamp(14px, 2.5vw, 16px)",
              textAlign: "center",
            }}
          >
            Valuable credits from recognized bodies.
          </div>
        </div>
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          style={{
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 2px 12px rgba(19, 57, 88, 0.06)",
            padding: "36px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <span style={{ fontSize: 38, color: "#6d4c41", marginBottom: 18 }}>
            🎓
          </span>
          <div
            style={{
              fontWeight: 700,
              fontSize: "clamp(18px, 3vw, 22px)",
              color: "#222",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Expert-Led Content
          </div>
          <div
            style={{
              color: "#555",
              fontSize: "clamp(14px, 2.5vw, 16px)",
              textAlign: "center",
            }}
          >
            Learn from top radiologists and medical professionals.
          </div>
        </div>
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          style={{
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 2px 12px rgba(33, 150, 243, 0.06)",
            padding: "36px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <span style={{ fontSize: 38, color: "#1976d2", marginBottom: 18 }}>
            📖
          </span>
          <div
            style={{
              fontWeight: 700,
              fontSize: "clamp(18px, 3vw, 22px)",
              color: "#222",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Vast Content Library
          </div>
          <div
            style={{
              color: "#555",
              fontSize: "clamp(14px, 2.5vw, 16px)",
              textAlign: "center",
            }}
          >
            Access thousands of hours of lectures and cases.
          </div>
        </div>
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          style={{
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 2px 12px rgba(33, 150, 243, 0.06)",
            padding: "36px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <span style={{ fontSize: 38, color: "#ffb300", marginBottom: 18 }}>
            💡
          </span>
          <div
            style={{
              fontWeight: 700,
              fontSize: "clamp(18px, 3vw, 22px)",
              color: "#222",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Interactive Assessments
          </div>
          <div
            style={{
              color: "#555",
              fontSize: "clamp(14px, 2.5vw, 16px)",
              textAlign: "center",
            }}
          >
            Test your knowledge and track your progress.
          </div>
        </div>
        <div
          data-aos="fade-up"
          data-aos-delay="500"
          style={{
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 2px 12px rgba(33, 150, 243, 0.06)",
            padding: "36px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <span style={{ fontSize: 38, color: "#00bfae", marginBottom: 18 }}>
            🤝
          </span>
          <div
            style={{
              fontWeight: 700,
              fontSize: "clamp(18px, 3vw, 22px)",
              color: "#222",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Community Support
          </div>
          <div
            style={{
              color: "#555",
              fontSize: "clamp(14px, 2.5vw, 16px)",
              textAlign: "center",
            }}
          >
            Join a vibrant community of peers and mentors for guidance and
            collaboration.
          </div>
        </div>
        <div
          data-aos="fade-up"
          data-aos-delay="600"
          style={{
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 2px 12px rgba(33, 150, 243, 0.06)",
            padding: "36px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <span style={{ fontSize: 38, color: "#ff7043", marginBottom: 18 }}>
            ⏰
          </span>
          <div
            style={{
              fontWeight: 700,
              fontSize: "clamp(18px, 3vw, 22px)",
              color: "#222",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Flexible Learning
          </div>
          <div
            style={{
              color: "#555",
              fontSize: "clamp(14px, 2.5vw, 16px)",
              textAlign: "center",
            }}
          >
            Learn at your own pace, anytime, anywhere, with on-demand access.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HomeHeroSlider latestMovie={latestMovie} />
      {!isAuthenticated && whyChooseSection}

      {isAuthenticated && (
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          style={{
            background: sectionBg[0],
            padding: "clamp(30px, 6vw, 48px) 0",
          }}
        >
          <ContinueWatching />
        </div>
      )}
      {/* Why Choose section for authenticated users */}
      {isAuthenticated && whyChooseSection}

      {/* Trending Section */}
      <div
        data-aos="fade-right"
        data-aos-duration="1000"
        style={{
          background: sectionBg[1],
          padding: "clamp(30px, 6vw, 48px) 0",
        }}
      >
        <LatestMovies title="Trending" />
      </div>

      {/* Assessment Card Section - Made Fully Responsive */}
      <div
        style={{
          background: "lavender",
          padding: "clamp(30px, 5vw, 40px) clamp(15px, 3vw, 30px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          data-aos="flip-left"
          data-aos-duration="1000"
          style={{
            position: "relative",
            borderRadius: "clamp(16px, 3vw, 24px)",
            boxShadow: "0 8px 32px 0 rgba(255, 193, 7, 0.18)",
            background: "linear-gradient(120deg, #fbf7e2 80%, #fef8df 100%)",
            padding: "10px",
            minWidth: "min(320px, 90vw)",
            maxWidth: 920,
            // width: window.innerWidth <= 768 ? "0%" : "100%",
            // height: window.innerWidth <= 768 ? "50%" : "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: window.innerWidth <= 768 ? "column" : "row",
            alignItems: "center",
            zIndex: 1,
            animation: "assessmentCardPop 1s cubic-bezier(.4,2,.6,1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(120deg, rgba(255, 235, 59, 0.12) 60%, rgba(255, 193, 7, 0.10) 100%)",
              borderRadius: "clamp(16px, 3vw, 24px)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
          {/* Left Thumbnail */}
          <div
            style={{
              flex: window.innerWidth <= 768 ? "none" : "0 0 160px",
              width: window.innerWidth <= 768 ? "120px" : "160px",
              height: window.innerWidth <= 768 ? "140px" : "190px",
              marginLeft: window.innerWidth <= 768 ? "0" : "100px",
              marginBottom: window.innerWidth <= 768 ? "-10px" : "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: window.innerWidth <= 768 ? "24px" : "24px 0 0 24px",
              zIndex: 2,
            }}
          >
            <img
              src="/assets/images/assessment.jpeg"
              alt="Assessment Thumbnail"
              style={{
                width: window.innerWidth <= 768 ? "100px" : "160px",
                height: window.innerWidth <= 768 ? "100px" : "120px",
                objectFit: "cover",
                borderRadius: 18,
                boxShadow: "0 2px 12px #ffe08288",
              }}
              loading="lazy"
            />
          </div>
          <div
            style={{
              flex: 1,
              padding: window.innerWidth <= 768 ? "8px" : "36px 36px 36px 32px",
              position: "relative",
              zIndex: 1,
              textAlign: window.innerWidth <= 768 ? "center" : "left",
              display: "flex",
              flexDirection: "column",
              alignItems: window.innerWidth <= 768 ? "center" : "flex-start",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "clamp(28px, 5vw, 34px)",
                marginBottom: 10,
                color: "#ffb300",
                fontWeight: 700,
                letterSpacing: 1,
                textShadow: "0 2px 8px #fffde4",
              }}
            >
              <span role="img" aria-label="Assessment">
                📝
              </span>
            </div>
            <h2
              style={{
                fontWeight: 800,
                fontSize: "clamp(20px, 4vw, 24px)",
                color: "#b28704",
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              Assessments Now Available!
            </h2>
            <p
              style={{
                fontSize: "clamp(15px, 3vw, 17px)",
                color: "#7c6f1c",
                marginBottom: 18,
                fontWeight: 500,
                lineHeight: "1.5",
              }}
            >
              Test your knowledge and track your progress.
              <br />
              Assessments are now available for all modules.
            </p>
            <button
              onClick={() => (window.location.href = "/atlas")}
              style={{
                background: "linear-gradient(90deg, #ffe082 60%, #ffd54f 100%)",
                color: "black",
                border: "none",
                borderRadius: 8,
                padding: "clamp(10px, 2vw, 12px) clamp(20px, 4vw, 28px)",
                fontWeight: 700,
                fontSize: "clamp(14px, 3vw, 16px)",
                boxShadow: "0 2px 8px #ffe08288",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              Go to Modules
              <span
                style={{ fontSize: "clamp(18px, 3vw, 20px)", marginLeft: 2 }}
              >
                →
              </span>
            </button>
          </div>
        </div>
        <style>{`
          @keyframes assessmentCardPop {
            0% { transform: scale(0.92) translateY(30px); opacity: 0; }
            60% { transform: scale(1.04) translateY(-8px); opacity: 1; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
        `}</style>
      </div>

      <div
        data-aos="fade-up"
        data-aos-duration="2000"
        style={{
          background: sectionBg[0],
          padding: "clamp(30px, 6vw, 48px) 0",
        }}
      >
        <LatestMovies title="Recent Items" />
      </div>

      <div
        style={{
          background: "#e3f2fd",
          padding:
            "clamp(30px, 5vw, 40px) clamp(10px, 2vw, 20px) clamp(40px, 6vw, 48px) 0",
          margin: "0 0 0 0",
          position: "relative",
          width: "100vw",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
        }}
      >
        <h2
          style={{
            fontWeight: 600,
            fontSize: "clamp(22px, 4vw, 28px)",
            color: "#222",
            marginBottom: "clamp(20px, 3vw, 24px)",
            textAlign: "center",
            letterSpacing: -0.5,
            padding: "0 20px",
          }}
        >
          Meet Our Faculty
        </h2>
        {/* Decorative gradients for carousel ends - Hidden on mobile */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: window.innerWidth <= 768 ? 0 : 60,
            height: "100%",
            background:
              "linear-gradient(to right, #e3f2fd 80%, rgba(227,242,253,0))",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: window.innerWidth <= 768 ? 0 : 60,
            height: "100%",
            background:
              "linear-gradient(to left, #e3f2fd 80%, rgba(227,242,253,0))",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          navigation={window.innerWidth > 768}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          spaceBetween={window.innerWidth <= 480 ? 24 : 24}
          slidesPerView={1}
          grabCursor={true}
          freeMode={false}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 24 },
            480: { slidesPerView: 1, spaceBetween: 10 },
            600: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            900: { slidesPerView: 3, spaceBetween: 24 },
            1200: { slidesPerView: 4, spaceBetween: 24 },
          }}
          style={{
            maxWidth: 1200,
            margin: window.innerWidth <= 768 ? "0 auto" : "0 auto",
            marginLeft: window.innerWidth <= 768 && "25px",
            position: "relative",
            zIndex: 3,
            padding: "0 clamp(10px, 2vw, 20px)",
          }}
          pagination={{
            clickable: true,
          }}
        >
          {facultyList.map((faculty, idx) => (
            <SwiperSlide key={faculty._id || idx}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "clamp(14px, 2.5vw, 18px)",
                  boxShadow: "0 2px 12px rgba(33, 150, 243, 0.08)",
                  padding: "clamp(24px, 4vw, 32px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: "clamp(280px, 45vw, 340px)",
                  height: "auto",
                  transition: "transform 0.2s",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/faculty-detail")}
                onMouseEnter={(e) => {
                  if (window.innerWidth > 768) {
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth > 768) {
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <img
                  src={faculty.image}
                  alt={faculty.name + " photo"}
                  style={{
                    width: "clamp(120px, 20vw, 160px)",
                    height: "clamp(120px, 20vw, 160px)",
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginBottom: "clamp(16px, 3vw, 22px)",
                    boxShadow: "0 2px 8px rgba(25,118,210,0.2)",
                    border: `3px solid ${THEME.primary}`,
                  }}
                  loading="lazy"
                />
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "clamp(16px, 3vw, 20px)",
                    color: THEME.text,
                    marginBottom: 4,
                    lineHeight: "1.2",
                  }}
                >
                  {faculty.name}
                </div>
                <div
                  style={{
                    color: THEME.textColor,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    lineHeight: "1.3",
                    padding: "0 5px",
                  }}
                >
                  {faculty.title}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        data-aos="zoom-in"
        data-aos-duration="1000"
        style={{
          background: sectionBg[1],
          padding: "clamp(30px, 6vw, 48px) 0",
        }}
      >
        <LatestMovies title="Recommended Cases" />
      </div>

      <ParallexSection randomImage={getRandomImage()} />

      <div
        data-aos="slide-up"
        data-aos-duration="1000"
        style={{
          background: sectionBg[0],
          padding: "clamp(30px, 6vw, 48px) 0",
        }}
      >
        <LatestMovies title="Upcoming Live Programs" />
      </div>

      <TestimonialsSection />

      {/* Recommended Lectures Section */}
      <div
        data-aos="fade-up"
        data-aos-delay="200"
        data-aos-duration="1000"
        style={{
          background: "ghostwhite",
          padding: "clamp(30px, 6vw, 48px) 0",
        }}
      >
        <LatestMovies title="Recommended Lectures" />
      </div>

      {/* Enhanced Responsive Styles */}
      <style jsx>{`
        /* Smooth scrolling for better UX */
        html {
          scroll-behavior: smooth;
        }

        /* Base responsive adjustments */
        * {
          box-sizing: border-box;
        }

        /* Container max-width adjustments */
        .container {
          max-width: 100%;
          padding: 0 clamp(15px, 3vw, 30px);
        }

        /* Typography scaling */
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          word-wrap: break-word;
          hyphens: auto;
        }

        /* Button responsiveness */
        button {
          min-height: 44px; /* Touch target size */
          touch-action: manipulation;
        }

        /* Image responsiveness */
        img {
          max-width: 100%;
          height: auto;
        }

        /* Responsive grid adjustments */
        @media (max-width: 1024px) {
          .why-choose-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
        }

        @media (max-width: 768px) {
          .why-choose-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            // padding: 0 5px !important;
          }

          .swiper-pagination {
            bottom: 10px !important; /* space above dots */
            position: relative !important; /* ensures dots don't overlap cards */
          }

          /* Assessment card mobile adjustments */
          [data-aos="flip-left"] {
            flex-direction: column !important;
            // gap: 10px !important
            text-align: center !important;
          }

          /* Faculty section mobile spacing */
          .swiper {
            padding: 0 10px !important;
          }

          /* Section padding mobile override */
          div[style*="padding"] {
            padding-left: clamp(15px, 4vw, 20px) !important;
            padding-right: clamp(15px, 4vw, 20px) !important;
          }
        }

        @media (max-width: 480px) {
          /* Extra small screens */
          .why-choose-grid div {
            // padding: 24px 16px !important;
            min-height: 50px !important;
          }

          /* Faculty cards smaller */
          .swiper-slide > div {
            min-height: 260px !important;
            // padding: 20px !important;
          }

          /* Assessment card extra small */
          [data-aos="flip-left"] {
            min-width: 95vw !important;
            margin: 0 auto !important;
          }
        }

        /* Landscape tablet adjustments */
        @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
          .why-choose-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
          img {
            image-rendering: -webkit-optimize-contrast;
          }
        }

        .main-title {
          color: #1976d2 !important;
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus styles for keyboard navigation */
        button:focus,
        [tabindex]:focus {
          outline: 2px solid #1976d2;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
});

HomePage.displayName = "HomePage";
export default HomePage;
