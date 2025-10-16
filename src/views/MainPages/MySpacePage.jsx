import { memo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFilter } from "../../context/FilterContext";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/auth/selectors";
import { Button } from "react-bootstrap";
import axios from "axios";
import {
  FaExclamationCircle,
  FaBars,
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaFilter,
  FaList,
  FaTh,
} from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
import NavCategories from "./NavCategories";
import ProgressBar from "./ProgressBar";
import { ChevronDown, ChevronUp } from "react-feather";
import { FaPlay } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "./MySpacePage.css";

const ModuleStatusCard = memo(({ module }) => {
  console.log(module);
  const isCompleted = module.progressPercentage === 100;

  if (module?.totalSessionsCount > 0) {
    return (
      <div
        className={`module-status-card ${
          isCompleted ? "completed" : "in-progress"
        }`}
      >
        <div className="module-status-card-title">{module.moduleName}</div>
        <div className="module-status-card-sessions">
          1 / {module.totalSessionsCount} Sessions
        </div>
        <div className="module-status-progress-wrapper">
          <div
            className={`module-status-progress-bar ${
              isCompleted ? "completed" : "in-progress"
            }`}
            style={{ width: `${Math.round(module.progressPercentage) || 50}%` }}
          />
        </div>
        <div className="module-status-progress-text">
          {Math.round(module.progressPercentage) || 50}% Complete
        </div>
      </div>
    );
  }
  return null;
});

