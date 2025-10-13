import React, {
  Fragment,
  memo,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import Player from "@vimeo/player";
import { Row, Col, Container, Nav, Tab, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../store/auth/selectors";
import ReviewComponent from "../../components/ReviewComponent";
import Sources from "../../components/Sources";
import LatestMovies from "../../components/sections/LatestMovies";
import { FixedBackButton } from "../../utilities/BackButton";
import { FaExclamationCircle, FaGraduationCap } from "react-icons/fa";
import { useEnterExit } from "../../utilities/usePage";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes, FaLock } from "react-icons/fa";
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
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  // useEnterExit();

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

  const tabStyles = `
  /* Make row a flex container so columns stretch */
.equal-height-row {
  display: flex;
  flex-wrap: wrap; /* important for stacking on mobile */
}

/* Make all direct columns flex children with equal height */
.equal-height-row > .col-xxl-8,
.equal-height-row > .col-xxl-4,
.equal-height-row > .col-xl-8,
.equal-height-row > .col-xl-4,
.equal-height-row > .col-lg-8,
.equal-height-row > .col-lg-4,
.equal-height-row > .col-md-12,
.equal-height-row > .col-sm-12 {
  display: flex;
  flex-direction: column;
}

/* Make inner containers fill column height */
.video-container,
.sessions-sidebar {
  flex: 1; /* grows to match sibling column height */
  display: flex;
  flex-direction: column;
}

   .custom-nav-btn, .custom-nav-btn * {
      cursor: pointer !important;
    }
      button {
  transition: all 0.25s ease;
}
button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.nav-btn {
  background: white;
  border: none;
  color: black;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 6px 12px;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background-color: #d0e4ff; /* soft blue hover */
}



/* ---------- Mobile Drawer ---------- */
@media (max-width: 991px) {
  .drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 998;
  }

  .drawer {
    position: fixed;
    top: 0;
    left: 0;
    width: 80%;
    max-width: 320px;
    height: 100vh;
    background: white;
    z-index: 999;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    box-shadow: 4px 0 16px rgba(0,0,0,0.15);
    overflow-y: auto;
  }

  .drawer.open {
    transform: translateX(0);
  }

  .video-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

/* ---------- Tabs + Video Mobile adjustments ---------- */
@media (max-width: 768px) {
  .video-card {
    margin-bottom: 16px;
  }

  .tabs-section {
    margin-top: 20px;
  }
}


    // .nav-pills .nav-link { transition: all 0.3s ease; }
    // .nav-pills .nav-link:not(.active) { background: transparent !important; color: ${THEME.primary} !important; }
    // .nav-pills .nav-link.active { background: ${THEME.primary} !important; color: white !important; box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4); transform: translateY(-2px); }
    // .nav-pills .nav-link:hover:not(.active) { background: rgba(25, 118, 210, 0.1) !important; transform: translateY(-1px); }
    // .sessions-sidebar::-webkit-scrollbar { width: 2px; }
    // .sessions-sidebar::-webkit-scrollbar-track {  }
    // .sessions-sidebar::-webkit-scrollbar-thumb { background: ${THEME.primary}; border-radius: 10px; }
    // .sessions-sidebar::-webkit-scrollbar-thumb:hover { background: #1565c0; }
  `;

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

  const isMobile = window.innerWidth < 480;
  const isTablet = window.innerWidth < 768;

  const aspectRatio = isMobile ? "1/1" : isTablet ? "4/3" : "16/9";
  const minHeight = isMobile ? "200px" : isTablet ? "250px" : "400px";
  useEffect(() => {
    // 🧠 Early return only if truly nothing to load
    if (!isAuthenticated || !vimeoVideoId || !videoContainerRef.current) return;

    // 🧹 Always destroy old player before making a new one
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
        ? { id: Number(vid), responsive: true }
        : { url: vid, responsive: true };
    };

    const options = buildPlayerOptions(vimeoVideoId);
    vimeoPlayerInstance.current = new PlayerLib(el, options);

    // ✅ Continue with your existing logic
    vimeoPlayerInstance.current.setVolume(1).catch(() => {});
    vimeoPlayerInstance.current.on("loaded", () => setIsVideoLoading(false));
    vimeoPlayerInstance.current.on("play", () => setIsVideoLoading(false));
    vimeoPlayerInstance.current.on("error", () => setIsVideoLoading(false));

    // ... (rest of your restoreProgress, saving progress logic, etc.)

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

    setIsVideoLoading(true); // show loader when switching video

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
        setIsVideoLoading(false); // hide loader when loaded
      })
      .catch((err) => {
        console.error("❌ Error switching Vimeo video:", err);
        setIsVideoLoading(false);
      });
  }, [vimeoVideoId]);

  return (
    <Fragment>
      <style>{tabStyles}</style>
      <div style={{ backgroundColor: THEME.background, minHeight: "100vh" }}>
        <FixedBackButton customPath="/main-page"></FixedBackButton>

        <Container fluid className="py-3">
          <Row className="g-2 align-items-stretch">
            <Col lg={8} md={12} className="d-flex">
              <div
                className="flex-grow-1 d-flex flex-column"
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  padding: "20px",
                  height: "100%",
                  // marginBottom: "16px",
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2"
                  style={{
                    rowGap: "10px",
                  }}
                >
                  <div
                    className="d-flex flex-wrap align-items-center gap-2"
                    style={{
                      flex: "1 1 auto",
                      minWidth: "250px",
                    }}
                  >
                    <h4
                      className="fw-bold mb-0"
                      style={{
                        color: THEME.darkText,
                        fontSize:
                          window.innerWidth < 560 ? "0.81rem" : "1.4rem",
                        lineHeight: 1.3,
                        flexShrink: 1,
                      }}
                    >
                      {t(title)}
                    </h4>

                    <span
                      className="badge"
                      style={{
                        background: "#e3f2fd",
                        color: THEME.primary,
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {t(module)}
                    </span>
                  </div>

                  {window.innerWidth > 560 && (
                    <div
                      className="d-flex gap-2"
                      style={{
                        flexShrink: 0,
                        // position: "relative",
                        // zIndex: 10,
                        // isolation: "isolate",
                      }}
                    >
                      <button
                        style={{
                          color: "black",
                          backgroundColor: "lightblue",
                          padding:
                            window.innerWidth < 568 ? "4x 6x" : "6px 10px",
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
                        {window.innerWidth < 620 ? null : "< Prev"}
                      </button>

                      <button
                        style={{
                          color: "black",
                          backgroundColor: "lightblue",
                          padding:
                            window.innerWidth < 568 ? "4x 6x" : "6px 10px",
                          borderRadius: "10px",
                          border: "none",
                          fontWeight: 600,
                          position: "relative",
                          zIndex: 1000,
                          display: "inline-block",
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
                        {window.innerWidth < 620 ? null : "Next >"}
                      </button>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    backgroundColor: "#000",
                  }}
                >
                  {!isAuthenticated ? (
                    // 🧱 Show Login Prompt for Non-Logged-In Users
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16/9",
                        minHeight,
                        backgroundColor: "#000",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        color: "white",
                      }}
                    >
                      <FaLock
                        size={48}
                        style={{ marginBottom: "16px", color: "#f44336" }}
                      />
                      <h5 style={{ marginBottom: "12px", color: "white" }}>
                        Please log in to watch this video
                      </h5>
                      <button
                        style={{
                          backgroundColor: THEME.primary,
                          color: "white",
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                        }}
                        onClick={() => navigate("/login")}
                      >
                        Login to Watch
                      </button>
                    </div>
                  ) : isLocked ? (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16/9",
                        minHeight,
                        backgroundColor: "#000",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        color: "white",
                      }}
                    >
                      <FaLock
                        size={48}
                        style={{ marginBottom: "16px", color: "#f44336" }}
                      />
                      <h5 style={{ marginBottom: "12px", color: "white" }}>
                        This session is locked
                      </h5>
                      <button
                        style={{
                          backgroundColor: THEME.primary,
                          color: "white",
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                        }}
                        onClick={() => navigate("/pricing")}
                      >
                        Subscribe to Unlock
                      </button>
                    </div>
                  ) : vimeoVideoId ? (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16/9",
                        minHeight,
                        pointerEvents: isVideoLoading ? "none" : "auto",
                      }}
                    >
                      {isVideoLoading && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                            borderRadius: "8px",
                            transition: "opacity 0.1s ease",
                          }}
                        >
                          <div
                            className="spinner-border"
                            role="status"
                            style={{
                              width: "3rem",
                              height: "3rem",
                              color: THEME.primary,
                            }}
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )}
                      <div
                        ref={videoContainerRef}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  ) : (
                    // ❗ Fallback
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        minHeight: "400px",
                        background: "#333",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        padding: "20px",
                      }}
                    >
                      <FaExclamationCircle
                        size={40}
                        style={{ marginBottom: "10px" }}
                      />
                      <p>{t("Video not available.")}</p>
                    </div>
                  )}
                </div>
              </div>
            </Col>

            <Col
              lg={4}
              md={12}
              className="d-flex"
              // style={{ gap: "16px" }}
            >
              <div
                className="flex-grow-1 d-flex flex-column sessions-sidebar"
                style={{
                  background: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  padding: "20px",
                  height: "100%",
                  // maxHeight: "100%",
                  // height: "580px",

                  // height: "90%",
                  overflowY: "auto",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5
                    className="fw-bold mb-0"
                    style={{ color: THEME.darkText }}
                  >
                    {t("Next Sessions")}
                  </h5>
                  {/* <span
                    className="badge"
                    style={{
                      background: THEME.primary,
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "8px",
                    }}
                  >
                    {totalSessions} {t("items")}
                  </span> */}
                </div>

                <div className="session-list">
                  {currentSessions.length > 0 ? (
                    currentSessions.map((session) => (
                      <div
                        key={session._id}
                        className="session-item d-flex align-items-center mb-2 p-3"
                        style={{
                          // background:
                          //   session._id === sessionId
                          //     ? "rgba(25, 118, 210, 0.08)"
                          //     : "#fafafa",
                          borderRadius: "10px",
                          cursor: "pointer",
                          // transition: "all 0.25s ease",
                          border:
                            session._id === sessionId
                              ? `1.5px solid ${THEME.primary}`
                              : "1.5px solid transparent",
                        }}
                        onClick={() => handleSessionClick(session)}
                      >
                        <div className="me-3" style={{ minWidth: "10px" }}>
                          <img
                            src="/assets/images/play.png"
                            style={{
                              height: "18px",
                            }}
                          ></img>
                        </div>
                        <div className="flex-grow-1 flex-wrap text-xs">
                          <div
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: session._id === sessionId ? 600 : 500,
                              color: THEME.darkText,
                              marginBottom: "4px",
                            }}
                          >
                            {session.title}
                          </div>
                          <div className="d-flex flex-wrap gap-2 align-items-center">
                            <span
                              className="badge"
                              style={{
                                background: "#e3f2fd",
                                color: THEME.primary,
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                              }}
                            >
                              {getSessionTypeLabel(session.sessionType)}
                            </span>
                            {session.sessionDuration && (
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  color: THEME.lightText,
                                }}
                              >
                                {session.sessionDuration}
                              </span>
                            )}
                            {session.isFree && (
                              <span
                                className="badge"
                                style={{
                                  background: "#e8f5e9",
                                  color: "#2e7d32",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                }}
                              >
                                Free
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className="text-center py-4"
                      style={{
                        background: "#f8f9fa",
                        borderRadius: "12px",
                        color: THEME.lightText,
                      }}
                    >
                      {t("Loading sessions...")}
                    </div>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      style={{
                        borderRadius: "8px",
                        padding: "6px 12px",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        border: `2px solid ${THEME.primary}`,
                        color: THEME.primary,
                      }}
                    >
                      ←
                    </Button>

                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            variant={
                              currentPage === pageNum
                                ? "primary"
                                : "outline-primary"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            style={{
                              borderRadius: "8px",
                              padding: "6px 12px",
                              fontWeight: 600,
                              fontSize: "0.85rem",
                              minWidth: "36px",
                              backgroundColor:
                                currentPage === pageNum
                                  ? THEME.primary
                                  : "transparent",
                              border: `2px solid ${THEME.primary}`,
                              color:
                                currentPage === pageNum
                                  ? "white"
                                  : THEME.primary,
                            }}
                          >
                            {pageNum}
                          </Button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return (
                          <span
                            key={pageNum}
                            style={{ color: THEME.lightText }}
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      style={{
                        borderRadius: "8px",
                        padding: "6px 12px",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        border: `2px solid ${THEME.primary}`,
                        color: THEME.primary,
                      }}
                    >
                      →
                    </Button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <div
            style={{
              background: "white",
              borderRadius: "8px",
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
                      color: "black",
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
                      color: "black",
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
                      color: "black",
                      padding: "10px 20px",
                    }}
                  >
                    {t("Reviews")}
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <div style={{ color: THEME.text, lineHeight: 1.8 }}>
                    <h5 className="fw-bold mb-3">{t("About this Session")}</h5>
                    <p style={{ fontSize: "1rem", color: THEME.lightText }}>
                      {description}
                    </p>
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
                        <h5
                          className="fw-bold mb-0"
                          style={{ color: THEME.darkText }}
                        >
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
                              border: `3px solid ${THEME.primary}`,
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
                                color: THEME.darkText,
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
                                color: THEME.lightText,
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
                                  color: THEME.darkText,
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
});

MovieDetail.displayName = "MovieDetail";
export default MovieDetail;
