import React, { useState, useEffect } from "react";
const AREAS = [
  "All",
  "Knee",
  "Shoulder",
  "Hip",
  "Pelvis",
  "Ankle",
  "Elbow",
  "Spine",
];
const LEVELS = ["All", "Beginner", "Advanced"];

const user = {
  name: "Shri",
  belt: "Green Belt",
  points: 1250,
  nextBelt: "Black Belt",
  pointsNeeded: 200,
  totalPointsForNextBelt: 1500,
  avgRank: 21,
  totalUsers: 250,
  totalScore: 566,
  totalPossible: 700,
  modules: {
    Knee: { score: 72, total: 100, rank: 35, totalUsers: 250 },
    Shoulder: { score: 85, total: 100, rank: 12, totalUsers: 250 },
    Hip: { score: 90, total: 100, rank: 8, totalUsers: 250 },
    Pelvis: { score: 68, total: 100, rank: 42, totalUsers: 250 },
    Ankle: { score: 77, total: 100, rank: 28, totalUsers: 250 },
    Elbow: { score: 93, total: 100, rank: 5, totalUsers: 250 },
    Spine: { score: 81, total: 100, rank: 19, totalUsers: 250 },
  },
};

const masteryLevel = (score) => {
  if (score >= 90) return "Advanced";
  else if (score >= 70) return "Advanced";
  else return "Beginner";
};

function getCardData(area, level) {
  const moduleKeys = Object.keys(user.modules);
  let filteredKeys = area === "All" ? moduleKeys : [area];
  filteredKeys = filteredKeys.filter((key) => {
    if (level === "All") return true;
    return masteryLevel(user.modules[key].score) === level;
  });
  if (filteredKeys.length === 0) {
    return { totalScore: 0, totalPossible: 0, avgRank: 0, totalUsers: 0 };
  }
  let totalScore = 0,
    totalPossible = 0,
    avgRank = 0,
    totalUsers = 0;
  filteredKeys.forEach((key) => {
    totalScore += user.modules[key].score;
    totalPossible += user.modules[key].total;
    avgRank += user.modules[key].rank;
    totalUsers = user.modules[key].totalUsers;
  });
  avgRank = Math.round(avgRank / filteredKeys.length);
  return { totalScore, totalPossible, avgRank, totalUsers };
}