// New ListView Component
const ListView = memo(
  ({ filteredCards, handleCardClick, formatTimeAgo, isMobile }) => {
    const [expandedModules, setExpandedModules] = useState(new Set());
    const [expandedPathologies, setExpandedPathologies] = useState(new Set());

    // Group sessions by module and pathology
    const groupedData = filteredCards.reduce((acc, card) => {
      const moduleName = card.category || "Uncategorized";
      const pathologyName = card.type || "General";

      if (!acc[moduleName]) {
        acc[moduleName] = {};
      }
      if (!acc[moduleName][pathologyName]) {
        acc[moduleName][pathologyName] = [];
      }
      acc[moduleName][pathologyName].push(card);
      return acc;
    }, {});

    const toggleModule = (moduleName) => {
      const newExpanded = new Set(expandedModules);
      if (newExpanded.has(moduleName)) {
        newExpanded.delete(moduleName);
      } else {
        newExpanded.add(moduleName);
      }
      setExpandedModules(newExpanded);
    };

    const togglePathology = (pathologyKey) => {
      const newExpanded = new Set(expandedPathologies);
      if (newExpanded.has(pathologyKey)) {
        newExpanded.delete(pathologyKey);
      } else {
        newExpanded.add(pathologyKey);
      }
      setExpandedPathologies(newExpanded);
    };

    const calculateModuleStats = (moduleData) => {
      const allSessions = Object.values(moduleData).flat();
      const totalSessions = allSessions.length;
      const completedSessions = allSessions.filter(
        (session) => session.progress >= 1
      ).length;
      const totalMinutes = allSessions.reduce((acc, session) => {
        const duration = parseInt(
          session.sessionDuration?.split(" ")[0] || "0"
        );
        return acc + duration;
      }, 0);
      const completedMinutes = allSessions.reduce((acc, session) => {
        const duration = parseInt(
          session.sessionDuration?.split(" ")[0] || "0"
        );
        return acc + duration * session.progress;
      }, 0);

      return {
        totalSessions,
        completedSessions,
        totalMinutes,
        completedMinutes: Math.round(completedMinutes),
        progressPercentage:
          totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
      };
    };

    const calculatePathologyStats = (sessions) => {
      const totalSessions = sessions.length;
      const completedSessions = sessions.filter(
        (session) => session.progress >= 1
      ).length;
      const totalMinutes = sessions.reduce((acc, session) => {
        const duration = parseInt(
          session.sessionDuration?.split(" ")[0] || "0"
        );
        return acc + duration;
      }, 0);
      const completedMinutes = sessions.reduce((acc, session) => {
        const duration = parseInt(
          session.sessionDuration?.split(" ")[0] || "0"
        );
        return acc + duration * session.progress;
      }, 0);

      return {
        totalSessions,
        completedSessions,
        totalMinutes,
        completedMinutes: Math.round(completedMinutes),
        progressPercentage:
          totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
      };
    };

    const formatDuration = (minutes) => {
      if (minutes < 60) return `${minutes}m`;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}m`
        : `${hours}h`;
    };

    if (Object.keys(groupedData).length === 0) {
      return (
        <div className="no-data-container">
          <div style={{ fontSize: 24, marginBottom: 16 }}>📋</div>
          <div style={{ marginBottom: 8 }}>No sessions found</div>
          <div style={{ fontSize: 14, color: "#999" }}>
            Try adjusting your filters or start watching some content
          </div>
        </div>
      );
    }

    return (
      <div className="list-view-container">
        {Object.entries(groupedData).map(([moduleName, moduleData]) => {
          const moduleStats = calculateModuleStats(moduleData);
          const isModuleExpanded = expandedModules.has(moduleName);

          return (
            <div key={moduleName} className="module-card">
              <div
                className="module-header"
                onClick={() => toggleModule(moduleName)}
              >
                <div>
                  <h3 className="module-title">{moduleName}</h3>
                </div>
                <div className="module-stats">
                  <span>
                    {moduleStats.completedSessions}/{moduleStats.totalSessions}{" "}
                    sessions
                  </span>
                  <span>
                    {formatDuration(moduleStats.completedMinutes)}/
                    {formatDuration(moduleStats.totalMinutes)}
                  </span>
                  <span>
                    {Math.round(moduleStats.progressPercentage)}% complete
                  </span>
                  <ChevronDown
                    size={20}
                    className={`chevron-icon ${
                      isModuleExpanded ? "expanded" : ""
                    }`}
                  />
                </div>
              </div>

              {isModuleExpanded && (
                <div className="pathology-section">
                  {Object.entries(moduleData).map(
                    ([pathologyName, sessions]) => {
                      const pathologyKey = `${moduleName}-${pathologyName}`;
                      const pathologyStats = calculatePathologyStats(sessions);
                      const isPathologyExpanded =
                        expandedPathologies.has(pathologyKey);

                      return (
                        <div key={pathologyKey} className="pathology-card">
                          <div
                            className="pathology-header"
                            onClick={() => togglePathology(pathologyKey)}
                          >
                            <div>
                              <h4 className="pathology-title">
                                {pathologyName}
                              </h4>
                            </div>
                            <div className="pathology-stats">
                              <span>
                                {pathologyStats.completedSessions}/
                                {pathologyStats.totalSessions} sessions
                              </span>
                              <span>
                                {formatDuration(
                                  pathologyStats.completedMinutes
                                )}
                                /{formatDuration(pathologyStats.totalMinutes)}
                              </span>
                              <ChevronDown
                                size={18}
                                className={`chevron-icon ${
                                  isPathologyExpanded ? "expanded" : ""
                                }`}
                              />
                            </div>
                          </div>

                          {isPathologyExpanded && (
                            <div className="session-list">
                              {sessions.map((session) => (
                                <div
                                  key={session.id}
                                  className="session-item"
                                  onClick={() => handleCardClick(session)}
                                >
                                  <img
                                    src={session.thumbnail}
                                    alt={session.type}
                                    className="session-thumbnail"
                                    onError={(e) => {
                                      e.target.src =
                                        "/assets/images/continue-watch/01.jpg";
                                    }}
                                  />
                                  <div className="session-info">
                                    <h5 className="session-title">
                                      {session.type}
                                    </h5>
                                    <div className="session-meta">
                                      <span
                                        className={`label-badge status-${session.status.toLowerCase()}`}
                                      >
                                        {session.status}
                                      </span>
                                      <span>{session.level}</span>
                                      <span>{session.sessionDuration}</span>
                                      {session.lastWatchedAt && (
                                        <span>
                                          {formatTimeAgo(session.lastWatchedAt)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="progress-indicator">
                                    <div className="progress-bar-small">
                                      <div
                                        className="progress-fill-small"
                                        style={{
                                          width: `${Math.round(
                                            session.progress * 100
                                          )}%`,
                                          background:
                                            session.progress >= 1
                                              ? "#4caf50"
                                              : "#1976d2",
                                        }}
                                      />
                                    </div>
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "#666",
                                      }}
                                    >
                                      {Math.round(session.progress * 100)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

const MySpacePage = memo(() => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [view, setView] = useState("watching");
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();
  const { activeFilters } = useFilter();
  const buttonRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isProgressBarMobile, setIsProgressBarMobile] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const maxPoints = 200;

  const [watchedSessions, setWatchedSessions] = useState([]);
  const [moduleProgress, setModuleProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedSessions, setSavedSessions] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [error, setError] = useState(null);
  const [moduleSessions, setModuleSessions] = useState([]);
  const [subscription, setSubscription] = useState({
    isSubscribed: true,
    planName: "Free",
  });

  const userId = localStorage.getItem("userId");

  const [isResponsiveRange, setIsResponsiveRange] = useState(false);

  // New function to calculate module-wise progress
  const getModuleProgress = (sessions) => {
    const modules = {};

    sessions.forEach((session) => {
      const moduleName = session.moduleName || "Uncategorized";
      if (!modules[moduleName]) {
        modules[moduleName] = {
          totalSessions: 0,
          watchedSessions: 0,
        };
      }
      modules[moduleName].totalSessions += 1;

      const isCompleted =
        session.playbackProgress &&
        session.playbackProgress.progressPercentage >= 1;
      if (isCompleted) {
        modules[moduleName].watchedSessions += 1;
      }
    });

    return Object.keys(modules).map((name) => ({
      moduleName: name,
      totalSessions: modules[name].totalSessions,
      watchedSessions: modules[name].watchedSessions,
      progressPercentage:
        (modules[name].watchedSessions / modules[name].totalSessions) * 100,
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 550);
      setIsProgressBarMobile(width >= 300 && width <= 1290);
      setIsResponsiveRange(width >= 350 && width <= 890);
      if (width > 890) {
        setSidebarOpen(false);
      } else if (width < 350) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPoints = async () => {
      try {
        const res = await axios.get(
          `https://primerad-backend.onrender.com/api/assessments/getUserPoints?userId=${localStorage.getItem(
            "userId"
          )}`
        );
        const data = res.data;
        if (data?.totalPoints !== undefined) {
          setTotalPoints(data.totalPoints);
        }
      } catch (error) {
        console.error("Error fetching user points:", error);
      }
    };

    fetchPoints();
  }, [isAuthenticated]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 590);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && view === "grid") {
      setView("list");
    } else if (!isMobile && view === "list") {
      setView("grid");
    }
  }, [isMobile, view]);

  // Fetch watched sessions from API
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const fetchWatchedSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://primerad-backend.onrender.com/api/sessions/getWatchedSessions?userId=${userId}`
        );

        const data = response.data;
        const sessions = data.data || [];
        setWatchedSessions(sessions);
        setModuleProgress(getModuleProgress(sessions));
      } catch (err) {
        console.error("Error fetching watched sessions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchedSessions();
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const fetchCompletedCount = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://primerad-backend.onrender.com/api/sessions/getCompletedSessions?userId=${userId}`
        );

        const data = response.data;
        const sessions = data.data || [];
        console.log(data, data.count);
        setCompletedCount(parseInt(data.count));
      } catch (err) {
        console.error("Error fetching watched sessions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedCount();
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    console.log(completedCount, "completed");

    const fetchModuleSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://primerad-backend.onrender.com/api/modules/getModulesSessionCount`
        );

        const data = response.data;
        const sessions = data.data || [];
        console.log(sessions, typeof sessions);

        console.log(sessions);
        setModuleSessions(sessions);
        setModuleProgress(getModuleProgress(sessions));
      } catch (err) {
        console.error("Error fetching watched sessions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchModuleSessions();
  }, [isAuthenticated]);

  // Transform API data to match your component's expected format
  const transformSessionData = (session) => {
    const progress = session.playbackProgress;
    const sessionDurationInMinutes = session.sessionDuration
      ? parseInt(session.sessionDuration.split(" ")[0])
      : 0;
    const currentTimeInMinutes = progress?.currentTime
      ? Math.floor(progress.currentTime / 60)
      : 0;
    const progressPercentage =
      sessionDurationInMinutes > 0
        ? Math.min(currentTimeInMinutes / sessionDurationInMinutes, 1)
        : 0;
    const remainingMinutes = Math.max(
      sessionDurationInMinutes - currentTimeInMinutes,
      0
    );

    return {
      id: session._id,
      type: session.title,
      vimeoVideoId: session.vimeoVideoId,
      isFree: session.isFree,
      category: session.moduleName,
      level:
        session.difficulty?.charAt(0).toUpperCase() +
          session.difficulty?.slice(1) || "Beginner",
      status: session.isFree ? "Free" : "Locked",
      thumbnail: session.imageUrl_1920x1080
        ? `https://primerad-backend.onrender.com${session.imageUrl_1920x1080}`
        : "/assets/images/continue-watch/01.jpg",
      minutesLeft: remainingMinutes,
      progress: progressPercentage,
      timeLeft:
        remainingMinutes > 0 ? `${remainingMinutes} mins left` : "Completed",
      sessionType: session.sessionType,
      lastWatchedAt: progress?.lastWatchedAt,
      currentTime: progress?.currentTime || 0,
      sessionDuration: session.sessionDuration,
      isAssessment: session.isAssessment,
    };
  };

  const transformedCards = watchedSessions.map(transformSessionData);

  const watchingCards = transformedCards.filter((card) => card.progress < 1);
  const completedCards = transformedCards.filter((card) => card.progress >= 1);
  const savedCards = savedSessions.map(transformSessionData);
  const filteredCards = (
    view === "watching"
      ? watchingCards
      : view === "completed"
      ? completedCards
      : savedCards
  ).filter((card) => {
    const areaMatch =
      activeFilters.area.length === 0 ||
      activeFilters.area.includes(card.category);
    const levelMatch =
      activeFilters.level.length === 0 ||
      activeFilters.level.includes(card.level);
    const statusMatch =
      activeFilters.status.length === 0 ||
      activeFilters.status.includes(card.status);
    const typeMatch =
      activeFilters.type.length === 0 ||
      activeFilters.type.some((type) =>
        card.type.toLowerCase().includes(type.toLowerCase())
      );
    const pathologyMatch =
      activeFilters.pathology.length === 0 ||
      activeFilters.pathology.some((pathology) =>
        card.type.toLowerCase().includes(pathology.toLowerCase())
      );

    return (
      areaMatch && levelMatch && statusMatch && typeMatch && pathologyMatch
    );
  });

  const handleCardClick = (card) => {
    if (card.status === "Locked") {
      navigate("/lecture-detail", {
        state: {
          id: card.id,
          vimeoVideoId: card.vimeoVideoId,
          title: card.type,
          description: card.description,
          faculty: card.faculty,
          module: card.module,
          isFree: card.isFree,
          submodule: card.submodule,
          duration: card.sessionDuration,
          startDate: card.startDate,
          contentType: card.contentType,
        },
      });
    } else {
      navigate("/lecture-detail", {
        state: {
          id: card.id,
          vimeoVideoId: card.vimeoVideoId,
          title: card.type,
          description: card.description,
          faculty: card.faculty,
          module: card.module,
          isFree: card.isFree,
          submodule: card.submodule,
          duration: card.sessionDuration,
          startDate: card.startDate,
          contentType: card.contentType,
        },
      });
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const watchedDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - watchedDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  };

  if (!isAuthenticated) {
    return (
      <div>
        <div className="auth-message-container">
          <div className="auth-message-content">
            <h2
              className={`auth-message-title ${
                isMobile ? "mobile" : "desktop"
              }`}
              style={{ fontSize: isMobile ? "24px" : "32px" }}
            >
              Login to view your Watched Sessions
            </h2>
            <p className="auth-message-text">
              Module progress and compete with others!
            </p>
            <button
              onClick={() => navigate("/login")}
              className="auth-message-button"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="myspace-page-container">
        {isResponsiveRange && (
          <button
            className={`sidebar-toggle ${sidebarOpen ? "open" : ""}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <FaTimes size={18} />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" />
              </svg>
            )}
          </button>
        )}

        {(!isMobile || (isResponsiveRange && sidebarOpen)) && (
          <div
            className={`sidebar-wrapper ${
              isResponsiveRange ? "mobile" : "desktop"
            } ${isResponsiveRange && !sidebarOpen ? "closed" : "open"}`}
            style={{
              top: isMobile ? "80px" : "90px",
              left: isResponsiveRange && !sidebarOpen ? "-250px" : "0",
            }}
          >
            <NavCategories />
          </div>
        )}

        {isResponsiveRange && sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`main-content-myspace ${isMobile ? "mobile" : "desktop"}`}
        >
          <div className={`content-inner ${isMobile ? "mobile" : "desktop"}`}>
            <div
              className={`header-section ${isMobile ? "mobile" : "desktop"}`}
            >
              <div
                className={`progress-container ${
                  isProgressBarMobile ? "mobile" : "desktop"
                }`}
              >
                <div
                  className={`subscription-badge ${
                    subscription.isSubscribed ? "subscribed" : "unsubscribed"
                  } ${isMobile ? "mobile" : "desktop"}`}
                >
                  <div
                    className={`subscription-icon ${
                      subscription.isSubscribed ? "subscribed" : "unsubscribed"
                    } ${isMobile ? "mobile" : "desktop"}`}
                  >
                    <div
                      className={`subscription-icon-inner ${
                        subscription.isSubscribed
                          ? "subscribed"
                          : "unsubscribed"
                      } ${isMobile ? "mobile" : "desktop"}`}
                    />
                  </div>

                  <div className="subscription-info">
                    <div
                      className={`subscription-label ${
                        isMobile ? "mobile" : "desktop"
                      }`}
                    >
                      Subscription
                    </div>
                    <div
                      className={`subscription-plan ${
                        subscription.isSubscribed
                          ? "subscribed"
                          : "unsubscribed"
                      } ${isMobile ? "mobile" : "desktop"}`}
                    >
                      {subscription.planName}
                    </div>
                  </div>

                  {subscription.isSubscribed && (
                    <div
                      className={`subscription-active-badge ${
                        isProgressBarMobile ? "mobile" : "desktop"
                      }`}
                    >
                      Active
                    </div>
                  )}

                  <div
                    className={`subscription-shimmer ${
                      subscription.isSubscribed ? "active" : ""
                    }`}
                  />
                </div>

                <div
                  className={`belt-status ${
                    isProgressBarMobile ? "mobile" : "desktop"
                  }`}
                >
                  Current Belt: <span className="belt-status-value">Green</span>
                </div>

                <div
                  className={`main-progress-bar ${
                    isProgressBarMobile ? "mobile" : "desktop"
                  }`}
                >
                  <div
                    className={`main-progress-bar-wrapper ${
                      isMobile ? "mobile" : "desktop"
                    }`}
                  >
                    <div
                      className="main-progress-bar-fill"
                      style={{
                        width: `${Math.min(
                          Math.round((totalPoints / maxPoints) * 100),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`points-display ${
                    isProgressBarMobile ? "mobile" : "desktop"
                  }`}
                >
                  {totalPoints} / {maxPoints} pts to{" "}
                  <span className="points-display-target">Black</span>
                </div>
              </div>
            </div>

            {moduleProgress.length > 0 && view !== "saved" && viewMode && (
              <div
                className={`module-progress-section ${
                  isMobile ? "mobile" : "desktop"
                }`}
              >
                <h3
                  className={`module-progress-title ${
                    isMobile ? "mobile" : "desktop"
                  }`}
                >
                  Module Progress
                </h3>
                <div
                  className={`module-progress-grid ${
                    isMobile ? "mobile" : "desktop"
                  }`}
                >
                  {moduleSessions.map((mod) => (
                    <ModuleStatusCard key={mod.moduleName} module={mod} />
                  ))}
                </div>
              </div>
            )}

            <div
              className={`view-mode-buttons ${
                isProgressBarMobile ? "mobile" : "desktop"
              }`}
            >
              <button
                className={`view-button ${
                  isProgressBarMobile ? "mobile" : "desktop"
                }`}
                onClick={() => setView("watching")}
              >
                Watching ({watchingCards.length})
              </button>
              <button
                className={`view-button ${
                  isProgressBarMobile ? "mobile" : "desktop"
                }`}
                onClick={() => setView("completed")}
              >
                Completed ({completedCards.length})
              </button>
              <button
                className={`view-button ${
                  isProgressBarMobile ? "mobile" : "desktop"
                }`}
                onClick={() => setView("saved")}
              >
                Saved ({savedCards.length})
              </button>
            </div>

            <div
              className={`view-toggle-buttons ${
                isMobile ? "mobile" : "desktop"
              }`}
            >
              <button
                className="view-toggle-button"
                onClick={() => setViewMode("grid")}
              >
                <FaTh size={14} />
                Grid
              </button>
              <button
                className="view-toggle-button"
                onClick={() => setViewMode("list")}
              >
                <FaList size={14} />
                List
              </button>
            </div>

            {/* Content Area */}
            <div className="video-cards-outer-card">
              {loading ? (
                <div className="loading-container">
                  <div>Loading your watched sessions...</div>
                </div>
              ) : error ? (
                <div className="error-container">
                  <FaExclamationCircle size={48} style={{ marginBottom: 16 }} />
                  <div style={{ fontSize: 18, marginBottom: 8 }}>
                    Error loading sessions
                  </div>
                  <div style={{ fontSize: 14 }}>{error}</div>
                  <button
                    className="error-retry-button"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              ) : filteredCards.length === 0 ? (
                <div className="no-data-container">
                  <div style={{ fontSize: 24, marginBottom: 16 }}>
                    {view === "watching"
                      ? "📺"
                      : view === "completed"
                      ? "✅"
                      : "💾"}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    {view === "watching"
                      ? "No sessions in progress"
                      : view === "completed"
                      ? "No completed sessions"
                      : "No saved sessions"}
                  </div>
                  <div style={{ fontSize: 14, color: "#999" }}>
                    {view === "watching"
                      ? "Start watching some content to see your progress here"
                      : view === "completed"
                      ? "Complete some sessions to see them here"
                      : "Save some sessions to see them here"}
                  </div>
                </div>
              ) : viewMode === "list" ? (
                <ListView
                  filteredCards={filteredCards}
                  handleCardClick={handleCardClick}
                  formatTimeAgo={formatTimeAgo}
                  isMobile={isMobile}
                />
              ) : (
                <div className="video-cards-grid">
                  {filteredCards.map((card) => (
                    <div
                      key={card.id}
                      className="video-card"
                      onClick={() => handleCardClick(card)}
                    >
                      {/* Video Thumbnail */}
                      <div className="video-container-myspace">
                        <img
                          src={card.thumbnail}
                          alt={card.type + " thumbnail"}
                          onError={(e) => {
                            e.target.src =
                              "/assets/images/continue-watch/01.jpg";
                          }}
                        />
                        <span className="duration-badge">{card.timeLeft}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="video-card-progress">
                        <div className="video-card-progress-wrapper">
                          <div
                            className={`video-card-progress-fill ${
                              card.progress >= 1 ? "completed" : "in-progress"
                            }`}
                            style={{
                              width: `${Math.round(card.progress * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Title and badges */}
                      <div className="video-title">{card.type}</div>
                      <div className="badges-row">
                        <span className="label-badge">{card.level}</span>

                        {card.status === "Locked" ? (
                          <span
                            data-tip
                            data-for={`locked-tip-${card.id}`}
                            className="lock-icon-container"
                          >
                            <span role="img" aria-label="Locked">
                              🔒
                            </span>
                            <ReactTooltip
                              id={`locked-tip-${card.id}`}
                              effect="solid"
                              clickable={true}
                            >
                              <div className="lock-tooltip-content">
                                <div className="lock-tooltip-message">
                                  This content is locked.
                                </div>
                                <button
                                  className="lock-tooltip-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate("/pricing");
                                  }}
                                >
                                  Upgrade
                                </button>
                              </div>
                            </ReactTooltip>
                          </span>
                        ) : (
                          <span
                            className={`label-badge status-${card.status.toLowerCase()}`}
                          >
                            {card.status}
                          </span>
                        )}
                      </div>

                      {/* Last watched info */}
                      {card.lastWatchedAt && (
                        <div className="days-ago">
                          {formatTimeAgo(card.lastWatchedAt)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ReactTooltip effect="solid" clickable={true} />
    </>
  );
});

MySpacePage.displayName = "MySpacePage";
export default MySpacePage;
