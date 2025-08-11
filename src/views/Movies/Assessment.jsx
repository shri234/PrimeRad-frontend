// Assessment.jsx - MCQ assessment for a video. Route: '/assessment'. Expects video info in location.state.
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Modal,
} from "react-bootstrap";

const QUESTIONS = [
  {
    question: "What is the main topic of the video?",
    options: [
      "Knee Injuries",
      "Shoulder Pain",
      "Hip Replacement",
      "Spine Surgery",
    ],
    answer: 0,
  },
  {
    question: "Who is the faculty for this lecture?",
    options: ["Dr. Smith", "Dr. Jones", "Dr. Lee", "Dr. Patel"],
    answer: 0,
  },
  {
    question: "Which module does this video belong to?",
    options: ["Orthopedics", "Cardiology", "Neurology", "Dermatology"],
    answer: 0,
  },
];

const Assessment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title = "Assessment" } = location.state || {};
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [showSummary, setShowSummary] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  useEffect(() => {
    if (!location.pathname.includes("assessment")) {
      document.body.style.overflow = "auto";
    }
  }, [location.pathname]);

  const handleOption = (idx) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleReset = () => {
    setCurrent(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setShowSummary(false);
  };

  const handleBack = () => {
    setShowBackModal(true);
  };

  const handleBackConfirm = () => {
    setShowBackModal(false);
    navigate(-1);
  };

  const handleBackCancel = () => {
    setShowBackModal(false);
  };

  const correctCount = answers.filter(
    (a, i) => a === QUESTIONS[i].answer
  ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card
              style={{
                borderRadius: 20,
                boxShadow: "0 8px 32px 0 rgba(31,38,135,0.13)",
                backdropFilter: "blur(8px)",
                background: "rgba(255,255,255,0.92)",
                padding: 0,
              }}
            >
              <Card.Body style={{ padding: "28px 18px 22px 18px" }}>
                {/* Top bar with Back and Reset (only during assessment) */}
                {!showSummary && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Button
                      variant="outline-danger"
                      onClick={handleBack}
                      size="md"
                      style={{
                        borderRadius: 10,
                        fontWeight: 600,
                        fontSize: 15,
                        padding: "4px 16px",
                      }}
                    >
                      <span style={{ fontSize: 17, marginRight: 4 }}>←</span>{" "}
                      Back
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={handleReset}
                      size="md"
                      style={{
                        borderRadius: 10,
                        fontWeight: 600,
                        fontSize: 15,
                        padding: "4px 16px",
                      }}
                    >
                      <span style={{ fontSize: 17, marginRight: 4 }}>🔄</span>{" "}
                      Reset
                    </Button>
                  </div>
                )}
                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "darkslategrey",
                      letterSpacing: 0.5,
                      marginBottom: 2,
                      opacity: 0.85,
                    }}
                  >
                    {title}
                  </div>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: 1.35 + "rem",
                      margin: 0,
                      color: "darkslategrey",
                      letterSpacing: 0.2,
                    }}
                  >
                    Assessment
                  </h3>
                  <ProgressBar
                    now={
                      ((current + (showSummary ? 1 : 0)) / QUESTIONS.length) *
                      100
                    }
                    style={{ height: 7, borderRadius: 8, marginTop: 10 }}
                  />
                </div>
                {!showSummary ? (
                  <>
                    <div style={{ marginBottom: 18 }}>
                      <h5
                        style={{
                          fontWeight: 600,
                          fontSize: 1.08 + "rem",
                          marginBottom: 12,
                        }}
                      >
                        {current + 1}. {QUESTIONS[current].question}
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                          marginTop: 8,
                        }}
                      >
                        {QUESTIONS[current].options.map((opt, idx) => (
                          <Button
                            key={idx}
                            variant={
                              answers[current] === idx
                                ? "primary"
                                : "outline-primary"
                            }
                            size="md"
                            style={{
                              borderRadius: 10,
                              fontWeight: 500,
                              textAlign: "left",
                              fontSize: 15,
                              padding: "7px 14px",
                              boxShadow:
                                answers[current] === idx
                                  ? "0 2px 8px rgba(0,123,255,0.10)"
                                  : undefined,
                            }}
                            onClick={() => handleOption(idx)}
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 18,
                      }}
                    >
                      <Button
                        variant="secondary"
                        onClick={handlePrev}
                        disabled={current === 0}
                        size="md"
                        style={{
                          borderRadius: 10,
                          minWidth: 90,
                          fontSize: 15,
                          padding: "4px 10px",
                        }}
                      >
                        <span style={{ fontSize: 16, marginRight: 4 }}>⬅️</span>{" "}
                        Previous
                      </Button>
                      <Button
                        variant="success"
                        onClick={handleNext}
                        disabled={answers[current] === null}
                        size="md"
                        style={{
                          borderRadius: 10,
                          minWidth: 90,
                          fontSize: 15,
                          padding: "4px 10px",
                        }}
                      >
                        {current === QUESTIONS.length - 1 ? (
                          <>
                            <span style={{ fontSize: 16, marginRight: 4 }}>
                              ✅
                            </span>{" "}
                            Submit
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: 16, marginRight: 4 }}>
                              ➡️
                            </span>{" "}
                            Next
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: 18 }}>
                    <h4
                      style={{
                        fontWeight: 700,
                        color: "#28a745",
                        fontSize: "1.2rem",
                      }}
                    >
                      Assessment Complete!
                    </h4>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        margin: "14px 0",
                      }}
                    >
                      You scored {correctCount} out of {QUESTIONS.length}
                    </p>
                    <Button
                      variant="primary"
                      style={{
                        borderRadius: 10,
                        marginTop: 10,
                        fontSize: 15,
                        padding: "4px 18px",
                      }}
                      onClick={() => navigate(-1)}
                    >
                      <span style={{ fontSize: 16, marginRight: 4 }}>🎬</span>{" "}
                      Back to Video
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showBackModal}
        onHide={handleBackCancel}
        style={{ zIndex: 10000 }}
        centered
        backdrop="static"
        animation={true}
      >
        <Modal.Header closeButton style={{ backgroundColor: "ghostwhite" }}>
          <Modal.Title style={{ fontWeight: 600, fontSize: 18 }}>
            Exit Assessment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            textAlign: "center",
            padding: "28px 18px",
            backgroundColor: "ghostwhite",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 18,
              marginBottom: 18,
              color: "black",
            }}
          >
            Do you want to exit assessment?
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
            <Button
              variant="danger"
              onClick={handleBackConfirm}
              style={{ borderRadius: 10, minWidth: 80 }}
            >
              Yes
            </Button>
            <Button
              variant="secondary"
              onClick={handleBackCancel}
              style={{ borderRadius: 10, minWidth: 80 }}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Assessment;
