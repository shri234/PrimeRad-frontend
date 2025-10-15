import React, {
  Fragment,
  memo,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import Player from "@vimeo/player";
import { Row, Col, Container, Nav, Tab, Button, Collapse } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../store/auth/selectors";
import ReviewComponent from "../../components/ReviewComponent";
import Sources from "../../components/Sources";
import LatestMovies from "../../components/sections/LatestMovies";
import { FixedBackButton } from "../../utilities/BackButton";
import { FaExclamationCircle, FaGraduationCap, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useEnterExit } from "../../utilities/usePage";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes, FaLock } from "react-icons/fa";
import axios from "axios";
import "./css/movieDetails.css"; // Import the CSS file
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MobileBreadcrumb from "@components/breadcrumb/MobileBreadcrumb"


const MovieDetail = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileAccordionOpen, setIsMobileAccordionOpen] = useState(true);

  const {
    id: sessionId,
    vimeoVideoId = null,
    title = "Untitled Lecture",
    description = "No description available.",
    module = "General",
    submodule = "General",
    duration = "N/A",
    isFree = false,
    startDate = null,
    contentType,
  } = location.state || {};

  const [initialPlaybackTime, setInitialPlaybackTime] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const progressSaveIntervalRef = useRef(null);
  const videoContainerRef = useRef(null);
  const vimeoPlayerInstance = useRef(null);

  const [faculty] = useState([
    {
      _id: "fac1",
      name: "Dr. Alok Sharma",
      image: "/assets/images/faculty1.jpg",
      specializations: ["Diagnostic Radiology", "MRI Interpretation"],
      description: "Experienced educator with expertise in medical sciences.",
      rating: 4.9,
      yearsExp: 15,
    },
  ]);

  const [relatedSessions, setRelatedSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const sessionsPerPage = 12;

  const getSessionModelType = useCallback((type) => {
    if (type && type.toLowerCase() === "case") return "DicomCase";
    if (type && type.toLowerCase() === "lecture") return "RecordedLecture";
    if (type && type.toLowerCase() === "live") return "LiveProgram";
    return null;
  }, []);

  const sessionModelType = getSessionModelType(contentType);

  useEffect(() => {
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

  const getSessionIcon = (sessionType) => {
    if (!sessionType) return "📄";
    const type = sessionType.toLowerCase();
    if (type === "vimeo" || type === "lecture") return "▶️";
    if (type === "dicom" || type === "case") return "🔬";
    if (type === "live") return "🔴";
    return "📄";
  };

  const getSessionTypeLabel = (sessionType) => {
    if (!sessionType) return "Content";
    const type = sessionType.toLowerCase();
    if (type === "vimeo" || type === "lecture") return "video";
    if (type === "dicom" || type === "case") return "case";
    if (type === "live") return "live";
    return "content";
  };

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

  const savePlaybackProgress = useCallback(
    async (currentTime) => {
      const userId = user?._id || user?.id || localStorage.getItem("userId");
      if (!userId || !sessionId || !sessionModelType) return;

      try {
        await axios.post(
          "https://primerad-backend.onrender.com/api/playback-progress/save",
          { userId, sessionId, currentTime, sessionModelType }
        );
      } catch (error) {
        console.error("Error saving playback progress:", error);
      }
    },
    [user, sessionId, sessionModelType]
  );

  useEffect(() => {
    if (isFree) {
      setIsLocked(false);
    } else {
      setIsLocked(true);
    }
    setIsVideoLoading(true);
  }, [isFree, vimeoVideoId, sessionId]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  }, []);

  const isMobile = window.innerWidth < 992;
  const isTablet = window.innerWidth < 768;

  useEffect(() => {
    if (!isAuthenticated || !vimeoVideoId || !videoContainerRef.current) return;

    if (vimeoPlayerInstance.current) {
      try {
        vimeoPlayerInstance.current.destroy();
      } catch (e) {}
      vimeoPlayerInstance.current = null;
    }

    let isMounted = true;
    setIsVideoLoading(true);

    const PlayerLib = Player;
    const el = videoContainerRef.current;

    const buildPlayerOptions = (vid) => {
      const numericId = String(vid).match(/^\d+$/);
      return numericId
        ? { 
            id: Number(vid), 
            responsive: true,
            controls: true,
            pip: true,
            playsinline: true
          }
        : { 
            url: vid, 
            responsive: true,
            controls: true,
            pip: true,
            playsinline: true
          };
    };

    const options = buildPlayerOptions(vimeoVideoId);
    vimeoPlayerInstance.current = new PlayerLib(el, options);

    vimeoPlayerInstance.current.setVolume(1).catch(() => {});
    vimeoPlayerInstance.current.on("loaded", () => setIsVideoLoading(false));
    vimeoPlayerInstance.current.on("play", () => setIsVideoLoading(false));
    vimeoPlayerInstance.current.on("error", () => setIsVideoLoading(false));

    return () => {
      isMounted = false;
      if (vimeoPlayerInstance.current) {
        try {
          vimeoPlayerInstance.current.destroy();
        } catch (e) {}
        vimeoPlayerInstance.current = null;
      }
    };
  }, [
    isAuthenticated,
    vimeoVideoId,
    sessionId,
    user,
    sessionModelType,
    isLocked,
  ]);

  useEffect(() => {
    if (!vimeoPlayerInstance.current || !vimeoVideoId) return;

    setIsVideoLoading(true);

    const extractVimeoId = (urlOrId) => {
      if (!urlOrId) return null;
      const match = urlOrId.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : urlOrId;
    };

    const newId = extractVimeoId(vimeoVideoId);

    vimeoPlayerInstance.current
      .loadVideo(newId)
      .then(() => {
        console.log("✅ Vimeo video switched to:", newId);
        setIsVideoLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error switching Vimeo video:", err);
        setIsVideoLoading(false);
      });
  }, [vimeoVideoId]);

  return (
    <Fragment>
      <div className="movie-detail-page">
        <FixedBackButton customPath="/main-page" />

        <MobileBreadcrumb />
        <Container fluid className="py-3">
          {/* Video and Sessions Row - Equal Height on Desktop */}
          <Row className="equal-height-row g-3 mb-4">
            {/* Video Section */}
            <Col lg={8} md={12}>
              <div className="video-container">
                <div className="main-card video-card">
                  {/* Video Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2 video-header">
                    <div className="d-flex flex-wrap align-items-center gap-2" style={{ flex: "1 1 auto", minWidth: "250px" }}>
                      <h4 className="video-title mb-0">
                        {t(title)}
                      </h4>

                      <span className="module-badge">
                        {t(module)}
                      </span>
                    </div>

                    {/* Navigation Buttons - Desktop Only */}
                    {window.innerWidth > 560 && (
                      <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
                        <Button
                          className="nav-button"
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
                          {window.innerWidth < 620 ? "◀" : "◀ Prev"}
                        </Button>

                        <Button
                          className="nav-button"
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
                          {window.innerWidth < 620 ? "▶" : "Next ▶"}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Video Player */}
                  <div className="video-player-container">
                    {!isAuthenticated ? (
                      <div className="lock-screen">
                        <FaLock size={48} className="lock-icon" />
                        <h5 className="lock-title">
                          Please log in to watch this video
                        </h5>
                        <button
                          className="lock-button"
                          onClick={() => navigate("/login")}
                        >
                          Login to Watch
                        </button>
                      </div>
                    ) : isLocked ? (
                      <div className="lock-screen">
                        <FaLock size={48} className="lock-icon" />
                        <h5 className="lock-title">
                          This session is locked
                        </h5>
                        <button
                          className="lock-button"
                          onClick={() => navigate("/pricing")}
                        >
                          Subscribe to Unlock
                        </button>
                      </div>
                    ) : vimeoVideoId ? (
                      <div
                        style={{ pointerEvents: isVideoLoading ? "none" : "auto", height: "100%" }}
                        className="course-video-card"
                      >
                        {isVideoLoading && (
                          <div className="video-loading-overlay">
                            <div className="spinner-border loading-spinner" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        )}
                        <div ref={videoContainerRef} style={{ width: "100%", height: "100%" }} />
                      </div>
                    ) : (
                      <div className="video-error-state">
                        <FaExclamationCircle size={40} className="error-icon" />
                        <p>{t("Video not available.")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Col>

            {/* Sessions Sidebar - Desktop */}
            <Col lg={4} className="d-none d-lg-block">
              <div className="sessions-sidebar">
                <div className="main-card sessions-card">
                  <div className="d-flex justify-content-between align-items-center sessions-sidebar-header">
                    <h5 className="sessions-title">
                      {t("Next Sessions")}
                    </h5>
                    <span className="sessions-count-badge">
                      {totalSessions} {t("items")}
                    </span>
                  </div>

                  <div className="session-list">
                    {currentSessions.length > 0 ? (
                      currentSessions.map((session) => (
                        <div
                          key={session._id}
                          className={`session-item d-flex align-items-center ${session._id === sessionId ? 'active' : 'inactive'}`}
                          onClick={() => handleSessionClick(session)}
                        >
                          <div className="session-play-icon">
                            {/* <img src="/assets/images/play.png" alt="play" /> */}
                            <PlayCircleOutlineIcon sx={{ color: '#d5896f' }} />
                          </div>
                          <div className="session-content">
                            <div className={`session-title ${session._id === sessionId ? 'active' : 'inactive'}`}>
                              {session.title}
                            </div>
                            <div className="session-meta">
                              <span className="session-type-badge">
                                {getSessionTypeLabel(session.sessionType)}
                              </span>
                              {session.sessionDuration && (
                                <span className="session-duration">
                                  {session.sessionDuration}
                                </span>
                              )}
                              {session.isFree && (
                                <span className="session-free-badge">
                                  Free
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="sessions-loading">
                        {t("Loading sessions...")}
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination-container">
                      <Button
                        className="pagination-btn outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        ←
                      </Button>

                      {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={pageNum}
                              className={`pagination-btn ${currentPage === pageNum ? 'filled' : 'outline'}`}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                          return (
                            <span key={pageNum} className="pagination-ellipsis">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      <Button
                        className="pagination-btn outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        →
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          {/* Mobile Sessions Accordion */}
          <div className="d-lg-none sessions-mobile-accordion">
            <button
              className={`accordion-header ${isMobileAccordionOpen ? 'open' : 'closed'}`}
              onClick={() => setIsMobileAccordionOpen(!isMobileAccordionOpen)}
            >
              <span>{t("Next Sessions")} ({totalSessions})</span>
              {isMobileAccordionOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <Collapse in={isMobileAccordionOpen}>
              <div className="accordion-content">
                <div className="accordion-body">
                  {currentSessions.length > 0 ? (
                    currentSessions.map((session) => (
                      <div
                        key={session._id}
                        className={`session-item d-flex align-items-center ${session._id === sessionId ? 'active' : 'inactive'}`}
                        onClick={() => handleSessionClick(session)}
                      >
                        <div className="session-play-icon">
                        <PlayCircleOutlineIcon sx={{ color: '#d5896f' }} />
                        </div>
                        <div className="session-content">
                          <div className={`session-title ${session._id === sessionId ? 'active' : 'inactive'}`}>
                            {session.title}
                          </div>
                          <div className="session-meta">
                            <span className="session-type-badge">
                              {getSessionTypeLabel(session.sessionType)}
                            </span>
                            {session.sessionDuration && (
                              <span className="session-duration">
                                {session.sessionDuration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="sessions-loading">
                      {t("Loading sessions...")}
                    </div>
                  )}
                </div>
              </div>
            </Collapse>
          </div>

          {/* Tabs Section */}
          <div className="tab-content-container">
            <Tab.Container defaultActiveKey="overview">
              <Nav variant="pills" className="tab-pills-container">
                <Nav.Item>
                  <Nav.Link eventKey="overview">{t("Overview")}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="resources">{t("Resources")}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reviews">{t("Reviews")}</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <div className="overview-content">
                    <h5 className="overview-title">
                      {t("About this Session")}
                    </h5>
                    <p className="overview-description">
                      {description}
                    </p>
                    
                    {/* Faculty Section */}
                    <div className="faculty-section">
                      <h5 className="faculty-title">
                        {t("Meet Your Instructor")}
                      </h5>

                      {faculty.length > 0 && (
                        <div className="faculty-item">
                          <div className="faculty-avatar">
                            <img src={faculty[0].image} alt={faculty[0].name} />
                          </div>
                          <div className="faculty-info">
                            <h6 className="faculty-name">
                              {faculty[0].name}
                            </h6>
                            <p className="faculty-specialization">
                              {faculty[0].specializations?.join(", ")}
                            </p>
                            <div className="faculty-rating">
                              <span className="rating-star">⭐</span>
                              <strong className="rating-value">
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
});

MovieDetail.displayName = "MovieDetail";
export default MovieDetail;
