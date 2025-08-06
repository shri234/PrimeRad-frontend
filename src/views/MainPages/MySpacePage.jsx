import { memo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFilter } from "../../context/FilterContext";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/auth/selectors";
import { Button } from "react-bootstrap";
import {
  FaExclamationCircle,
  FaBars,
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaFilter,
} from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
import NavCategories from "./NavCategories";
import ProgressBar from "./ProgressBar";
import { ChevronDown, ChevronUp } from "react-feather";
import { FaPlay } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";

const videoCardStyles = `
.sidebar-container {
  position: relative;
  display: flex;
}

.arrow-toggle {
  position: fixed;
  top: 80px;
  left: 10px;
  z-index: 1000;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.arrow-toggle:hover {
  background: #f5f5f5;
  transform: scale(1.05);
}

.arrow-toggle.open {
  left: 260px; /* Adjust based on sidebar width + margin */
}

.sidebar {
  transition: transform 0.3s ease;
}

.sidebar.hidden {
  transform: translateX(-100%);
}

/* Media queries for responsive behavior */
@media (min-width: 350px) and (max-width: 890px) {
  .arrow-toggle {
    display: flex;
  }
}

@media (max-width: 349px) {
  .arrow-toggle {
    display: none;
  }
}

@media (min-width: 890px) {
  .arrow-toggle {
    display: none;
  }
  
  .sidebar {
    transform: translateX(0) !important;
  }
}
  .video-card {
    position: relative;
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    max-width: 320px;
    min-width: 260px;
    border-radius: 20px;
  }
  .video-card:hover {
    background: #f5f5f5 !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  }
  .video-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 aspect ratio */
    border-radius: 18px;
    overflow: hidden;
    background: #000;
    margin-bottom: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .video-container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 18px;
    display: block;
    background: #000;
  }
  .duration-badge {
    position: absolute;
    bottom: 10px;
    right: 14px;
    background: ivory;
    color: gray;
    border-radius: 8px;
    padding: 2px 10px;
    font-size: 15px;
    font-weight: 600;
    z-index: 2;
    letter-spacing: 0.5px;
  }
  .category-badge {
    position: absolute;
    top: 12px;
    right: 16px;
    background: #1976d2;
    color: #fff;
    border-radius: 8px;
    padding: 4px 14px;
    font-size: 13px;
    font-weight: 600;
    z-index: 2;
    box-shadow: 0 2px 8px rgba(25,118,210,0.10);
    letter-spacing: 0.5px;
    text-transform: capitalize;
  }
  .badges-row {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    margin-bottom: 6px;
    flex-wrap: wrap;
    align-items: center;
  }
  .label-badge {
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: #e3f2fd;
    color: #1976d2;
    display: inline-block;
  }
  .label-badge.status-free {
    background: #e0f7fa;
    color: #00bfae;
  }
  .label-badge.status-locked {
    background: #ffe0b2;
    color: #ffb300;
  }
  .days-ago {
    color: #666;
    font-size: 15px;
    margin-top: 2px;
    margin-bottom: 0;
    font-weight: 500;
    letter-spacing: 0.2px;
  }
  .video-title {
    font-weight: 700;
    font-size: 20px;
    color: #222;
    margin-top: 14px;
    margin-bottom: 0;
    line-height: 1.2;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .video-cards-outer-card {
    background: ;
    border-radius: 28px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.07);
    padding: 18px 18px 18px 18px;
    max-width: 1400px;
    margin: 28px auto 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .video-cards-outer-card .video-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 32px 24px;
    width: 100%;
  }
  
  /* Mobile responsive grid */
  @media (max-width: 580px) {
    .video-cards-outer-card .video-cards-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .video-cards-outer-card {
      padding: 12px;
      margin: 16px auto 0 auto;
      border-radius: 20px;
    }
    
    .video-card {
      max-width: 100%;
      min-width: 0;
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    font-size: 18px;
    color: #666;
  }

  .error-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: #f44336;
    text-align: center;
  }

  .no-data-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: #666;
    text-align: center;
    font-size: 18px;
  }
`;

const THEME = {
  primary: "#1976d2", // blue
  secondary: "#00bfae", // teal
  background: "#f4f8fb", // light blue/gray
  card: "#fff",
  accent: "#ffb300", // amber
  text: "#263238", // dark blue-gray
  border: "#e0e0e0",
};

