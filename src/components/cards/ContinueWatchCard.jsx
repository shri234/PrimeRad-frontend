import { Fragment, memo, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ContinueWatchCard = memo(
  ({ imagePath, dataLeftTime, progressValue, title, sessionData }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    imagePath = `https://primerad-backend.onrender.com${imagePath}`;

    const handleClick = () => {
      navigate("/movies-detail", {
        state: {
          id: sessionData.sessionId,
          vimeoVideoId: sessionData.vimeoVideoId,
          title: sessionData.title || "Untitled Lecture",
          description: sessionData.description || "No description available.",
          faculty: sessionData.faculty || "Unknown Faculty",
          module: sessionData.module || "General",
          isFree: sessionData.isFree,
          submodule: sessionData.submodule || "General",
          duration: sessionData.duration || "N/A",
          startDate: sessionData.startDate,
          contentType: sessionData.contentType,
        },
      });
    };

    return (
      <Fragment>
        <div
          className="iq-watching-block"
          style={{
            position: "relative",
            cursor: "pointer",
            width: "100%",
            height: "100%",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick} // <-- navigate on click
        >
          <div className="block-images position-relative">
            <div
              className="iq-image-box overly-images"
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "8px",
              }}
            >
              <img
                src={imagePath}
                alt="content-thumbnail"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                  opacity: "0.8",
                }}
              />
              {isHovered && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "20px",
                    color: "#ffffff",
                    background: "rgba(0, 0, 0, 0.6)",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 8,
                    pointerEvents: "none",
                  }}
                >
                  <i className="fa-solid fa-play"></i>
                </div>
              )}
            </div>
            <div
              className="iq-preogress"
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                right: "10px",
                zIndex: 5,
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "white",
                  marginBottom: "5px",
                  display: "block",
                  textAlign: "right",
                }}
              >
                {dataLeftTime}
              </span>
              <ProgressBar
                now={progressValue}
                style={{
                  height: "4px",
                  backgroundColor: "rgba(255,255,255,0.3)",
                  borderRadius: "5px",
                  // color: "navy",
                }}
                variant="success"
              />
            </div>
          </div>
          {title && (
            <div
              style={{
                marginTop: 10,
                textAlign: "left",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#222",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                padding: "0 5px",
              }}
            >
              {title}
            </div>
          )}
        </div>
      </Fragment>
    );
  }
);

ContinueWatchCard.displayName = "ContinueWatchCard";

export default ContinueWatchCard;
