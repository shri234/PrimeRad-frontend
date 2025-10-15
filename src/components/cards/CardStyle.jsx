import { Fragment, memo } from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./CardStyle.css";

const CardStyle = memo(
  ({
    title,
    movieTime,
    watchlistLink,
    link,
    image,
    level,
    category,
    isFree,
    status,
    tags,
    difficulty,
    instructor,
    sectionType,
    onCardClick,
    cardData,
  }) => {
    const { t } = useTranslation();

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
          className={`iq-card card-hover medical-case-card ${
            !onCardClick ? "non-clickable" : ""
          }`}
          onClick={onCardClick ? () => onCardClick(cardData) : undefined}
        >
          <div className="card-image-container">
            <img src={image} alt={title} className="img-fluid w-100 h-100" />

            <div className="card-status-badge-container">
              <span className="card-status-badge">
                <img src="/assets/images/live.png" alt="status icon" />
                {isFree === true ? "Free" : "Pro"}
              </span>
            </div>

            <div className="play-button-overlay">
              <div className="play-button-circle">
                <i className="fas fa-play"></i>
              </div>
            </div>
          </div>

          <div className="card-content-container">
            <div className="rating-review">
              <StarRateIcon className="star-icon" />
              <span>4.6</span>
              <span className="viewer-count">1k+ viewers</span>
            </div>

            <div className="card-title-normal">
              <h5 className="case-title">{title}</h5>

              <div className="card-badge-container">
                {sectionType && (
                  <span className="card-badge section-type">{sectionType}</span>
                )}
                {category && (
                  <span className="card-badge category">{category}</span>
                )}
              </div>

              <div className="card-tags-mobile">
                {Array.isArray(tags) &&
                  tags.map((tag, idx) => (
                    <span key={idx} className="card-tag">
                      {tag}
                    </span>
                  ))}
              </div>
            </div>

            <Button className="button-card">Watch for free</Button>
          </div>
        </div>
      </Fragment>
    );
  }
);

CardStyle.displayName = "CardStyle";
export default CardStyle;
