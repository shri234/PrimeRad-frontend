import {
  Fragment,
  memo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import ContinueWatchCard from "../cards/ContinueWatchCard";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/auth/selectors";

const ContinueWatching = memo(() => {
  const {
    id: sessionId,
    vimeoVideoId = null,
    title = "Untitled Lecture",
    description = "No description available.",
    faculty = "Unknown Faculty",
    module = "General",
    submodule = "General",
    duration = "N/A",
    startDate = null,
    contentType,
  } = location.state || {};
  const { t } = useTranslation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const carouselRef = useRef(null);

  const [firstVisibleIndex, setFirstVisibleIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(5);
  const [watching, setWatching] = useState([]); // now from API

  const cardGap = 20;
  const totalItems = watching.length;

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchWatchedSessions = async () => {
      try {
        const res = await fetch(
          `https://primerad-backend.onrender.com/api/sessions/getWatchedSessions?userId=${localStorage.getItem(
            "userId"
          )}`
        );
        const data = await res.json();

        if (data?.data) {
          console.log(data.data);
          const mapped = data.data.map((session) => ({
            image: session.imageUrl_1920x1080
              ? session.imageUrl_1920x1080
              : "/assets/images/default.jpg",
            value: session.playbackProgress
              ? Math.min(
                  Math.round(
                    (session.playbackProgress.currentTime /
                      (parseFloat(session.sessionDuration) * 60 || 1)) *
                      100
                  ),
                  100
                )
              : 0,
            leftTime: session.sessionDuration,
            id: session._id,
            title: session.title,
            sessionId: session._id,
            vimeoVideoId: session.vimeoVideoId,
            description: session.description,
            faculty: session.facultyName,
            module: session.moduleName,
            submodule: session.subModuleName,
            duration: session.sessionDuration,
            startDate: session.startDate,
            isFree: session.isFree,
            contentType:
              session.sessionType === "Dicom"
                ? "Case"
                : session.sessionType === "Vimeo"
                ? "Lecture"
                : session.sessionType || "Other",
          }));

          console.log(mapped);

          setWatching(mapped);
        }
      } catch (err) {
        console.error("Error fetching watched sessions:", err);
      }
    };

    fetchWatchedSessions();
  }, [isAuthenticated]);

  const handleClick = (session) => {
    navigate("/lecture-detail", {
      state: {
        id: session.sessionId,
        vimeoVideoId: session.vimeoVideoId,
        isFree: session.isFree,
        title: session.title,
        description: session.description || "No description available.",
        faculty: session.faculty || "Unknown Faculty",
        module: session.module || "General",
        submodule: session.submodule || "General",
        duration: session.duration || "N/A",
        startDate: session.startDate,
        contentType: session.contentType,
      },
    });
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1400) setCardsPerPage(6);
      else if (window.innerWidth >= 1200) setCardsPerPage(5);
      else if (window.innerWidth >= 992) setCardsPerPage(4);
      else if (window.innerWidth >= 768) setCardsPerPage(3);
      else if (window.innerWidth >= 576) setCardsPerPage(2);
      else setCardsPerPage(1);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll when index changes
  useEffect(() => {
    if (carouselRef.current && totalItems > 0) {
      const firstCard = carouselRef.current.children[0];
      if (!firstCard) return;
      const cardAndGapWidth = firstCard.offsetWidth + cardGap;
      carouselRef.current.scrollTo({
        left: firstVisibleIndex * cardAndGapWidth,
        behavior: "smooth",
      });
    }
  }, [firstVisibleIndex, cardsPerPage, cardGap, totalItems]);

  const handleNext = useCallback(() => {
    setFirstVisibleIndex((prev) =>
      Math.min(prev + cardsPerPage, totalItems - cardsPerPage)
    );
  }, [cardsPerPage, totalItems]);

  const handlePrev = useCallback(() => {
    setFirstVisibleIndex((prev) => Math.max(prev - cardsPerPage, 0));
  }, [cardsPerPage]);

  const canGoNext = firstVisibleIndex < totalItems - cardsPerPage;
  const canGoPrev = firstVisibleIndex > 0;

  if (!isAuthenticated || watching.length === 0) return null;

  return (
    <Fragment>
      <div
        className="continue-watching-block section-padding-top"
        style={{ position: "relative", padding: "88px 0" }}
      >
        <div
          className="container-fluid"
          style={{
            height: "100%",
          }}
        >
          <h2
            style={{
              fontWeight: 600,
              fontSize: window.innerWidth <= 468 ? 20 : 28,
              color: "darkslategrey",
              marginBottom: 36,
              textAlign: "left",
              paddingLeft: window.innerWidth <= 468 ? "18px" : "15px",
            }}
          >
            {t("ott_home.continue_watching")}
          </h2>

          <div style={{ position: "relative" }}>
            {/* Prev Arrow */}
            {totalItems > cardsPerPage && window.innerWidth > 468 && (
              <div
                onClick={canGoPrev ? handlePrev : null}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  cursor: canGoPrev ? "pointer" : "not-allowed",
                  backgroundColor: canGoPrev
                    ? "rgba(0,0,0,0.4)"
                    : "rgba(0,0,0,0.1)",
                  borderRadius: "50%",
                  width: "45px",
                  height: "45px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: canGoPrev ? "white" : "#999",
                  fontSize: "28px",
                }}
              >
                &#10094;
              </div>
            )}

            {/* Cards */}
            <div
              ref={carouselRef}
              style={{
                display: "flex",
                gap: `${cardGap}px`,
                overflowX: "auto",
                overflowY: "hidden",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollBehavior: "smooth",
                width: "100%",
                paddingBottom: "10px",
              }}
            >
              {watching.map((data, index) => (
                <div
                  key={index}
                  style={{
                    flexShrink: 0,
                    width: `calc((100% - ${
                      cardGap * (cardsPerPage - 1)
                    }px) / ${cardsPerPage})`,
                  }}
                >
                  <ContinueWatchCard
                    sessionData={data}
                    contentType={data.contentType}
                    category={data.module}
                    imagePath={data.image}
                    progressValue={data.value}
                    dataLeftTime={data.leftTime}
                    title={data.title}
                  />
                </div>
              ))}
            </div>

            {totalItems > cardsPerPage && window.innerWidth > 468 && (
              <div
                onClick={canGoNext ? handleNext : null}
                style={{
                  position: "absolute",
                  right: "0px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  cursor: canGoNext ? "pointer" : "not-allowed",
                  backgroundColor: canGoNext
                    ? "rgba(0,0,0,0.4)"
                    : "rgba(0,0,0,0.1)",
                  borderRadius: "50%",
                  width: "45px",
                  height: "45px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: canGoNext ? "white" : "#999",
                  fontSize: "28px",
                }}
              >
                &#10095;
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
});

ContinueWatching.displayName = "ContinueWatching";
export default ContinueWatching;
