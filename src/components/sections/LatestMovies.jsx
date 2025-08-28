import { Fragment, useState, useEffect, useCallback } from "react"; // Added useCallback
import SectionSlider from "../slider/SectionSlider";
import CardStyle from "../../components/cards/CardStyle";
import { useTranslation } from "react-i18next";
import { getRandomImage } from "../../utilities/random-image";
import { useNavigate } from "react-router-dom"; // <--- Import useNavigate

const LatestMovies = (props) => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // <--- Initialize useNavigate

  // Common function to calculate time ago (optional, but good for consistency)
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

  // --- Data fetching functions (wrapped in useCallback for stability) ---

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(
        "https://primerad-backend.onrender.com/api/sessions/getTopWatchedSessions"
      );
      const data = await res.json();
      if (data?.data) {
        setSessions(data.data);
      }
    } catch (err) {
      console.error("Error fetching top watched sessions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecentItems = useCallback(async () => {
    try {
      const res = await fetch(
        "https://primerad-backend.onrender.com/api/sessions/getRecentItems"
      );
      const data = await res.json();
      if (data?.data) {
        setSessions(data.data);
      }
    } catch (err) {
      console.error("Error fetching recent items:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecommendedLectures = useCallback(async () => {
    try {
      const res = await fetch(
        "https://primerad-backend.onrender.com/api/sessions/getTopRatedLectures"
      );
      const data = await res.json();
      if (data?.data) {
        setSessions(data.data);
      }
    } catch (err) {
      console.error("Error fetching top rated lectures:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecommendedCases = useCallback(async () => {
    try {
      const res = await fetch(
        "https://primerad-backend.onrender.com/api/sessions/getTopRatedCases"
      );
      const data = await res.json();
      if (data?.data) {
        setSessions(data.data);
      }
    } catch (err) {
      console.error("Error fetching top rated cases:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    if (props.title?.toLowerCase().includes("trending")) {
      fetchSessions();
    } else if (props.title?.toLowerCase().includes("recent")) {
      fetchRecentItems();
    } else if (props.title?.toLowerCase().includes("lectures")) {
      fetchRecommendedLectures();
    } else if (props.title?.toLowerCase().includes("cases")) {
      // Changed from if to else if
      fetchRecommendedCases();
    } else if (props.title?.toLowerCase().includes("live")) {
      // Changed from if to else if
      fetchRecommendedLectures();
    } else {
      setLoading(false); // No specific fetch for other titles, assume loaded
    }
  }, [
    props.title,
    fetchSessions,
    fetchRecentItems,
    fetchRecommendedLectures,
    fetchRecommendedCases,
  ]);

  const handleCardClick = useCallback(
    (cardData) => {
      if (
        cardData.contentType &&
        cardData.contentType.toLowerCase() === "case"
      ) {
        navigate(`/case/${cardData.id}`);
      } else if (
        cardData.contentType &&
        cardData.contentType.toLowerCase() === "lecture"
      ) {
        navigate("/lecture-detail", {
          state: {
            id: cardData.id,
            vimeoVideoId: cardData.vimeoVideoId,
            title: cardData.title,
            description: cardData.description,
            faculty: cardData.faculty,
            isFree: cardData.isFree,
            module: cardData.module,
            submodule: cardData.submodule,
            duration: cardData.duration,
            startDate: cardData.startDate,
            contentType: cardData.contentType,
          },
        });
      } else if (
        cardData.contentType &&
        cardData.contentType.toLowerCase() === "live"
      ) {
        navigate("/live", { state: cardData });
      }
    },
    [navigate]
  );

  if (props.onlyTitle) {
    return (
      <div style={{ padding: "24px 0" }}>
        <h5
          className="main-title text-capitalize mb-0"
          style={{
            color: "#003366",
            fontWeight: "bold",
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            marginLeft: "24px",
          }}
        >
          {props.title}
        </h5>
      </div>
    );
  }

  const listToRender = loading ? [] : sessions;

  return (
    <Fragment>
      <SectionSlider
        title={props.title}
        list={listToRender}
        className="latest-block streamit-block"
        slidesPerView={5}
        titleLink={
          props.title?.toLowerCase().includes("trending")
            ? "/trending-view-all"
            : props.title?.toLowerCase().includes("recent")
            ? "/recent-items-view-all"
            : props.title?.toLowerCase().includes("case")
            ? "/recommended-cases-view-all"
            : props.title?.toLowerCase().includes("live")
            ? "/upcoming-live-programs-view-all"
            : props.title?.toLowerCase().includes("lecture")
            ? "/recommended-lectures-view-all"
            : undefined
        }
        breakpoints={{
          0: {
            slidesPerView: 1, // 📱 Mobile: show 1
            slidesPerGroup: 1, // move 1 at a time
            pagination: { clickable: true },
          },
          768: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            pagination: false,
          },
          1024: {
            slidesPerView: 5, // 🖥 Desktop: show 5
            slidesPerGroup: 5,
          },
        }}
      >
        {(data, index) => {
          console.log(data);
          const card = {
            id: data._id,
            title: data.title,
            description: data.description,
            imageUrl:
              `https://primerad-backend.onrender.com${data.imageUrl_522x760}` ||
              `https://primerad-backend.onrender.com${data.imageUrl_1920x1080}`,
            imageUrl_1920x1080: data.imageUrl_1920x1080,
            sessionDuration: data.sessionDuration || "",
            difficulty: data.difficulty,
            moduleName: data.moduleName,
            isAssessment: data.isAssessment,
            isFree: data.isFree,
            startDate: data.startDate,
            vimeoVideoId: data.vimeoVideoId || null,
            faculty: data.faculty || "Unknown Faculty",
            subCategoryId: data.subCategoryId,
            sessionType: data.sessionType,
            image: data.imageUrl || getRandomImage(),
            movieTime: data.sessionDuration || "",
            level: data.difficulty,
            category: data.moduleName,
            status: data.isFree ? "Free" : "Locked",
            tags: data.tags || [], // Assuming tags might be present
            instructor: data.instructor, // Assuming instructor might be present

            contentType:
              data.sessionType === "Dicom"
                ? "Case"
                : data.sessionType === "Vimeo"
                ? "Lecture"
                : "live" || "Other", // Default to "Other" if type is unknown
          };

          return (
            <CardStyle
              image={card.imageUrl}
              title={card.title}
              movieTime={card.movieTime}
              watchlistLink="/playlist"
              link=""
              level={card.level}
              category={card.category}
              status={card.status}
              tags={card.tags}
              difficulty={card.difficulty}
              instructor={card.instructor}
              sectionType={card.contentType}
              onCardClick={() => handleCardClick(card)}
            />
          );
        }}
      </SectionSlider>
    </Fragment>
  );
};

LatestMovies.DisplayName = LatestMovies;
export default LatestMovies;
