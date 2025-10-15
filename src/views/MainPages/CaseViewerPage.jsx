import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  Fragment,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import LatestMovies from "../../components/sections/LatestMovies";
import { Row, Col, Container, Nav, Tab, Form, Button } from "react-bootstrap";
import { useEnterExit } from "../../utilities/usePage";
import { useTranslation } from "react-i18next";
import Sources from "../../components/Sources";
import ReviewComponent from "../../components/ReviewComponent";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
SwiperCore.use([Navigation, Pagination]);
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaGraduationCap, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

import { selectIsAuthenticated, selectUser } from "../../store/auth/selectors";
import { FixedBackButton } from "../../utilities/BackButton";
import { Info, BookOpen, Star } from "lucide-react";

const CORS_PROXY = "https://corsproxy.io/?";
const DICOM_AUTH_URL = "http://localhost:5000/api/dicom-auth";
const DICOM_CLIENT_ID = "integration-vidocto-prime";
const DICOM_CLIENT_SECRET = "546969d3-c304-4156-aa32-a7d60a6c5bff";
const DICOM_USERNAME = "info@vidocto.com";
const DICOM_PASSWORD = "dic@vid123";
const DICOM_WORKSPACE_ID = 40426;

// // THEME COLORS
// const THEME = {
//   primary: "#1976d2", // blue
//   secondary: "#00bfae", // teal
//   background: "#f4f8fb", // light blue/gray
//   card: "#fff",
//   accent: "#ffb300", // amber
//   text: "#263238", // dark blue-gray
//   border: "#e0e0e0",
// };

// const tabStyles = `
//    .custom-nav-btn, .custom-nav-btn * {
//       cursor: pointer !important;
//     }
//       button {
//   transition: all 0.25s ease;
// }
// button:hover {
//   transform: translateY(-1px);
//   box-shadow: 0 4px 12px rgba(0,0,0,0.08);
// }

//     // .nav-pills .nav-link { transition: all 0.3s ease; }
//     // .nav-pills .nav-link:not(.active) { background: transparent !important; color: ${THEME.primary} !important; }
//     // .nav-pills .nav-link.active { background: ${THEME.primary} !important; color: white !important; box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4); transform: translateY(-2px); }
//     // .nav-pills .nav-link:hover:not(.active) { background: rgba(25, 118, 210, 0.1) !important; transform: translateY(-1px); }
//     // .sessions-sidebar::-webkit-scrollbar { width: 2px; }
//     // .sessions-sidebar::-webkit-scrollbar-track {  }
//     // .sessions-sidebar::-webkit-scrollbar-thumb { background: ${THEME.primary}; border-radius: 10px; }
//     // .sessions-sidebar::-webkit-scrollbar-thumb:hover { background: #1565c0; }
//   `;
const medicaiOrigin = "https://app.medicai.io";

