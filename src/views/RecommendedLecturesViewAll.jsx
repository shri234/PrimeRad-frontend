import { Fragment, memo } from "react";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CardStyle from "../components/cards/CardStyle";
import BreadCrumbWidget from "../components/BreadcrumbWidget";
import { latestMovie } from "../StaticData/data";
import axios from "axios";
import { FixedBackButton } from "../utilities/BackButton";

const RecentItemsViewAll = memo(() => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const IMAGE_BASE_URL = "http://localhost:5000";

  return (
    <Fragment>
      <FixedBackButton customPath="/home"></FixedBackButton>

      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "60px 0 40px 0",
          // marginTop: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
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
                  fontSize: "3rem",
                  fontWeight: "700",
                  marginBottom: "15px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  letterSpacing: "-1px",
                }}
              >
                Lectures
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1.2rem",
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
      </div>

      {/* Main Content Section */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "calc(100vh - 200px)",
          paddingTop: "40px",
          paddingBottom: "60px",
        }}
      >
        <Container fluid>
          {/* <Row className="mb-4">
            <Col>
              <div
                style={{
                  background: "white",
                  borderRadius: "15px",
                  padding: "20px 30px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "1px solid #e9ecef",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "20px",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        color: "#495057",
                        marginBottom: "5px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                      }}
                    >
                      {loading
                        ? "Loading..."
                        : `${cases.length} Recent Items Found`}
                    </h4>
                    <p
                      style={{
                        color: "#6c757d",
                        marginBottom: 0,
                        fontSize: "0.95rem",
                      }}
                    >
                      Continue where you left off
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        background: "linear-gradient(45deg, #007bff, #0056b3)",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        boxShadow: "0 2px 10px rgba(0,123,255,0.3)",
                      }}
                    >
                      Recently Viewed
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row> */}

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
                    <div
                      style={{
                        fontSize: "3rem",
                        marginBottom: "20px",
                      }}
                    >
                      ⚠️
                    </div>
                    <h4
                      style={{
                        color: "#e53e3e",
                        marginBottom: "15px",
                      }}
                    >
                      Oops! Something went wrong
                    </h4>
                    <p
                      style={{
                        color: "#e53e3e",
                        marginBottom: 0,
                      }}
                    >
                      {error}
                    </p>
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
                        md={4}
                        sm={6}
                        xs={12}
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
                            e.currentTarget.style.boxShadow =
                              "0 10px 30px rgba(0,0,0,0.15)";
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
                            watchlistLink={`/playlist?caseId=${item._id}`}
                            link={`/lecture-detail`}
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
                        <p
                          style={{
                            color: "#6c757d",
                            marginBottom: "20px",
                            fontSize: "1.1rem",
                          }}
                        >
                          Showing all {cases.length} recent items
                        </p>
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
