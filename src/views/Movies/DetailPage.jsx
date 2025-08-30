import React, {
  Fragment,
  memo,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Player from "@vimeo/player";

import { Row, Col, Container, Nav, Tab, Form, Button } from "react-bootstrap";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../store/auth/selectors";
//components
import ReviewComponent from "../../components/ReviewComponent";
import Sources from "../../components/Sources";
import LatestMovies from "../../components/sections/LatestMovies";
import { FixedBackButton } from "../../utilities/BackButton";

// Icons
import {
  FaExclamationCircle,
  FaGraduationCap,
  FaUser,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";

import { generateImgPath } from "../../StaticData/data"; // Assuming this is correct for image paths

//utilities
import { useEnterExit } from "../../utilities/usePage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

// the hook
import { useTranslation } from "react-i18next";
import axios from "axios";

const THEME = {
  primary: "#1976d2",
  secondary: "#00bfae",
  background: "#f4f8fb",
  card: "#ffffff",
  accent: "#ffb300",
  text: "#263238",
  border: "#e0e0e0",
  lightText: "#666666",
  darkText: "#222222",
  mediumGray: "#A0AEC0",
  softBlue: "#e2f0fe",
};

const MovieDetail = memo(() => {
  const { t } = useTranslation(); // Translation hook
  const location = useLocation(); // Location hook for route state
  const navigate = useNavigate(); // Navigation hook
  const isAuthenticated = useSelector(selectIsAuthenticated); // Auth status from Redux
  const user = useSelector(selectUser); // User object from Redux for ID and name

  const {
    id: sessionId,
    vimeoVideoId = null,
    title = "Untitled Lecture",
    description = "No description available.", // Assuming faculty is an array of objects from backend
    module = "General",
    submodule = "General",
    duration = "N/A",
    isFree = false,
    startDate = null,
    contentType, // e.g., "Lecture", "Case", "Live"
  } = location.state || {};

  console.log("MovieDetail Mounted/Rendered:", {
    sessionId,
    vimeoVideoId,
    contentType,
    isAuthenticated,
    isFree,
    userId: user?._id,
    locationState: location.state,
  });

  // State for Vimeo player
  const [initialPlaybackTime, setInitialPlaybackTime] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const progressSaveIntervalRef = useRef(null); // Use ref for interval ID

  // Refs for DOM elements
  const videoContainerRef = useRef(null);
  const vimeoPlayerInstance = useRef(null);

  const [faculty, setFaculty] = useState([
    {
      _id: "fac1",
      name: "Dr. Alok Sharma",
      image: "/assets/images/faculty1.jpg",
      specializations: ["Diagnostic Radiology", "MRI Interpretation"],
      description:
        "Experienced educator with expertise in medical sciences and innovative teaching methodologies. Passionate about student success and industry-relevant curriculum development.",
      rating: 4.9,
      yearsExp: 15,
    },
    {
      _id: "fac2",
      name: "Dr. Priya Gupta",
      image: "/assets/images/faculty2.jpg",
      specializations: ["Orthopedic Imaging", "Musculoskeletal MRI"],
      description:
        "Specialist in Musculoskeletal Radiology, focusing on complex joint pathologies. Renowned for detailed and evidence-based case reviews.",
      rating: 4.8,
      yearsExp: 10,
    },
    {
      _id: "fac3",
      name: "Dr. Ben Carter",
      image: "/assets/images/faculty3.jpg",
      specializations: ["Neuroradiology", "Spine Pathology"],
      description:
        "An expert in interpreting spine MRIs and CT scans. Dr. Carter provides clear, concise, and clinically relevant insights for aspiring radiologists.",
      rating: 5.0,
      yearsExp: 8,
    },
    {
      _id: "fac4",
      name: "Dr. Maria Rodriguez",
      image: "/assets/images/faculty4.jpg",
      specializations: ["Emergency Radiology", "Trauma Imaging"],
      description:
        "A dedicated educator with a passion for teaching emergency room imaging. Her sessions focus on rapid diagnosis and critical decision-making.",
      rating: 4.7,
      yearsExp: 12,
    },
  ]);

  // A helper function to generate the image path, assuming a static asset folder
  const generateImgPath = (path) => path;

  // Hook for page entry/exit animations/logic (assuming it's external)
  useEnterExit();

  // Helper to determine session model type for backend API calls
  const getSessionModelType = useCallback((type) => {
    if (type && type.toLowerCase() === "case") return "DicomCase";
    if (type && type.toLowerCase() === "lecture") return "RecordedLecture";
    if (type && type.toLowerCase() === "live") return "LiveProgram";
    return null;
  }, []);

  const sessionModelType = getSessionModelType(contentType);

  const tabStyles = `
    .nav-pills .nav-link { transition: all 0.3s ease; position: relative; overflow: hidden; }
    .nav-pills .nav-link:not(.active) { background: transparent !important; color: ${THEME.primary} !important; }
    .nav-pills .nav-link.active { background: lightblue !important; color: white !important; box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4); transform: translateY(-2px); }
    .nav-pills .nav-link:hover:not(.active) { background: rgba(25, 118, 210, 0.1) !important; transform: translateY(-1px); }
    .nav-pills .nav-link.active::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%); pointer-events: none; }
  `;

  const savePlaybackProgress = useCallback(
    async (currentTime) => {
      const userId = user?._id || user?.id || localStorage.getItem("userId");

      if (!userId || !sessionId || !sessionModelType) {
        console.warn(
          "Cannot save progress: User ID, session ID, or session model type missing.",
          {
            userId: userId ? "✓" : "✗",
            sessionId: sessionId ? "✓" : "✗",
            sessionModelType: sessionModelType ? "✓" : "✗",
          }
        );
        return;
      }

      try {
        await axios.post(
          "https://primerad-backend.onrender.com/api/playback-progress/save",
          {
            userId: userId,
            sessionId: sessionId,
            currentTime: currentTime,
            sessionModelType: sessionModelType,
          }
        );
        // console.log(
        //   `Playback progress saved for session ${sessionId} (${sessionModelType}) at ${currentTime} seconds.`
        // );
      } catch (error) {
        console.error("Error saving playback progress:", error);
      }
    },
    [user, sessionId, sessionModelType]
  );

  useEffect(() => {
    const fetchInitialProgress = async () => {
      const userId = user?._id || user?.id || localStorage.getItem("userId");

      if (
        !isAuthenticated ||
        !userId ||
        !sessionId ||
        !sessionModelType ||
        !isFree ||
        !vimeoVideoId
      ) {
        setInitialPlaybackTime(0);
        return;
      }
      try {
        const response = await axios.get(
          `https://primerad-backend.onrender.com/api/playback-progress/${userId}/${sessionId}`
        );
        if (response.data && typeof response.data.currentTime === "number") {
          setInitialPlaybackTime(response.data.currentTime);
          console.log(
            "Initial playback time fetched:",
            response.data.currentTime
          );
        } else {
          setInitialPlaybackTime(0);
        }
      } catch (error) {
        console.error("Error fetching initial playback progress:", error);
        setInitialPlaybackTime(0);
      }
    };

    fetchInitialProgress();
  }, [
    isAuthenticated,
    user,
    sessionId,
    sessionModelType,
    isFree,
    vimeoVideoId,
  ]);

  useEffect(() => {
    if (vimeoPlayerInstance.current) {
      vimeoPlayerInstance.current.destroy();
      vimeoPlayerInstance.current = null;
      setPlayerReady(false);
    }
    if (progressSaveIntervalRef.current) {
      clearInterval(progressSaveIntervalRef.current);
      progressSaveIntervalRef.current = null;
    }

    if (!isFree || !vimeoVideoId || !videoContainerRef.current) {
      console.log(
        "Vimeo Player initialization skipped: Content not free, Vimeo ID missing, or container not ready."
      );
      setPlayerReady(false);
      return;
    }

    const userId = user?._id || user?.id || localStorage.getItem("userId");
    const fullPrerequisitesMet =
      isAuthenticated && userId && sessionId && sessionModelType;
    if (!fullPrerequisitesMet) {
      console.warn(
        "User tracking and progress saving are disabled due to missing user/session data."
      );
    }

    const initializePlayer = async () => {
      try {
        const player = new Player(videoContainerRef.current, {
          url: `https://vimeo.com/${vimeoVideoId}`,
          controls: true,
          responsive: true,
          color: THEME.primary.substring(1),
          title: false,
          byline: false,
          portrait: false,
        });

        vimeoPlayerInstance.current = player;
        await player.ready();
        setPlayerReady(true);

        if (initialPlaybackTime > 0) {
          await player.setCurrentTime(initialPlaybackTime);
          console.log(
            `Seeked to initial playback time: ${initialPlaybackTime}`
          );
        }

        const onPlay = async () => {
          if (!fullPrerequisitesMet) {
            console.log(
              "Progress saving disabled on play: missing user/session data."
            );
            return;
          }
          try {
            await axios.post(
              `https://primerad-backend.onrender.com/api/sessions/track?userId=${userId}&sessionId=${sessionId}`
            );
            console.log("✅ Session view tracked");
          } catch (error) {
            console.error("❌ Failed to track session view:", error);
          }

          if (progressSaveIntervalRef.current) {
            clearInterval(progressSaveIntervalRef.current);
          }

          const intervalId = setInterval(async () => {
            try {
              const currentTime = await player.getCurrentTime();
              await savePlaybackProgress(currentTime);
            } catch (error) {
              console.warn("Error during periodic progress save:", error);
            }
          }, 10000);
          progressSaveIntervalRef.current = intervalId;
        };

        const onPause = async () => {
          if (fullPrerequisitesMet) {
            try {
              const currentTime = await player.getCurrentTime();
              await savePlaybackProgress(currentTime);
            } catch (error) {
              console.warn("Error saving progress on pause:", error);
            }
          }
          if (progressSaveIntervalRef.current) {
            clearInterval(progressSaveIntervalRef.current);
            progressSaveIntervalRef.current = null;
          }
        };

        const onEnded = async () => {
          if (fullPrerequisitesMet) {
            try {
              const currentTime = await player.getCurrentTime();
              await savePlaybackProgress(currentTime);
            } catch (error) {
              console.warn("Error saving progress on end:", error);
            }
          }
          if (progressSaveIntervalRef.current) {
            clearInterval(progressSaveIntervalRef.current);
            progressSaveIntervalRef.current = null;
          }
        };

        player.on("play", onPlay);
        player.on("pause", onPause);
        player.on("ended", onEnded);
      } catch (error) {
        console.error("Error initializing Vimeo Player:", error);
        setPlayerReady(false);
      }
    };

    initializePlayer(); // Call player initialization

    // 6. Cleanup Function: Destroys player and saves final progress on unmount or re-render
    return () => {
      if (progressSaveIntervalRef.current) {
        clearInterval(progressSaveIntervalRef.current);
        progressSaveIntervalRef.current = null;
      }
      if (vimeoPlayerInstance.current) {
        const userIdForCleanup =
          user?._id || user?.id || localStorage.getItem("userId");
        if (userIdForCleanup && sessionId && sessionModelType) {
          vimeoPlayerInstance.current
            .getCurrentTime()
            .then((currentTime) => savePlaybackProgress(currentTime))
            .catch((error) =>
              console.warn("Error getting time for cleanup:", error)
            )
            .finally(() => {
              if (vimeoPlayerInstance.current) {
                vimeoPlayerInstance.current.destroy();
                vimeoPlayerInstance.current = null;
              }
              setPlayerReady(false);
            });
        } else {
          // No full prerequisites, just destroy
          if (vimeoPlayerInstance.current) {
            vimeoPlayerInstance.current.destroy();
            vimeoPlayerInstance.current = null;
          }
          setPlayerReady(false);
        }
      }
    };
  }, [
    vimeoVideoId,
    isAuthenticated,
    user,
    sessionId,
    sessionModelType, // Core dependencies
    initialPlaybackTime,
    savePlaybackProgress,
    isFree,
  ]);

  useEffect(() => {
    const handleWindowBeforeUnload = async () => {
      if (vimeoPlayerInstance.current) {
        try {
          const currentTime =
            await vimeoPlayerInstance.current.getCurrentTime();
          const userId =
            user?._id || user?.id || localStorage.getItem("userId");
          if (navigator.sendBeacon && userId && sessionId && sessionModelType) {
            const data = JSON.stringify({
              userId: userId,
              sessionId: sessionId,
              currentTime: currentTime,
              sessionModelType: sessionModelType,
            });
            navigator.sendBeacon(
              "https://primerad-backend.onrender.com/api/playback-progress/save",
              new Blob([data], { type: "application/json" })
            );
            console.log("Beacon sent on beforeunload.");
          } else {
            console.log(
              "Beacon not sent: missing prerequisites or sendBeacon not supported."
            );
          }
        } catch (error) {
          console.warn("Error saving progress on window beforeunload:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleWindowBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleWindowBeforeUnload);
    };
  }, [user, sessionId, sessionModelType]); // savePlaybackProgress is not needed as sendBeacon is direct

  // Format date for display
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      const options = { year: "numeric", month: "short", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  }, []);

  // Handler for "Subscribe" button click
  const handleSubscribeClick = useCallback(() => {
    // Navigate to pricing page, passing current path so user can be redirected back
    navigate("/pricing", { state: { from: location.pathname } });
  }, [navigate, location.pathname]);

  const displayFacultyNames = useMemo(() => {
    if (Array.isArray(faculty) && faculty.length > 0) {
      return faculty.map((f) => f.name).join(", ");
    }
    return typeof faculty === "string" ? faculty : "Unknown Faculty";
  }, [faculty]);

  return (
    <Fragment>
      <style>{tabStyles}</style>
      <div style={{ backgroundColor: THEME.background }}>
        <FixedBackButton customPath="/main-page"></FixedBackButton>
        <div
          className="iq-main-slider site-video mb-5"
          style={{
            borderRadius: "0 0 28px 28px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          {isAuthenticated ? (
            <Container fluid className="p-0">
              <Row className="g-0">
                <Col>
                  <div className="pt-0">
                    <div
                      className="video-wrapper"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "50vh",
                        height: "90vh",
                        width: "100%",
                        padding: "0 15px",
                        "@media (max-width: 768px)": {
                          height: "50vh",
                          minHeight: "40vh",
                        },
                        "@media (max-width: 480px)": {
                          height: "40vh",
                          minHeight: "35vh",
                        },
                      }}
                    >
                      {/* --- Conditional Video Playback / Subscribe Button --- */}
                      {!isFree ? ( // If the content is NOT free (i.e., locked)
                        <div
                          className="locked-content-overlay"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0,0,0,0.85)", // Dark overlay
                            color: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "1.5rem",
                            textAlign: "center",
                            zIndex: 100, // Ensure this overlay is highest
                            padding: "20px",
                          }}
                        >
                          <FaExclamationCircle
                            size={50}
                            style={{
                              marginBottom: "20px",
                              // Responsive icon size
                              fontSize: "clamp(40px, 8vw, 50px)",
                            }}
                          />
                          <p
                            style={{
                              marginBottom: "15px",
                              fontSize: "clamp(1.2rem, 4vw, 1.8rem)", // Responsive font size
                              fontWeight: "bold",
                            }}
                          >
                            Content Locked
                          </p>
                          <p
                            style={{
                              marginBottom: "30px",
                              fontSize: "clamp(0.9rem, 3vw, 1.1rem)", // Responsive font size
                              maxWidth: "300px", // Limit width for readability
                              textAlign: "center",
                            }}
                          >
                            This exclusive content requires a subscription.
                          </p>
                          <Button
                            variant="primary"
                            onClick={handleSubscribeClick} // Handles navigation to /pricing
                            style={{
                              backgroundColor: "lightblue",
                              borderColor: THEME.primary,
                              borderRadius: "10px",
                              padding: "12px 25px",
                              fontSize: "clamp(1rem, 3vw, 1.2rem)",
                              fontWeight: 700,
                              boxShadow: "0 4px 15px rgba(25,108,210,0.4)",
                              minWidth: "200px",
                            }}
                          >
                            Subscribe to Unlock
                          </Button>
                        </div>
                      ) : // If isFree is true, attempt to render the video player or "Video not available" message
                      vimeoVideoId ? (
                        <>
                          <div
                            ref={videoContainerRef}
                            className="video-container"
                            style={{
                              width: "82%", // Full width on mobile
                              maxWidth: "95%", //
                              height: "auto",
                              aspectRatio: "16/9",
                              border: "none",
                              // Responsive width adjustments
                              // Mobile first approach
                            }}
                          />
                          {/* Loading overlay for video player (appears on top of video, under subscribe button overlay) */}
                          {!playerReady && (
                            <div
                              className="loading-overlay"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "rgba(0,0,0,0.8)",
                                color: "#fff",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "clamp(1rem, 3vw, 1.1rem)", // Responsive font size
                                zIndex: 90, // Higher than video, lower than subscribe overlay
                              }}
                            >
                              Loading video...
                            </div>
                          )}
                        </>
                      ) : (
                        // Display message if vimeoVideoId is missing
                        <div
                          className="video-unavailable"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "#333",
                            color: "#fff",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "clamp(1rem, 3vw, 1.2rem)", // Responsive font size
                            flexDirection: "column",
                            textAlign: "center",
                            zIndex: 10,
                            padding: "20px",
                          }}
                        >
                          <FaExclamationCircle
                            size={40}
                            style={{
                              marginBottom: "10px",
                              fontSize: "clamp(30px, 6vw, 40px)", // Responsive icon size
                            }}
                          />
                          <p>Video not available.</p>
                          <small
                            style={{
                              fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)", // Responsive small text
                              textAlign: "center",
                              maxWidth: "280px",
                            }}
                          >
                            Please check if the video ID is correct or
                            available.
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center login-prompt"
              style={{
                height: "50vh",
                minHeight: "300px", // Minimum height for mobile
                background: "#333",
                borderRadius: "0 0 28px 28px",
                padding: "20px", // Add padding for mobile
              }}
            >
              <div className="text-center text-white">
                <h2
                  className="mb-3"
                  style={{
                    fontSize: "clamp(1.5rem, 5vw, 2rem)", // Responsive heading
                  }}
                >
                  {t("Login to watch unlimited content")}
                </h2>
                <Button
                  variant="primary"
                  onClick={() => navigate("/login")}
                  className="mt-3 py-2 px-4"
                  style={{
                    backgroundColor: THEME.primary,
                    borderColor: THEME.primary,
                    borderRadius: "8px",
                    fontSize: "clamp(1rem, 3vw, 1.1rem)", // Responsive button text
                    fontWeight: 600,
                    minWidth: "150px", // Minimum button width
                  }}
                >
                  {t("Login")}
                </Button>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            .video-wrapper {
              height: 45vh !important;
              min-height: 45vh !important;
              padding: 0 0px !important;
            }

            .video-container {
              width: 98% !important;
              max-width: 98% !important;
            }

            .locked-content-overlay,
            .video-unavailable {
              padding: 15px !important;
            }
          }

          @media (max-width: 480px) {
            .video-wrapper {
              height: 25vh !important;
              min-height: 30vh !important;
              padding: 0 0px !important;
            }

            .video-container {
              width: 100% !important;
              max-width: 100% !important;
            }

            .login-prompt {
              height: 40vh !important;
              padding: 15px !important;
            }
          }

          @media (max-width: 360px) {
            .video-wrapper {
              height: 35vh !important;
              min-height: 30vh !important;
            }

            .locked-content-overlay p:first-of-type,
            .video-unavailable p {
              font-size: 1rem !important;
            }

            .locked-content-overlay p:last-of-type,
            .video-unavailable small {
              font-size: 0.85rem !important;
            }
          }
        `}</style>

        <div className="details-part pt-4 px-md-0">
          <Container fluid>
            <Row>
              <Col lg="12">
                <div
                  className="trending-info pt-0 pb-4 mb-4  position-relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    borderRadius: "24px",
                    marginTop: "-60px",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                    padding: "25px 20px",
                    border: "1px solid rgba(25, 118, 210, 0.1)",
                  }}
                >
                  {/* Medical Pattern Background */}
                  <div
                    className="position-absolute"
                    style={{
                      top: 0,
                      right: 0,
                      width: "200px",
                      height: "200px",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231976d2' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      opacity: 0.3,
                    }}
                  />

                  <Row>
                    <Col md="12" className="mb-auto">
                      <div
                        className="d-flex flex-row flex-row-md align-items-center align-items-md-center mb-2 mb-md-4"
                        style={{
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="flex-grow-1 p-2 flex-md-row">
                          <div className="d-flex align-items-center mb-0  ">
                            <div
                              className="me-3 d-flex align-items-center justify-content-center"
                              style={{
                                width:
                                  window.innerWidth <= 768 ? "24px" : "48px",
                                height:
                                  window.innerWidth <= 768 ? "24px" : "48px",
                                marginTop:
                                  window.innerWidth <= 768 ? "10px" : "20px",
                                background:
                                  "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                                borderRadius: "12px",
                                color: "white",
                                fontSize:
                                  window.innerWidth <= 768
                                    ? "0.8rem"
                                    : "1.2rem",
                              }}
                            >
                              🏥
                            </div>
                            <div>
                              <h1
                                className="fw-bold mx-0 ml-md-0"
                                style={{
                                  color: "#1a202c",
                                  fontSize:
                                    window.innerWidth <= 768 ? "1rem" : "2rem",
                                  marginTop: "20px",
                                  marginLeft: "-10px",
                                  lineHeight: 1.2,
                                  textTransform: "uppercase",
                                  background: "darkslategrey",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  backgroundClip: "text",
                                }}
                              >
                                {t(title)}
                              </h1>
                            </div>
                          </div>
                        </div>

                        {/* Medical Status Badge */}
                        <div className="d-flex flex-column flex-md-row gap-2 gap-md-0">
                          <div
                            className="badge d-flex  align-items-center"
                            style={{
                              background:
                                "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                              color: "white",
                              fontSize:
                                window.innerWidth <= 768
                                  ? "0.70rem"
                                  : "0.85rem",
                              padding: "8px 16px",
                              borderRadius: "20px",
                              fontWeight: 600,
                              boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                            }}
                          >
                            <span className="me-2">✓</span>
                            {t("Medically Reviewed")}
                          </div>
                        </div>
                      </div>

                      <div className="row g-2 mb-2">
                        <Col xs={6} md={6} lg={3}>
                          <div
                            className="p-3 d-flex flex-row align-items-center w-100 w-md-100 flex-shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                              borderRadius: "16px",
                              border: "1px solid rgba(25, 118, 210, 0.2)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            <div
                              className="me-3 d-flex align-items-center justify-content-center"
                              style={{
                                width:
                                  window.innerWidth <= 768 ? "20px" : "40px",
                                height:
                                  window.innerWidth <= 768 ? "20px" : "40px",
                                background:
                                  "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                                borderRadius: "10px",
                                color: "white",
                                fontSize: "1rem",
                              }}
                            >
                              ⏱️
                            </div>
                            <div>
                              <div
                                className="small fw-semibold"
                                style={{
                                  color: "#1976d2",
                                  fontSize: "0.8rem",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {t("Duration")}
                              </div>
                              <div
                                className="fw-bold"
                                style={{
                                  color: "#1a202c",
                                  fontSize:
                                    window.innerWidth >= 768
                                      ? "1.1rem"
                                      : "0.85rem",
                                }}
                              >
                                {duration}
                              </div>
                            </div>
                          </div>
                        </Col>

                        <Col xs={6} md={6} lg={3}>
                          <div
                            className="p-3 d-flex align-items-center w-100 w-md-100"
                            style={{
                              background:
                                "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
                              borderRadius: "16px",
                              border: "1px solid rgba(156, 39, 176, 0.2)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            <div
                              className="me-3 d-flex align-items-center justify-content-center"
                              style={{
                                width:
                                  window.innerWidth <= 768 ? "20px" : "40px",
                                height:
                                  window.innerWidth <= 768 ? "20px" : "40px",
                                background:
                                  "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
                                borderRadius: "10px",
                                color: "white",
                                fontSize: "1rem",
                              }}
                            >
                              📅
                            </div>
                            <div>
                              <div
                                className="small fw-semibold"
                                style={{
                                  color: "#9c27b0",
                                  fontSize: "0.8rem",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {t("Published")}
                              </div>
                              <div
                                className="fw-bold"
                                style={{
                                  color: "#1a202c",
                                  fontSize:
                                    window.innerWidth <= 768
                                      ? "13px"
                                      : "1.1rem",
                                }}
                              >
                                {formatDate(startDate)}
                              </div>
                            </div>
                          </div>
                        </Col>

                        <Col xs={6} md={6} lg={3}>
                          <div
                            className="p-3 d-flex align-items-center w-100 w-md-100"
                            style={{
                              background:
                                "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                              borderRadius: "16px",
                              border: "1px solid rgba(76, 175, 80, 0.2)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            <div
                              className="me-3 d-flex align-items-center justify-content-center"
                              style={{
                                width:
                                  window.innerWidth <= 768 ? "20px" : "40px",
                                height:
                                  window.innerWidth <= 768 ? "20px" : "40px",
                                background:
                                  "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                                borderRadius: "10px",
                                color: "white",
                                fontSize: "1rem",
                              }}
                            >
                              🏥
                            </div>
                            <div>
                              <div
                                className="small fw-semibold"
                                style={{
                                  color: "#4caf50",
                                  fontSize:
                                    window.innerWidth <= 768
                                      ? "10px"
                                      : "0.8rem",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {t("Medical Specialty")}
                              </div>
                              <div
                                className="fw-bold"
                                style={{
                                  color: "#1a202c",
                                  fontSize: "1.1rem",
                                }}
                              >
                                {t(module)}
                              </div>
                            </div>
                          </div>
                        </Col>

                        <Col xs={6} md={6} lg={3}>
                          <div
                            className="p-3 d-flex align-items-center w-100 w-md-100"
                            style={{
                              background:
                                "linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)",
                              borderRadius: "16px",
                              border: "1px solid rgba(255, 152, 0, 0.2)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            <div
                              className="me-3 d-flex align-items-center justify-content-center"
                              style={{
                                width:
                                  window.innerWidth <= 768 ? "20px" : "40px",
                                height:
                                  window.innerWidth <= 768 ? "20px" : "40px",
                                background:
                                  "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                                borderRadius: "10px",
                                color: "white",
                                fontSize: "1rem",
                              }}
                            >
                              🔬
                            </div>
                            <div>
                              <div
                                className="small fw-bolder"
                                style={{
                                  color: "orange",
                                  fontSize:
                                    window.innerWidth <= 768
                                      ? "10px"
                                      : "0.8rem",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {t("Pathology Focus")}
                              </div>
                              <div
                                className="fw-bold"
                                style={{
                                  color: "#1a202c",
                                  fontSize: "1.1rem",
                                }}
                              >
                                {t(submodule)}
                              </div>
                            </div>
                          </div>
                        </Col>
                      </div>

                      {/* Medical Accreditation Strip */}
                      <div
                        className="d-flex flex-wrap align-items-center justify-content-center gap-3 py-3 px-4"
                        style={{
                          background:
                            "linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)",
                          borderRadius: "16px",
                          border: "1px solid rgba(25, 118, 210, 0.1)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <span className="me-2" style={{ fontSize: "1.1rem" }}>
                            🏆
                          </span>
                          <small
                            style={{
                              color: "#4a5568",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "auto",
                              fontWeight: 600,
                            }}
                          >
                            {t("AMA Approved")}
                          </small>
                        </div>
                        <div
                          style={{
                            width: "2px",
                            height: "20px",
                            background: "#e2e8f0",
                            borderRadius: "1px",
                          }}
                        />
                        <div className="d-flex align-items-center">
                          <span className="me-2" style={{ fontSize: "1.1rem" }}>
                            📋
                          </span>
                          <small
                            style={{
                              color: "#4a5568",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "auto",
                              fontWeight: 600,
                            }}
                          >
                            {t("Evidence-Based")}
                          </small>
                        </div>
                        <div
                          style={{
                            width: "2px",
                            height: "20px",
                            background: "#e2e8f0",
                            borderRadius: "1px",
                          }}
                        />
                        <div className="d-flex align-items-center">
                          <span className="me-2" style={{ fontSize: "1.1rem" }}>
                            🔬
                          </span>
                          <small
                            style={{
                              color: "#4a5568",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "auto",
                              fontWeight: 600,
                            }}
                          >
                            {t("Peer Reviewed")}
                          </small>
                        </div>
                        <div
                          style={{
                            width: "2px",
                            height: "20px",
                            background: "#e2e8f0",
                            borderRadius: "1px",
                          }}
                        />
                        <div className="d-flex align-items-center">
                          <span className="me-2" style={{ fontSize: "1.1rem" }}>
                            ⚕️
                          </span>
                          <small
                            style={{
                              color: "#4a5568",
                              fontSize:
                                window.innerWidth <= 768 ? "12px" : "auto",
                              fontWeight: 600,
                            }}
                          >
                            {t("Clinical Guidelines")}
                          </small>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Enhanced Tabbed Content with Medical Theme */}
                <div
                  className="content-details trending-info position-relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    borderRadius: "24px",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                    padding: window.innerWidth >= 768 ? "35px" : "20px",
                    marginBottom: "15px",
                    border: "1px solid rgba(25, 118, 210, 0.1)",
                  }}
                >
                  <div
                    className="position-absolute"
                    style={{
                      top: "-20px",
                      left: "-20px",
                      width: "100px",
                      height: "100px",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e3f2fd' fill-opacity='0.6'%3E%3Cpath d='M20 20.5V18h-2v2.5h-2.5v2H18v2.5h2V22.5h2.5v-2H20zM0 18.5V16h2v2.5h2.5v2H2v2.5H0V20.5h-2.5v-2H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      opacity: 0.7,
                    }}
                  />

                  <Tab.Container defaultActiveKey="first">
                    <Nav
                      className="nav-pills mb-5 position-relative"
                      style={{
                        background: THEME.softBlue, // Using a theme color
                        borderRadius: "20px",
                        padding: "8px",
                        gap: "6px",
                        flexWrap: "wrap",
                        border: "1px solid rgba(25, 118, 210, 0.2)",
                        boxShadow: "inset 0 2px 4px rgba(25, 118, 210, 0.1)",
                      }}
                    >
                      <Nav.Item className="flex-grow-1 flex-md-grow-0">
                        <Nav.Link
                          eventKey="first"
                          className="text-center py-3 px-4 position-relative"
                          style={{
                            borderRadius: "16px",
                            fontWeight: 700,
                            fontSize: "1rem",
                            border: "none",
                            transition: "all 0.3s ease",
                            overflow: "hidden",
                          }}
                        >
                          <div className="d-flex align-items-center text-black justify-content-center position-relative z-index-2">
                            <span
                              className="me-2"
                              style={{ fontSize: "1.1rem" }}
                            >
                              📋
                            </span>
                            {t("Overview")}
                          </div>
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              borderRadius: "12px",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              zIndex: 1,
                            }}
                          />
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item className="flex-grow-1 flex-md-grow-0">
                        <Nav.Link
                          eventKey="second"
                          className="text-center py-3 px-4 position-relative"
                          style={{
                            borderRadius: "16px",
                            fontWeight: 700,
                            fontSize: "1rem",
                            border: "none",
                            transition: "all 0.3s ease",
                            overflow: "hidden",
                          }}
                        >
                          <div className="d-flex align-items-center text-black justify-content-center position-relative z-index-2">
                            <span
                              className="me-2"
                              style={{ fontSize: "1.1rem" }}
                            >
                              📚
                            </span>
                            {t("Medical Resources")}
                          </div>
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              borderRadius: "12px",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              zIndex: 1,
                            }}
                          />
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item className="flex-grow-1 flex-md-grow-0">
                        <Nav.Link
                          eventKey="third"
                          className="text-center py-3 px-4 position-relative"
                          style={{
                            borderRadius: "16px",
                            fontWeight: 700,
                            fontSize: "1rem",
                            border: "none",
                            transition: "all 0.3s ease",
                            overflow: "hidden",
                          }}
                        >
                          <div className="d-flex align-items-center text-black justify-content-center position-relative z-index-2">
                            <span
                              className="me-2"
                              style={{ fontSize: "1.1rem" }}
                            >
                              ⭐
                            </span>
                            {t("Reviews")}
                          </div>
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              borderRadius: "12px",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              zIndex: 1,
                            }}
                          />
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>

                    <Tab.Content>
                      {/* Clinical Overview Tab */}
                      <Tab.Pane className="fade show" eventKey="first">
                        <div
                          className="p-4"
                          style={{
                            background:
                              "linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)",
                            borderRadius: "20px",
                            border: "1px solid rgba(25, 118, 210, 0.1)",
                          }}
                        >
                          <div className="d-flex align-items-center mb-3">
                            <div
                              className="me-3 d-flex align-items-center justify-content-center"
                              style={{
                                width:
                                  window.innerWidth >= 768 ? "48px" : "24px",
                                height:
                                  window.innerWidth >= 768 ? "48px" : "24px",
                                background:
                                  "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                                borderRadius: "12px",
                                color: "white",
                                fontSize:
                                  window.innerWidth >= 768 ? "1.2rem" : "1rem",
                              }}
                            >
                              🩺
                            </div>
                            <div>
                              <h4
                                className="fw-bold mb-1"
                                style={{ color: "#1a202c", fontSize: "1.4rem" }}
                              >
                                {t("Medical Summary")}
                              </h4>
                              <p
                                className="mb-0 small"
                                style={{ color: "#718096" }}
                              >
                                {t(
                                  "Comprehensive clinical overview and learning objectives"
                                )}
                              </p>
                            </div>
                          </div>

                          <div
                            className="content-text"
                            style={{
                              lineHeight: 1.8,
                              fontSize: "1.1rem",
                              color: "#4a5568",
                              marginBottom: "24px",
                            }}
                          >
                            {description}
                          </div>

                          <div
                            className="p-4 mb-4"
                            style={{
                              background:
                                "linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)",
                              borderRadius: "16px",
                              border: "1px solid rgba(76, 175, 80, 0.2)",
                            }}
                          >
                            <h5
                              className="fw-bold mb-3 d-flex align-items-center"
                              style={{ color: "#2e7d32", fontSize: "1.2rem" }}
                            >
                              <span className="me-2">🎯</span>
                              {t("Learning Objectives")}
                            </h5>
                            <ul
                              className="mb-0"
                              style={{ color: "#4a5568", fontSize: "1rem" }}
                            >
                              <li className="mb-2">
                                {t(
                                  "Understand fundamental clinical concepts and applications"
                                )}
                              </li>
                              <li className="mb-2">
                                {t("Apply evidence-based medical practices")}
                              </li>
                              <li className="mb-2">
                                {t(
                                  "Develop critical thinking in diagnostic procedures"
                                )}
                              </li>
                              <li className="mb-0">
                                {t("Enhance patient care and safety protocols")}
                              </li>
                            </ul>
                          </div>

                          <div
                            className="p-4"
                            style={{
                              background:
                                "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                              borderRadius: "16px",
                              border: "1px solid rgba(255, 152, 0, 0.2)",
                            }}
                          >
                            <h5
                              className="fw-bold mb-3 d-flex align-items-center"
                              style={{ color: "#ef6c00", fontSize: "1.2rem" }}
                            >
                              <span className="me-2">⚠️</span>
                              {t("Important Clinical Notes")}
                            </h5>
                            <p
                              className="mb-0"
                              style={{ color: "#4a5568", fontSize: "1rem" }}
                            >
                              {t(
                                "This content is for educational purposes and should complement, not replace, clinical judgment and professional medical advice."
                              )}
                            </p>
                          </div>
                        </div>
                      </Tab.Pane>

                      {/* Medical Resources Tab */}
                      <Tab.Pane className="fade" eventKey="second">
                        <div
                          className="p-4"
                          style={{
                            background:
                              "linear-gradient(135deg, #f3e5f5 0%, #f8bbd9 100%)",
                            borderRadius: "20px",
                            border: "1px solid rgba(156, 39, 176, 0.1)",
                          }}
                        >
                          <div className="d-flex align-items-center mb-4">
                            <div
                              className="me-3 d-flex align-items-center justify-content-center"
                              style={{
                                width: "48px",
                                height: "48px",
                                background:
                                  "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
                                borderRadius: "12px",
                                color: "white",
                                fontSize: "1.2rem",
                              }}
                            >
                              📚
                            </div>
                            <div>
                              <h4
                                className="fw-bold mb-1"
                                style={{ color: "#1a202c", fontSize: "1.4rem" }}
                              >
                                {t("Medical Resources & References")}
                              </h4>
                              <p
                                className="mb-0 small"
                                style={{ color: "#718096" }}
                              >
                                {t(
                                  "Supplementary materials and clinical references"
                                )}
                              </p>
                            </div>
                          </div>
                          <Sources />
                        </div>
                      </Tab.Pane>

                      <Tab.Pane className="fade" eventKey="third">
                        <div
                          className="p-4"
                          style={{
                            background:
                              "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                            borderRadius: "20px",
                            border: "1px solid rgba(76, 175, 80, 0.1)",
                          }}
                        >
                          <div className="d-flex align-items-center mb-4">
                            <div
                              className="me-3 d-flex align-items-center justify-content-center"
                              style={{
                                width: "48px",
                                height: "48px",
                                background:
                                  "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                                borderRadius: "12px",
                                color: "white",
                                fontSize: "1.2rem",
                              }}
                            >
                              ⭐
                            </div>
                            <div>
                              <h4
                                className="fw-bold mb-1"
                                style={{ color: "#1a202c", fontSize: "1.4rem" }}
                              >
                                {t("Reviews & Feedback")}
                              </h4>
                              <p
                                className="mb-0 small"
                                style={{ color: "#718096" }}
                              >
                                {t(
                                  "Peer reviews and educational effectiveness ratings"
                                )}
                              </p>
                            </div>
                          </div>
                          <ReviewComponent
                            itemId={sessionId}
                            isAuthenticated={isAuthenticated}
                            currentUserId={
                              user?._id || user?.id || user?.userId
                            }
                            itemTitle={title}
                            itemType={contentType}
                          />
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        {/* Faculty/Cast Section */}
        <div className="cast-tabs pb-5 px-0 px-md-0">
          <Container fluid>
            <div
              className="content-details trending-info position-relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                borderRadius: "24px",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                padding: "40px 35px",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "150px",
                  height: "150px",
                  background: "linear-gradient(135deg, #667eea20, #764ba220)",
                  borderRadius: "50%",
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  left: "-30px",
                  width: "100px",
                  height: "100px",
                  background: "linear-gradient(135deg, #f093fb20, #f5576c20)",
                  borderRadius: "50%",
                  opacity: 0.5,
                }}
              />

              <Tab.Container defaultActiveKey="first">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                  <div>
                    <h3
                      className="fw-bold mb-2"
                      style={{
                        color: "#1a202c",
                        fontSize: "2rem",
                        background:
                          "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {t("Meet Your Faculty")}
                    </h3>
                    <p
                      className="mb-0"
                      style={{
                        color: "#718096",
                        fontSize: "1.1rem",
                        fontWeight: 400,
                      }}
                    >
                      {t(
                        "Learn from industry experts and experienced educators"
                      )}
                    </p>
                  </div>

                  {/* Faculty Count Badge */}
                  <div
                    className="d-flex align-items-center mt-3 mt-md-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      color: "white",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                    }}
                  >
                    <FaGraduationCap className="me-2" />
                    {Array.isArray(faculty)
                      ? faculty.length
                      : faculty
                      ? 1
                      : 0}{" "}
                    {t("Faculty Member")}
                    {Array.isArray(faculty) && faculty.length !== 1
                      ? "s"
                      : ""}{" "}
                    {/* Corrected pluralization */}
                  </div>
                </div>

                <Nav
                  className="nav-pills mb-5 position-relative"
                  style={{
                    background:
                      "linear-gradient(135deg, #ebf8ff 0%, #e6fffa 100%)",
                    borderRadius: "16px",
                    padding: "6px",
                    border: "1px solid rgba(102, 126, 234, 0.1)",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                  }}
                >
                  <Nav.Item className="flex-grow-1">
                    <Nav.Link
                      eventKey="first"
                      className="text-center py-3 px-4 position-relative"
                      style={{
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        border: "none",
                        background: "transparent",
                        color: "#2d3748",
                        transition: "all 0.3s ease",
                        overflow: "hidden",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center position-relative z-index-2">
                        <FaUser className="me-2" size={16} />
                        {t("Faculty Information")}
                      </div>
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "12px",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          zIndex: 1,
                        }}
                      />
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane className="fade show" eventKey="first">
                    {Array.isArray(faculty) && faculty.length > 0 ? (
                      <Swiper
                        slidesPerView={1}
                        loop={false}
                        modules={[Navigation]}
                        navigation={{
                          nextEl: ".swiper-button-next-custom",
                          prevEl: ".swiper-button-prev-custom",
                        }}
                        className="position-relative faculty-swiper"
                        style={{
                          padding: "20px 0",
                        }}
                        breakpoints={{
                          0: { slidesPerView: 1, spaceBetween: 20 },
                          768: { slidesPerView: 1, spaceBetween: 25 },
                          992: { slidesPerView: 1, spaceBetween: 30 },
                        }}
                      >
                        {faculty.map((member, index) => (
                          <SwiperSlide key={member._id || index}>
                            <div
                              className="faculty-card position-relative"
                              style={{
                                background:
                                  "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                                borderRadius: "20px",
                                padding: "30px",
                                boxShadow:
                                  "0 8px 25px rgba(0,0,0,0.06), 0 3px 10px rgba(0,0,0,0.03)",
                                border: "1px solid rgba(255,255,255,0.8)",
                                transition: "all 0.3s ease",
                                overflow: "hidden",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(-5px)";
                                e.currentTarget.style.boxShadow =
                                  "0 12px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                  "0 8px 25px rgba(0,0,0,0.06), 0 3px 10px rgba(0,0,0,0.03)";
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  width: "80px",
                                  height: "80px",
                                  background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                                  opacity: 0.1,
                                }}
                              />
                              <Row className="align-items-center">
                                <Col
                                  xs={12}
                                  md={4}
                                  lg={3}
                                  className="text-center mb-4 mb-md-0"
                                >
                                  <div className="position-relative d-inline-block">
                                    <div
                                      className="faculty-image-container position-relative"
                                      style={{
                                        width: "120px",
                                        height: "120px",
                                        margin: "0 auto",
                                      }}
                                    >
                                      <img
                                        src={member.image}
                                        alt={`${member.name} profile`}
                                        className="img-fluid"
                                        loading="lazy"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                          borderRadius: "50%",
                                          border: "4px solid #ffffff",
                                          boxShadow:
                                            "0 8px 25px rgba(0,0,0,0.15)",
                                        }}
                                      />
                                      <div
                                        className="position-absolute"
                                        style={{
                                          bottom: "8px",
                                          right: "8px",
                                          width: "24px",
                                          height: "24px",
                                          backgroundColor: "#38a169",
                                          borderRadius: "50%",
                                          border: "3px solid white",
                                          boxShadow:
                                            "0 2px 8px rgba(0,0,0,0.2)",
                                        }}
                                      />
                                      <div
                                        className="position-absolute"
                                        style={{
                                          top: "-10px",
                                          right: "-10px",
                                          background:
                                            "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                          borderRadius: "12px",
                                          padding: "4px 8px",
                                          fontSize: "0.7rem",
                                          fontWeight: 700,
                                          color: "white",
                                          boxShadow:
                                            "0 4px 15px rgba(240, 147, 251, 0.4)",
                                        }}
                                      >
                                        ⭐ 4.9
                                      </div>
                                    </div>
                                  </div>
                                </Col>

                                <Col xs={12} md={8} lg={9}>
                                  <div className="faculty-info">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                                      <div>
                                        <h4
                                          className="fw-bold mb-1"
                                          style={{
                                            color: "#1a202c",
                                            fontSize: "1.6rem",
                                          }}
                                        >
                                          <Link
                                            to="/faculty-detail" // Adjust this link to pass member._id if faculty-detail page is dynamic
                                            state={{
                                              facultyId: member._id,
                                              facultyName: member.name,
                                              facultyImage: member.image,
                                            }}
                                            style={{
                                              color: "inherit",
                                              textDecoration: "none",
                                              transition: "color 0.3s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                              e.target.style.color = "#667eea";
                                            }}
                                            onMouseLeave={(e) => {
                                              e.target.style.color = "#1a202c";
                                            }}
                                          >
                                            {t(
                                              member.name || "Unknown Faculty"
                                            )}
                                          </Link>
                                        </h4>
                                        <div className="d-flex align-items-center mb-2">
                                          <span
                                            className="badge me-2"
                                            style={{
                                              background:
                                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                              fontSize: "0.8rem",
                                              padding: "6px 12px",
                                              borderRadius: "8px",
                                              fontWeight: 600,
                                            }}
                                          >
                                            {t("Senior Lecturer")}
                                          </span>
                                          <span
                                            className="badge"
                                            style={{
                                              background:
                                                "linear-gradient(135deg, #38a169 0%, #2f855a 100%)",
                                              fontSize: "0.8rem",
                                              padding: "6px 12px",
                                              borderRadius: "8px",
                                              fontWeight: 600,
                                            }}
                                          >
                                            {t("Verified Educator")}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                      <div className="col-6 col-md-3">
                                        <div
                                          className="text-center p-3"
                                          style={{
                                            background:
                                              "linear-gradient(135deg, #ebf8ff 0%, #e6fffa 100%)",
                                            borderRadius: "12px",
                                            border:
                                              "1px solid rgba(102, 126, 234, 0.1)",
                                          }}
                                        >
                                          <div
                                            className="fw-bold mb-1"
                                            style={{
                                              fontSize: "1.3rem",
                                              color: "#1a202c",
                                            }}
                                          >
                                            156
                                          </div>
                                          <small
                                            style={{
                                              color: "#718096",
                                              fontSize: "0.8rem",
                                            }}
                                          >
                                            {t("Lectures")}
                                          </small>
                                        </div>
                                      </div>
                                      <div className="col-6 col-md-3">
                                        <div
                                          className="text-center p-3"
                                          style={{
                                            background:
                                              "linear-gradient(135deg, #f0fff4 0%, #f0f9ff 100%)",
                                            borderRadius: "12px",
                                            border:
                                              "1px solid rgba(56, 161, 105, 0.1)",
                                          }}
                                        >
                                          <div
                                            className="fw-bold mb-1"
                                            style={{
                                              fontSize: "1.3rem",
                                              color: "#1a202c",
                                            }}
                                          >
                                            4.9
                                          </div>
                                          <small
                                            style={{
                                              color: "#718096",
                                              fontSize: "0.8rem",
                                            }}
                                          >
                                            {t("Rating")}
                                          </small>
                                        </div>
                                      </div>
                                      <div className="col-6 col-md-3">
                                        <div
                                          className="text-center p-3"
                                          style={{
                                            background:
                                              "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
                                            borderRadius: "12px",
                                            border:
                                              "1px solid rgba(236, 72, 153, 0.1)",
                                          }}
                                        >
                                          <div
                                            className="fw-bold mb-1"
                                            style={{
                                              fontSize: "1.3rem",
                                              color: "#1a202c",
                                            }}
                                          >
                                            8+
                                          </div>
                                          <small
                                            style={{
                                              color: "#718096",
                                              fontSize: "0.8rem",
                                            }}
                                          >
                                            {t("Years Exp")}
                                          </small>
                                        </div>
                                      </div>
                                    </div>

                                    <p
                                      className="mb-3"
                                      style={{
                                        color: "#4a5568",
                                        fontSize: "1rem",
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {t(
                                        "Experienced educator with expertise in medical sciences and innovative teaching methodologies. Passionate about student success and industry-relevant curriculum development."
                                      )}
                                    </p>

                                    <div className="mb-3">
                                      <h6
                                        className="fw-semibold mb-2"
                                        style={{
                                          color: "#2d3748",
                                          fontSize: "0.9rem",
                                        }}
                                      >
                                        {t("Specializations")}:
                                      </h6>
                                      <div className="d-flex flex-wrap gap-2">
                                        {[
                                          "Medical Imaging",
                                          "Diagnostic Radiology",
                                          "Patient Care",
                                          "Clinical Research",
                                        ].map((spec, index) => (
                                          <span
                                            key={index}
                                            className="badge"
                                            style={{
                                              background: `linear-gradient(135deg, ${
                                                index % 2 === 0
                                                  ? "#667eea20, #764ba220"
                                                  : "#f093fb20, #f5576c20"
                                              })`,
                                              color: "#4a5568",
                                              fontSize: "0.8rem",
                                              padding: "6px 12px",
                                              borderRadius: "8px",
                                              fontWeight: 500,
                                              border: `1px solid ${
                                                index % 2 === 0
                                                  ? "#667eea30"
                                                  : "#f093fb30"
                                              }`,
                                            }}
                                          >
                                            {t(spec)}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <div
                        className="text-center py-5"
                        style={{
                          background:
                            "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
                          borderRadius: "16px",
                          border: "2px dashed #cbd5e0",
                        }}
                      >
                        <FaGraduationCap
                          size={48}
                          style={{ color: "#a0aec0", marginBottom: "16px" }}
                        />
                        <h5 style={{ color: "#4a5568", marginBottom: "8px" }}>
                          {t("No Faculty Information")}
                        </h5>
                        <p style={{ color: "#718096", marginBottom: 0 }}>
                          {t(
                            "Faculty details will be displayed here when available"
                          )}
                        </p>
                      </div>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </Container>
        </div>
        <LatestMovies title="Recent Items" />
      </div>
    </Fragment>
  );
});

MovieDetail.displayName = "MovieDetail";
export default MovieDetail;
