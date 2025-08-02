import { Fragment, memo } from "react";

//react-router-dom Link is NOT used for the whole card click anymore
// import { Link } from "react-router-dom"; // REMOVED or comment out this line if only react-router-dom Link was here

// the hook
import { useTranslation } from "react-i18next";

const CardStyle = memo(
  ({
    title,
    movieTime,
    watchlistLink, // Keep if still used for a specific watchlist icon/button
    link, // This prop can now be considered redundant for direct navigation
    image,
    level,
    category,
    status,
    tags,
    difficulty,
    instructor,
    sectionType,
    onCardClick, // <--- NEW PROP
    cardData, // <--- NEW PROP: The full data object passed from parent
  }) => {
    const { t } = useTranslation();

    // Get status color (unchanged)
    const getStatusColor = (status) => {
      switch (status) {
        case "Free":
          return "#28a745";
        case "Premium":
          return "#ffc107";
        case "Locked":
          return "#dc3545";
        default:
          return "#6c757d";
      }
    };

    // Get level color (unchanged)
    const getLevelColor = (level) => {
      switch (level) {
        case "Beginner":
          return "#17a2b8";
        case "Intermediate":
          return "#fd7e14";
        case "Advanced":
          return "#dc3545";
        default:
          return "#6c757d";
      }
    };

    // Get difficulty color (unchanged)
    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case "Easy":
          return "#28a745";
        case "Medium":
          return "#ffc107";
        case "Hard":
          return "#dc3545";
        default:
          return "#6c757d";
      }
    };

    return (
      <Fragment>
        <div
          className="iq-card card-hover medical-case-card"
          onClick={onCardClick ? () => onCardClick(cardData) : undefined} // <--- NEW: onClick handler using cardData
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            minHeight: "360px",
            background: "#fff",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            cursor: onCardClick ? "pointer" : "default", // <--- Indicate clickability
          }}
        >
          {/* Image Container */}
          <div
            className="image-container"
            style={{
              position: "relative",
              height: "300px", // Fixed value
              overflow: "hidden",
            }}
          >
            <img
              src={image}
              alt={title}
              className="img-fluid w-100 h-100"
              style={{
                objectFit: "cover",
                borderRadius: "16px 16px 0 0",
                transition: "transform 0.3s ease",
              }}
            />
            {/* Module and section labels stacked at top right (unchanged) */}
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 4,
                zIndex: 2,
              }}
            >
              {category && (
                <span
                  style={{
                    background: "#1976d2",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    borderRadius: "8px",
                    padding: "2px 10px",
                    letterSpacing: "0.5px",
                    marginBottom: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  {category}
                </span>
              )}
              {sectionType && (
                <span
                  style={{
                    background: "#e0e7ef",
                    color: "#003366",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    borderRadius: "8px",
                    padding: "2px 10px",
                    letterSpacing: "0.5px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  {sectionType}
                </span>
              )}
            </div>

            {/* Play button overlay */}
            <div
              className="play-button-overlay"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 0,
                transition: "opacity 0.3s ease",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#333",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                <i className="fas fa-play"></i>
              </div>
            </div>
          </div>

          <div
            className="content-container"
            style={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "all 0.3s ease",
            }}
          >
            {/* Title Section (always visible by default, hidden on hover) */}
            <div className="card-title-normal" style={{ width: "100%" }}>
              <h5
                className="case-title"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "450",
                  lineHeight: "1",
                  color: "#2c3e50",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: "2",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {title}
              </h5>
              {/* Tags for Mobile (initially hidden on desktop, always shown on mobile) */}
              <div
                className="card-tags-mobile"
                style={{
                  display: "none", // Hidden by default on desktop
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "4px",
                  marginTop: "6px",
                }}
              >
                {Array.isArray(tags) &&
                  tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "#e0e7ef",
                        color: "#1976d2",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        borderRadius: "8px",
                        padding: "2px 8px",
                        display: "inline-block",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>

            {/* Faculty Info (initially hidden, shown on hover) */}
          </div>
        </div>
        <style jsx>{`
          .medical-case-card {
            cursor: pointer;
            min-height: 350px; /* Base min-height */
            height: auto; /* Allow height to adjust */
            transform: scale(1); /* Initial scale */
            transition: transform 0.3s ease, box-shadow 0.3s ease,
              min-height 0.3s ease; /* Add min-height to transition */
          }

          .medical-case-card:hover {
            transform: translateY(-5px); /* Lift slightly */
            min-height: 400px; /* Expand downward, assuming content fits */
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
            z-index: 2; /* Bring to front on hover */
          }

          .medical-case-card:hover .image-container img {
            filter: brightness(0.9);
          }

          .medical-case-card:hover .play-button-overlay {
            opacity: 1 !important;
          }

          .medical-case-card .content-container {
            opacity: 1; /* Always visible */
            transition: opacity 0.3s ease;
          }

          /* Default desktop state */
          .medical-case-card .card-title-normal {
            display: block; /* Title is shown */
          }
          .medical-case-card .card-tags-mobile {
            display: none; /* Tags are hidden */
          }
          .medical-case-card .faculty-info {
            display: none; /* Faculty is hidden */
          }

          /* Hover state for desktop */
          .medical-case-card:hover .card-title-normal {
            display: block !important; /* Hide title */
          }
          .medical-case-card:hover .card-tags-mobile {
            display: flex !important; /* Show tags on hover */
          }
          .medical-case-card:hover .faculty-info {
            display: flex !important; /* Show faculty on hover */
          }

          /* Mobile Responsive - Always show title and tags, hide faculty */
          @media (max-width: 768px) {
            .medical-case-card {
              min-height: 340px; /* Adjust min-height for mobile */
              max-height: 380px; /* Adjust max-height for mobile */
              transform: none !important; /* Disable hover transform on touch devices */
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important; /* Reset hover shadow */
            }

            .medical-case-card .image-container {
              height: 150px; /* Adjust image height for mobile */
            }

            .medical-case-card .play-button-overlay {
              opacity: 1 !important; /* Always show play button on mobile */
            }

            .medical-case-card .content-container .faculty-info {
              display: none !important; /* Always hide faculty on mobile */
            }
            .medical-case-card .content-container > .card-title-normal {
              display: block !important; /* Always show title on mobile */
            }
            .medical-case-card .content-container .card-tags-mobile {
              display: flex !important; /* Always show tags on mobile */
            }
          }

          @media (max-width: 576px) {
            .medical-case-card {
              min-height: 320px;
              max-height: 360px;
            }

            .medical-case-card .image-container {
              height: 140px;
            }

            .medical-case-card .content-container {
              padding: 10px;
            }
          }

          @media (hover: none) {
            .medical-case-card:hover {
              transform: none;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }

            .medical-case-card:hover .image-container img {
              transform: none;
            }

            .medical-case-card:hover .play-button-overlay {
              opacity: 0 !important;
            }
          }
        `}</style>
      </Fragment>
    );
  }
);

CardStyle.displayName = "CardStyle";
export default CardStyle;
