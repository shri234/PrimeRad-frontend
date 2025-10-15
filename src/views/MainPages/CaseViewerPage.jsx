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
import "./CaseViewerPage.css";

const CORS_PROXY = "https://corsproxy.io/?";
const DICOM_AUTH_URL = "http://localhost:5000/api/dicom-auth";
const DICOM_CLIENT_ID = "integration-vidocto-prime";
const DICOM_CLIENT_SECRET = "546969d3-c304-4156-aa32-a7d60a6c5bff";
const DICOM_USERNAME = "info@vidocto.com";
const DICOM_PASSWORD = "dic@vid123";
const DICOM_WORKSPACE_ID = 40426;

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
  }, [token]);

  const iframeRef = useRef(null);
  const [authSent, setAuthSent] = useState(false);
  console.log(token);
  console.log(studyId, "stu");

  const dicom_caseId = null;
  const workspaceId = 40426;
  const accessToken = token;
  const studyIds = studyId ? [studyId] : [];

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

    const handleLoad = () => sendAuthData();
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleLoad);
    }

    sendAuthData();

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleLoad);
      }
    };
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
    }, 200);
  };

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
    const refreshInterval = setInterval(async () => {}, 240000);
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setDisplayCaseCount(3);
      } else if (window.innerWidth <= 1024) {
        setDisplayCaseCount(4);
      } else {
        setDisplayCaseCount(5);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

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
  const [touched, setTouched] = useState(Array(questions.length).fill(false));

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

  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowErrors(true);

    const hasEmpty = answers.some((ans) => ans.trim() === "");
    if (hasEmpty) {
      return;
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
      id: 6,
      type: "Meniscus",
      category: "Knee",
      level: "Intermediate",
      status: "Locked",
      thumbnail: "/assets/images/continue-watch/04.jpg",
    },
    {
      id: 7,
      type: "Rotator Cuff",
      category: "Shoulder",
      level: "Advanced",
      status: "Free",
      thumbnail: "/assets/images/continue-watch/06.jpg",
    },
  ];

  const casesToDisplay = dicomCases.slice(0, displayCaseCount);

  const handleScrollToCases = () => {
    if (moreCasesRef.current) {
      moreCasesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Fragment>
      <div className="case-viewer-container">
        <FixedBackButton customPath="/main-page" />
        <Container fluid className="py-3 case-viewer-main-content">
          <div className="case-viewer-grid">
            <div className="case-viewer-left-column">
              <div className="case-viewer-video-card">
                <div className="case-viewer-header">
                  <h2 className="case-viewer-title">{title}</h2>

                  <div className="case-viewer-nav-buttons">
                    <Button
                      className="case-viewer-nav-btn"
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
                      className="case-viewer-nav-btn"
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

                <div className="case-viewer-video-container">
                  <div className="case-viewer-video-controls">
                    <button
                      title="Description"
                      onClick={() => handleTabChange("description")}
                      className="case-viewer-icon-btn"
                    >
                      <Info size={16} />
                    </button>

                    <button
                      title="Resources"
                      onClick={() => handleTabChange("resources")}
                      className="case-viewer-icon-btn"
                    >
                      <BookOpen size={16} />
                    </button>

                    <button
                      title="Reviews"
                      onClick={() => handleTabChange("reviews")}
                      className="case-viewer-icon-btn"
                    >
                      <Star size={16} />
                    </button>
                  </div>

                  <img
                    src="/assets/images/dicomm.jpg"
                    alt="DICOM preview"
                    className="case-viewer-dicom-img"
                  />
                </div>
              </div>
            </div>

            <Col lg={4} md={12} className="case-viewer-right-column">
              <div className="case-viewer-observations-card">
                <h2 className="case-viewer-observations-title">
                  User Observations
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="case-viewer-observations-form"
                >
                  {questions.map((question, index) => {
                    const isEmpty = answers[index].trim() === "";
                    const showError = showErrors && isEmpty;

                    return (
                      <div key={index} className="case-viewer-form-group">
                        <label>{question}</label>

                        <textarea
                          className={`form-control case-viewer-textarea ${
                            showError ? "error" : ""
                          }`}
                          rows={3}
                          placeholder="Type your answer here..."
                          value={answers[index]}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onBlur={() => handleBlur(index)}
                        />

                        {showError && (
                          <div className="case-viewer-error-text">
                            ⚠️ Please fill out this field.
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="case-viewer-submit-container">
                    <button
                      type="submit"
                      className="btn btn-primary case-viewer-submit-btn"
                    >
                      Save Observations
                    </button>
                  </div>
                </form>
              </div>
            </Col>
          </div>

          <div className="case-viewer-tabs-card">
            <Tab.Container defaultActiveKey="overview">
              <Nav variant="pills" className="case-viewer-nav-pills">
                <Nav.Item>
                  <Nav.Link
                    eventKey="overview"
                    className="case-viewer-nav-link"
                  >
                    {t("Overview")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="resources"
                    className="case-viewer-nav-link"
                  >
                    {t("Resources")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reviews" className="case-viewer-nav-link">
                    {t("Reviews")}
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <div className="case-viewer-overview-content">
                    <h5 className="case-viewer-section-title">
                      {t("About this Session")}
                    </h5>
                    <p className="case-viewer-description">{description}</p>

                    <div className="case-viewer-instructor-card">
                      <div className="case-viewer-instructor-header">
                        <h5>{t("Meet Your Instructor")}</h5>
                      </div>

                      {faculty.length > 0 && (
                        <div className="case-viewer-instructor-content">
                          <div className="case-viewer-instructor-avatar">
                            <img src={faculty[0].image} alt={faculty[0].name} />
                          </div>
                          <div className="case-viewer-instructor-info">
                            <h6 className="case-viewer-instructor-name">
                              {faculty[0].name}
                            </h6>
                            <p className="case-viewer-instructor-specialization">
                              {faculty[0].specializations?.join(", ")}
                            </p>
                            <div className="case-viewer-instructor-rating">
                              <span className="star">⭐</span>
                              <strong>{faculty[0].rating}</strong> {t("Rating")}
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