export default function ScoreBoard() {
  // Mock authentication state for demo
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userId] = useState(localStorage.getItem("userId"));
  const [username] = useState(localStorage.getItem("username"));
  const [apiUserPoints, setApiUserPoints] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeArea, setActiveArea] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Mock navigate function
  const navigate = (path) => {
    console.log(`Would navigate to: ${path}`);
    // In a real app, this would handle navigation
  };

  const cardData = getCardData(activeArea, activeLevel);

  useEffect(() => {
    async function fetchPoints() {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setApiUserPoints(1250);
      } catch (err) {
        console.error("Failed to fetch points", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPoints();
  }, [userId]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const pointsToShow = apiUserPoints !== null ? apiUserPoints : 0;
  const progressPercentage = (pointsToShow / user.totalPointsForNextBelt) * 100;

  const styles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
  font-family: "Inter", -apple-system, sans-serif;
}
    
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes slideInFromLeft {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutToLeft {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(-100%); opacity: 0; }
    }
    
    // @keyframes shimmer {
    //   0% { background-position: -200px 0; }
    //   100% { background-position: calc(200px + 100%) 0; }
    // }
    
    .animate-slide-up { animation: slideInUp 0.6s ease-out; }
    .animate-pulse-gentle { animation: pulse 2s ease-in-out infinite; }
    .slide-in-left { animation: slideInFromLeft 0.3s ease-out; }
    .slide-out-left { animation: slideOutToLeft 0.3s ease-out; }
    
    .shimmer-effect {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200px 100%;
      animation: shimmer 1.5s infinite;
    }
    
    .filter-btn {
      transition: all 0.2s ease;
      border: 1px solid #e0e4e7;
      background: white;
      color: #64748b;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      outline: none;
      font-family: inherit;
    }
    
    .filter-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #3b82f6;
    }
    
    .filter-btn.active {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      border-color: #3b82f6;
      box-shadow: 0 4px 16px rgba(59,130,246,0.3);
    }
    
    .card-hover {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    
    .card-hover:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    
    .progress-glow { box-shadow: 0 0 20px rgba(34, 197, 94, 0.4); }
    
    .glass-effect {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .performer-row {
      transition: all 0.2s ease;
    }
    
    .performer-row:hover {
      background: #f8fafc !important;
      transform: translateX(4px);
    }

    .mobile-filter-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      backdrop-filter: blur(4px);
    }

    .mobile-filter-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 280px;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 1000;
      padding: 24px;
      overflow-y: auto;
    }

    .filter-toggle-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border: none;
      border-radius: 12px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(59,130,246,0.3);
      transition: all 0.2s ease;
    }

    .filter-toggle-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(59,130,246,0.4);
    }
  `;

  if (!isAuthenticated) {
    return (
      <div>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)",
            padding: "20px",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <h2
              style={{
                fontSize: isMobile ? "24px" : "32px",
                fontWeight: "bold",
                color: "#1565c0",
                marginBottom: "16px",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Login to Access Assessments
            </h2>
            <p
              style={{
                color: "#546e7a",
                marginBottom: "32px",
                fontSize: "16px",
                lineHeight: "1.5",
              }}
            >
              Join our platform to attempt assessments and compete with others!
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #1976d2, #1565c0)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(25,118,210,0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 24px rgba(25,118,210,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 16px rgba(25,118,210,0.3)";
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  const FilterContent = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Area Filters */}
      <div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              background: "#3b82f6",
              borderRadius: "50%",
            }}
          ></span>
          Areas
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              isMobile && showMobileFilters
                ? "repeat(2, 1fr)"
                : isMobile
                ? "repeat(2, 1fr)"
                : "1fr",
            gap: "8px",
          }}
        >
          {AREAS.map((area) => (
            <button
              key={area}
              className={`filter-btn ${activeArea === area ? "active" : ""}`}
              onClick={() => {
                setActiveArea(area);
                if (isMobile) setShowMobileFilters(false);
              }}
              style={{
                fontSize: "14px",
                padding: "8px 12px",
              }}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Level Filters */}
      <div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              background: "#10b981",
              borderRadius: "50%",
            }}
          ></span>
          Levels
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "8px",
          }}
        >
          {LEVELS.map((level) => (
            <button
              key={level}
              className={`filter-btn ${activeLevel === level ? "active" : ""}`}
              onClick={() => {
                setActiveLevel(level);
                if (isMobile) setShowMobileFilters(false);
              }}
              style={{
                fontSize: "14px",
                padding: "8px 12px",
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <style>{styles}</style>

      {/* Mobile Filter Button */}
      {isMobile && !showMobileFilters ? (
        <button
          className="filter-toggle-btn"
          style={{
            marginTop: "35px",
            marginLeft: "-10px",
          }}
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" />
          </svg>
        </button>
      ) : showMobileFilters ? null : (
        ""
      )}

      {/* Mobile Filter Overlay and Sidebar */}
      {isMobile && showMobileFilters && (
        <>
          <div
            className="mobile-filter-overlay"
            onClick={() => setShowMobileFilters(false)}
          />
          <div
            className={`mobile-filter-sidebar ${
              showMobileFilters ? "slide-in-left" : "slide-out-left"
            }`}
            style={{
              marginTop: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "18px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#374151",
                }}
              >
                Filters
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  color: "#6b7280",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ×
              </button>
            </div>
            <FilterContent />
          </div>
        </>
      )}

      <div
        style={{
          minHeight: "800px",
          background: "#f4f8fb",
          paddingTop: isMobile ? "20px" : "20px",
          paddingBottom: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "50px auto 0 auto", // Add top margin here
            padding: isMobile ? "0 16px" : "0 24px",
          }}
        >
          <div className="animate-slide-up" style={{ marginBottom: "32px" }}>
            <div
              className="glass-effect"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "24px",
                }}
              >
                {/* User Info */}
                <div style={{ textAlign: isMobile ? "center" : "left" }}>
                  <h1
                    style={{
                      fontSize: isMobile ? "28px" : "36px",
                      fontWeight: "bold",
                      background: "linear-gradient(90deg, #667eea, #764ba2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: "8px",
                    }}
                  >
                    {username}
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <span
                      style={{
                        padding: "8px 16px",
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "white",
                        fontWeight: "600",
                        borderRadius: "20px",
                        fontSize: "14px",
                      }}
                    >
                      {user.belt}
                    </span>
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#374151",
                      }}
                    >
                      {isLoading ? (
                        <span
                          className="shimmer-effect"
                          style={{
                            display: "inline-block",
                            width: "64px",
                            height: "24px",
                            borderRadius: "4px",
                          }}
                        ></span>
                      ) : (
                        `${pointsToShow} pts`
                      )}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: isMobile ? "100%" : "400px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "8px",
                      }}
                    >
                      <span>Progress to {user.nextBelt}</span>
                      <span>{user.pointsNeeded} pts needed</span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        background: "#e5e7eb",
                        borderRadius: "6px",
                        height: "12px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="progress-glow"
                        style={{
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #10b981, #3b82f6)",
                          borderRadius: "6px",
                          transition: "width 1s ease-out",
                          width: `${progressPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Trophy Icon */}
                <div className="animate-pulse-gentle">
                  <div
                    style={{
                      width: "96px",
                      height: "96px",
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(251,191,36,0.4)",
                    }}
                  >
                    <svg
                      style={{ width: "48px", height: "48px", fill: "white" }}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C13.1 2 14 2.9 14 4V8C14 9.1 13.1 10 12 10S10 9.1 10 8V4C10 2.9 10.9 2 12 2M21 9V7L15 7V9C15 11.8 12.8 14 10 14C7.2 14 5 11.8 5 9V7L3 7V9C3 12.24 5.21 14.89 8.18 15.71C8.06 15.95 8 16.22 8 16.5V21H16V16.5C16 16.22 15.94 15.95 15.82 15.71C18.79 14.89 21 12.24 21 9Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "280px 1fr",
              gap: "24px",
            }}
          >
            {/* Desktop Filters */}
            {!isMobile && (
              <div>
                <div
                  className="glass-effect"
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "12px",
                    padding: "24px",
                    position: "sticky",
                    top: "24px",
                    marginBottom: "18px",
                  }}
                >
                  <FilterContent />
                </div>
              </div>
            )}

            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Stats Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                  gap: "24px",
                  gridAutoRows: "120px",
                }}
              >
                <div
                  className="card-hover glass-effect"
                  style={{
                    background: "linear-gradient(135deg, #ffeaa7, #fab1a0)",
                    boxShadow: "0 8px 32px rgba(255,234,167,0.3)",
                    borderRadius: "12px",
                    padding: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "rgba(255,255,255,0.3)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>⭐</span>
                    </div>
                    <div>
                      <p
                        style={{
                          color: "Black",
                          fontWeight: "500",
                          marginBottom: "4px",
                        }}
                      >
                        Total Score
                      </p>
                      <p
                        style={{
                          fontSize: "28px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        {pointsToShow}/200
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="card-hover glass-effect"
                  style={{
                    background: "linear-gradient(135deg, #74b9ff, #0984e3)",
                    boxShadow: "0 8px 32px rgba(116,185,255,0.3)",
                    borderRadius: "12px",
                    padding: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "rgba(255,255,255,0.3)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>🏅</span>
                    </div>
                    <div>
                      <p
                        style={{
                          color: "black",
                          fontWeight: "500",
                          marginBottom: "4px",
                        }}
                      >
                        Average Rank
                      </p>
                      <p
                        style={{
                          fontSize: "28px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        #{cardData.avgRank} / {cardData.totalUsers}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="glass-effect"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      style={{ width: "20px", height: "20px", fill: "white" }}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C13.1 2 14 2.9 14 4V8C14 9.1 13.1 10 12 10S10 9.1 10 8V4C10 2.9 10.9 2 12 2M21 9V7L15 7V9C15 11.8 12.8 14 10 14C7.2 14 5 11.8 5 9V7L3 7V9C3 12.24 5.21 14.89 8.18 15.71C8.06 15.95 8 16.22 8 16.5V21H16V16.5C16 16.22 15.94 15.95 15.82 15.71C18.79 14.89 21 12.24 21 9Z" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#374151",
                    }}
                  >
                    Top Performers
                  </h3>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {[
                    { name: "Alice", score: 98 },
                    { name: "Bob", score: 92 },
                    { name: "Carl", score: 89 },
                    { name: "David", score: 87 },
                    { name: "Eva", score: 85 },
                  ].map((performer, idx) => (
                    <div
                      key={performer.name}
                      className="performer-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px",
                        borderRadius: "8px",
                        background:
                          idx < 3
                            ? "linear-gradient(90deg, #f8fafc, #f1f5f9)"
                            : "#fff",
                        border:
                          idx < 3 ? "1px solid #e2e8f0" : "1px solid #f1f5f9",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: "14px",
                            background:
                              idx === 0
                                ? "#fbbf24"
                                : idx === 1
                                ? "#9ca3af"
                                : idx === 2
                                ? "#f97316"
                                : "#e5e7eb",
                            color: idx < 3 ? "white" : "#6b7280",
                          }}
                        >
                          {idx + 1}
                        </div>
                        <span style={{ fontWeight: "600", color: "#374151" }}>
                          {performer.name}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: "#374151",
                          }}
                        >
                          {performer.score}
                        </span>
                        <span style={{ color: "#9ca3af", fontSize: "14px" }}>
                          /100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
