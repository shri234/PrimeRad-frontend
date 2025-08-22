import React, {
  Fragment,
  memo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Row, Col, Container, Nav, Tab } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/auth/selectors";
import { FixedBackButton } from "../../utilities/BackButton";
import { selectUser } from "../../store/auth/selectors";
import ReviewComponent from "../../components/ReviewComponent";
import Sources from "../../components/Sources";
import RatingStar from "../../components/rating-star";
import { generateImgPath } from "../../StaticData/data";

import {
  FaGraduationCap,
  FaUser,
  FaVideo,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideoSlash,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { useTranslation } from "react-i18next";

const THEME = {
  primary: "#1976d2",
  secondary: "#00bfae",
  background: "#f4f8fb",
  card: "#fff",
  accent: "#ffb300",
  text: "#263238",
  border: "#e0e0e0",
};

const ZOOM_CONFIG = {
  meetingNumber: "5387499339",
  passWord: "n2hGRVEnYTLVvvmABwhFpWxff5j8sv.1",
  sdkKey: "X602ddj3QhO_WufAVepnbw",
  sdkSecret: "",
  userName: "Medical Student",
  userEmail: "",
  leaveUrl: window.location.origin,
};

const ZoomMeeting = ({ isAuthenticated, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const meetingContainerRef = useRef(null);
  const zoomClientRef = useRef(null);

  useEffect(() => {
    const loadZoomSDK = async () => {
      try {
        const { ZoomMtg } = await import("@zoomus/websdk");

        ZoomMtg.setZoomJSLib("https://source.zoom.us/2.18.0/lib", "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();

        zoomClientRef.current = ZoomMtg;
      } catch (err) {
        console.error("Failed to load Zoom SDK:", err);
        setError("Failed to load Zoom SDK");
      }
    };

    loadZoomSDK();
  }, []);

  const generateSignature = useCallback(async (meetingNumber, role) => {
    try {
      const response = await fetch("/api/zoom/signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingNumber,
          role,
          sdkKey: ZOOM_CONFIG.sdkKey,
        }),
      });

      const data = await response.json();
      return data.signature;
    } catch (error) {
      console.error("Error generating signature:", error);
      throw error;
    }
  }, []);

  const joinMeeting = useCallback(async () => {
    if (!zoomClientRef.current) {
      setError("Zoom SDK not loaded");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const signature = await generateSignature(ZOOM_CONFIG.meetingNumber, 0);

      await zoomClientRef.current.init({
        leaveUrl: ZOOM_CONFIG.leaveUrl,
        success: (success) => {
          console.log("Zoom SDK initialized successfully", success);

          zoomClientRef.current.join({
            signature: signature,
            meetingNumber: ZOOM_CONFIG.meetingNumber,
            userName: user?.name || ZOOM_CONFIG.userName,
            userEmail: user?.email || ZOOM_CONFIG.userEmail,
            passWord: ZOOM_CONFIG.passWord,
            sdkKey: ZOOM_CONFIG.sdkKey,
            success: (success) => {
              console.log("Successfully joined meeting", success);
              setIsJoined(true);
              setIsLoading(false);
            },
            error: (error) => {
              console.error("Error joining meeting", error);
              setError("Failed to join meeting");
              setIsLoading(false);
            },
          });
        },
        error: (error) => {
          console.error("Zoom SDK initialization failed", error);
          setError("Failed to initialize Zoom SDK");
          setIsLoading(false);
        },
      });
    } catch (err) {
      console.error("Error in joinMeeting:", err);
      setError("Failed to join meeting");
      setIsLoading(false);
    }
  }, [generateSignature, user]);

  const leaveMeeting = useCallback(() => {
    if (zoomClientRef.current && isJoined) {
      zoomClientRef.current.leave();
      setIsJoined(false);
    }
  }, [isJoined]);

  const toggleAudio = useCallback(() => {
    if (zoomClientRef.current && isJoined) {
      if (audioEnabled) {
        zoomClientRef.current.mute();
      } else {
        zoomClientRef.current.unmute();
      }
      setAudioEnabled(!audioEnabled);
    }
  }, [audioEnabled, isJoined]);

  const toggleVideo = useCallback(() => {
    if (zoomClientRef.current && isJoined) {
      if (videoEnabled) {
        zoomClientRef.current.muteVideo();
      } else {
        zoomClientRef.current.unmuteVideo();
      }
      setVideoEnabled(!videoEnabled);
    }
  }, [videoEnabled, isJoined]);

  if (!isAuthenticated) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="text-center">
          <h2>Login to join the live session</h2>
          <button
            className="btn btn-primary mt-3"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: window.innerWidth <= 768 ? "260px" : "700px",
      }}
    >
      <div
        ref={meetingContainerRef}
        id="zmmtg-root"
        style={{
          width: "100%",
          height: window.innerWidth <= 768 ? "260px" : "700px",
          borderRadius: "16px",
          position: "absolute",
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      />

      {isJoined && (
        <div
          className="position-absolute bottom-0 start-50 translate-middle-x mb-3"
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            borderRadius: "25px",
            padding: "10px 20px",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="d-flex gap-3 align-items-center">
            <button
              className={`btn btn-sm ${
                audioEnabled ? "btn-success" : "btn-danger"
              }`}
              onClick={toggleAudio}
              style={{
                borderRadius: "50%",
                width: "45px",
                height: "45px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>

            <button
              className={`btn btn-sm ${
                videoEnabled ? "btn-success" : "btn-danger"
              }`}
              onClick={toggleVideo}
              style={{
                borderRadius: "50%",
                width: "45px",
                height: "45px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
            </button>

            <button
              className="btn btn-sm btn-outline-light"
              onClick={leaveMeeting}
              style={{
                borderRadius: "20px",
                padding: "8px 16px",
              }}
            >
              Leave Meeting
            </button>
          </div>
        </div>
      )}

      {!isJoined && !isLoading && (
        <div
          className="position-absolute top-50 start-50 translate-middle"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h4 className="mb-3">Ready to join the live session?</h4>
          <button
            className="btn btn-primary btn-lg"
            onClick={joinMeeting}
            style={{
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              border: "none",
              borderRadius: "25px",
              padding: "12px 30px",
              fontWeight: "600",
            }}
          >
            <FaVideo className="me-2" />
            Join Meeting
          </button>
        </div>
      )}

      {isLoading && (
        <div
          className="position-absolute top-50 start-50 translate-middle"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Connecting to meeting...</h5>
          <p className="text-muted mb-0">
            Please wait while we set up your session
          </p>
        </div>
      )}

      {error && (
        <div
          className="position-absolute top-50 start-50 translate-middle"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
            maxWidth: window.innerWidth <= 768 ? "150px" : "400px",
            maxHeight: window.innerWidth <= 768 ? "150px" : "200px",
          }}
        >
          <div className="text-danger mb-1 mb-md-2">
            <i className="fas fa-exclamation-triangle fa-1x fa-md-2x"></i>
          </div>
          <h5 className="text-danger">Connection Error</h5>
          <p className="text-muted mb-1 mb-md-3">{error}</p>
          <button
            className="btn btn-primary "
            onClick={() => {
              setError(null);
              joinMeeting();
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

const LivePage = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("Knee MRI Case");
  const [duration, setDuration] = useState("30 mins");
  const [description, setDescription] = useState("");
  const [module, setModule] = useState("Orthopedics");
  const [submodule, setSubmodule] = useState("Knee Pathology");
  const dicomName = "Anonymized00098";
  const [showVideo, setShowVideo] = useState(false);
  const videoUrl = "https://player.vimeo.com/video/1102457741";
  const [startDate, setStartDate] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [contentType, setContentType] = useState("dicom");

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

  const shows = {
    id: 1,
    slug: "live-session",
    thumbnail: generateImgPath("/assets/images/genre/01.webp"),
    title: "Live Session",
    detail: "Live Zoom session.",
    season_type: "1 Session",
    certificate: "Live",
    rating: 5.0,
    likes: 12,
    rating_from: "Users",
    geners: ["home.action", "home.adventure", "ott_home.drama"],
    tags: ["ott_home.live", "ott_home.session", "ott_home.zoom"],
    video_link: "zoom-sdk-integration",
    video_type: "zoom-sdk",
    is_restricted: false,
    cast: [
      {
        title: "detail_page.james_chinlund",
        thumbnail: generateImgPath("/assets/images/faculty1.jpg"),
        as: "detail_page.as_james",
      },
      {
        title: "detail_page.james_earl",
        thumbnail: generateImgPath("/assets/images/faculty2.jpg"),
        as: "detail_page.as_jones",
      },
    ],
    crew: [
      {
        title: "detail_page.jeff_nathanson",
        thumbnail: generateImgPath("/assets/images/genre/g3.webp"),
        as: "detail_page.writing",
      },
      {
        title: "detail_page.irene_mecchi",
        thumbnail: generateImgPath("/assets/images/genre/g5.webp"),
        as: "detail_page.writing",
      },
      {
        title: "detail_page.karan_gilchrist",
        thumbnail: generateImgPath("/assets/images/genre/g4.webp"),
        as: "detail_page.production",
      },
    ],
    created_by_username: "Admin",
    created_at: "Feb 2024",
    ranking: "#1 in Live Sessions Today ",
    date: "Feb 2024",
  };

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

  return (
    <Fragment>
      <div style={{ backgroundColor: THEME.background }}>
        <FixedBackButton customPath="/main-page"></FixedBackButton>
        <div className="iq-main-slider site-video">
          <Container fluid>
            <Row>
              <Col lg="12">
                <div className="pt-0">
                  <div
                    style={{
                      position: "relative",
                      marginTop: 24,
                      marginBottom: "50px",
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  >
                    <ZoomMeeting
                      isAuthenticated={isAuthenticated}
                      user={user}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Rest of your component remains the same */}
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

                      {/* Clinical Reviews Tab */}
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
                          {/* Updated ReviewComponent usage */}
                          <ReviewComponent
                            itemId={sessionId}
                            isAuthenticated={isAuthenticated}
                            currentUserId={
                              user?._id || user?.id || user?.userId
                            } // Pass user ID to ReviewComponent
                            itemTitle={title}
                            itemType={contentType} // Pass content type to ReviewComponent
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
        <div className="cast-tabs pb-5 px-4 px-md-0">
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
                                        src={
                                          member.image
                                            ? `https://primerad-backend.onrender.com${member.image}`
                                            : "/assets/images/faculty1.jpg"
                                        }
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
      </div>
    </Fragment>
  );
});

LivePage.displayName = "LivePage";
export default LivePage;
