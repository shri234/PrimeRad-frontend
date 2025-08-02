import { memo, useState, useEffect, useRef, useCallback } from "react"; // Import useRef and useCallback
import { useNavigate } from "react-router-dom";
import { useFilter } from "../../context/FilterContext";
import { FaExclamationCircle } from "react-icons/fa";
import isFirstRender from "./hooks/useIsFirstRender";
import { FaPlay } from "react-icons/fa"; // Not used but kept from original
import {
  FaFolderOpen,
  FaChalkboardTeacher,
  FaBroadcastTower,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import NavCategories from "./NavCategories";
import axios from "axios";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../store/auth/selectors"; // selectUser is not used but kept from original

const THEME = {
  primary: "#1976d2", // blue
  secondary: "#00bfae", // teal
  background: "#f4f8fb", // light blue/gray
  card: "#fff",
  accent: "#ffb300", // amber
  text: "#263238", // dark blue-gray
  border: "#e0e0e0",
};

// CSS styles for video cards (UNCHANGED)
const videoCardStyles = `
  .video-card {
    position: relative;
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    max-width: 200px;
    min-width: 100px;
    border-radius: 20px;
  }
  .video-card.list-view {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 600px;
    min-width: 0;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    border-radius: 18px;
    margin-bottom: 12px;
    padding: 0;
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
  .video-card.list-view .video-container {
    width: 180px;
    min-width: 180px;
    height: 110px;
    padding-top: 0;
    border-radius: 14px 0 0 14px;
    margin: 0;
    box-shadow: none;
  }
  .video-card.list-view .video-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 14px 0 0 14px;
    position: static;
  }
  .video-card.list-view .video-content {
    flex: 1;
    padding: 16px 18px 16px 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }
  .video-card.list-view .video-title {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 6px;
    font-weight: 700;
    color: #222;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .video-card:hover {
    background: #f5f5f5 !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
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
  .content-type-badge {
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: #ede7f6;
    color: #512da8;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .label-badge {
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
  }
  .label-badge.level-beginner {
    background: #e3f2fd;
    color: #1976d2;
  }
  .label-badge.level-advanced {
    background: #fde8e8;
    color: #d32f2f;
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
    gap:20px;
    max-width: 1400px;
    margin: 28px auto 0 auto;
    width: 100%;
    /* height: calc(100vh - 170px); */
    /* min-height: 0; */
    display: flex;
    flex-direction: column;
    align-items: stretch;
    /* overflow: hidden; */
  }
  .video-cards-outer-card .video-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 36px 24px;
    width: 100%;
  }
  
  /* Mobile responsive grid */
  @media (max-width: 768px) {
    .video-cards-outer-card .video-cards-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
    
    .video-card.list-view {
      max-width: 100%;
      margin-bottom: 16px;
    }
  }
  
  /* Small mobile devices */
  @media (max-width: 480px) {
    .video-cards-outer-card .video-cards-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
  .video-card {
    /* height: 100%; */
    min-width: 0;
    max-width: 100%;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 769px) {
    .main-page-desktop-layout {
      display: flex;
    }
    .desktop-sidebar {
      width: 250px;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }
    .desktop-main-content {
      flex: 1;
      min-height: 100vh;
      overflow-y: auto; /* This is the key for the scrollable area */
      padding-top: 70px;
      padding-right: 18px;
    }
  }
`;

// Loader component for image placeholder (UNCHANGED)
const ImageLoader = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#eee",
      zIndex: 1,
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        border: "4px solid #ccc",
        borderTop: "4px solid #1976d2",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const VideoCard = ({ card, view, isMobile, handleCardClick, children }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div
      key={card.id}
      className={`video-card${view === "list" ? " list-view" : ""}`}
      style={{
        cursor: "pointer",
        width: view === "list" ? "100%" : "auto",
        maxWidth: view === "list" ? "100%" : isMobile ? "100%" : 320,
        minWidth: 0,
        background: view === "list" ? "#fff" : undefined,
        borderRadius: view === "list" ? 18 : undefined,
        boxShadow: view === "list" ? "0 2px 8px rgba(0,0,0,0.04)" : undefined,
        display: view === "list" ? "flex" : undefined,
        flexDirection: view === "list" ? "row" : undefined,
        alignItems: view === "list" ? "center" : undefined,
        padding: view === "list" ? "0 24px 0 0" : undefined,
        gap: view === "list" ? 10 : undefined,
      }}
      onClick={() => handleCardClick(card)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {view === "list" ? (
        <>
          {/* Left: Thumbnail */}
          <div
            className="video-container"
            style={{
              width: 180,
              minWidth: 180,
              height: 110,
              margin: "18px 24px 18px 0",
              borderRadius: 14,
              overflow: "hidden",
              flexShrink: 0,
              position: "relative",
            }}
          >
            {!imgLoaded && <ImageLoader />}
            <img
              src={card.thumbnail}
              alt={card.type + " thumbnail"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "14px",
                opacity: imgLoaded ? 1 : 0,
                transition: "opacity 0.3s",
              }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
            <span className="duration-badge">{card.duration}</span>
            <span className="category-badge">{card.category}</span>
          </div>
          <div
            className="video-content"
            style={{
              flex: 1,
              padding: "0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {children}
          </div>
        </>
      ) : (
        <>
          <div className="video-container" style={{ position: "relative" }}>
            {!imgLoaded && <ImageLoader />}
            <img
              src={card.thumbnail}
              alt={card.type + " thumbnail"}
              style={{
                opacity: imgLoaded ? 1 : 0,
                transition: "opacity 0.3s",
              }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
            <span className="duration-badge">{card.duration}</span>
            <span className="category-badge">{card.category}</span>
          </div>
          {children}
        </>
      )}
    </div>
  );
};

const MainPage = memo(() => {
  const [view, setView] = useState("grid");
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  const { activeFilters } = useFilter();
  const [totalPoints, setTotalPoints] = useState(0);
  const maxPoints = 200;
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const LIMIT = 12;

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

  const fetchSessions = useCallback(async (pageNum, append = false) => {
    if (!hasMore && append) return;
    if (isFetchingMore && append) return;

    if (append) {
      setIsFetchingMore(true);
    } else {
      setInitialLoading(true);
    }

    try {
      const response = await axios.get(
        `https://primerad-backend.onrender.com/api/sessions/get?page=${pageNum}&limit=${LIMIT}`
      );

      const { data: newSessionData, total } = response.data;

      const calculateTimeAgo = (startDate) => {
        if (!startDate) return "";
        const now = new Date();
        const start = new Date(startDate);
        const diffMs = now - start;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 60 && diffHours === 0) {
          return diffMinutes <= 1 ? "just now" : `${diffMinutes} minutes ago`;
        } else if (diffHours < 24) {
          return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
        } else {
          return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
        }
      };

      const cards = (newSessionData || []).map((session) => ({
        id: session._id,
        type: session.title,
        contentType:
          session.sessionType === "Dicom"
            ? "Case"
            : session.sessionType === "Vimeo"
            ? "Lecture"
            : session.sessionType || "Other",
        level: session.difficulty === "beginner" ? "Beginner" : "Advanced",
        status: session.isFree ? "Free" : "Locked",
        thumbnail: session.imageUrl_1920x1080
          ? `https://primerad-backend.onrender.com${session.imageUrl_1920x1080}`
          : session.imageUrl
          ? `https://primerad-backend.onrender.com${session.imageUrl}`
          : "/default-thumbnail.jpg",
        duration: session.sessionDuration || "",
        isFree: session.isFree,
        category: session.moduleName || session.subCategoryId || "",
        timeAgo: calculateTimeAgo(session.startDate),
        vimeoVideoId: session.vimeoVideoId || null,
        description: session.description || "No description available.",
        faculty: session.faculty || "Unknown Faculty",
        module: session.moduleName || "General",
        submodule: session.subCategoryId || "General",
        startDate: session.startDate,
      }));

      setSessions((prevSessions) =>
        append ? [...prevSessions, ...cards] : cards
      );
      // Determine if there's more data based on total and current page/limit
      setHasMore(pageNum * LIMIT < total);
      console.log(`Page: ${pageNum}, Limit: ${LIMIT}, Total: ${total}`);
      console.log(`Calculated hasMore: ${pageNum * LIMIT < total}`);
      console.log(`Current hasMore state: ${hasMore}`); // This might be stale due to closure if not carefully managed
      console.log(`Is Fetching More: ${isFetchingMore}`);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setHasMore(false); // On error, assume no more data
    } finally {
      setInitialLoading(false);
      setIsFetchingMore(false);
      console.log("Fetch finished. isFetchingMore set to false.");
    }
  }, []); // Dependencies for useCallback

  // Effect for initial session fetch
  useEffect(() => {
    // Only perform the fetch if it's truly the first render
    if (isFirstRender) {
      // <--- NEW GUARD
      fetchSessions(1, false);
    }
  }, [fetchSessions, isFirstRender]);

  // Effect for mobile view and scroll detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileNavOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleWindowScroll = () => {
      if (!isMobile) {
        const { scrollY } = window;
        const { scrollHeight, clientHeight } = document.documentElement;
        if (scrollHeight - scrollY <= clientHeight + 200) {
          if (hasMore && !isFetchingMore && !initialLoading) {
            setPage((prevPage) => prevPage + 1);
          }
        }
      }
    };

    if (!isMobile) {
      window.addEventListener("scroll", handleWindowScroll);
    }
    return () => {
      window.removeEventListener("resize", checkMobile);
      if (!isMobile) {
        window.removeEventListener("scroll", handleWindowScroll);
      }
    };
  }, [isMobile, hasMore, isFetchingMore, initialLoading]);

  // Effect to trigger fetching more sessions when page changes
  useEffect(() => {
    if (page > 1) {
      fetchSessions(page, true);
    }
  }, [page, fetchSessions]); // Add fetchSessions to dependencies

  const filteredCards = sessions.filter((card) => {
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
      activeFilters.type.includes(card.contentType);
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
    if (card.contentType && card.contentType.toLowerCase() === "case") {
      navigate(`/case/${card.id}`);
    } else if (
      card.contentType &&
      card.contentType.toLowerCase() === "lecture"
    ) {
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
          duration: card.duration,
          startDate: card.startDate,
          contentType: card.contentType,
        },
      });
    } else if (card.contentType && card.contentType.toLowerCase() === "live") {
      navigate("/live", { state: card });
    }
  };

  const getActiveFilterNames = () => {
    const filters = [];
    if (activeFilters.area.length > 0)
      filters.push(`Area: ${activeFilters.area.join(", ")}`);
    if (activeFilters.level.length > 0)
      filters.push(`Level: ${activeFilters.level.join(", ")}`);
    if (activeFilters.status.length > 0)
      filters.push(`Status: ${activeFilters.status.join(", ")}`);
    if (activeFilters.type.length > 0)
      filters.push(`Type: ${activeFilters.type.join(", ")}`);
    if (activeFilters.pathology.length > 0)
      filters.push(`Pathology: ${activeFilters.pathology.join(", ")}`);
    return filters.join(" | ");
  };

  return (
    <div style={{ background: THEME.background }}>
      <style>{videoCardStyles}</style>

      {isMobile && (
        <button
          style={{
            position: "fixed",
            top: "80px",
            left: "20px",
            zIndex: 1001,
            background: THEME.primary,
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            cursor: "pointer",
          }}
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        >
          {isMobileNavOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      <div className={!isMobile ? "main-page-desktop-layout" : ""}>
        <div
          className={!isMobile ? "desktop-sidebar" : ""}
          style={{
            width: isMobile ? (isMobileNavOpen ? "250px" : "0") : undefined,
            position: isMobile ? "fixed" : undefined,
            top: isMobile ? 0 : undefined,
            height: isMobile ? "100vh" : undefined,
            overflowY: isMobile ? "auto" : undefined,
            background: isMobile ? THEME.card : undefined,
            zIndex: isMobile ? 1000 : undefined,
            transition: isMobile ? "width 0.3s ease" : undefined,
          }}
        >
          <NavCategories />
        </div>

        {isMobile && isMobileNavOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
            onClick={() => setIsMobileNavOpen(false)}
          />
        )}

        <div
          className={!isMobile ? "desktop-main-content" : ""}
          style={{
            paddingTop: isMobile ? "120px" : undefined,
            paddingRight: isMobile ? "12px" : undefined,
            paddingLeft: isMobile ? "12px" : undefined,
            // Ensure this div is scrollable for desktop
            overflowY: !isMobile ? "auto" : undefined,
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
                justifyContent: isAuthenticated ? "space-between" : "flex-end",
                alignItems: "center",
                gap: isMobile ? "16px" : "24px",
                flexWrap: "wrap",
                // This part should not be scrollable if its parent handles scroll
                // maxWidth: 1400, // This might restrict width and not align with the grid
                margin: "0 auto", // Center it
              }}
            >
              {isAuthenticated && (
                <div
                  style={{
                    background: "#e5eaf0",
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
                      minWidth: isMobile ? 120 : 180,
                      textAlign: isMobile ? "center" : "right",
                    }}
                  >
                    {totalPoints} / {maxPoints} pts to{" "}
                    <span style={{ fontWeight: 700, color: "#222" }}>
                      Black
                    </span>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: isMobile ? "8px" : "10px" }}>
                <button
                  style={{
                    padding: isMobile ? "6px 8px" : "8px 10px",
                    backgroundColor:
                      view === "grid" ? "darkslategray" : "lightgray",
                    color: view === "grid" ? "white" : "black",
                    border: "none",
                    borderRadius: isMobile ? "8px" : "10px",
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: "600",
                  }}
                  onClick={() => setView("grid")}
                >
                  {isMobile ? "Grid" : "Grid"}
                </button>
                <button
                  style={{
                    padding: isMobile ? "6px 8px" : "8px 10px",
                    backgroundColor:
                      view === "list" ? "darkslategray" : "lightgray",
                    color: view === "list" ? "white" : "black",
                    border: "none",
                    borderRadius: isMobile ? "8px" : "10px",
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: "600",
                  }}
                  onClick={() => setView("list")}
                >
                  {isMobile ? "List" : "List"}
                </button>
              </div>
            </div>
            {initialLoading && filteredCards.length === 0 ? ( // Only show initial loading for first fetch
              <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
            ) : filteredCards.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "60vh",
                  textAlign: "center",
                  color: "#666",
                }}
              >
                <FaExclamationCircle
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                    color: "#999",
                  }}
                />
                <h3>No records found</h3>
                <p style={{ marginTop: "8px" }}>
                  There are no cards matching your current filters.
                </p>
                {Object.values(activeFilters).some((arr) => arr.length > 0) && (
                  <p style={{ marginTop: "4px", fontSize: "0.9rem" }}>
                    Active filters: {getActiveFilterNames()}
                  </p>
                )}
              </div>
            ) : (
              <div className="video-cards-outer-card">
                <div
                  className={view === "grid" ? "video-cards-grid" : undefined}
                  style={
                    view === "list"
                      ? {
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                          // Removed fixed height and overflowY here as the parent .desktop-main-content will scroll
                          width: "100%",
                        }
                      : undefined
                  }
                >
                  {filteredCards.map((card, idx) => (
                    <VideoCard
                      key={card.id}
                      card={card}
                      view={view}
                      isMobile={isMobile}
                      handleCardClick={handleCardClick}
                    >
                      {/* Title and badges, etc. */}
                      {view === "list" ? (
                        <>
                          <div
                            className="video-title"
                            style={{
                              fontSize: 20,
                              fontWeight: 700,
                              color: "#222",
                              marginBottom: 6,
                            }}
                          >
                            {card.type}
                          </div>
                          <div
                            className="badges-row"
                            style={{ marginBottom: 6 }}
                          >
                            <span className="content-type-badge">
                              {card.contentType === "Case" && (
                                <FaFolderOpen style={{ marginRight: 4 }} />
                              )}
                              {card.contentType === "Lecture" && (
                                <FaChalkboardTeacher
                                  style={{ marginRight: 4 }}
                                />
                              )}
                              {card.contentType === "Live" && (
                                <FaBroadcastTower style={{ marginRight: 4 }} />
                              )}
                              {card.contentType}
                            </span>
                            <span
                              className={`label-badge level-${card.level.toLowerCase()}`}
                            >
                              {card.level}
                            </span>
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
                                  <div
                                    style={{ padding: 8, textAlign: "center" }}
                                  >
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
                          <div
                            className="days-ago"
                            style={{ color: "#666", fontSize: 15 }}
                          >
                            {card.timeAgo}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="video-title">{card.type}</div>
                          <div className="badges-row">
                            <span className="content-type-badge">
                              {card.contentType === "Case" && (
                                <FaFolderOpen style={{ marginRight: 4 }} />
                              )}
                              {card.contentType === "Lecture" && (
                                <FaChalkboardTeacher
                                  style={{ marginRight: 4 }}
                                />
                              )}
                              {card.contentType === "Live" && (
                                <FaBroadcastTower style={{ marginRight: 4 }} />
                              )}
                              {card.contentType}
                            </span>
                            <span
                              className={`label-badge level-${card.level.toLowerCase()}`}
                            >
                              {card.level}
                            </span>
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
                                  <div
                                    style={{ padding: 8, textAlign: "center" }}
                                  >
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
                          <div className="days-ago">{card.timeAgo}</div>
                        </>
                      )}
                    </VideoCard>
                  ))}
                </div>
              </div>
            )}
            {/* Loading indicator for fetching more data */}
            {isFetchingMore && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                Loading more sessions...
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: "4px solid #ccc",
                    borderTop: "4px solid #1976d2",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "10px auto",
                  }}
                />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            {!hasMore && !initialLoading && filteredCards.length > 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#666",
                }}
              >
                You've reached the end of the list!
              </div>
            )}
          </div>
        </div>
      </div>
      <ReactTooltip effect="solid" clickable={true} />
    </div>
  );
});

MainPage.displayName = "MainPage";
export default MainPage;
