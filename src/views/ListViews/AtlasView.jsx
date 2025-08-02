// AtlasView.jsx
import "./AtlasView.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// Static module assets and icons (these can remain static if not dynamic from API)
const moduleAssets = {
  Knee: "/assets/images/knee1.jpg",
  Shoulder: "/assets/images/rotator-cuff.jpg",
  Spine: "/assets/images/spine.jpg",
  Ankle: "/assets/images/ankle.jpg",
  Elbow: "/assets/images/elbow.jpg",
  Hip: "/assets/images/hip.jpg",
};

const moduleIcons = {
  Knee: "🦵",
  Shoulder: "💪",
  Spine: "🦴",
  Ankle: "🦶",
  Elbow: "💪",
  Hip: "🦵",
};

const AtlasView = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [modulesData, setModulesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:5000/api/modules/modules-with-pathology-count"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setModulesData(response.data.data);
        } else {
          setModulesData([]);
          console.warn(
            "API returned unexpected data structure for modules:",
            response.data
          );
        }
      } catch (err) {
        console.error("Error fetching modules with pathology count:", err);
        setError("Failed to load modules. Please try again later.");
        setModulesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleCardClick = (moduleName, moduleId) => {
    navigate(`/atlas/${moduleName.toLowerCase()}`, {
      state: { moduleId: moduleId, moduleName: moduleName },
    });
  };

  return (
    <div
      className="atlas-view-container"
      style={{ boxSizing: "border-box", overflowX: "hidden" }}
    >
      <div className="atlas-header advanced-bg">
        <h1>Atlas of Modules</h1>
        <p>Select a module to explore lectures, cases, and live programs.</p>
      </div>

      {loading && (
        <div
          className="loading-message"
          style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "1.2rem",
            color: "#666",
          }}
        >
          Loading modules...
        </div>
      )}

      {error && (
        <div
          className="error-message"
          style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "1.2rem",
            color: "red",
          }}
        >
          Error: {error}
        </div>
      )}

      {!loading && !error && modulesData.length === 0 && (
        <div
          className="no-data-message"
          style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "1.2rem",
            color: "#888",
          }}
        >
          No modules found. Please add modules to the backend.
        </div>
      )}

      {!loading && !error && modulesData.length > 0 && (
        <div className="atlas-grid">
          {modulesData.map((mod) => {
            const isActive = hovered === mod.moduleName;
            const pathologiesToDisplay = mod.randomPathologyNames || [];

            return (
              <div
                className={`atlas-card advanced${isActive ? " expanded" : ""}`}
                key={mod._id}
                tabIndex={0}
                role="button"
                aria-label={`Open ${mod.moduleName} module`}
                onClick={() => handleCardClick(mod.moduleName, mod._id)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  handleCardClick(mod.moduleName, mod._id)
                }
                onMouseEnter={() => setHovered(mod.moduleName)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(mod.moduleName)}
                onBlur={() => setHovered(null)}
              >
                <div className="atlas-card-img">
                  <span className="atlas-card-icon">
                    {moduleIcons[mod.moduleName] || "📚"}
                  </span>
                </div>
                <h2>{mod.moduleName}</h2>
                <p>{mod.totalPathologiesCount} pathologies</p>
                {isActive && (
                  <div className="atlas-pathology-list">
                    {pathologiesToDisplay.map((p, i) => (
                      <div className="atlas-pathology-item" key={i}>
                        {p}
                      </div>
                    ))}
                    <button
                      className="atlas-viewall-btn"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        // MODIFIED: Pass mod._id to handleCardClick
                        handleCardClick(mod.moduleName, mod._id);
                      }}
                    >
                      View All
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AtlasView;
