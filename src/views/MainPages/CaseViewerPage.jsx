import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LatestMovies from "../../components/sections/LatestMovies";

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
  // Token and refresh logic
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem("dicom_refresh_token") || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyId, setStudyId] = useState(null);
  const dicomName = "Anonymized00098"; // Set your DICOM name here

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
        {/* Left: Observations Form */}
        <div
          className="observations-form-panel" // Add a class for global styles
          style={{
            flex: 1,
            borderRight: `1px solid ${THEME.border}`,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            background: THEME.card,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            borderRadius: "16px 0 0 16px",
            margin: 24,
            marginRight: 0,
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
                  borderRadius: "0 0 16px 0",
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
                      onClick={() => {
                        // Handle watch video
                        console.log("Watch video clicked");
                      }}
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
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: DICOM Viewer */}
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
            borderRadius: "0 16px 16px 0",
            margin: 24,
            marginLeft: 0,
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
      </div>

      {/* More DICOM Cases Section - now below the main flex row */}
      <div
        ref={moreCasesRef}
        style={{
          width: "100%",
          background: THEME.background,
          padding: "48px 0 32px 0",
          marginTop: 0,
        }}
      >
        <LatestMovies
          title="Recommended Dicom Cases"
          dicomCases={casesToDisplay} // Pass filtered cases
        />
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

            {/* Observations Summary */}
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: 12,
                padding: 20,
                marginBottom: 24,
                border: "1px solid #e9ecef",
              }}
            >
              <h3
                style={{
                  color: THEME.text,
                  fontWeight: 600,
                  fontSize: 16,
                  marginBottom: 12,
                }}
              >
                Your Observations Summary:
              </h3>
              <div style={{ fontSize: 14, color: "#666" }}>
                {Object.entries(observations).map(([key, value]) => {
                  const sectionNames = {
                    medialMeniscus: "1. Medial meniscus",
                    medialCartilage: "2. Medial cartilage",
                    lateralMeniscus: "3. Lateral meniscus",
                    lateralCartilage: "4. Lateral cartilage",
                  };
                  return (
                    <div
                      key={key}
                      style={{
                        marginBottom: 8,
                        padding: "8px 12px",
                        background: value ? "#e3f2fd" : "#fff3cd",
                        borderRadius: 6,
                        border: `1px solid ${value ? "#bbdefb" : "#ffeaa7"}`,
                      }}
                    >
                      <strong style={{ color: THEME.text }}>
                        {sectionNames[key]}:
                      </strong>{" "}
                      <span style={{ color: value ? "#1976d2" : "#856404" }}>
                        {value
                          ? `"${value.substring(0, 50)}${
                              value.length > 50 ? "..." : ""
                            }"`
                          : "No comments provided"}
                      </span>
                    </div>
                  );
                })}
              </div>
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
                padding: "24px 32px",
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

            .observations-form-panel {
              margin: 0 0 24px 0; /* Remove right margin, add bottom margin */
              border-radius: 16px; /* Full border-radius when stacked */
              max-width: 100%; /* Take full width */
              min-width: unset; /* Remove min-width constraint */
            }

            .dicom-viewer-panel {
              margin: 0; /* Remove left margin when stacked */
              border-radius: 16px; /* Full border-radius when stacked */
              padding: 24px; /* Adjust padding */
              flex: unset; /* Remove flex sizing */
              width: 100%; /* Take full width */
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

            .observations-form-panel, .dicom-viewer-panel {
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
