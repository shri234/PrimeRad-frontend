import { Fragment, memo } from "react";
import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CardStyle from "../components/cards/CardStyle";
import BreadCrumbWidget from "../components/BreadcrumbWidget";
import { latestMovie } from "../StaticData/data";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FixedBackButton } from "../utilities/BackButton";

const RecentItemsViewAll = memo(() => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Cases");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTopRatedCases = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/sessions/getRecentItems"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setCases(response.data.data);
        } else {
          setCases([]);
          setError("Received unexpected data format from API.");
        }
      } catch (err) {
        console.error("Error fetching top rated cases:", err);
        setError("Failed to load recent items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedCases();
  }, []);

  const handleCardClick = useCallback(
    (cardData) => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (
        cardData.sessionType &&
        cardData.sessionType.toLowerCase() === "dicom"
      ) {
        navigate(`/case/${cardData.id}`);
      } else if (
        cardData.sessionType &&
        cardData.sessionType.toLowerCase() === "vimeo"
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

  const IMAGE_BASE_URL = "http://localhost:5000";

  const tabs = ["Cases", "Lectures", "Live"];

  const renderMobileCard = (item, index) => {
    const imageUrl = item.imageUrl_522x760 || item.imageUrl_1920x1080;
    const fullImageUrl = imageUrl
      ? `${IMAGE_BASE_URL}${imageUrl}`
      : "path/to/default/placeholder.jpg";

    return (
      <div
        key={item._id}
        style={{
          background: "white",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
          marginBottom: "16px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", padding: "16px" }}>
          {/* Thumbnail with play button */}
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "60px",
              borderRadius: "8px",
              overflow: "hidden",
              flexShrink: 0,
              background: "#f5f5f5",
            }}
          >
            <img
              src={fullImageUrl}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='60' viewBox='0 0 80 60'%3E%3Crect width='80' height='60' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='10' fill='%23999' text-anchor='middle' dy='.3em'%3EImage%3C/text%3E%3C/svg%3E";
              }}
            />
            {/* Play button overlay */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "4px solid transparent",
                  borderBottom: "4px solid transparent",
                  borderLeft: "6px solid #666",
                  marginLeft: "1px",
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              marginLeft: "16px",
              overflow: "hidden",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1a1a1a",
                margin: "0 0 4px 0",
                lineHeight: "1.3",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.moduleName || item.difficulty || "Medical Case Study"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <Fragment>
        <FixedBackButton customPath="/home" />

        {/* Mobile Header Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "20px 0 30px 0",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Container>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "white",
                  margin: "10px 0 12px 0",
                  letterSpacing: "-0.5px",
                }}
              >
                Trending
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: window.innerWidth <= 768 ? "1rem" : "1.2rem",
                  margin: 0,
                  lineHeight: "1.5",
                }}
              >
                Discover your recently viewed cases and continue your learning
                journey
              </p>
            </div>

            {/* Tab Navigation */}
            <div
              style={{
                display: "flex",
                background: "#f8f9fa",
                borderRadius: "12px",
                padding: "6px",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "8px",
                    background: activeTab === tab ? "white" : "transparent",
                    color: activeTab === tab ? "#1a1a1a" : "#666",
                    fontSize: "15px",
                    fontWeight: activeTab === tab ? "600" : "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow:
                      activeTab === tab ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </Container>
        </div>

        {/* Mobile Content Section */}
        <div
          style={{
            background: "#fafafa",
            minHeight: "calc(100vh - 200px)",
            padding: "20px 0 40px 0",
          }}
        >
          <Container>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "60px 20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid #f3f3f3",
                    borderTop: "3px solid #007bff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginBottom: "20px",
                  }}
                />
                <p style={{ fontSize: "16px", color: "#666", margin: 0 }}>
                  Loading recent items...
                </p>
              </div>
            ) : error ? (
              <div
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "40px 20px",
                  textAlign: "center",
                  maxWidth: "400px",
                  margin: "40px auto",
                  border: "1px solid #ffebee",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
                <h3
                  style={{
                    fontSize: "18px",
                    color: "#d32f2f",
                    marginBottom: "12px",
                    fontWeight: "600",
                  }}
                >
                  Something went wrong
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  {error}
                </p>
              </div>
            ) : cases.length === 0 ? (
              <div
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "60px 20px",
                  textAlign: "center",
                  maxWidth: "400px",
                  margin: "40px auto",
                }}
              >
                <div
                  style={{
                    fontSize: "64px",
                    marginBottom: "24px",
                    opacity: 0.6,
                  }}
                >
                  📚
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    color: "#1a1a1a",
                    marginBottom: "12px",
                    fontWeight: "600",
                  }}
                >
                  No Recent Items Yet
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  Start exploring cases to see them appear here
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "24px 16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                {activeTab === "Cases" && (
                  <>
                    {cases.map((item, index) => renderMobileCard(item, index))}
                    {cases.length === 0 && (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px 20px",
                          color: "#666",
                        }}
                      >
                        <p>No cases found in this category.</p>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "Lectures" && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      color: "#666",
                    }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "20px" }}>
                      🎥
                    </div>
                    <h3
                      style={{
                        fontSize: "18px",
                        marginBottom: "12px",
                        color: "#1a1a1a",
                      }}
                    >
                      Lectures Coming Soon
                    </h3>
                    <p style={{ fontSize: "14px", margin: 0 }}>
                      We're working on bringing you the best lecture content.
                    </p>
                  </div>
                )}

                {activeTab === "Live" && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      color: "#666",
                    }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "20px" }}>
                      🔴
                    </div>
                    <h3
                      style={{
                        fontSize: "18px",
                        marginBottom: "12px",
                        color: "#1a1a1a",
                      }}
                    >
                      Live Sessions Coming Soon
                    </h3>
                    <p style={{ fontSize: "14px", margin: 0 }}>
                      Join live interactive sessions with experts.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!loading && !error && cases.length > 0 && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "40px",
                  padding: "40px 20px",
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1a1a1a",
                    marginBottom: "16px",
                    letterSpacing: "-0.5px",
                  }}
                >
                  SUBSCRIBE
                </h2>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#666",
                    marginBottom: "24px",
                    lineHeight: "1.5",
                  }}
                >
                  Get access to premium content and exclusive features
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "14px 32px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                >
                  Subscribe Now
                </button>
              </div>
            )}
          </Container>
        </div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <FixedBackButton customPath="/home" />
      {/* 
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "60px 0 40px 0",
          position: "relative",
          overflow: "hidden",
        }}
      > */}
      {/* <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.1)",
            zIndex: 1,
          }}
        />
        <Container fluid style={{ position: "relative", zIndex: 2 }}>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2
                style={{
                  color: "white",
                  fontSize: window.innerWidth <= 768 ? "2rem" : "3rem",
                  fontWeight: "700",
                  marginBottom: "15px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  letterSpacing: "-1px",
                }}
              >
                Trending
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: window.innerWidth <= 768 ? "1rem" : "1.2rem",
                  fontWeight: "300",
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: "1.6",
                }}
              >
                Discover your recently viewed cases and continue your learning
                journey
              </p>
            </Col>
          </Row>
        </Container>
      </div> */}

      {/* Desktop Main Content Section */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "calc(100vh - 200px)",
          paddingTop: "40px",
          paddingBottom: "60px",
        }}
      >
        <Container fluid>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              border: "1px solid #e9ecef",
            }}
          >
            {loading ? (
              <Row>
                <Col className="text-center py-5">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "20px",
                      padding: "40px",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        border: "4px solid #f3f3f3",
                        borderTop: "4px solid #007bff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "1.1rem",
                        color: "#6c757d",
                        margin: 0,
                      }}
                    >
                      Loading recent items...
                    </p>
                  </div>
                </Col>
              </Row>
            ) : error ? (
              <Row>
                <Col className="text-center py-5">
                  <div
                    style={{
                      background: "#fff5f5",
                      border: "1px solid #feb2b2",
                      borderRadius: "15px",
                      padding: "40px",
                      maxWidth: "500px",
                      margin: "0 auto",
                    }}
                  >
                    <div style={{ fontSize: "3rem", marginBottom: "20px" }}>
                      ⚠️
                    </div>
                    <h4 style={{ color: "#e53e3e", marginBottom: "15px" }}>
                      Oops! Something went wrong
                    </h4>
                    <p style={{ color: "#e53e3e", marginBottom: 0 }}>{error}</p>
                  </div>
                </Col>
              </Row>
            ) : cases.length === 0 ? (
              <Row>
                <Col className="text-center py-5">
                  <div
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "15px",
                      padding: "60px 40px",
                      maxWidth: "500px",
                      margin: "0 auto",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "4rem",
                        marginBottom: "25px",
                        opacity: 0.6,
                      }}
                    >
                      📚
                    </div>
                    <h4
                      style={{
                        color: "#495057",
                        marginBottom: "15px",
                        fontWeight: "600",
                      }}
                    >
                      No Recent Items Yet
                    </h4>
                    <p
                      style={{
                        color: "#6c757d",
                        marginBottom: 0,
                        lineHeight: "1.5",
                      }}
                    >
                      Start exploring cases to see them appear here
                    </p>
                  </div>
                </Col>
              </Row>
            ) : (
              <>
                <Row className="g-4">
                  {cases.map((item, index) => {
                    const imageUrl =
                      item.imageUrl_522x760 || item.imageUrl_1920x1080;
                    const fullImageUrl = imageUrl
                      ? `${IMAGE_BASE_URL}${imageUrl}`
                      : "path/to/default/placeholder.jpg";
                    const caseInfo = item.moduleName || item.difficulty;

                    return (
                      <Col
                        key={item._id}
                        xxl={3}
                        xl={2}
                        lg={3}
                        md={12}
                        sm={6}
                        xs={6}
                        className="d-flex"
                      >
                        <div
                          style={{
                            width: "100%",
                            transform: "scale(1)",
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.02)";
                            // e.currentTarget.style.boxShadow =
                            //   "0 10px 30px rgba(0,0,0,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <CardStyle
                            image={fullImageUrl}
                            title={item.title}
                            movieTime={caseInfo}
                            category={item.moduleName}
                            sectionType={item.sessionType}
                            watchlistLink={`/playlist?caseId=${item._id}`}
                            link=""
                            onCardClick={() => handleCardClick(item)}
                          />
                        </div>
                      </Col>
                    );
                  })}
                </Row>

                {cases.length > 12 && (
                  <Row className="mt-5">
                    <Col className="text-center">
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                          borderRadius: "15px",
                          padding: "30px",
                          border: "2px dashed #dee2e6",
                        }}
                      >
                        <div
                          style={{
                            background: "white",
                            display: "inline-block",
                            padding: "10px 25px",
                            borderRadius: "25px",
                            color: "#007bff",
                            fontWeight: "600",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                          }}
                        >
                          ✨ Keep learning to see more!
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
              </>
            )}
          </div>
        </Container>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 1400px) {
            h1 {
              font-size: 2.8rem !important;
            }
          }
          
          @media (max-width: 768px) {
            h1 {
              font-size: 2.2rem !important;
            }
          }
        `}
      </style>
    </Fragment>
  );
});

RecentItemsViewAll.displayName = "RecentItemsViewAll";
export default RecentItemsViewAll;