const ModuleStatusCard = memo(({ module }) => {
  console.log(module);
  const isCompleted = module.progressPercentage === 100;

  const cardStyles = {
    padding: "16px",
    background: "#e8f5e9",
    borderRadius: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    border: `1px solid ${isCompleted ? "#4caf50" : "#e0e0e0"}`,
  };

  const progressBarWrapperStyles = {
    width: "100%",
    height: "8px",
    background: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
    marginTop: "8px",
  };

  const progressBarStyles = {
    width: `${Math.round(module.progressPercentage) || 50}%`,
    height: "100%",
    background: isCompleted ? "#4caf50" : "#1976d2",
    transition: "width 0.3s ease-in-out",
  };

  if (module?.totalSessionsCount > 0) {
    return (
      <div style={cardStyles}>
        <div style={{ fontWeight: 600, fontSize: "14px" }}>
          {module.moduleName}
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "darkslategrey",
          }}
        >
          1 / {module.totalSessionsCount} Sessions
        </div>
        <div style={progressBarWrapperStyles}>
          <div style={progressBarStyles} />
        </div>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
          {Math.round(module.progressPercentage) || 50}% Complete
        </div>
      </div>
    );
  }
  return null;
});

const MySpacePage = memo(() => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [view, setView] = useState("watching");
  const navigate = useNavigate();
  const { activeFilters } = useFilter();
  const buttonRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
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

      // Assuming progress is 100% when playbackPercentage is >= 1
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
        const res = await fetch(
          `https://primerad-backend.onrender.com/api/assessments/getUserPoints?userId=${localStorage.getItem(
            "userId"
          )}`
        );
        const data = await res.json();
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

        const response = await fetch(
          `https://primerad-backend.onrender.com/api/sessions/getWatchedSessions?userId=${userId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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

        const response = await fetch(
          `http://localhost:5000/api/sessions/getCompletedSessions?userId=${userId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const sessions = data.data || [];
        console.log(data, data.count);
        setCompletedCount(parseInt(data.count));
        // setModuleProgress(getModuleProgress(sessions));
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
    // if (completedCount) {
    const fetchModuleSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:5000/api/modules/getModulesSessionCount`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const sessions = data.data || [];
        console.log(sessions, typeof sessions);
        // sessions[0].completedCount = completedCount;
        // sessions[1].completedCount = completedCount;

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
      category: session.moduleName,
      level:
        session.difficulty?.charAt(0).toUpperCase() +
          session.difficulty?.slice(1) || "Beginner",
      status: session.isFree ? "Free" : "Locked",
      thumbnail: session.imageUrl_1920x1080
        ? `http://localhost:5000${session.imageUrl_1920x1080}`
        : "/assets/images/continue-watch/01.jpg", // fallback image
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

  // Apply filters
  const savedCards = savedSessions.map(transformSessionData);
  const filteredCards = (
    view === "watching" ? watchingCards : completedCards
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
      navigate("/movies-detail", {
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
      navigate("/movies-detail", {
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
      <div
        style={{
          minHeight: "100vh",
          background: "#f1f7fb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "2.3rem",
            color: "#0a197d",
            fontFamily: "monospace",
            marginBottom: 48,
            textAlign: "center",
            fontWeight: 500,
            letterSpacing: 2,
          }}
        >
          Login to Watch Unlimited Videos
        </div>
        <button
          style={{
            background: "#8fd0e8",
            color: "#111",
            border: "none",
            borderRadius: 40,
            padding: "10px 28px",
            fontSize: "1.5rem",
            fontWeight: 700,
            boxShadow: "0 4px 18px 0 #b6e0f7",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          background: "#f4f8fb",
          display: "flex",
        }}
      >
        <style>{videoCardStyles}</style>
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
        {isResponsiveRange && (
          <button
            className={`sidebar-toggle ${sidebarOpen ? "open" : ""}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: "fixed",
              top: "60px",
              left: sidebarOpen ? "0px" : "0px",
              zIndex: 1001,
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "20%",
              width: "40px",
              height: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              marginLeft: "-3px",
            }}
          >
            {sidebarOpen ? <FaTimes /> : <FaFilter />}
          </button>
        )}

        {(!isMobile || (isResponsiveRange && sidebarOpen)) && (
          <div
            className="sidebar-wrapper"
            style={{
              width: "250px",
              flexShrink: 0,
              position: isResponsiveRange ? "fixed" : "sticky",
              top: 0,
              left: isResponsiveRange && !sidebarOpen ? "-250px" : "0",
              height: "100vh",
              overflowY: "hidden",
              zIndex: 1000,
              transition: "left 0.3s ease",
              boxShadow: isResponsiveRange
                ? "2px 0 10px rgba(0,0,0,0.1)"
                : "none",
            }}
          >
            <NavCategories />
          </div>
        )}
        {isResponsiveRange && sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            background: "transparent",
            flex: 1,
            overflowY: "auto",
            paddingTop: isMobile ? "100px" : "70px",
            paddingRight: isMobile ? "12px" : "18px",
            paddingLeft: isMobile ? "12px" : "0",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: isMobile ? "4px" : "8px",
              backgroundColor: "transparent",
            }}
          >
            <div
              style={{
                marginBottom: isMobile ? "16px" : "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: isMobile ? "16px" : "24px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  background: "antiquewhite",
                  borderRadius: isMobile ? 12 : 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  padding: isMobile ? "12px 16px" : "18px 28px",
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 16 : 24,
                  maxWidth: 900,
                  width: "100%",
                  minWidth: isMobile ? 280 : 320,
                  flex: 1,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? 8 : 12,
                    padding: isMobile ? "12px 16px" : "16px 20px",
                    background: subscription.isSubscribed
                      ? "linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%)"
                      : "linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)",
                    borderRadius: isMobile ? 12 : 16,
                    border: `2px solid ${
                      subscription.isSubscribed ? "#4caf50" : "#e0e0e0"
                    }`,
                    boxShadow: subscription.isSubscribed
                      ? "0 4px 20px rgba(76, 175, 80, 0.15)"
                      : "0 4px 16px rgba(0, 0, 0, 0.08)",
                    minWidth: isMobile ? 140 : 200,
                    textAlign: "left",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "default",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Status Icon */}
                  <div
                    style={{
                      width: isMobile ? 24 : 28,
                      height: isMobile ? 24 : 28,
                      borderRadius: "50%",
                      background: subscription.isSubscribed
                        ? "linear-gradient(135deg, #4caf50, #66bb6a)"
                        : "linear-gradient(135deg, #9e9e9e, #bdbdbd)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? 8 : 10,
                        height: isMobile ? 8 : 10,
                        background: "white",
                        borderRadius: "50%",
                        opacity: subscription.isSubscribed ? 1 : 0.7,
                      }}
                    />
                  </div>

                  {/* Text Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: isMobile ? 12 : 13,
                        fontWeight: 500,
                        color: "#666",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: 2,
                        lineHeight: 1,
                      }}
                    >
                      Subscription
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? 16 : 18,
                        fontWeight: 700,
                        color: subscription.isSubscribed
                          ? "#2e7d32"
                          : "#5f6368",
                        lineHeight: 1.2,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {subscription.planName}
                    </div>
                  </div>

                  {/* Premium Badge (if subscribed) */}
                  {subscription.isSubscribed && (
                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        right: -1,
                        background: "linear-gradient(135deg, #ffd700, #ffb300)",
                        color: "#333",
                        fontSize: isMobile ? 8 : 9,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "0 14px 0 8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Active
                    </div>
                  )}

                  {/* Subtle Animation Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: subscription.isSubscribed
                        ? "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)"
                        : "none",
                      animation: subscription.isSubscribed
                        ? "shimmer 3s infinite"
                        : "none",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 16 : 20,
                    fontWeight: 400,
                    minWidth: isMobile ? 120 : 180,
                    textAlign: isMobile ? "center" : "left",
                  }}
                >
                  Current Belt:{" "}
                  <span style={{ fontWeight: 700, color: "#1976d2" }}>
                    Green
                  </span>
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: isMobile ? 100 : 120,
                    margin: isMobile ? "0 8px" : "0 18px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 16,
                      background: "ghostwhite",
                      borderRadius: 8,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(
                          Math.round((totalPoints / maxPoints) * 100),
                          100
                        )}%`,
                        height: "100%",
                        background: "#1976d2",
                        borderRadius: 8,
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    fontSize: isMobile ? 14 : 18,
                    fontWeight: 400,
                    minWidth: isMobile ? 100 : 180,
                    textAlign: isMobile ? "center" : "right",
                  }}
                >
                  {totalPoints} / {maxPoints} pts to{" "}
                  <span style={{ fontWeight: 700, color: "#222" }}>Black</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: isMobile ? "6px" : "8px" }}>
                <button
                  style={{
                    padding: isMobile ? "4px 6px" : "8px 10px",
                    backgroundColor:
                      view === "watching" ? "darkslategray" : "lightgray",
                    color: view === "watching" ? "white" : "black",
                    border: "none",
                    borderRadius: isMobile ? "8px" : "10px",
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: "600",
                  }}
                  onClick={() => setView("watching")}
                >
                  Watching ({watchingCards.length})
                </button>
                <button
                  style={{
                    padding: isMobile ? "6px 8px" : "8px 10px",
                    backgroundColor:
                      view === "completed" ? "darkslategray" : "lightgray",
                    color: view === "completed" ? "white" : "black",
                    border: "none",
                    borderRadius: isMobile ? "8px" : "10px",
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: "600",
                  }}
                  onClick={() => setView("completed")}
                >
                  Completed ({completedCards.length})
                </button>
                <button
                  style={{
                    padding: isMobile ? "6px 8px" : "8px 10px",
                    backgroundColor:
                      view === "saved" ? "darkslategray" : "lightgray",
                    color: view === "saved" ? "white" : "black",
                    border: "none",
                    borderRadius: isMobile ? "8px" : "10px",
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: "600",
                  }}
                  onClick={() => setView("saved")}
                >
                  Saved ({savedCards.length})
                </button>
              </div>
            </div>

            {/* NEW: Module Progress Section */}
            {moduleProgress.length > 0 && view !== "saved" && (
              <div
                style={{
                  marginBottom: isMobile ? "24px" : "32px",
                  padding: isMobile ? "12px" : "18px",
                  background: "#e5eaf0",
                  borderRadius: isMobile ? "12px" : "16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "20px" : "24px",
                    marginBottom: "16px",
                    fontWeight: 700,
                    color: THEME.text,
                  }}
                >
                  Module Progress
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: isMobile ? "12px" : "20px",
                  }}
                >
                  {moduleSessions.map((mod) => (
                    <ModuleStatusCard key={mod.moduleName} module={mod} />
                  ))}
                </div>
              </div>
            )}

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
                    style={{
                      marginTop: 16,
                      padding: "8px 16px",
                      background: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              ) : filteredCards.length === 0 ? (
                <div className="no-data-container">
                  <div style={{ fontSize: 24, marginBottom: 16 }}>
                    {view === "watching" ? "📺" : "✅"}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    {view === "watching"
                      ? "No sessions in progress"
                      : "No completed sessions"}
                  </div>
                  <div style={{ fontSize: 14, color: "#999" }}>
                    {view === "watching"
                      ? "Start watching some content to see your progress here"
                      : "Complete some sessions to see them here"}
                  </div>
                </div>
              ) : (
                <div className="video-cards-grid">
                  {filteredCards.map((card) => (
                    <div
                      key={card.id}
                      className="video-card"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCardClick(card)}
                    >
                      {/* Video Thumbnail */}
                      <div className="video-container">
                        <img
                          src={card.thumbnail}
                          alt={card.type + " thumbnail"}
                          onError={(e) => {
                            e.target.src =
                              "/assets/images/continue-watch/01.jpg";
                          }}
                        />
                        {/* Time left badge at bottom right */}
                        <span className="duration-badge">{card.timeLeft}</span>
                      </div>

                      {/* Progress bar */}
                      <div style={{ width: "100%", margin: "8px 0 0 0" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "6px",
                            background: "#e0e0e0",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.round(card.progress * 100)}%`,
                              height: "100%",
                              background:
                                card.progress >= 1 ? "#4caf50" : "#1976d2",
                              borderRadius: "4px",
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                      </div>

                      {/* Title and badges */}
                      <div className="video-title">{card.type}</div>
                      <div className="badges-row">
                        {/* Level badge */}
                        <span className="label-badge">{card.level}</span>

                        {/* Status */}
                        {card.status === "Locked" ? (
                          <span
                            data-tip
                            data-for={`locked-tip-${card.id}`}
                            style={{
                              fontSize: 18,
                              marginRight: 6,
                              cursor: "pointer",
                            }}
                          >
                            <span role="img" aria-label="Locked">
                              🔒
                            </span>
                            <ReactTooltip
                              id={`locked-tip-${card.id}`}
                              effect="solid"
                              clickable={true}
                            >
                              <div style={{ padding: 8, textAlign: "center" }}>
                                <div style={{ marginBottom: 8 }}>
                                  This content is locked.
                                </div>
                                <button
                                  style={{
                                    background: "#1976d2",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "6px 18px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
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
