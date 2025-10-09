import React, { Fragment, useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { FixedBackButton } from "../../../utilities/BackButton";
import { useLocation } from "react-router-dom";
import CompareObservationsModal from "./CompareObservationsModal";

const AssessmentView = ({}) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [aiComparison, setAiComparison] = useState("");
  const [showAISummary, setShowAISummary] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    THEME,
    selectedDifficulty,
    userObs,
    facultyObs,
    // showModal,
    // showAISummary,
    // aiComparison,
    // loading,
    showFeedbackModal,
    selectedFeedback,
  } = location.state || {};
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
  };

  const handleAICompare = async () => {
    setAiComparison(""); // Clear previous summary
    setLoading(true);
    setShowAISummary(true); // Open modal immediately

    try {
      const response = await fetch(
        "http://localhost:5000/api/sessions/compare-observations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userObservations: userObs,
            facultyObservations: facultyObs,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch AI report");

      const data = await response.json();

      setAiComparison(data.report || "<p>No summary generated.</p>");
    } catch (err) {
      console.error("AI Summary Error:", err);
      setAiComparison(
        "<p>⚠️ Failed to generate AI report. Please try again later.</p>"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <div
        style={{
          backgroundColor: THEME.background,
          minHeight: "100vh",
          //   marginTop: "-55px",
          // display: "flex",
          // flexDirection: "column",
        }}
      >
        <FixedBackButton />

        <Container
          fluid
          className="py-3"
          // style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <Row
            className="g-2"
            //   style={{
            //     display: "flex",
            //     flex: 1,
            //     alignItems: "stretch",
            //     flexWrap: "nowrap",
            //   }}
          >
            <Col lg={9} md={12}>
              <div
                style={{
                  background: "white",
                  boxShadow: "3px 4px 16px rgba(0,0,0,0.08)",
                  padding: "24px",
                  borderRadius: "12px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                  <h2
                    style={{
                      color: "navy",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    DICOM Viewer
                  </h2>
                </div>

                <div
                  style={{
                    position: "relative",
                    backgroundColor: "black",
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: "10px",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                  }}
                >
                  <img
                    src="/assets/images/dicomm.jpg"
                    alt="DICOM preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </Col>

            <Col lg={3} md={12}>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  padding: "24px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "16px",
                  }}
                >
                  {selectedDifficulty} Assessment
                </h2>

                {!saved ? (
                  <>
                    <div className="d-flex flex-column gap-3">
                      {[
                        "What abnormalities do you notice?",
                        "Describe the region of interest.",
                        "Any additional notes or comments?",
                        "Any suggestions for diagnosis?",
                      ].map((question, index) => (
                        <div key={index}>
                          <label
                            style={{
                              fontWeight: "500",
                              fontSize: "14px",
                              marginBottom: "6px",
                              display: "block",
                            }}
                          >
                            {question}
                          </label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Type your answer here..."
                            style={{
                              fontSize: "14px",
                              borderRadius: "8px",
                              resize: "none",
                            }}
                          ></textarea>
                        </div>
                      ))}
                    </div>

                    <div className="text-center mt-3">
                      <Button
                        style={{
                          backgroundColor: "lightblue",
                          border: "none",
                          color: "black",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          padding: "8px 12px",
                        }}
                        onClick={handleSave}
                      >
                        Save Observations
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="d-flex justify-content-center">
                    <div
                      className="d-flex flex-column align-items-center gap-3"
                      style={{ width: "300px", marginTop: "170px" }}
                    >
                      <button
                        style={{
                          width: "100%",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          padding: "6px",
                          border: "lightblue",
                          color: "black",
                          backgroundColor: "lightblue",
                        }}
                        onClick={() => setShowModal(true)}
                      >
                        Compare Observations
                      </button>

                      <button
                        style={{
                          width: "100%",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          padding: "6px",
                          color: "black",
                          backgroundColor: "lightblue",
                          border: "none",
                        }}
                        onClick={handleAICompare}
                        disabled={loading}
                      >
                        {loading
                          ? "Generating..."
                          : "Generate AI Summary Report"}
                      </button>

                      <button
                        style={{
                          width: "100%",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          padding: "8px",
                          color: "white",
                          backgroundColor: "#dc3545",
                          border: "none",
                        }}
                        onClick={() => setSaved(false)}
                      >
                        Retake Assessment
                      </button>
                    </div>
                  </div>
                )}

                {/* Compare Observations Modal */}
                <CompareObservationsModal
                  show={showModal}
                  handleClose={() => setShowModal(false)}
                  userObservations={userObs}
                  facultyObservations={facultyObs}
                />

                {/* AI Summary Modal */}
                <Modal
                  show={showAISummary}
                  onHide={() => {
                    setShowAISummary(false);
                    setTimeout(() => setShowFeedbackModal(true), 300);
                  }}
                  centered
                  size="lg"
                  contentClassName="custom-ai-modal"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>AI Summary Report</Modal.Title>
                  </Modal.Header>

                  <Modal.Body
                    className="p-4 bg-light"
                    style={{ maxHeight: "70vh", overflowY: "auto" }}
                  >
                    {loading ? (
                      <div className="text-center py-5 text-muted">
                        <div
                          className="spinner-border text-primary mb-3"
                          role="status"
                        ></div>
                        <div>Generating your report...</div>
                      </div>
                    ) : (
                      <div
                        className="ai-report-container"
                        dangerouslySetInnerHTML={{ __html: aiComparison }}
                      />
                    )}
                  </Modal.Body>
                </Modal>

                {/* Feedback Modal */}
                <Modal
                  show={showFeedbackModal}
                  contentClassName="custom-modal"
                  onHide={() => setShowFeedbackModal(false)}
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>We Value Your Feedback</Modal.Title>
                  </Modal.Header>

                  <Modal.Body className="text-center">
                    <p className="mb-4">
                      How would you rate this AI Summary Report?
                    </p>

                    <div className="d-flex flex-column gap-3 align-items-center">
                      {["Excellent", "Satisfactory", "Needs Improvement"].map(
                        (option) => (
                          <button
                            key={option}
                            className={`feedback-option-btn ${
                              selectedFeedback === option ? "selected" : ""
                            }`}
                            onClick={() => setSelectedFeedback(option)}
                          >
                            {option}
                          </button>
                        )
                      )}
                    </div>
                  </Modal.Body>

                  <Modal.Footer className="d-flex justify-content-center gap-3">
                    <button
                      className="cancel-btn"
                      onClick={() => setShowFeedbackModal(false)}
                    >
                      Cancel
                    </button>

                    <button
                      className="submit-btn"
                      disabled={!selectedFeedback}
                      onClick={() => {
                        console.log("User Feedback:", selectedFeedback);
                        setShowFeedbackModal(false);
                        setSelectedFeedback("");
                      }}
                    >
                      Submit
                    </button>
                  </Modal.Footer>
                </Modal>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default AssessmentView;
