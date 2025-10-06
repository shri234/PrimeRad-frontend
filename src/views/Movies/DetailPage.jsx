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
  const sessionsPerPage = 10;

  useEnterExit();

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
   .custom-nav-btn, .custom-nav-btn * {
      cursor: pointer !important;
    }
    .nav-pills .nav-link { transition: all 0.3s ease; }
    .nav-pills .nav-link:not(.active) { background: transparent !important; color: ${THEME.primary} !important; }
    .nav-pills .nav-link.active { background: ${THEME.primary} !important; color: white !important; box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4); transform: translateY(-2px); }
    .nav-pills .nav-link:hover:not(.active) { background: rgba(25, 118, 210, 0.1) !important; transform: translateY(-1px); }
    .sessions-sidebar::-webkit-scrollbar { width: 6px; }
    .sessions-sidebar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
    .sessions-sidebar::-webkit-scrollbar-thumb { background: ${THEME.primary}; border-radius: 10px; }
    .sessions-sidebar::-webkit-scrollbar-thumb:hover { background: #1565c0; }
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

  useEffect(() => {
    if (!isAuthenticated || !vimeoVideoId || !videoContainerRef.current) return;

    let isMounted = true;
    setIsVideoLoading(true); // show loader immediately

    const PlayerLib = Player;
    const el = videoContainerRef.current;

    const buildPlayerOptions = (vid) => {
      const numericId = String(vid).match(/^\d+$/);
      if (numericId) {
        return { id: Number(vid), responsive: true };
      }
      return { url: vid, responsive: true };
    };

    const options = buildPlayerOptions(vimeoVideoId);

    vimeoPlayerInstance.current = new PlayerLib(el, options);

    vimeoPlayerInstance.current.setVolume(1).catch(() => {});

    // 👇 Hide loader when player is ready or video starts
    vimeoPlayerInstance.current.on("loaded", () => setIsVideoLoading(false));
    vimeoPlayerInstance.current.on("play", () => setIsVideoLoading(false));
    vimeoPlayerInstance.current.on("error", () => setIsVideoLoading(false));

    // restore saved progress from backend (if available)
    let progressInterval = null;
    const restoreProgress = async () => {
      try {
        const userId = user?._id || user?.id || localStorage.getItem("userId");
        if (!userId || !sessionId) return;
        const resp = await axios.get(
          `https://primerad-backend.onrender.com/api/playback-progress/get?userId=${userId}&sessionId=${sessionId}&sessionModelType=${sessionModelType}`
        );
        const saved = resp?.data?.data;
        if (
          saved &&
          typeof saved.currentTime === "number" &&
          saved.currentTime > 0
        ) {
          // setTime after loaded event
          vimeoPlayerInstance.current.on("loaded", async () => {
            try {
              // only seek if still mounted
              if (!isMounted) return;
              await vimeoPlayerInstance.current.setCurrentTime(
                saved.currentTime
              );
            } catch (err) {
              console.warn("Failed to set saved currentTime:", err);
            }
          });
        }
      } catch (err) {
        console.warn("No saved progress or error fetching it:", err);
      }
    };

    // timeupdate handler (throttled / periodic)
    const startSavingProgress = () => {
      // Save every 8-12 seconds or so
      progressInterval = setInterval(async () => {
        try {
          const time = await vimeoPlayerInstance.current.getCurrentTime();
          // call your save function (already defined in component)
          savePlaybackProgress(Math.floor(time));
        } catch (err) {
          console.error("Error reading time from vimeo player:", err);
        }
      }, 10000); // every 10s
    };

    // on playset ready
    vimeoPlayerInstance.current
      .ready()
      .then(() => {
        if (!isMounted) return;
        setPlayerReady(true);
        restoreProgress();
        startSavingProgress();

        // also listen to pause/ended to save one last time
        vimeoPlayerInstance.current.on("pause", async () => {
          try {
            const time = await vimeoPlayerInstance.current.getCurrentTime();
            await savePlaybackProgress(Math.floor(time));
          } catch (e) {}
        });

        vimeoPlayerInstance.current.on("ended", async () => {
          try {
            await savePlaybackProgress(0); // optionally reset on finish
          } catch (e) {}
        });
      })
      .catch((err) => {
        console.error("Vimeo player ready() error:", err);
      });

    // cleanup
    return () => {
      isMounted = false;
      if (progressInterval) clearInterval(progressInterval);
      if (vimeoPlayerInstance.current) {
        try {
          vimeoPlayerInstance.current.unload &&
            vimeoPlayerInstance.current.unload();
          vimeoPlayerInstance.current.off && vimeoPlayerInstance.current.off();
          vimeoPlayerInstance.current.destroy &&
            vimeoPlayerInstance.current.destroy();
        } catch (e) {
          /* swallow */
        }
        vimeoPlayerInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, vimeoVideoId, sessionId, user, sessionModelType]);

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

        <Container fluid className="py-4">
          <Row className="g-4">
            <Col lg={8} md={12}>
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                  <div className="flex-grow-1" style={{ minWidth: "200px" }}>
                    <h4
                      className="fw-bold mb-2"
                      style={{
                        color: THEME.darkText,
                        fontSize: "1.4rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {t(title)}
                    </h4>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      <span
                        className="badge"
                        style={{
                          background: "#e3f2fd",
                          color: THEME.primary,
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        {t(module)}
                      </span>
                      <span
                        className="badge"
                        style={{
                          background: "#fff3e0",
                          color: "#f57c00",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        {duration}
                      </span>
                      <span
                        className="badge"
                        style={{
                          background: "#f3e5f5",
                          color: "#9c27b0",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        {formatDate(startDate)}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex gap-3" style={{ flexShrink: 0 }}>
                    {/* Previous Button */}
                    <Button
                      className="custom-nav-btn"
                      variant="light"
                      onClick={() => {
                        if (!relatedSessions.length) return;
                        const currentIndex = relatedSessions.findIndex(
                          (s) => s._id === sessionId
                        );
                        const prevIndex =
                          currentIndex <= 0
                            ? relatedSessions.length - 1 // loop to last
                            : currentIndex - 1;
                        handleSessionClick(relatedSessions[prevIndex]);
                      }}
                      style={{
                        borderRadius: "10px",
                        padding: "8px 16px",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        border: `2px solid ${THEME.primary}`,
                        color: THEME.primary,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = THEME.softBlue)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                    >
                      ← {t("Previous")}
                    </Button>

                    {/* Next Button */}
                    <Button
                      className="custom-nav-btn"
                      variant="primary"
                      onClick={() => {
                        if (!relatedSessions.length) return;
                        const currentIndex = relatedSessions.findIndex(
                          (s) => s._id === sessionId
                        );
                        const nextIndex =
                          currentIndex >= relatedSessions.length - 1
                            ? 0 // loop to first
                            : currentIndex + 1;
                        handleSessionClick(relatedSessions[nextIndex]);
                      }}
                      style={{
                        borderRadius: "10px",
                        padding: "8px 16px",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        backgroundColor: THEME.primary,
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#125cae")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = THEME.primary)
                      }
                    >
                      {t("Next")} →
                    </Button>
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    backgroundColor: "#000",
                  }}
                >
                {vimeoVideoId ? (
  <div
    style={{
      position: "relative",
      width: "100%",
      aspectRatio: "16/9",
      minHeight: "400px",
    }}
  >
    {/* 🌀 Loader Overlay */}
    {isVideoLoading && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          borderRadius: "10px",
          transition: "opacity 0.3s ease",
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

    {/* 🎥 Vimeo Player Container */}
    <div
      ref={videoContainerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  </div>
) : (
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

              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
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
                        <h5 className="fw-bold mb-3">
                          {t("About this Session")}
                        </h5>
                        <p style={{ fontSize: "1rem", color: THEME.lightText }}>
                          {description}
                        </p>
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
            </Col>

            <Col lg={4} md={12}>
              <div
                className="sessions-sidebar"
                style={{
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  padding: "24px",
                  position: "sticky",
                  top: "20px",
                  maxHeight: "calc(100vh - 100px)",
                  overflowY: "auto",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5
                    className="fw-bold mb-0"
                    style={{ color: THEME.darkText }}
                  >
                    {t("Learning")}
                  </h5>
                  <span
                    className="badge"
                    style={{
                      background: THEME.primary,
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "8px",
                    }}
                  >
                    {totalSessions} {t("items")}
                  </span>
                </div>

                <div className="session-list">
                  {currentSessions.length > 0 ? (
                    currentSessions.map((session) => (
                      <div
                        key={session._id}
                        className="session-item d-flex align-items-center mb-3 p-3"
                        style={{
                          background:
                            session._id === sessionId ? "#e3f2fd" : "#f8f9fa",
                          borderRadius: "12px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          border:
                            session._id === sessionId
                              ? `2px solid ${THEME.primary}`
                              : "2px solid transparent",
                        }}
                        onClick={() => handleSessionClick(session)}
                        onMouseEnter={(e) => {
                          if (session._id !== sessionId)
                            e.currentTarget.style.background = "#e9ecef";
                        }}
                        onMouseLeave={(e) => {
                          if (session._id !== sessionId)
                            e.currentTarget.style.background = "#f8f9fa";
                        }}
                      >
                        <div className="me-3" style={{ minWidth: "24px" }}>
                          <span style={{ fontSize: "1.2rem" }}>
                            {getSessionIcon(session.sessionType)}
                          </span>
                        </div>
                        <div className="flex-grow-1">
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
        </Container>

        <Container fluid className="mb-5">
          <Row className="justify-content-center">
            <Col lg={8} md={12}>
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  padding: "24px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5
                    className="fw-bold mb-0"
                    style={{ color: THEME.darkText }}
                  >
                    {t("Meet Your Instructor")}
                  </h5>
                  <span
                    className="badge"
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                    }}
                  >
                    <FaGraduationCap className="me-1" />
                    {t("Expert Educator")}
                  </span>
                </div>
                {faculty.length > 0 && (
                  <div
                    className="d-flex align-items-center p-3"
                    style={{ background: "#f8f9fa", borderRadius: "12px" }}
                  >
                    <img
                      src={faculty[0].image}
                      alt={faculty[0].name}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "20px",
                        border: `4px solid ${THEME.primary}`,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6
                        className="fw-bold mb-1"
                        style={{ color: THEME.darkText, fontSize: "1.1rem" }}
                      >
                        {faculty[0].name}
                      </h6>
                      <p
                        className="mb-2 text-muted"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {faculty[0].specializations?.join(", ")}
                      </p>
                      <div className="d-flex flex-wrap align-items-center gap-3">
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: THEME.lightText,
                          }}
                        >
                          <span
                            style={{ color: "#ffb300", marginRight: "4px" }}
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
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>

        <LatestMovies title="Recent Items" />
      </div>
    </Fragment>
  );
});

MovieDetail.displayName = "MovieDetail";
export default MovieDetail;
