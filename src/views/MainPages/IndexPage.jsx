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
import { Navigation, Autoplay } from "swiper";
import "swiper/css";
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
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

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
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading Faculty...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
        {error}
      </div>
    );
  }

  if (facultyList.length === 0) {
    return (
      <div
        style={{ textAlign: "center", padding: "40px", color: THEME.textColor }}
      >
        No faculty members found.
      </div>
    );
  }

  const whyChooseSection = (
    <div
      style={{
        background: "#2A2F42",
        padding: "48px 0 32px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2
        data-aos="fade-up"
        style={{
          fontWeight: 430,
          fontSize: 34,
          marginBottom: 36,
          color: "ghostwhite",
          letterSpacing: -1,
          textAlign: "center",
        }}
      >
        Why Choose PrimeRad?
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "32px",
          width: "100%",
          maxWidth: 1200,
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
          }}
        >
          <span style={{ fontSize: 38, color: "#8e24aa", marginBottom: 18 }}>
            ✔️
          </span>
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              color: "#222",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Accredited CME/CE
          </div>
          <div style={{ color: "#555", fontSize: 16, textAlign: "center" }}>
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
          }}
        >
          <span style={{ fontSize: 38, color: "#6d4c41", marginBottom: 18 }}>
            🎓
          </span>
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              color: "#222",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Expert-Led Content
          </div>
          <div style={{ color: "#555", fontSize: 16, textAlign: "center" }}>
            Learn from top radiologists and medical professionals.
          </div>
        </div>
        {/* Card 3 */}
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
          }}
        >
          <span style={{ fontSize: 38, color: "#1976d2", marginBottom: 18 }}>
            📖
          </span>
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              color: "#222",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Vast Content Library
          </div>
          <div style={{ color: "#555", fontSize: 16, textAlign: "center" }}>
            Access thousands of hours of lectures and cases.
          </div>
        </div>
        {/* Card 4 */}
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
          }}
        >
          <span style={{ fontSize: 38, color: "#ffb300", marginBottom: 18 }}>
            💡
          </span>
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              color: "#222",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Interactive Assessments
          </div>
          <div style={{ color: "#555", fontSize: 16, textAlign: "center" }}>
            Test your knowledge and track your progress.
          </div>
        </div>
        {/* Card 5 - Community Support */}
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
          }}
        >
          <span style={{ fontSize: 38, color: "#00bfae", marginBottom: 18 }}>
            🤝
          </span>
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              color: "#222",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Community Support
          </div>
          <div style={{ color: "#555", fontSize: 16, textAlign: "center" }}>
            Join a vibrant community of peers and mentors for guidance and
            collaboration.
          </div>
        </div>
        {/* Card 6 - Flexible Learning */}
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
          }}
        >
          <span style={{ fontSize: 38, color: "#ff7043", marginBottom: 18 }}>
            ⏰
          </span>
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              color: "#222",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Flexible Learning
          </div>
          <div style={{ color: "#555", fontSize: 16, textAlign: "center" }}>
            Learn at your own pace, anytime, anywhere, with on-demand access.
          </div>
        </div>
      </div>
    </div>
  );
  // Faculty data (unique instructors from latestMovie)

  return (
    <>
      <HomeHeroSlider latestMovie={latestMovie} />
      {/* Why Choose section for non-authenticated users */}
      {!isAuthenticated && whyChooseSection}
      {/* Continue Watching Section */}
      {isAuthenticated && (
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          style={{
            background: sectionBg[0],
            padding: "48px 0",
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
          padding: "48px 0",
        }}
      >
        <LatestMovies title="Trending" />
      </div>

      <div
        style={{
          // background: "#FFF6D7",
          padding: "40px 30px",
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
            borderRadius: 24,
            boxShadow: "0 8px 32px 0 rgba(255, 193, 7, 0.18)",
            background: "linear-gradient(120deg, #fffbe7 80%, #fffde4 100%)",
            padding: "10px",
            minWidth: 420,
            maxWidth: 920,
            width: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            zIndex: 1,
            animation: "assessmentCardPop 1s cubic-bezier(.4,2,.6,1)",
          }}
        >
          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(120deg, rgba(255, 235, 59, 0.12) 60%, rgba(255, 193, 7, 0.10) 100%)",
              borderRadius: 24,
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
          {/* Left Thumbnail */}
          <div
            style={{
              flex: "0 0 160px",
              height: 190,
              marginLeft: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 243, 128, 0.18)",
              borderRadius: "24px 0 0 24px",
              zIndex: 2,
            }}
          >
            <img
              src="/assets/images/assessment.jpeg"
              alt="Assessment Thumbnail"
              style={{
                width: 160,
                height: 120,
                objectFit: "cover",
                borderRadius: 18,
                boxShadow: "0 2px 12px #ffe08288",
              }}
              loading="lazy"
            />
          </div>
          {/* Right Content */}
          <div
            style={{
              flex: 1,
              padding: "36px 36px 36px 32px",
              position: "relative",
              zIndex: 1,
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 34,
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
                fontSize: 24,
                color: "#b28704",
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              Assessments Now Available!
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "#7c6f1c",
                marginBottom: 18,
                fontWeight: 500,
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
                padding: "12px 28px",
                fontWeight: 700,
                fontSize: 16,
                boxShadow: "0 2px 8px #ffe08288",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "background 0.2s",
              }}
            >
              Go to Modules
              <span style={{ fontSize: 20, marginLeft: 2 }}>→</span>
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
        data-aos-duration="1000"
        style={{
          background: sectionBg[0],
          padding: "48px 0",
        }}
      >
        <LatestMovies title="Recent Items" />
      </div>

      {/* Faculty Carousel Section */}
      <div
        style={{
          background: "#e3f2fd", // Consistent with your provided snippet
          padding: "40px 20px 48px 0",
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
            fontSize: 28,
            color: "#222",
            marginBottom: 24,
            textAlign: "center",
            letterSpacing: -0.5,
          }}
        >
          Meet Our Faculty
        </h2>
        {/* Decorative gradients for carousel ends - adjust padding: "40px 20px 48px 0" if they cut off content */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 60,
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
            width: 60,
            height: "100%",
            background:
              "linear-gradient(to left, #e3f2fd 80%, rgba(227,242,253,0))",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation // Enables default navigation arrows
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          spaceBetween={24}
          slidesPerView={3}
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 4 }, // Added 1200 breakpoint for more slides on larger screens
          }}
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            position: "relative",
            zIndex: 3,
          }}
        >
          {facultyList.map((faculty, idx) => (
            <SwiperSlide key={faculty._id || idx}>
              {" "}
              {/* Use unique _id for key */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  boxShadow: "0 2px 12px rgba(33, 150, 243, 0.08)",
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: 340,
                  height: "auto", // Changed to auto to allow content to dictate height, but minHeight ensures consistency
                  transition: "transform 0.2s",
                  textAlign: "center",
                  cursor: "pointer", // Make it clickable
                }}
                onClick={() => navigate("/faculty-detail")}
                // Optional: Add onClick to navigate to a faculty detail page
                // onClick={() => navigate(`/faculty/${faculty._id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <img
                  src={faculty.image}
                  alt={faculty.name + " photo"} // Better alt text
                  style={{
                    width: 160,
                    height: 160,
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginBottom: 22,
                    boxShadow: "0 2px 8px rgba(25,118,210,0.2)", // More pronounced shadow for depth
                    border: `3px solid ${THEME.primary}`, // Border matching theme primary
                  }}
                  loading="lazy"
                />
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 20,
                    color: THEME.text, // Use theme color
                    marginBottom: 4,
                  }}
                >
                  {faculty.name} {/* Use 'name' from API */}
                </div>
                <div style={{ color: THEME.textColor, fontSize: 16 }}>
                  {" "}
                  {/* Use theme color */}
                  {faculty.title} {/* Use 'title' (description) from API */}
                </div>
                {/* Optional: Add a "View Profile" button */}
                {/* <button
                style={{
                  marginTop: 15,
                  padding: "8px 16px",
                  background: THEME.secondary,
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                View Profile
              </button> */}
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
          padding: "48px 0",
          // height: "30%",
        }}
      >
        <LatestMovies title="Recommended Cases" />
      </div>

      <ParallexSection randomImage={getRandomImage()} />

      {/* Upcoming Live Programs Section */}
      <div
        data-aos="slide-up"
        data-aos-duration="1000"
        style={{
          background: sectionBg[0],
          padding: "48px 0",
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
          padding: "48px 0",
        }}
      >
        <LatestMovies title="Recommended Lectures" />
      </div>

      {/* Global Styles */}
      <style jsx>{`
        /* Smooth scrolling for better UX */
        html {
          scroll-behavior: smooth;
        }

        /* Responsive padding adjustments */
        @media (max-width: 768px) {
          div[style*="padding: 60px 0"] {
            padding: 40px 0 !important;
          }

          div[style*="padding: 40px 0"] {
            padding: 30px 0 !important;
          }
        }

        @media (max-width: 576px) {
          div[style*="padding: 60px 0"] {
            padding: 30px 0 !important;
          }

          div[style*="padding: 40px 0"] {
            padding: 20px 0 !important;
          }
        }

        .main-title {
          color: #1976d2 !important;
        }
      `}</style>
      <style>{`
        @media (max-width: 900px) {
          .why-choose-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .why-choose-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
});

HomePage.displayName = "HomePage";
export default HomePage;