const CaseViewerPage = () => {
  const { caseId } = useParams();
  const { t } = useTranslation();
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem("dicom_refresh_token") || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyId, setStudyId] = useState(null);
  const [title, setTitle] = useState("Knee MRI Case");
  const [duration, setDuration] = useState("30 mins");
  const [description, setDescription] = useState("");
  const [module, setModule] = useState("Orthopedics");
  const [relatedSessions, setRelatedSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [saved, setSaved] = useState(false);

  const sessionsPerPage = 12;

  useEnterExit();
  const [submodule, setSubmodule] = useState("Knee Pathology");
  const dicomName = "Anonymized00098";
  const [showVideo, setShowVideo] = useState(false);
  const videoUrl = "https://player.vimeo.com/video/1102457741";
  const [startDate, setStartDate] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  // const [faculty, setFaculty] = useState(null);
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
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = relatedSessions.slice(
    indexOfFirstSession,
    indexOfLastSession
  );
  const totalPages = Math.ceil(totalSessions / sessionsPerPage);
  // setSessionId(session._id)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    const currentId = sessionId || caseId;

    if (currentId && currentId !== sessionId) {
      setSessionId(currentId);
    }
    const fetchRelatedSessions = async () => {
      try {
        const res = await axios.get(
          "https://primerad-backend.onrender.com/api/sessions/getRecentItems"
        );
        if (res.data?.data) {
          setRelatedSessions(res.data.data);
          setTotalSessions(res.data.data.length);
        }
      } catch (error) {
        console.error("Error fetching related sessions:", error);
      }
    };
    fetchRelatedSessions();
  }, []);

  useEffect(() => {
    setStartDate("2025-07-15T10:00:00Z");
  }, []);
  const saveTokens = (access, refresh) => {
    setToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("dicom_access_token", access);
    if (refresh) localStorage.setItem("dicom_refresh_token", refresh);
  };

  const [observations, setObservations] = useState({
    medialMeniscus: "",
    medialCartilage: "",
    lateralMeniscus: "",
    lateralCartilage: "",
  });
  const [observationsSubmitted, setObservationsSubmitted] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const isMobile = window.innerWidth < 480;
  const isTablet = window.innerWidth < 768;

  const aspectRatio = isMobile ? "1/1" : isTablet ? "4/3" : "16/9";
  const minHeight = isMobile ? "200px" : isTablet ? "250px" : "400px";
  const switchToTab = (tabKey) => setActiveTab(tabKey);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const [displayCaseCount, setDisplayCaseCount] = useState(5);

  const handleObservationChange = (field, value) => {
    setObservations((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const handleSubmitObservations = (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmission = () => {
    // Save observations to localStorage or send to backend
    localStorage.setItem(
      `case_${caseId}_observations`,
      JSON.stringify(observations)
    );
    setObservationsSubmitted(true);
    setShowConfirmationModal(false);
  };

  const handleCancelSubmission = () => {
    setShowConfirmationModal(false);
  };

  const handleCompareObservations = () => {
    setShowComparisonModal(true);
  };

  const handleCloseComparisonModal = () => {
    setShowComparisonModal(false);
  };

  // Function to fetch Study ID
  async function getStudyId(accessToken, dicomName) {
    const url =
      "https://app.medicai.io/api/resources/my-drive?discriminator=STUDY&searchInTrash=false&size=500&page=0&sort=uploadedDate%2Cdesc";
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status}\nResponse: ${errorText}`);
    }

    console.log(response);
    const data = await response.json();
    if (!data.content || !Array.isArray(data.content)) {
      throw new Error("Invalid Response Structure: " + JSON.stringify(data));
    }
    const match = data.content.find(
      (item) => item.patient && item.patient.name === dicomName
    );
    return match ? match.id : null;
  }

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (refreshToken) {
          const params = new URLSearchParams();
          params.append("grant_type", "refresh_token");
          params.append("refresh_token", refreshToken);
          params.append("client_id", DICOM_CLIENT_ID);
          params.append("client_secret", DICOM_CLIENT_SECRET);
          const response = await fetch(DICOM_AUTH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
          });
          data = await response.json();
          if (data.access_token) {
            saveTokens(data.access_token, data.refresh_token);
            setLoading(false);
            return;
          }
        }
        // Fallback to password grant
        const params = new URLSearchParams();
        params.append("grant_type", "password");
        params.append("client_id", DICOM_CLIENT_ID);
        params.append("client_secret", DICOM_CLIENT_SECRET);
        params.append("username", DICOM_USERNAME);
        params.append("password", DICOM_PASSWORD);
        params.append("scope", "orthanc:studies:dicom-web offline_access");
        const response = await fetch(DICOM_AUTH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
        data = await response.json();
        if (data.access_token) {
          saveTokens(data.access_token, data.refresh_token);
        } else {
          throw new Error(data.error_description || "Failed to fetch token");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  const handleSessionClick = (session) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const sessionType = session.sessionType?.toLowerCase();

    if (sessionType === "dicom" || sessionType === "case") {
      navigate(`/case/${session._id}`);
    } else if (sessionType === "vimeo" || sessionType === "lecture") {
      navigate("/lecture-detail", {
        state: {
          id: session._id,
          vimeoVideoId: session.vimeoVideoId,
          title: session.title,
          description: session.description,
          faculty: session.faculty,
          isFree: session.isFree,
          module: session.moduleName,
          submodule: session.submodule,
          duration: session.sessionDuration,
          startDate: session.startDate,
          contentType: sessionType === "vimeo" ? "Lecture" : "Case",
        },
      });
    } else if (sessionType === "live") {
      navigate("/live", { state: session });
    }
  };

  useEffect(() => {
    if (token) {
      getStudyId(token, dicomName)
        .then((id) => setStudyId(id))
        .catch((err) => setError(err.message));
    }
    console.log(studyId);
    // eslint-disable-next-line
  }, [token]);

  const iframeRef = useRef(null); // Reference to the DICOM viewer iframe for sending authentication data
  const [authSent, setAuthSent] = useState(false);
  console.log(token);
  console.log(studyId, "stu");
  // Example: get these from your logic or props
  const dicom_caseId = null; // or a real caseId if you have one
  const workspaceId = 40426; // your workspaceId
  const accessToken = token; // from your auth logic
  const studyIds = studyId ? [studyId] : [];

  // Build authData
  const authData = dicom_caseId
    ? {
        type: "send-gallery-auth-data",
        workspaceId,
        caseId: dicom_caseId,
        accessToken,
      }
    : {
        type: "send-auth-data",
        workspaceId,
        studyIds,
        accessToken,
      };

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;

    function sendAuthData() {
      if (iframeRef.current && iframeRef.current.contentWindow && !authSent) {
        iframeRef.current.contentWindow.postMessage(authData, medicaiOrigin);
        setAuthSent(true);
        console.log("✅ Auth data sent:", authData);
      } else if (!authSent && retryCount < maxRetries) {
        console.warn(
          `⚠ Iframe not ready, retrying... (${retryCount + 1}/${maxRetries})`
        );
        retryCount++;
        setTimeout(sendAuthData, 2000);
      } else if (retryCount >= maxRetries) {
        console.error("❌ Max retries reached! Check iframe status.");
      }
    }

    // Send on iframe load
    const handleLoad = () => sendAuthData();
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleLoad);
    }

    // Try sending on mount and when authData changes
    sendAuthData();

    // Cleanup
    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleLoad);
      }
    };
    // eslint-disable-next-line
  }, [accessToken, studyId]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setTimeout(() => {
      const target = document.getElementById(`${key}Tab`);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 200); // wait 200ms for tab to render
  };
  // Periodically resend authData if not sent
  useEffect(() => {
    if (authSent) return;
    const interval = setInterval(() => {
      if (accessToken && !authSent) {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(authData, medicaiOrigin);
          setAuthSent(true);
          console.log("✅ Sending Auth data!");
        }
      } else {
        console.warn("⚠ Unable to send Auth data! Retrying...");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [accessToken, studyId, dicom_caseId, authSent]);

  useEffect(() => {
    // This interval seems to be empty, so it won't do anything.
    // If it's intended to refresh tokens, the logic should be inside.
    const refreshInterval = setInterval(async () => {
      // Logic to refresh token here if needed
    }, 240000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!accessToken && iframeRef.current) {
        console.warn("⚠ Auth data missing, reloading iframe...");
        iframeRef.current.src = iframeRef.current.src;
      } else {
        console.log("✅ Token exists, no need to reload.");
      }
    }, 30000);
    return () => clearTimeout(timeout);
  }, [accessToken]);

  // Adjust number of displayed cases based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setDisplayCaseCount(3); // Show fewer on small screens
      } else if (window.innerWidth <= 1024) {
        setDisplayCaseCount(4); // Medium screens
      } else {
        setDisplayCaseCount(5); // Large screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call on mount to set initial count

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const questions = [
    "What abnormalities do you notice?",
    "Describe the region of interest.",
    "Any additional notes or comments?",
    "Any suggestions for diagnosis?",
    "Any additional notes or comments?",
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [touched, setTouched] = useState(Array(questions.length).fill(false)); // tracks which were interacted with
  // const [showErrors, setShowErrors] = useState(false);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleBlur = (index) => {
    const updated = [...touched];
    updated[index] = true;
    setTouched(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowErrors(true);

    const hasEmpty = answers.some((ans) => ans.trim() === "");
    if (hasEmpty) {
      return; // prevent submission
    }

    alert("✅ All observations saved successfully!");
    console.log("Saved Observations:", answers);
  };

  const viewerUrl = token
    ? `https://viewer.medicai.io/?token=${token}&caseId=${caseId}&workspaceId=${DICOM_WORKSPACE_ID}`
    : "";

  const navigate = useNavigate();
  const moreCasesRef = React.useRef(null);

  const dicomCases = [
    {
      id: 1,
      type: "ACL",
      category: "Knee",
      level: "Beginner",
      status: "Free",
      thumbnail: "/assets/images/continue-watch/01.jpg",
    },
    {
      id: 2,
      type: "ACL",
      category: "Knee",
      level: "Beginner",
      status: "Free",
      thumbnail: "/assets/images/continue-watch/02.jpg",
    },
    {
      id: 3,
      type: "Disc",
      category: "Hip",
      level: "Beginner",
      status: "Locked",
      thumbnail: "/assets/images/continue-watch/03.jpg",
    },
    {
      id: 4,
      type: "Disc",
      category: "Hip",
      level: "Beginner",
      status: "Free",
      thumbnail: "/assets/images/continue-watch/05.jpg",
    },
    {
      id: 5,
      type: "ACL",
      category: "Knee",
      level: "Beginner",
      status: "Free",
      thumbnail: "/assets/images/continue-watch/07.jpg",
    },
    {
      id: 6, // Added for potential larger screens
      type: "Meniscus",
      category: "Knee",
      level: "Intermediate",
      status: "Locked",
      thumbnail: "/assets/images/continue-watch/04.jpg",
    },
    {
      id: 7, // Added for potential larger screens
      type: "Rotator Cuff",
      category: "Shoulder",
      level: "Advanced",
      status: "Free",
      thumbnail: "/assets/images/continue-watch/06.jpg",
    },
  ];

  const [showErrors, setShowErrors] = useState(false);

  const casesToDisplay = dicomCases.slice(0, displayCaseCount);

  const handleScrollToCases = () => {
    if (moreCasesRef.current) {
      moreCasesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const iconButtonStyle = {
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "50%",
    padding: "6px",
    cursor: "pointer",
    width: "30%",
    height: "20%",
    color: "navy",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "all 0.2s ease-in-out",
  };

  return (
    <Fragment>
      {/* <style>{tabStyles}</style> */}
      <div
        style={{
          // backgroundColor: THEME.background,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <FixedBackButton customPath="/main-page"></FixedBackButton>
        <Container
          fluid
          className="py-3"
          // style={{
          //   flex: 1,
          //   display: "flex",
          //   flexDirection: "column",
          // }}
        >
          <div
            className="g-2"
            style={{
              display: "flex",
              // flexDirection: "column",
              flex: 1,
              gap: "4px",
              alignItems: "stretch",
              flexWrap: "nowrap",
            }}
          >
            <div className="flex-grow-2 d-flex flex-column">
              <div
                style={{
                  background: "white",
                  boxShadow: "3px 4px 16px rgba(0,0,0,0.08)",
                  padding: "24px",
                  // marginTop: "20px",
                  borderRadius: "12px",
                  height: "100%",
                }}
              >
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <h2
                    style={{
                      // color: "navy",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {title}
                  </h2>

                  <div
                    className="d-flex gap-2"
                    style={{
                      flexShrink: 0,
                    }}
                  >
                    <Button
                      style={{
                        // color: "black",
                        // backgroundColor: "lightblue",
                        padding: window.innerWidth < 568 ? "4x 6x" : "6px 10px",
                        borderRadius: "10px",
                        border: "none",
                        cursor: "pointer",
                        position: "relative",
                        zIndex: 1000,
                        display: "inline-block",
                        fontWeight: 600,
                      }}
                      onClick={() => {
                        if (!relatedSessions.length) return;
                        const currentIndex = relatedSessions.findIndex(
                          (s) => s._id === sessionId
                        );
                        if (currentIndex === -1) return;
                        const prevIndex =
                          currentIndex <= 0
                            ? relatedSessions.length - 1
                            : currentIndex - 1;
                        handleSessionClick(relatedSessions[prevIndex]);
                      }}
                    >
                      {window.innerWidth < 620 ? "<" : "< Prev"}
                    </Button>

                    <Button
                      style={{
                        // color: "black",
                        // backgroundColor: "lightblue",
                        padding: window.innerWidth < 568 ? "4x 6x" : "6px 10px",
                        borderRadius: "10px",
                        border: "none",
                        cursor: "pointer",
                        position: "relative",
                        zIndex: 1000,
                        display: "inline-block",
                        fontWeight: 600,
                      }}
                      onClick={() => {
                        if (!relatedSessions.length) return;
                        const currentIndex = relatedSessions.findIndex(
                          (s) => s._id === sessionId
                        );
                        if (currentIndex === -1) return;
                        const nextIndex =
                          currentIndex >= relatedSessions.length - 1
                            ? 0
                            : currentIndex + 1;
                        handleSessionClick(relatedSessions[nextIndex]);
                      }}
                    >
                      {window.innerWidth < 620 ? ">" : "Next >"}
                    </Button>
                  </div>
                </div>

                <div
                  style={{
                    position: "relative",
                    // backgroundColor: "black",
                    marginTop: "5px",
                    // width: "100%",
                    // aspectRatio: "16/9",
                    borderRadius: "10px",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "550px",
                    maxHeight: "550px",
                    alignItems: "center",
                    flexGrow: 1,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      display: "flex",
                      gap: "10px",
                      zIndex: 3,
                    }}
                  >
                    <button
                      title="Description"
                      onClick={() => handleTabChange("description")}
                      style={iconButtonStyle}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f0f4ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      <Info size={16} />
                    </button>

                    <button
                      title="Resources"
                      onClick={() => handleTabChange("resources")}
                      style={iconButtonStyle}
                    >
                      <BookOpen size={16} />
                    </button>

                    <button
                      title="Reviews"
                      onClick={() => handleTabChange("reviews")}
                      style={iconButtonStyle}
                    >
                      <Star size={16} />
                    </button>
                  </div>

                  <img
                    src="/assets/images/dicomm.jpg"
                    alt="DICOM preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>

            <Col lg={4} md={12} className="d-flex flex-column">
              <div
                style={{
                  // backgroundColor: "white",
                  borderRadius: "10px",
                  // marginTop: "20px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  maxHeight: "calc(100vh - 190px)",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "16px",
                  }}
                >
                  User Observations
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="d-flex flex-column gap-3"
                  style={{ width: "100%" }}
                >
                  {questions.map((question, index) => {
                    const isEmpty = answers[index].trim() === "";
                    const showError = showErrors && isEmpty;

                    return (
                      <div key={index}>
                        <label
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            marginBottom: "6px",
                            display: "block",
                          }}
                        >
                          {question}
                        </label>

                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Type your answer here..."
                          value={answers[index]}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onBlur={() => handleBlur(index)}
                          style={{
                            fontSize: "14px",
                            borderRadius: "8px",
                            height: "100px",
                            resize: "none",
                            borderColor: showError ? "red" : "#ced4da",
                          }}
                        ></textarea>

                        {showError && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            ⚠️ Please fill out this field.
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="submit"
                      className="btn btn-primary mt-2"
                      style={{
                        // backgroundColor: "lightblue",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        width: "70%",
                        // color: "black",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      Save Observations
                    </button>
                  </div>
                </form>
              </div>
            </Col>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              marginTop: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              padding: "24px",
            }}
          >
            <Tab.Container defaultActiveKey="overview">
              <Nav variant="pills" className="mb-4" style={{ gap: "8px" }}>
                <Nav.Item>
                  <Nav.Link
                    eventKey="overview"
                    style={{
                      borderRadius: "10px",
                      fontWeight: 600,
                      // color: "black",
                      padding: "10px 20px",
                    }}
                  >
                    {t("Overview")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="resources"
                    style={{
                      borderRadius: "10px",
                      fontWeight: 600,
                      // color: "black",
                      padding: "10px 20px",
                    }}
                  >
                    {t("Resources")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="reviews"
                    style={{
                      borderRadius: "10px",
                      fontWeight: 600,
                      // color: "black",
                      padding: "10px 20px",
                    }}
                  >
                    {t("Reviews")}
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <div style={{ lineHeight: 1.8 }}>
                    <h5 className="fw-bold mb-3">{t("About this Session")}</h5>
                    <p style={{ fontSize: "1rem" }}>{description}</p>
                    <div
                      style={{
                        background: "white",
                        borderRadius: "8px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        padding: "20px",
                        position: "sticky",
                        // bottom: "20px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0" style={{}}>
                          {t("Meet Your Instructor")}
                        </h5>
                      </div>

                      {faculty.length > 0 && (
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              // border: `3px solid ${THEME.primary}`,
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={faculty[0].image}
                              alt={faculty[0].name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <h6
                              className="fw-bold mb-1"
                              style={{
                                // color: THEME.darkText,
                                fontSize: "1rem",
                              }}
                            >
                              {faculty[0].name}
                            </h6>
                            <p
                              className="mb-2 text-muted"
                              style={{ fontSize: "0.9rem" }}
                            >
                              {faculty[0].specializations?.join(", ")}
                            </p>
                            <div
                              style={{
                                fontSize: "0.85rem",
                                // color: THEME.lightText,
                              }}
                            >
                              <span
                                style={{
                                  color: "#ffb300",
                                  marginRight: "4px",
                                }}
                              >
                                ⭐
                              </span>
                              <strong
                                style={{
                                  // color: THEME.darkText,
                                  marginRight: "4px",
                                }}
                              >
                                {faculty[0].rating}
                              </strong>
                              {t("Rating")}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="resources">
                  <Sources />
                </Tab.Pane>
                <Tab.Pane eventKey="reviews">
                  <ReviewComponent
                    itemId={sessionId}
                    isAuthenticated={isAuthenticated}
                    currentUserId={user?._id || user?.id}
                    itemTitle={title}
                    itemType={contentType}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </Container>
        <LatestMovies title="Recent Items" />
      </div>
    </Fragment>
  );
};

export default CaseViewerPage;
