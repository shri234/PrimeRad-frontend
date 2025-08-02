import React, { useState, useEffect } from "react";
import "./ScoreBoard.css";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/auth/selectors";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
    Knee: {
      score: 72,
      total: 100,
      rank: 35,
      totalUsers: 250,
      topPerformers: [
        { name: "Alice", score: 98 },
        { name: "Bob", score: 92 },
        { name: "Carl", score: 89 },
      ],
    },
    Shoulder: {
      score: 85,
      total: 100,
      rank: 12,
      totalUsers: 250,
      topPerformers: [
        { name: "Alice", score: 98 },
        { name: "Bob", score: 92 },
        { name: "Carl", score: 89 },
      ],
    },
    Hip: {
      score: 90,
      total: 100,
      rank: 8,
      totalUsers: 250,
      topPerformers: [
        { name: "Alice", score: 98 },
        { name: "Bob", score: 92 },
        { name: "Carl", score: 89 },
      ],
    },
    Pelvis: {
      score: 68,
      total: 100,
      rank: 42,
      totalUsers: 250,
      topPerformers: [
        { name: "Alice", score: 98 },
        { name: "Bob", score: 92 },
        { name: "Carl", score: 89 },
      ],
    },
    Ankle: {
      score: 77,
      total: 100,
      rank: 28,
      totalUsers: 250,
      topPerformers: [
        { name: "Alice", score: 98 },
        { name: "Bob", score: 92 },
        { name: "Carl", score: 89 },
      ],
    },
    Elbow: {
      score: 93,
      total: 100,
      rank: 5,
      totalUsers: 250,
      topPerformers: [
        { name: "Alice", score: 98 },
        { name: "Bob", score: 92 },
        { name: "Carl", score: 89 },
      ],
    },
    Spine: {
      score: 81,
      total: 100,
      rank: 19,
      totalUsers: 250,
      topPerformers: [
        { name: "Alice", score: 98 },
        { name: "Bob", score: 92 },
        { name: "Carl", score: 89 },
      ],
    },
  },
  topPerformers: [
    { name: "Alice", score: 98 },
    { name: "Bob", score: 92 },
    { name: "Carl", score: 89 },
  ],
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
    return {
      totalScore: 0,
      totalPossible: 0,
      avgRank: 0,
      totalUsers: 0,
      topPerformers: [],
    };
  }
  // Aggregate if multiple modules
  let totalScore = 0,
    totalPossible = 0,
    avgRank = 0,
    totalUsers = 0,
    topPerformers = [];
  filteredKeys.forEach((key) => {
    totalScore += user.modules[key].score;
    totalPossible += user.modules[key].total;
    avgRank += user.modules[key].rank;
    totalUsers = user.modules[key].totalUsers; // Assume same for all
    topPerformers = user.modules[key].topPerformers; // Use from first module
  });
  avgRank = Math.round(avgRank / filteredKeys.length);
  return {
    totalScore,
    totalPossible,
    avgRank,
    totalUsers,
    topPerformers,
  };
}

const progressPercentage = (user.points / user.totalPointsForNextBelt) * 100;

