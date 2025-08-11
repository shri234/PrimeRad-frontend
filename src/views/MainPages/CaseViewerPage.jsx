import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LatestMovies from "../../components/sections/LatestMovies";
import { Row, Col, Container, Nav, Tab, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Sources from "../../components/Sources";
import ReviewComponent from "../../components/ReviewComponent";
import { FaGraduationCap, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../store/auth/selectors";
import { FixedBackButton } from "../../utilities/BackButton";

const CORS_PROXY = "https://corsproxy.io/?";
const DICOM_AUTH_URL = "http://localhost:5000/api/dicom-auth";
const DICOM_CLIENT_ID = "integration-vidocto-prime";
const DICOM_CLIENT_SECRET = "546969d3-c304-4156-aa32-a7d60a6c5bff";
const DICOM_USERNAME = "info@vidocto.com";
const DICOM_PASSWORD = "dic@vid123";
const DICOM_WORKSPACE_ID = 40426;

// THEME COLORS
const THEME = {
  primary: "#1976d2", // blue
  secondary: "#00bfae", // teal
  background: "#f4f8fb", // light blue/gray
  card: "#fff",
  accent: "#ffb300", // amber
  text: "#263238", // dark blue-gray
  border: "#e0e0e0",
};

const medicaiOrigin = "https://app.medicai.io";

const CaseViewerPage = () => {
  const { caseId } = useParams();
  const { t } = useTranslation();
  // Token and refresh logic
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem("dicom_refresh_token") || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyId, setStudyId] = useState(null);
  const [title, setTitle] = useState("Knee MRI Case");
  const [duration, setDuration] = useState("30 mins");
  const [description, setDescription] = useState("");
  const [module, setModule] = useState("Orthopedics");
  const [submodule, setSubmodule] = useState("Knee Pathology");
  const dicomName = "Anonymized00098"; // Set your DICOM name here
  const [showVideo, setShowVideo] = useState(false);
  const videoUrl = "https://player.vimeo.com/video/1102457741"; // Replace with your Vimeo video ID
  const [startDate, setStartDate] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const isAuthenticated = useSelector(selectIsAuthenticated); // Auth status from Redux
  const user = useSelector(selectUser);
  const [contentType, setContentType] = useState("dicom");

  // In an useEffect hook, you would set the startDate after fetching the data.
  // For now, you can just define a placeholder.
  useEffect(() => {
    // This is just a placeholder, you would replace it with your actual data fetch.
    setStartDate("2025-07-15T10:00:00Z");
  }, []);
  // Helper to save tokens
  const saveTokens = (access, refresh) => {
    setToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("dicom_access_token", access);
    if (refresh) localStorage.setItem("dicom_refresh_token", refresh);
  };

  // Observation form state
  const [observations, setObservations] = useState({
    medialMeniscus: "",
    medialCartilage: "",
    lateralMeniscus: "",
    lateralCartilage: "",
  });
  const [observationsSubmitted, setObservationsSubmitted] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // State for responsive display of DICOM cases
  const [displayCaseCount, setDisplayCaseCount] = useState(5);

  const handleObservationChange = (field, value) => {
    setObservations((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      const options = { year: "numeric", month: "short", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  }, []);

  const handleSubmitObservations = (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmission = () => {
    // Save observations to localStorage or send to backend
    localStorage.setItem(
      `case_${caseId}_observations`,
      JSON.stringify(observations)
    );
    setObservationsSubmitted(true);
    setShowConfirmationModal(false);
  };

  const handleCancelSubmission = () => {
    setShowConfirmationModal(false);
  };

  const handleCompareObservations = () => {
    setShowComparisonModal(true);
  };

  const handleCloseComparisonModal = () => {
    setShowComparisonModal(false);
  };

  // Function to fetch Study ID
  async function getStudyId(accessToken, dicomName) {
    const url =
      "https://app.medicai.io/api/resources/my-drive?discriminator=STUDY&searchInTrash=false&size=500&page=0&sort=uploadedDate%2Cdesc";
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status}\nResponse: ${errorText}`);
    }

    console.log(response);
    const data = await response.json();
    if (!data.content || !Array.isArray(data.content)) {
      throw new Error("Invalid Response Structure: " + JSON.stringify(data));
    }
    const match = data.content.find(
      (item) => item.patient && item.patient.name === dicomName
    );
    return match ? match.id : null;
  }

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        // Try refresh token grant if available
        if (refreshToken) {
          const params = new URLSearchParams();
          params.append("grant_type", "refresh_token");
          params.append("refresh_token", refreshToken);
          params.append("client_id", DICOM_CLIENT_ID);
          params.append("client_secret", DICOM_CLIENT_SECRET);
          const response = await fetch(DICOM_AUTH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
          });
          data = await response.json();
          if (data.access_token) {
            saveTokens(data.access_token, data.refresh_token);
            setLoading(false);
            return;
          }
        }
        // Fallback to password grant
        const params = new URLSearchParams();
        params.append("grant_type", "password");
        params.append("client_id", DICOM_CLIENT_ID);
        params.append("client_secret", DICOM_CLIENT_SECRET);
        params.append("username", DICOM_USERNAME);
        params.append("password", DICOM_PASSWORD);
        params.append("scope", "orthanc:studies:dicom-web offline_access");
        const response = await fetch(DICOM_AUTH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
        data = await response.json();
        if (data.access_token) {
          saveTokens(data.access_token, data.refresh_token);
        } else {
          throw new Error(data.error_description || "Failed to fetch token");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (token) {
      // Fetch Study ID after token is available
      getStudyId(token, dicomName)
        .then((id) => setStudyId(id))
        .catch((err) => setError(err.message));
    }
    console.log(studyId);
    // eslint-disable-next-line
  }, [token]);

  const iframeRef = useRef(null); // Reference to the DICOM viewer iframe for sending authentication data
  const [authSent, setAuthSent] = useState(false);
  console.log(token);
  console.log(studyId, "stu");
  // Example: get these from your logic or props
  const dicom_caseId = null; // or a real caseId if you have one
  const workspaceId = 40426; // your workspaceId
  const accessToken = token; // from your auth logic
  const studyIds = studyId ? [studyId] : [];

  // Build authData
  const authData = dicom_caseId
    ? {
        type: "send-gallery-auth-data",
        workspaceId,
        caseId: dicom_caseId,
        accessToken,
      }
    : {
        type: "send-auth-data",
        workspaceId,
        studyIds,
        accessToken,
      };

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;

    function sendAuthData() {
      if (iframeRef.current && iframeRef.current.contentWindow && !authSent) {
        iframeRef.current.contentWindow.postMessage(authData, medicaiOrigin);
        setAuthSent(true);
        console.log("✅ Auth data sent:", authData);
      } else if (!authSent && retryCount < maxRetries) {
        console.warn(
          `⚠ Iframe not ready, retrying... (${retryCount + 1}/${maxRetries})`
        );
        retryCount++;
        setTimeout(sendAuthData, 2000);
      } else if (retryCount >= maxRetries) {
        console.error("❌ Max retries reached! Check iframe status.");
      }
    }

    // Send on iframe load
    const handleLoad = () => sendAuthData();
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleLoad);
    }

    // Try sending on mount and when authData changes
    sendAuthData();

    // Cleanup
    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleLoad);
      }
    };
    // eslint-disable-next-line
  }, [accessToken, studyId]);

  // Periodically resend authData if not sent
  useEffect(() => {
    if (authSent) return;
    const interval = setInterval(() => {
      if (accessToken && !authSent) {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(authData, medicaiOrigin);
          setAuthSent(true);
          console.log("✅ Sending Auth data!");
        }
      } else {
        console.warn("⚠ Unable to send Auth data! Retrying...");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [accessToken, studyId, dicom_caseId, authSent]);

  useEffect(() => {
    // This interval seems to be empty, so it won't do anything.
    // If it's intended to refresh tokens, the logic should be inside.
    const refreshInterval = setInterval(async () => {
      // Logic to refresh token here if needed
    }, 240000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!accessToken && iframeRef.current) {
        console.warn("⚠ Auth data missing, reloading iframe...");
        iframeRef.current.src = iframeRef.current.src;
      } else {
        console.log("✅ Token exists, no need to reload.");
      }
    }, 30000);
    return () => clearTimeout(timeout);
  }, [accessToken]);

  // Adjust number of displayed cases based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setDisplayCaseCount(3); // Show fewer on small screens
      } else if (window.innerWidth <= 1024) {
        setDisplayCaseCount(4); // Medium screens
      } else {
        setDisplayCaseCount(5); // Large screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call on mount to set initial count

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const viewerUrl = token
    ? `https://viewer.medicai.io/?token=${token}&caseId=${caseId}&workspaceId=${DICOM_WORKSPACE_ID}`
    : "";

  const navigate = useNavigate();
  const moreCasesRef = React.useRef(null);

  const dicomCases = [
    {
      id: 1,
      type: "ACL",
      category: "Knee",
      level: "Beginner",
      status: "Free",
      thumbnail: "/assets/images/continue-watch/01.jpg",
    },
    {
      id: 2,
      type: "ACL",
      category: "Knee",
      level: "Beginner",
      status: "Free",
      thumbnail: "/assets/images/continue-watch/02.jpg",
    },
    {
      id: 3,
      type: "Disc",
      category: "Hip",
      level: "Beginner",
      status: "Locked",
      thumbnail: "/assets/images/continue-watch/03.jpg",
    },
    {
      id: 4,
      type: "Disc",
      category: "Hip",
      level: "Beginner",
      status: "Free",
      thumbnail: "/assets/images/continue-watch/05.jpg",
    },
    {
      id: 5,
      type: "ACL",
      category: "Knee",
      level: "Beginner",
      status: "Free",
      thumbnail: "/assets/images/continue-watch/07.jpg",
    },
    {
      id: 6, // Added for potential larger screens
      type: "Meniscus",
      category: "Knee",
      level: "Intermediate",
      status: "Locked",
      thumbnail: "/assets/images/continue-watch/04.jpg",
    },
    {
      id: 7, // Added for potential larger screens
      type: "Rotator Cuff",
      category: "Shoulder",
      level: "Advanced",
      status: "Free",
      thumbnail: "/assets/images/continue-watch/06.jpg",
    },
  ];

  // Filter DICOM cases based on displayCaseCount
  const casesToDisplay = dicomCases.slice(0, displayCaseCount);

  // Scroll to more cases
  const handleScrollToCases = () => {
    if (moreCasesRef.current) {
      moreCasesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <FixedBackButton customPath="/main-page"></FixedBackButton>
      <div
        className="case-viewer-container" // Add a class for global styles
        style={{
          display: "flex",
          height: "calc(100vh - 64px)",
          marginTop: 64,
          background: THEME.background,
          flexDirection: "row", // Default for larger screens
        }}
      >
        {/* Left: DICOM Viewer */}
        <div
          className="dicom-viewer-panel" // Add a class for global styles
          style={{
            flex: 2,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            background: THEME.card,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            borderRadius: "16px 0 0 16px",
            margin: 24,
            marginRight: 0,
            minWidth: 0,
          }}
        >
          <h2
            style={{
              marginBottom: 24,
              color: THEME.primary,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            DICOM Viewer
          </h2>
          {loading && <p>Loading DICOM viewer...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          {!loading && !error && token && (
            <div
              style={{
                marginTop: 16,
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {studyId ? (
                <iframe
                  ref={iframeRef}
                  className="dicomview sessioniframe"
                  id={dicom_caseId ? "dicomcaseviewer" : "dicomviewer"}
                  src={`https://app.medicai.io/public-study/${studyId}`}
                  width="100%"
                  height="100%" // Use 100% height within its flex container
                  style={{ width: "100%", border: "none" }}
                  title="DICOM Viewer"
                />
              ) : (
                <div style={{ color: THEME.primary, fontWeight: 600 }}>
                  Study ID: Not found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Observations Form */}
        <div
          className="observations-form-panel" // Add a class for global styles
          style={{
            flex: 1,
            borderLeft: `1px solid ${THEME.border}`,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            background: THEME.card,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            borderRadius: "0 16px 16px 0",
            margin: 24,
            marginLeft: 0,
            minWidth: 320,
            maxWidth: 420,
            overflow: "hidden",
          }}
        >
          {/* Observations Header */}
          <div
            style={{
              background: THEME.primary,
              color: "#fff",
              padding: "20px 32px 12px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              borderBottom: `4px solid ${THEME.accent}`,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
              Your observations
            </div>
            <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>
              (On submitting your observations, you will be able to compare your
              observations with the faculty's observations along with an
              explanation video)
            </div>
          </div>

          {/* Observations Form */}
          <div
            style={{
              padding: 32,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              maxHeight: "calc(100vh - 64px - 90px)",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {!observationsSubmitted ? (
              <form
                onSubmit={handleSubmitObservations}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                {/* Section 1: Medial Meniscus */}
                <div style={{ marginBottom: 24 }}>
                  <h3
                    style={{
                      color: THEME.text,
                      fontWeight: 600,
                      fontSize: 16,
                      marginBottom: 12,
                    }}
                  >
                    1. Medial compartment: A) Medial meniscus
                  </h3>
                  <textarea
                    value={observations.medialMeniscus}
                    onChange={(e) =>
                      handleObservationChange("medialMeniscus", e.target.value)
                    }
                    placeholder="Add your comments"
                    style={{
                      width: "100%",
                      minHeight: 100,
                      padding: 12,
                      border: `1px solid ${THEME.border}`,
                      borderRadius: 8,
                      fontSize: 14,
                      fontFamily: "inherit",
                      resize: "vertical",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = THEME.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = THEME.border;
                    }}
                  />
                </div>

                {/* Section 2: Medial Cartilage */}
                <div style={{ marginBottom: 24 }}>
                  <h3
                    style={{
                      color: THEME.text,
                      fontWeight: 600,
                      fontSize: 16,
                      marginBottom: 12,
                    }}
                  >
                    2. Medial compartment: B) Medial femoral condyle and medial
                    tibial plateau cartilage
                  </h3>
                  <textarea
                    value={observations.medialCartilage}
                    onChange={(e) =>
                      handleObservationChange("medialCartilage", e.target.value)
                    }
                    placeholder="Add your comments"
                    style={{
                      width: "100%",
                      minHeight: 100,
                      padding: 12,
                      border: `1px solid ${THEME.border}`,
                      borderRadius: 8,
                      fontSize: 14,
                      fontFamily: "inherit",
                      resize: "vertical",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = THEME.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = THEME.border;
                    }}
                  />
                </div>

                {/* Section 3: Lateral Meniscus */}
                <div style={{ marginBottom: 24 }}>
                  <h3
                    style={{
                      color: THEME.text,
                      fontWeight: 600,
                      fontSize: 16,
                      marginBottom: 12,
                    }}
                  >
                    3. Lateral compartment: A) Lateral meniscus
                  </h3>
                  <textarea
                    value={observations.lateralMeniscus}
                    onChange={(e) =>
                      handleObservationChange("lateralMeniscus", e.target.value)
                    }
                    placeholder="Add your comments"
                    style={{
                      width: "100%",
                      minHeight: 100,
                      padding: 12,
                      border: `1px solid ${THEME.border}`,
                      borderRadius: 8,
                      fontSize: 14,
                      fontFamily: "inherit",
                      resize: "vertical",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = THEME.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = THEME.border;
                    }}
                  />
                </div>

                {/* Section 4: Lateral Cartilage */}
                <div style={{ marginBottom: 24 }}>
                  <h3
                    style={{
                      color: THEME.text,
                      fontWeight: 600,
                      fontSize: 16,
                      marginBottom: 12,
                    }}
                  >
                    4. Lateral compartment: B) Lateral femoral condyle and
                    lateral tibial plateau cartilage
                  </h3>
                  <textarea
                    value={observations.lateralCartilage}
                    onChange={(e) =>
                      handleObservationChange(
                        "lateralCartilage",
                        e.target.value
                      )
                    }
                    placeholder="Add your comments"
                    style={{
                      width: "100%",
                      minHeight: 100,
                      padding: 12,
                      border: `1px solid ${THEME.border}`,
                      borderRadius: 8,
                      fontSize: 14,
                      fontFamily: "inherit",
                      resize: "vertical",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = THEME.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = THEME.border;
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: 12,
                    padding: "12px 24px",
                    background: THEME.primary,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 16,
                    letterSpacing: 1,
                    boxShadow: "0 2px 8px rgba(25,118,210,0.15)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#1565c0";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(25,118,210,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = THEME.primary;
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 8px rgba(25,118,210,0.15)";
                  }}
                >
                  Submit Observations
                </button>
              </form>
            ) : (
              /* Confirmation Screen */
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                  animation: "fadeIn 0.7s",
                  background: "#f8f9fa",
                  borderRadius: "0 16px 16px 0",
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: "32px 24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    textAlign: "center",
                    maxWidth: 320,
                    width: "100%",
                  }}
                >
                  {/* Success Icon */}
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      background: "#00bfae",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      fontSize: 24,
                      color: "#fff",
                    }}
                  >
                    ✓
                  </div>

                  <h3
                    style={{
                      color: THEME.text,
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 8,
                    }}
                  >
                    Your observations are recorded
                  </h3>

                  <p
                    style={{
                      color: "#666",
                      fontSize: 14,
                      marginBottom: 24,
                    }}
                  >
                    You can now compare your observations with faculty feedback
                  </p>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <button
                      onClick={handleCompareObservations}
                      style={{
                        padding: "12px 20px",
                        background: "#00bfae",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#00a896";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#00bfae";
                      }}
                    >
                      COMPARE OBSERVATIONS
                    </button>

                    <button
                      onClick={() => setShowVideo(true)}
                      style={{
                        padding: "12px 20px",
                        background: "#00bfae",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        transition: "background 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#00a896";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#00bfae";
                      }}
                    >
                      ▶ WATCH VIDEO
                    </button>
                  </div>
                  {showVideo && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        marginTop: "35px",
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        overflow: "auto",
                        alignItems: "center",
                        zIndex: 10000,
                      }}
                    >
                      <iframe
                        src={videoUrl}
                        width="80%"
                        height="80%"
                        frameborder="0"
                        allow="autoplay; fullscreen"
                        allowfullscreen
                        title="Vimeo Video Player"
                      ></iframe>
                      <button
                        onClick={() => setShowVideo(false)}
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "20px",
                          background: "lightgray",
                          border: "none",
                          padding: "2px 6px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                        }}
                      >
                        X
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="details-part pt-4 px-4 px-md-0">
        <Container fluid>
          <Row>
            <Col lg="12">
              {/* Enhanced Header Section with Medical Theme */}
              <div
                className="trending-info pt-0 pb-4 mb-5 position-relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  borderRadius: "24px",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                  padding: "40px 35px",
                  border: "1px solid rgba(25, 118, 210, 0.1)",
                }}
              >
                {/* Medical Pattern Background */}
                <div
                  className="position-absolute"
                  style={{
                    top: 0,
                    right: 0,
                    width: "200px",
                    height: "200px",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231976d2' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    opacity: 0.3,
                  }}
                />

                <Row>
                  <Col md="12" className="mb-auto">
                    <div
                      className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-4"
                      style={{
                        justifyContent: "space-between",
                        gap: 20,
                      }}
                    >
                      <div className="flex-grow-1 p-2">
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: "48px",
                              height: "48px",
                              marginTop: "20px",
                              background:
                                "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                              borderRadius: "12px",
                              color: "white",
                              fontSize: "1.2rem",
                            }}
                          >
                            🏥
                          </div>
                          <div>
                            <h1
                              className="fw-bold mx-0"
                              style={{
                                color: "#1a202c",
                                fontSize: "2rem",
                                marginTop: "20px",
                                lineHeight: 1.2,
                                background: "darkslategrey",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                              }}
                            >
                              {t(title)}
                            </h1>
                          </div>
                        </div>
                      </div>

                      {/* Medical Status Badge */}
                      <div className="d-flex flex-column gap-2">
                        <div
                          className="badge d-flex align-items-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                            color: "white",
                            fontSize: "0.85rem",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontWeight: 600,
                            boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                          }}
                        >
                          <span className="me-2">✓</span>
                          {t("Medically Reviewed")}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Medical Information Grid */}
                    <div className="row g-4 mb-4">
                      <Col xs={12} md={6} lg={3}>
                        <div
                          className="p-3 h-100 d-flex align-items-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                            borderRadius: "16px",
                            border: "1px solid rgba(25, 118, 210, 0.2)",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              background:
                                "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                              borderRadius: "10px",
                              color: "white",
                              fontSize: "1rem",
                            }}
                          >
                            ⏱️
                          </div>
                          <div>
                            <div
                              className="small fw-semibold"
                              style={{
                                color: "#1976d2",
                                fontSize: "0.8rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {t("Duration")}
                            </div>
                            <div
                              className="fw-bold"
                              style={{
                                color: "#1a202c",
                                fontSize: "1.1rem",
                              }}
                            >
                              {duration}
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={12} md={6} lg={3}>
                        <div
                          className="p-3 h-100 d-flex align-items-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
                            borderRadius: "16px",
                            border: "1px solid rgba(156, 39, 176, 0.2)",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              background:
                                "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
                              borderRadius: "10px",
                              color: "white",
                              fontSize: "1rem",
                            }}
                          >
                            📅
                          </div>
                          <div>
                            <div
                              className="small fw-semibold"
                              style={{
                                color: "#9c27b0",
                                fontSize: "0.8rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {t("Published")}
                            </div>
                            <div
                              className="fw-bold"
                              style={{
                                color: "#1a202c",
                                fontSize: "1.1rem",
                              }}
                            >
                              {formatDate(startDate)}
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={12} md={6} lg={3}>
                        <div
                          className="p-3 h-100 d-flex align-items-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                            borderRadius: "16px",
                            border: "1px solid rgba(76, 175, 80, 0.2)",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              background:
                                "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                              borderRadius: "10px",
                              color: "white",
                              fontSize: "1rem",
                            }}
                          >
                            🏥
                          </div>
                          <div>
                            <div
                              className="small fw-semibold"
                              style={{
                                color: "#4caf50",
                                fontSize: "0.8rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {t("Medical Specialty")}
                            </div>
                            <div
                              className="fw-bold"
                              style={{
                                color: "#1a202c",
                                fontSize: "1.1rem",
                              }}
                            >
                              {t(module)}
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={12} md={6} lg={3}>
                        <div
                          className="p-3 h-100 d-flex align-items-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)",
                            borderRadius: "16px",
                            border: "1px solid rgba(255, 152, 0, 0.2)",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              background:
                                "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                              borderRadius: "10px",
                              color: "white",
                              fontSize: "1rem",
                            }}
                          >
                            🔬
                          </div>
                          <div>
                            <div
                              className="small fw-semibold"
                              style={{
                                color: "#ff9800",
                                fontSize: "0.8rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {t("Pathology Focus")}
                            </div>
                            <div
                              className="fw-bold"
                              style={{
                                color: "#1a202c",
                                fontSize: "1.1rem",
                              }}
                            >
                              {t(submodule)}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </div>

                    {/* Medical Accreditation Strip */}
                    <div
                      className="d-flex flex-wrap align-items-center justify-content-center gap-3 py-3 px-4"
                      style={{
                        background:
                          "linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)",
                        borderRadius: "16px",
                        border: "1px solid rgba(25, 118, 210, 0.1)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <span className="me-2" style={{ fontSize: "1.1rem" }}>
                          🏆
                        </span>
                        <small style={{ color: "#4a5568", fontWeight: 600 }}>
                          {t("AMA Approved")}
                        </small>
                      </div>
                      <div
                        style={{
                          width: "2px",
                          height: "20px",
                          background: "#e2e8f0",
                          borderRadius: "1px",
                        }}
                      />
                      <div className="d-flex align-items-center">
                        <span className="me-2" style={{ fontSize: "1.1rem" }}>
                          📋
                        </span>
                        <small style={{ color: "#4a5568", fontWeight: 600 }}>
                          {t("Evidence-Based")}
                        </small>
                      </div>
                      <div
                        style={{
                          width: "2px",
                          height: "20px",
                          background: "#e2e8f0",
                          borderRadius: "1px",
                        }}
                      />
                      <div className="d-flex align-items-center">
                        <span className="me-2" style={{ fontSize: "1.1rem" }}>
                          🔬
                        </span>
                        <small style={{ color: "#4a5568", fontWeight: 600 }}>
                          {t("Peer Reviewed")}
                        </small>
                      </div>
                      <div
                        style={{
                          width: "2px",
                          height: "20px",
                          background: "#e2e8f0",
                          borderRadius: "1px",
                        }}
                      />
                      <div className="d-flex align-items-center">
                        <span className="me-2" style={{ fontSize: "1.1rem" }}>
                          ⚕️
                        </span>
                        <small style={{ color: "#4a5568", fontWeight: 600 }}>
                          {t("Clinical Guidelines")}
                        </small>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Enhanced Tabbed Content with Medical Theme */}
              <div
                className="content-details trending-info position-relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  borderRadius: "24px",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                  padding: "35px",
                  marginBottom: "30px",
                  border: "1px solid rgba(25, 118, 210, 0.1)",
                }}
              >
                <div
                  className="position-absolute"
                  style={{
                    top: "-20px",
                    left: "-20px",
                    width: "100px",
                    height: "100px",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e3f2fd' fill-opacity='0.6'%3E%3Cpath d='M20 20.5V18h-2v2.5h-2.5v2H18v2.5h2V22.5h2.5v-2H20zM0 18.5V16h2v2.5h2.5v2H2v2.5H0V20.5h-2.5v-2H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    opacity: 0.7,
                  }}
                />

                <Tab.Container defaultActiveKey="first">
                  <Nav
                    className="nav-pills mb-5 position-relative"
                    style={{
                      background: THEME.softBlue, // Using a theme color
                      borderRadius: "20px",
                      padding: "8px",
                      gap: "6px",
                      flexWrap: "wrap",
                      border: "1px solid rgba(25, 118, 210, 0.2)",
                      boxShadow: "inset 0 2px 4px rgba(25, 118, 210, 0.1)",
                    }}
                  >
                    <Nav.Item className="flex-grow-1 flex-md-grow-0">
                      <Nav.Link
                        eventKey="first"
                        className="text-center py-3 px-4 position-relative"
                        style={{
                          borderRadius: "16px",
                          fontWeight: 700,
                          fontSize: "1rem",
                          border: "none",
                          transition: "all 0.3s ease",
                          overflow: "hidden",
                        }}
                      >
                        <div className="d-flex align-items-center text-black justify-content-center position-relative z-index-2">
                          <span className="me-2" style={{ fontSize: "1.1rem" }}>
                            📋
                          </span>
                          {t("Overview")}
                        </div>
                        <div
                          className="position-absolute top-0 start-0 w-100 h-100"
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "12px",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            zIndex: 1,
                          }}
                        />
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item className="flex-grow-1 flex-md-grow-0">
                      <Nav.Link
                        eventKey="second"
                        className="text-center py-3 px-4 position-relative"
                        style={{
                          borderRadius: "16px",
                          fontWeight: 700,
                          fontSize: "1rem",
                          border: "none",
                          transition: "all 0.3s ease",
                          overflow: "hidden",
                        }}
                      >
                        <div className="d-flex align-items-center text-black justify-content-center position-relative z-index-2">
                          <span className="me-2" style={{ fontSize: "1.1rem" }}>
                            📚
                          </span>
                          {t("Medical Resources")}
                        </div>
                        <div
                          className="position-absolute top-0 start-0 w-100 h-100"
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "12px",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            zIndex: 1,
                          }}
                        />
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item className="flex-grow-1 flex-md-grow-0">
                      <Nav.Link
                        eventKey="third"
                        className="text-center py-3 px-4 position-relative"
                        style={{
                          borderRadius: "16px",
                          fontWeight: 700,
                          fontSize: "1rem",
                          border: "none",
                          transition: "all 0.3s ease",
                          overflow: "hidden",
                        }}
                      >
                        <div className="d-flex align-items-center text-black justify-content-center position-relative z-index-2">
                          <span className="me-2" style={{ fontSize: "1.1rem" }}>
                            ⭐
                          </span>
                          {t("Reviews")}
                        </div>
                        <div
                          className="position-absolute top-0 start-0 w-100 h-100"
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "12px",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            zIndex: 1,
                          }}
                        />
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    {/* Clinical Overview Tab */}
                    <Tab.Pane className="fade show" eventKey="first">
                      <div
                        className="p-4"
                        style={{
                          background:
                            "linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)",
                          borderRadius: "20px",
                          border: "1px solid rgba(25, 118, 210, 0.1)",
                        }}
                      >
                        <div className="d-flex align-items-center mb-4">
                          <div
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: "48px",
                              height: "48px",
                              background:
                                "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                              borderRadius: "12px",
                              color: "white",
                              fontSize: "1.2rem",
                            }}
                          >
                            🩺
                          </div>
                          <div>
                            <h4
                              className="fw-bold mb-1"
                              style={{ color: "#1a202c", fontSize: "1.4rem" }}
                            >
                              {t("Medical Summary")}
                            </h4>
                            <p
                              className="mb-0 small"
                              style={{ color: "#718096" }}
                            >
                              {t(
                                "Comprehensive clinical overview and learning objectives"
                              )}
                            </p>
                          </div>
                        </div>

                        <div
                          className="content-text"
                          style={{
                            lineHeight: 1.8,
                            fontSize: "1.1rem",
                            color: "#4a5568",
                            marginBottom: "24px",
                          }}
                        >
                          {description}
                        </div>

                        <div
                          className="p-4 mb-4"
                          style={{
                            background:
                              "linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)",
                            borderRadius: "16px",
                            border: "1px solid rgba(76, 175, 80, 0.2)",
                          }}
                        >
                          <h5
                            className="fw-bold mb-3 d-flex align-items-center"
                            style={{ color: "#2e7d32", fontSize: "1.2rem" }}
                          >
                            <span className="me-2">🎯</span>
                            {t("Learning Objectives")}
                          </h5>
                          <ul
                            className="mb-0"
                            style={{ color: "#4a5568", fontSize: "1rem" }}
                          >
                            <li className="mb-2">
                              {t(
                                "Understand fundamental clinical concepts and applications"
                              )}
                            </li>
                            <li className="mb-2">
                              {t("Apply evidence-based medical practices")}
                            </li>
                            <li className="mb-2">
                              {t(
                                "Develop critical thinking in diagnostic procedures"
                              )}
                            </li>
                            <li className="mb-0">
                              {t("Enhance patient care and safety protocols")}
                            </li>
                          </ul>
                        </div>

                        <div
                          className="p-4"
                          style={{
                            background:
                              "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                            borderRadius: "16px",
                            border: "1px solid rgba(255, 152, 0, 0.2)",
                          }}
                        >
                          <h5
                            className="fw-bold mb-3 d-flex align-items-center"
                            style={{ color: "#ef6c00", fontSize: "1.2rem" }}
                          >
                            <span className="me-2">⚠️</span>
                            {t("Important Clinical Notes")}
                          </h5>
                          <p
                            className="mb-0"
                            style={{ color: "#4a5568", fontSize: "1rem" }}
                          >
                            {t(
                              "This content is for educational purposes and should complement, not replace, clinical judgment and professional medical advice."
                            )}
                          </p>
                        </div>
                      </div>
                    </Tab.Pane>

                    {/* Medical Resources Tab */}
                    <Tab.Pane className="fade" eventKey="second">
                      <div
                        className="p-4"
                        style={{
                          background:
                            "linear-gradient(135deg, #f3e5f5 0%, #f8bbd9 100%)",
                          borderRadius: "20px",
                          border: "1px solid rgba(156, 39, 176, 0.1)",
                        }}
                      >
                        <div className="d-flex align-items-center mb-4">
                          <div
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: "48px",
                              height: "48px",
                              background:
                                "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
                              borderRadius: "12px",
                              color: "white",
                              fontSize: "1.2rem",
                            }}
                          >
                            📚
                          </div>
                          <div>
                            <h4
                              className="fw-bold mb-1"
                              style={{ color: "#1a202c", fontSize: "1.4rem" }}
                            >
                              {t("Medical Resources & References")}
                            </h4>
                            <p
                              className="mb-0 small"
                              style={{ color: "#718096" }}
                            >
                              {t(
                                "Supplementary materials and clinical references"
                              )}
                            </p>
                          </div>
                        </div>
                        <Sources />
                      </div>
                    </Tab.Pane>

                    {/* Clinical Reviews Tab */}
                    <Tab.Pane className="fade" eventKey="third">
                      <div
                        className="p-4"
                        style={{
                          background:
                            "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                          borderRadius: "20px",
                          border: "1px solid rgba(76, 175, 80, 0.1)",
                        }}
                      >
                        <div className="d-flex align-items-center mb-4">
                          <div
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: "48px",
                              height: "48px",
                              background:
                                "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                              borderRadius: "12px",
                              color: "white",
                              fontSize: "1.2rem",
                            }}
                          >
                            ⭐
                          </div>
                          <div>
                            <h4
                              className="fw-bold mb-1"
                              style={{ color: "#1a202c", fontSize: "1.4rem" }}
                            >
                              {t("Reviews & Feedback")}
                            </h4>
                            <p
                              className="mb-0 small"
                              style={{ color: "#718096" }}
                            >
                              {t(
                                "Peer reviews and educational effectiveness ratings"
                              )}
                            </p>
                          </div>
                        </div>
                        {/* Updated ReviewComponent usage */}
                        <ReviewComponent
                          itemId={sessionId}
                          isAuthenticated={isAuthenticated}
                          currentUserId={user?._id || user?.id || user?.userId} // Pass user ID to ReviewComponent
                          itemTitle={title}
                          itemType={contentType} // Pass content type to ReviewComponent
                        />
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Faculty/Cast Section */}
      <div className="cast-tabs pb-5 px-4 px-md-0">
        <Container fluid>
          <div
            className="content-details trending-info position-relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              borderRadius: "24px",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
              padding: "40px 35px",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "150px",
                height: "150px",
                background: "linear-gradient(135deg, #667eea20, #764ba220)",
                borderRadius: "50%",
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-30px",
                left: "-30px",
                width: "100px",
                height: "100px",
                background: "linear-gradient(135deg, #f093fb20, #f5576c20)",
                borderRadius: "50%",
                opacity: 0.5,
              }}
            />

            <Tab.Container defaultActiveKey="first">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                <div>
                  <h3
                    className="fw-bold mb-2"
                    style={{
                      color: "#1a202c",
                      fontSize: "2rem",
                      background:
                        "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {t("Meet Your Faculty")}
                  </h3>
                  <p
                    className="mb-0"
                    style={{
                      color: "#718096",
                      fontSize: "1.1rem",
                      fontWeight: 400,
                    }}
                  >
                    {t("Learn from industry experts and experienced educators")}
                  </p>
                </div>

                {/* Faculty Count Badge */}
                <div
                  className="d-flex align-items-center mt-3 mt-md-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    color: "white",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <FaGraduationCap className="me-2" />
                  {Array.isArray(faculty)
                    ? faculty.length
                    : faculty
                    ? 1
                    : 0}{" "}
                  {t("Faculty Member")}
                  {Array.isArray(faculty) && faculty.length !== 1
                    ? "s"
                    : ""}{" "}
                  {/* Corrected pluralization */}
                </div>
              </div>

              <Nav
                className="nav-pills mb-5 position-relative"
                style={{
                  background:
                    "linear-gradient(135deg, #ebf8ff 0%, #e6fffa 100%)",
                  borderRadius: "16px",
                  padding: "6px",
                  border: "1px solid rgba(102, 126, 234, 0.1)",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                }}
              >
                <Nav.Item className="flex-grow-1">
                  <Nav.Link
                    eventKey="first"
                    className="text-center py-3 px-4 position-relative"
                    style={{
                      borderRadius: "12px",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      border: "none",
                      background: "transparent",
                      color: "#2d3748",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center position-relative z-index-2">
                      <FaUser className="me-2" size={16} />
                      {t("Faculty Information")}
                    </div>
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "12px",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        zIndex: 1,
                      }}
                    />
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane className="fade show" eventKey="first">
                  {Array.isArray(faculty) && faculty.length > 0 ? (
                    <Swiper
                      slidesPerView={1}
                      loop={false}
                      modules={[Navigation]}
                      navigation={{
                        nextEl: ".swiper-button-next-custom",
                        prevEl: ".swiper-button-prev-custom",
                      }}
                      className="position-relative faculty-swiper"
                      style={{
                        padding: "20px 0",
                      }}
                      breakpoints={{
                        0: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 1, spaceBetween: 25 },
                        992: { slidesPerView: 1, spaceBetween: 30 },
                      }}
                    >
                      {faculty.map((member, index) => (
                        <SwiperSlide key={member._id || index}>
                          <div
                            className="faculty-card position-relative"
                            style={{
                              background:
                                "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                              borderRadius: "20px",
                              padding: "30px",
                              boxShadow:
                                "0 8px 25px rgba(0,0,0,0.06), 0 3px 10px rgba(0,0,0,0.03)",
                              border: "1px solid rgba(255,255,255,0.8)",
                              transition: "all 0.3s ease",
                              overflow: "hidden",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-5px)";
                              e.currentTarget.style.boxShadow =
                                "0 12px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 8px 25px rgba(0,0,0,0.06), 0 3px 10px rgba(0,0,0,0.03)";
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: "80px",
                                height: "80px",
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                                opacity: 0.1,
                              }}
                            />
                            <Row className="align-items-center">
                              <Col
                                xs={12}
                                md={4}
                                lg={3}
                                className="text-center mb-4 mb-md-0"
                              >
                                <div className="position-relative d-inline-block">
                                  <div
                                    className="faculty-image-container position-relative"
                                    style={{
                                      width: "120px",
                                      height: "120px",
                                      margin: "0 auto",
                                    }}
                                  >
                                    <img
                                      src={
                                        member.image
                                          ? `https://primerad-backend.onrender.com${member.image}`
                                          : generateImgPath(
                                              "/assets/images/faculty1.jpg"
                                            )
                                      }
                                      alt={`${member.name} profile`}
                                      className="img-fluid"
                                      loading="lazy"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                        border: "4px solid #ffffff",
                                        boxShadow:
                                          "0 8px 25px rgba(0,0,0,0.15)",
                                      }}
                                    />
                                    <div
                                      className="position-absolute"
                                      style={{
                                        bottom: "8px",
                                        right: "8px",
                                        width: "24px",
                                        height: "24px",
                                        backgroundColor: "#38a169",
                                        borderRadius: "50%",
                                        border: "3px solid white",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                      }}
                                    />
                                    <div
                                      className="position-absolute"
                                      style={{
                                        top: "-10px",
                                        right: "-10px",
                                        background:
                                          "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                        borderRadius: "12px",
                                        padding: "4px 8px",
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        color: "white",
                                        boxShadow:
                                          "0 4px 15px rgba(240, 147, 251, 0.4)",
                                      }}
                                    >
                                      ⭐ 4.9
                                    </div>
                                  </div>
                                </div>
                              </Col>

                              <Col xs={12} md={8} lg={9}>
                                <div className="faculty-info">
                                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                                    <div>
                                      <h4
                                        className="fw-bold mb-1"
                                        style={{
                                          color: "#1a202c",
                                          fontSize: "1.6rem",
                                        }}
                                      >
                                        <Link
                                          to="/faculty-detail" // Adjust this link to pass member._id if faculty-detail page is dynamic
                                          state={{
                                            facultyId: member._id,
                                            facultyName: member.name,
                                            facultyImage: member.image,
                                          }}
                                          style={{
                                            color: "inherit",
                                            textDecoration: "none",
                                            transition: "color 0.3s ease",
                                          }}
                                          onMouseEnter={(e) => {
                                            e.target.style.color = "#667eea";
                                          }}
                                          onMouseLeave={(e) => {
                                            e.target.style.color = "#1a202c";
                                          }}
                                        >
                                          {t(member.name || "Unknown Faculty")}
                                        </Link>
                                      </h4>
                                      <div className="d-flex align-items-center mb-2">
                                        <span
                                          className="badge me-2"
                                          style={{
                                            background:
                                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            fontSize: "0.8rem",
                                            padding: "6px 12px",
                                            borderRadius: "8px",
                                            fontWeight: 600,
                                          }}
                                        >
                                          {t("Senior Lecturer")}
                                        </span>
                                        <span
                                          className="badge"
                                          style={{
                                            background:
                                              "linear-gradient(135deg, #38a169 0%, #2f855a 100%)",
                                            fontSize: "0.8rem",
                                            padding: "6px 12px",
                                            borderRadius: "8px",
                                            fontWeight: 600,
                                          }}
                                        >
                                          {t("Verified Educator")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row g-3 mb-3">
                                    <div className="col-6 col-md-3">
                                      <div
                                        className="text-center p-3"
                                        style={{
                                          background:
                                            "linear-gradient(135deg, #ebf8ff 0%, #e6fffa 100%)",
                                          borderRadius: "12px",
                                          border:
                                            "1px solid rgba(102, 126, 234, 0.1)",
                                        }}
                                      >
                                        <div
                                          className="fw-bold mb-1"
                                          style={{
                                            fontSize: "1.3rem",
                                            color: "#1a202c",
                                          }}
                                        >
                                          156
                                        </div>
                                        <small
                                          style={{
                                            color: "#718096",
                                            fontSize: "0.8rem",
                                          }}
                                        >
                                          {t("Lectures")}
                                        </small>
                                      </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                      <div
                                        className="text-center p-3"
                                        style={{
                                          background:
                                            "linear-gradient(135deg, #f0fff4 0%, #f0f9ff 100%)",
                                          borderRadius: "12px",
                                          border:
                                            "1px solid rgba(56, 161, 105, 0.1)",
                                        }}
                                      >
                                        <div
                                          className="fw-bold mb-1"
                                          style={{
                                            fontSize: "1.3rem",
                                            color: "#1a202c",
                                          }}
                                        >
                                          4.9
                                        </div>
                                        <small
                                          style={{
                                            color: "#718096",
                                            fontSize: "0.8rem",
                                          }}
                                        >
                                          {t("Rating")}
                                        </small>
                                      </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                      <div
                                        className="text-center p-3"
                                        style={{
                                          background:
                                            "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
                                          borderRadius: "12px",
                                          border:
                                            "1px solid rgba(236, 72, 153, 0.1)",
                                        }}
                                      >
                                        <div
                                          className="fw-bold mb-1"
                                          style={{
                                            fontSize: "1.3rem",
                                            color: "#1a202c",
                                          }}
                                        >
                                          8+
                                        </div>
                                        <small
                                          style={{
                                            color: "#718096",
                                            fontSize: "0.8rem",
                                          }}
                                        >
                                          {t("Years Exp")}
                                        </small>
                                      </div>
                                    </div>
                                  </div>

                                  <p
                                    className="mb-3"
                                    style={{
                                      color: "#4a5568",
                                      fontSize: "1rem",
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {t(
                                      "Experienced educator with expertise in medical sciences and innovative teaching methodologies. Passionate about student success and industry-relevant curriculum development."
                                    )}
                                  </p>

                                  <div className="mb-3">
                                    <h6
                                      className="fw-semibold mb-2"
                                      style={{
                                        color: "#2d3748",
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      {t("Specializations")}:
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                      {[
                                        "Medical Imaging",
                                        "Diagnostic Radiology",
                                        "Patient Care",
                                        "Clinical Research",
                                      ].map((spec, index) => (
                                        <span
                                          key={index}
                                          className="badge"
                                          style={{
                                            background: `linear-gradient(135deg, ${
                                              index % 2 === 0
                                                ? "#667eea20, #764ba220"
                                                : "#f093fb20, #f5576c20"
                                            })`,
                                            color: "#4a5568",
                                            fontSize: "0.8rem",
                                            padding: "6px 12px",
                                            borderRadius: "8px",
                                            fontWeight: 500,
                                            border: `1px solid ${
                                              index % 2 === 0
                                                ? "#667eea30"
                                                : "#f093fb30"
                                            }`,
                                          }}
                                        >
                                          {t(spec)}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    // Empty State for no faculty found
                    <div
                      className="text-center py-5"
                      style={{
                        background:
                          "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
                        borderRadius: "16px",
                        border: "2px dashed #cbd5e0",
                      }}
                    >
                      <FaGraduationCap
                        size={48}
                        style={{ color: "#a0aec0", marginBottom: "16px" }}
                      />
                      <h5 style={{ color: "#4a5568", marginBottom: "8px" }}>
                        {t("No Faculty Information")}
                      </h5>
                      <p style={{ color: "#718096", marginBottom: 0 }}>
                        {t(
                          "Faculty details will be displayed here when available"
                        )}
                      </p>
                    </div>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </Container>
      </div>

      {/* More DICOM Cases Section - now below the main flex row */}
      <div
        data-aos="zoom-in"
        data-aos-duration="1000"
        style={{
          // background: sectionBg[1],
          padding: "48px 0",
          // height: "30%",
        }}
      >
        <LatestMovies title="Recommended Cases" />
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease-out",
          }}
          onClick={handleCancelSubmission}
        >
          <div
            className="confirmation-modal-content" // Add class for responsiveness
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "32px",
              maxWidth: 480,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              animation: "slideUp 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "linear-gradient(135deg, #1976d2, #00bfae)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 28,
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
                }}
              >
                ⚠️
              </div>
              <h2
                style={{
                  color: THEME.text,
                  fontWeight: 700,
                  fontSize: 24,
                  marginBottom: 8,
                }}
              >
                Confirm Submission
              </h2>
              <p
                style={{
                  color: "#666",
                  fontSize: 16,
                  lineHeight: 1.5,
                }}
              >
                Are you sure you want to submit your observations? This action
                cannot be undone.
              </p>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleCancelSubmission}
                style={{
                  padding: "12px 24px",
                  background: "#f8f9fa",
                  color: "#666",
                  border: "1px solid #dee2e6",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  minWidth: 120,
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#e9ecef";
                  e.target.style.borderColor = "#adb5bd";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#f8f9fa";
                  e.target.style.borderColor = "#dee2e6";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmission}
                style={{
                  padding: "12px 24px",
                  background: THEME.primary,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  minWidth: 120,
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow =
                    "0 6px 16px rgba(25, 118, 210, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(25, 118, 210, 0.3)";
                }}
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparisonModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease-out",
          }}
          onClick={handleCloseComparisonModal}
        >
          <div
            className="comparison-modal-content" // Add class for responsiveness
            style={{
              background: "#fff",
              borderRadius: 16,
              maxWidth: "95vw",
              maxHeight: "95vh",
              width: 1400,
              marginTop: "38px",
              height: "90vh",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              animation: "slideUp 0.3s ease-out",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "12px 10px",

                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8f9fa",
                color: "#495057",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: 24,
                  margin: 0,
                }}
              >
                Observations Comparison
              </h2>
              <button
                onClick={handleCloseComparisonModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "#495057",
                  fontSize: 24,
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none";
                }}
              >
                ×
              </button>
            </div>

            <div
              className="comparison-modal-body" // Add class for responsiveness
              style={{
                flex: 1,
                display: "flex",
                overflow: "hidden",
                flexDirection: "row", // Default for larger screens
              }}
            >
              {/* Left Column: Your Observations */}
              <div
                style={{
                  flex: 1,
                  padding: "32px",
                  borderRight: "1px solid #e0e0e0",
                  overflowY: "auto",
                }}
              >
                <h3
                  style={{
                    color: "#6c757d",
                    fontWeight: 700,
                    fontSize: 24,
                    marginBottom: 24,
                    textAlign: "center",
                  }}
                >
                  Your Observations
                </h3>

                {Object.entries(observations).map(([key, value]) => {
                  const sectionNames = {
                    medialMeniscus: "Medial compartment: A) Medial meniscus",
                    medialCartilage:
                      "Medial compartment: B) Medial femoral condyle and medial tibial plateau cartilage",
                    lateralMeniscus: "Lateral compartment: A) Lateral meniscus",
                    lateralCartilage:
                      "Lateral compartment: B) Lateral femoral condyle and lateral tibial plateau cartilage",
                  };

                  return (
                    <div
                      key={key}
                      style={{
                        marginBottom: 24,
                        padding: "20px",
                        background: value ? "#f8f9fa" : "#fff8e1",
                        borderRadius: 8,
                        border: `1px solid ${value ? "#e9ecef" : "#ffecb3"}`,
                      }}
                    >
                      <h4
                        style={{
                          color: "#495057",
                          fontWeight: 600,
                          fontSize: 16,
                          marginBottom: 12,
                        }}
                      >
                        {sectionNames[key]}
                      </h4>
                      <p
                        style={{
                          color: value ? "#6c757d" : "#8d6e63",
                          fontSize: 15,
                          lineHeight: 1.6,
                          margin: 0,
                          fontStyle: value ? "normal" : "italic",
                        }}
                      >
                        {value || "No observations recorded"}
                      </p>
                    </div>
                  );
                })}

                {/* Additional sections that weren't in the form but are in faculty observations */}
                {[
                  "Extensor mechanism (PF joint, tendons, ligaments, fat pad, any PF dysplasia features)",
                  "Cruciate ligaments",
                  "Collateral ligaments (medial and lateral; posterolateral and posteromedial corners)",
                ].map((section) => (
                  <div
                    key={section}
                    style={{
                      marginBottom: 24,
                      padding: "20px",
                      background: "#fff8e1",
                      borderRadius: 8,
                      border: "1px solid #ffecb3",
                    }}
                  >
                    <h4
                      style={{
                        color: "#495057",
                        fontWeight: 600,
                        fontSize: 16,
                        marginBottom: 12,
                      }}
                    >
                      {section}
                    </h4>
                    <p
                      style={{
                        color: "#8d6e63",
                        fontSize: 15,
                        lineHeight: 1.6,
                        margin: 0,
                        fontStyle: "italic",
                      }}
                    >
                      No observations recorded
                    </p>
                  </div>
                ))}
              </div>

              {/* Right Column: Faculty Observations */}
              <div
                style={{
                  flex: 1,
                  padding: "32px",
                  overflowY: "auto",
                }}
              >
                <h3
                  style={{
                    color: "#6c757d",
                    fontWeight: 700,
                    fontSize: 24,
                    marginBottom: 24,
                    textAlign: "center",
                  }}
                >
                  Faculty's Observations
                </h3>

                {/* Faculty observations data */}
                {[
                  {
                    section:
                      "Medial compartment (Medial meniscus Medial femoral condyle and medial tibial plateau cartilage)",
                    observation:
                      "Medial meniscal signal changes in body and posterior horn – degeneration and could represent some contusional change. No medial meniscal tear.",
                  },
                  {
                    section:
                      "Lateral compartment (Lateral meniscus Lateral femoral condyle and lateral tibial plateau cartilage)",
                    observation: "Intact lateral meniscus",
                  },
                  {
                    section:
                      "Extensor mechanism (PF joint, tendons, ligaments, fat pad, any PF dysplasia features)",
                    observation: "Intact.",
                  },
                  {
                    section: "Cruciate ligaments",
                    observation: "Intact.",
                  },
                  {
                    section:
                      "Collateral ligaments (medial and lateral; posterolateral and posteromedial corners)",
                    observation:
                      "The most striking feature is at the posterolateral/ lateral aspects of the knee where there is significant abnormality to the fibular collateral ligament which appears to be disrupted from its distal attachment region where it joins biceps femoris and there is oedema throughout the residual ligament (high-grade injury of the LCL and biceps femoris). The biceps femoris attachment shows signal changes in keeping with partial strain. Popliteus and iliotibial band are intact. There is associated soft tissue oedema in the posterolateral corner representing injury to the smaller ligaments (particularly popliteofibular). Focal bony edema is seen at lateral margin of tibial plateau in region of distal ALL.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: 24,
                      padding: "20px",
                      background: "#f1f8e9",
                      borderRadius: 8,
                      border: "1px solid #c8e6c9",
                    }}
                  >
                    <h4
                      style={{
                        color: "#495057",
                        fontWeight: 600,
                        fontSize: 16,
                        marginBottom: 12,
                      }}
                    >
                      {item.section}
                    </h4>
                    <p
                      style={{
                        color: "#558b2f",
                        fontSize: 15,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {item.observation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations and Responsive Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          /* Responsive Styles */

          /* Base styles for larger screens (1025px and up) - already mostly in JS inline styles */
          .case-viewer-container {
            padding: 0 24px; /* Add some horizontal padding to the main container */
          }

          /* Medium screens (769px to 1024px) */
          @media (max-width: 1024px) {
            .case-viewer-container {
              flex-direction: column;
              height: auto; /* Allow height to adjust */
              margin-top: 64px;
              padding: 24px; /* Uniform padding */
            }

            .dicom-viewer-panel {
              margin: 0 0 24px 0; /* Remove right margin, add bottom margin */
              border-radius: 16px; /* Full border-radius when stacked */
              max-width: 100%; /* Take full width */
              min-width: unset; /* Remove min-width constraint */
            }

            .observations-form-panel {
              margin: 0; /* Remove left margin when stacked */
              border-radius: 16px; /* Full border-radius when stacked */
              padding-left: 0; /* Reset padding */
              border-left: none; /* Remove left border when stacked */
              flex: unset; /* Remove flex sizing */
              width: 100%; /* Take full width */
              max-width: 100%; /* Override max-width constraint */
            }

            .dicom-viewer-panel h2 {
              font-size: 20px; /* Smaller heading */
            }

            .dicomview.sessioniframe {
              height: 400px !important; /* Adjust iframe height for medium screens */
            }

            .confirmation-modal-content, .comparison-modal-content {
                padding: 24px;
            }
          }

          /* Small screens (400px to 768px) */
          @media (max-width: 768px) {
            .case-viewer-container {
              padding: 16px; /* Smaller padding */
            }

            .dicom-viewer-panel, .observations-form-panel {
                margin: 0 0 16px 0; /* Even smaller margins */
                border-radius: 12px; /* Slightly smaller radius */
            }

            .observations-form-panel div:first-child { /* Header */
                padding: 16px 20px 8px 20px; /* Adjust header padding */
            }
            .observations-form-panel div:nth-child(2) { /* Form content */
                padding: 20px; /* Adjust form content padding */
            }

            .observations-form-panel div h3 {
                font-size: 15px; /* Smaller headings in form */
            }

            .observations-form-panel textarea,
            .observations-form-panel button {
                font-size: 13px; /* Smaller font sizes for form elements */
                padding: 10px;
            }

            .dicom-viewer-panel h2 {
              font-size: 18px; /* Even smaller heading */
              margin-bottom: 16px;
            }

            .dicomview.sessioniframe {
              height: 300px !important; /* Further adjust iframe height for small screens */
            }

            .confirmation-modal-content {
                width: 95%; /* Take more width on very small screens */
                padding: 20px;
            }
            .confirmation-modal-content h2 {
                font-size: 20px;
            }
            .confirmation-modal-content p {
                font-size: 14px;
            }
            .confirmation-modal-content button {
                padding: 10px 15px;
                font-size: 13px;
            }

            .comparison-modal-content {
                width: 98vw; /* Almost full width for comparison modal */
                height: 90vh; /* Max height */
                padding: 0; /* Remove padding around content within the modal */
                border-radius: 12px;
            }
            .comparison-modal-content > div:first-child { /* Modal header */
                padding: 16px 20px;
            }
            .comparison-modal-content > div:first-child h2 {
                font-size: 20px;
            }
            .comparison-modal-body {
                flex-direction: column; /* Stack columns inside comparison modal */
                overflow-y: auto; /* Enable scrolling for the whole body */
            }
            .comparison-modal-body > div { /* Both observation columns */
                border-right: none !important; /* Remove right border */
                border-bottom: 1px solid #e0e0e0; /* Add bottom border between stacked columns */
                padding: 20px; /* Adjust padding */
            }
            .comparison-modal-body > div:last-child {
                border-bottom: none; /* No bottom border for the last column */
            }
            .comparison-modal-body h3 {
                font-size: 20px;
            }
            .comparison-modal-body h4 {
                font-size: 14px;
            }
            .comparison-modal-body p {
                font-size: 13px;
            }
          }

          /* Extra-large screens (1401px to 1600px) - mostly using existing styles but could be enhanced */
          @media (min-width: 1401px) and (max-width: 1600px) {
            .case-viewer-container {
              max-width: 1500px; /* Constrain max-width for very wide screens */
              margin: 64px auto 0 auto; /* Center the container */
            }
            .observations-form-panel {
                max-width: 480px; /* Slightly wider form */
            }
            .dicom-viewer-panel {
                padding: 40px; /* More padding */
            }
          }
        `}
      </style>
    </>
  );
};

export default CaseViewerPage;