export default function ScoreBoard() {
  const userId = localStorage.getItem("userId");
  const [apiUserPoints, setApiUserPoints] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeArea, setActiveArea] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All");
  const [isMobile, setIsMobile] = useState(false);
  const cardData = getCardData(activeArea, activeLevel);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  // Detect mobile device

  useEffect(() => {
    async function fetchPoints() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://primerad-backend.onrender.com/api/assessments/getUserPoints?userId=${userId}`
        );
        const data = await res.json();
        setApiUserPoints(data.totalPoints); // ← extract totalPoints from response
      } catch (err) {
        console.error("Failed to fetch points", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPoints();
  }, [userId]);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const pointsToShow = apiUserPoints !== null ? apiUserPoints : 0;
  const progressPercentage = (pointsToShow / user.totalPointsForNextBelt) * 100;

  return (
    <>
      {isAuthenticated ? (
        <>
          <div
            className="scoreboard-flex-layout"
            style={{
              paddingTop: isMobile ? "100px" : "0",
              paddingLeft: isMobile ? "12px" : "0",
              paddingRight: isMobile ? "12px" : "0",
              overflow: "visible",
              height: "auto",
            }}
          >
            <aside
              className="left-side-nav"
              style={{
                width: isMobile ? "100%" : "260px",
                minWidth: isMobile ? "0" : "220px",
                margin: isMobile ? "0 0 20px 0" : "28px 0 0 10px",
                padding: isMobile ? "16px 12px" : "28px 24px 32px 24px",
                gap: isMobile ? "20px" : "36px",
                flexDirection: isMobile ? "column" : "column",
                position: "relative",
              }}
            >
              <div className="filter-group">
                <div
                  className="filter-title"
                  style={{
                    fontSize: isMobile ? "1rem" : "1.1rem",
                    marginBottom: isMobile ? "8px" : "12px",
                  }}
                >
                  Area
                </div>
                <div
                  className="filter-buttons"
                  style={{
                    gap: isMobile ? "8px 6px" : "12px 10px",
                  }}
                >
                  {AREAS.map((area) => (
                    <button
                      key={area}
                      className={
                        "filter-btn" + (activeArea === area ? " active" : "")
                      }
                      onClick={() => setActiveArea(area)}
                      style={{
                        padding: isMobile ? "6px 12px" : "8px 18px",
                        fontSize: isMobile ? "0.9rem" : "1rem",
                      }}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <div
                  className="filter-title"
                  style={{
                    fontSize: isMobile ? "1rem" : "1.1rem",
                    marginBottom: isMobile ? "8px" : "12px",
                  }}
                >
                  Level
                </div>
                <div
                  className="filter-buttons"
                  style={{
                    gap: isMobile ? "8px 6px" : "12px 10px",
                  }}
                >
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      className={
                        "filter-btn" + (activeLevel === level ? " active" : "")
                      }
                      onClick={() => setActiveLevel(level)}
                      style={{
                        padding: isMobile ? "6px 12px" : "8px 18px",
                        fontSize: isMobile ? "0.9rem" : "1rem",
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div
              className="scoreboard-new"
              style={{
                marginLeft: isMobile ? "0" : "0px",
                marginRight: isMobile ? "0" : "0",
              }}
            >
              <div
                className="header-new"
                style={{
                  marginTop: isMobile ? "20px" : "32px",
                  marginBottom: isMobile ? "30px" : "40px",
                }}
              >
                <div
                  className="user-name"
                  style={{
                    fontSize: isMobile ? "1.8rem" : "2.2rem",
                  }}
                >
                  {localStorage.getItem("username")}
                </div>
                <div
                  className="belt-points"
                  style={{
                    fontSize: isMobile ? "1rem" : "1.1rem",
                    marginBottom: isMobile ? "12px" : "18px",
                  }}
                >
                  <span className="belt">{user.belt}</span>
                  <span className="points">
                    {isLoading ? "Loading..." : pointsToShow ?? 0} pts
                  </span>
                </div>
                <div
                  className="progress-bar-wrap"
                  style={{
                    width: isMobile ? "90vw" : "60vw",
                    maxWidth: isMobile ? "400px" : "700px",
                    margin: isMobile ? "0 auto 8px auto" : "0 auto 10px auto",
                  }}
                >
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div
                  className="cup-animation"
                  style={{
                    margin: isMobile ? "20px 0 16px 0" : "32px 0 24px 0",
                    minHeight: isMobile ? "60px" : "80px",
                  }}
                >
                  <svg
                    className="cup-svg"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      width: isMobile ? "50px" : "60px",
                      height: isMobile ? "50px" : "60px",
                    }}
                  >
                    <ellipse cx="32" cy="60" rx="18" ry="4" fill="#E0C873" />
                    <path
                      d="M16 12C16 7.58172 19.5817 4 24 4H40C44.4183 4 48 7.58172 48 12V28C48 36.8366 40.8366 44 32 44C23.1634 44 16 36.8366 16 28V12Z"
                      fill="#FFD700"
                      stroke="#C9A100"
                      strokeWidth="2"
                    />
                    <rect
                      x="24"
                      y="44"
                      width="16"
                      height="8"
                      rx="4"
                      fill="#FFD700"
                      stroke="#C9A100"
                      strokeWidth="2"
                    />
                    <rect
                      x="28"
                      y="52"
                      width="8"
                      height="6"
                      rx="3"
                      fill="#FFD700"
                      stroke="#C9A100"
                      strokeWidth="2"
                    />
                    <path
                      d="M16 20C10 20 4 24 4 32C4 38 10 40 16 36"
                      stroke="#C9A100"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M48 20C54 20 60 24 60 32C60 38 54 40 48 36"
                      stroke="#C9A100"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
                <div
                  className="next-belt-info"
                  style={{
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    marginTop: isMobile ? "6px" : "8px",
                  }}
                >
                  Next: {user.nextBelt} ({user.pointsNeeded} pts needed)
                </div>
              </div>
              <div
                className="cards-row"
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "20px" : "32px",
                  marginTop: isMobile ? "40px" : "56px",
                  alignItems: isMobile ? "center" : "flex-start",
                  marginBottom: "2rem",
                }}
              >
                <div
                  className="card-new card-yellow"
                  style={{
                    minWidth: isMobile ? "280px" : "220px",
                    maxWidth: isMobile ? "320px" : "260px",
                    minHeight: isMobile ? "160px" : "180px",
                    padding: isMobile
                      ? "24px 16px 20px 16px"
                      : "28px 18px 22px 18px",
                  }}
                >
                  <div
                    className="card-icon"
                    style={{
                      fontSize: isMobile ? "2rem" : "2.2rem",
                      marginBottom: isMobile ? "8px" : "10px",
                    }}
                  >
                    ⭐
                  </div>
                  <div
                    className="card-title"
                    style={{
                      fontSize: isMobile ? "1rem" : "1.1rem",
                      marginBottom: isMobile ? "8px" : "10px",
                    }}
                  >
                    Total Score
                  </div>
                  <div
                    className="card-value"
                    style={{
                      fontSize: isMobile ? "1.2rem" : "1.4rem",
                      marginTop: isMobile ? "6px" : "8px",
                    }}
                  >
                    <b>{pointsToShow}/200</b>
                  </div>
                </div>
                <div
                  className="card-new card-blue"
                  style={{
                    minWidth: isMobile ? "280px" : "220px",
                    maxWidth: isMobile ? "320px" : "260px",
                    minHeight: isMobile ? "160px" : "180px",
                    padding: isMobile
                      ? "24px 16px 20px 16px"
                      : "28px 18px 22px 18px",
                  }}
                >
                  <div
                    className="card-icon"
                    style={{
                      fontSize: isMobile ? "2rem" : "2.2rem",
                      marginBottom: isMobile ? "8px" : "10px",
                    }}
                  >
                    🏅
                  </div>
                  <div
                    className="card-title"
                    style={{
                      fontSize: isMobile ? "1rem" : "1.1rem",
                      marginBottom: isMobile ? "8px" : "10px",
                    }}
                  >
                    Average Rank
                  </div>
                  <div
                    className="card-value"
                    style={{
                      fontSize: isMobile ? "1.2rem" : "1.4rem",
                      marginTop: isMobile ? "6px" : "8px",
                    }}
                  >
                    <b>
                      #{cardData.avgRank} out of {cardData.totalUsers}
                    </b>
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: isMobile ? 32 : 48,
                  width: "100%",
                  maxWidth: 700,
                  marginTop: "20px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: "20px",
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  padding: isMobile ? "18px 8px" : "28px 32px",
                }}
              >
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    textAlign: "left",
                    color: "#1976d2",
                    fontWeight: 700,
                    fontSize: isMobile ? 18 : 22,
                    marginBottom: 18,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(90deg, #FFD700 60%, #FFFACD 100%)",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      boxShadow: "0 2px 8px #FFD70044",
                      marginRight: 8,
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <ellipse cx="12" cy="22" rx="7" ry="2" fill="#E0C873" />
                      <path
                        d="M6 4C6 2.34315 7.34315 1 9 1H15C16.6569 1 18 2.34315 18 4V13C18 17.4183 14.4183 21 10 21C5.58172 21 2 17.4183 2 13V4Z"
                        fill="#FFD700"
                        stroke="#C9A100"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="9"
                        y="21"
                        width="6"
                        height="2"
                        rx="1"
                        fill="#FFD700"
                        stroke="#C9A100"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="11"
                        y="23"
                        width="2"
                        height="1"
                        rx="0.5"
                        fill="#FFD700"
                        stroke="#C9A100"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M6 7C2 7 0 9 0 13C0 16 2 17 6 15"
                        stroke="#C9A100"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <path
                        d="M18 7C22 7 24 9 24 13C24 16 22 17 18 15"
                        stroke="#C9A100"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  </span>
                  Top Performers
                </h3>
                <style>{`
                  @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  .top-performers-table-animate {
                    animation: fadeInUp 0.8s cubic-bezier(.4,2,.6,1);
                  }
                `}</style>
                <table
                  className="top-performers-table-animate"
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                    borderCollapse: "collapse",
                    fontSize: isMobile ? 14 : 16,
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f5f7fa" }}>
                      <th
                        style={{
                          padding: "10px 8px",
                          borderRadius: 8,
                          textAlign: "left",
                          color: "#1976d2",
                          fontWeight: 600,
                        }}
                      >
                        Rank
                      </th>
                      <th
                        style={{
                          padding: "10px 8px",
                          borderRadius: 8,
                          textAlign: "left",
                          color: "#1976d2",
                          fontWeight: 600,
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          padding: "10px 8px",
                          borderRadius: 8,
                          textAlign: "left",
                          color: "#1976d2",
                          fontWeight: 600,
                        }}
                      >
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Alice", score: 98 },
                      { name: "Bob", score: 92 },
                      { name: "Carl", score: 89 },
                      { name: "David", score: 87 },
                      { name: "Eva", score: 85 },
                      { name: "Frank", score: 83 },
                      { name: "Grace", score: 81 },
                      { name: "Helen", score: 80 },
                      { name: "Ivy", score: 78 },
                      { name: "Jack", score: 76 },
                    ].map((p, idx) => (
                      <tr
                        key={p.name}
                        style={{
                          background: idx % 2 === 0 ? "#f9fbfc" : "#fff",
                        }}
                      >
                        <td
                          style={{
                            padding: "10px 8px",
                            fontWeight: 600,
                            color:
                              idx === 0
                                ? "#FFD700"
                                : idx === 1
                                ? "#C0C0C0"
                                : idx === 2
                                ? "#CD7F32"
                                : "#1976d2",
                          }}
                        >
                          {idx + 1}
                        </td>
                        <td style={{ padding: "10px 8px", fontWeight: 500 }}>
                          {p.name}
                        </td>
                        <td style={{ padding: "10px 8px", fontWeight: 500 }}>
                          {p.score}/100
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{
            minHeight: "100vh",
            textAlign: "center",
            backgroundColor: "#f0f8ff",
            paddingTop: "100px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <h2
            style={{
              color: "navy",
              fontSize: window.innerWidth <= 768 ? "24px" : "32px",
              fontFamily: "monospace",
              marginBottom: "20px",
            }}
          >
            Login to attempt many Assessments and win big
          </h2>
          <Button
            variant="primary"
            onClick={() => navigate("/login")}
            className="mt-3"
            style={{
              borderRadius: "25px",
              padding: window.innerWidth <= 768 ? "8px 20px" : "10px 25px",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              fontSize: window.innerWidth <= 768 ? "14px" : "16px",
            }}
          >
            Login
          </Button>
        </div>
      )}
    </>
  );
}
