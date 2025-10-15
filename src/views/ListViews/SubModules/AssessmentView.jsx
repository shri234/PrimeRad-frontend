import React, { Fragment, useState, useEffect, useRef } from "react";
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
  
  // Streaming functionality states
  const [streamedContent, setStreamedContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  
  const {
    THEME,
    selectedDifficulty,
    userObs,
    facultyObs,
    showFeedbackModal,
    selectedFeedback,
  } = location.state || {};
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
  };

  // Real streaming function for HTML string response
  const handleAICompare = async () => {
    setStreamedContent(""); // Clear previous content
    setLoading(true);
    setIsStreaming(false);
    setShowAISummary(true); // Open modal immediately

    try {
      const response = await fetch(
        "https://primerad-backend.onrender.com/api/sessions/compare-observations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userObservations: userObs,
            facultyObservations: facultyObs,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      setLoading(false);
      setIsStreaming(true);

      // Get the reader from the response body
      const reader = response.body.getReader();
      let accumulatedContent = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode the chunk using TextDecoder
          const chunk = new TextDecoder("utf-8").decode(value, { stream: true });
          accumulatedContent += chunk;

          // Update the displayed content in real-time
          setStreamedContent(accumulatedContent);
        }

        // Set final content and stop streaming
        setAiComparison(accumulatedContent);
        setIsStreaming(false);

      } finally {
        reader.releaseLock();
      }
      
    } catch (err) {
      console.error("AI Summary Error:", err);
      setLoading(false);
      setIsStreaming(false);
      
      const errorContent = "<p>⚠️ Failed to generate AI report. Please try again later.</p>";
      setAiComparison(errorContent);
      setStreamedContent(errorContent);
    }
  };

  // Alternative method if you want character-by-character streaming after getting full response
  const handleAICompareWithCharStreaming = async () => {
    setStreamedContent("");
    setLoading(true);
    setIsStreaming(false);
    setShowAISummary(true);

    try {
      const response = await fetch(
        "https://primerad-backend.onrender.com/api/sessions/compare-observations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userObservations: userObs,
            facultyObservations: facultyObs,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      setLoading(false);
      setIsStreaming(true);

      const reader = response.body.getReader();
      let fullContent = "";

      try {
        // First, collect all the content
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder("utf-8").decode(value, { stream: true });
          fullContent += chunk;
        }

        // Now stream it character by character for visual effect
        await streamTextCharByChar(fullContent);
        setAiComparison(fullContent);

      } finally {
        reader.releaseLock();
      }
      
    } catch (err) {
      console.error("AI Summary Error:", err);
      setLoading(false);
      setIsStreaming(false);
      
      const errorContent = "<p>⚠️ Failed to generate AI report. Please try again later.</p>";
      setAiComparison(errorContent);
      setStreamedContent(errorContent);
    }
  };

  // Method for word-by-word streaming (more natural for HTML content)
  const handleAICompareWordStreaming = async () => {
    setStreamedContent("");
    setLoading(true);
    setIsStreaming(false);
    setShowAISummary(true);

    try {
      const response = await fetch(
        "https://primerad-backend.onrender.com/api/sessions/compare-observations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userObservations: userObs,
            facultyObservations: facultyObs,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      setLoading(false);
      setIsStreaming(true);

      const reader = response.body.getReader();
      let fullContent = "";

      try {
        // Collect all content first
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder("utf-8").decode(value, { stream: true });
          fullContent += chunk;
        }

        // Stream word by word for better HTML handling
        await streamWordByWord(fullContent);
        setAiComparison(fullContent);

      } finally {
        reader.releaseLock();
      }
      
    } catch (err) {
      console.error("AI Summary Error:", err);
      setLoading(false);
      setIsStreaming(false);
      
      const errorContent = "<p>⚠️ Failed to generate AI report. Please try again later.</p>";
      setAiComparison(errorContent);
      setStreamedContent(errorContent);
    }
  };

  // Character-by-character streaming
  const streamTextCharByChar = (content) => {
    return new Promise((resolve) => {
      let currentIndex = 0;
      
      const streamInterval = setInterval(() => {
        if (currentIndex >= content.length) {
          clearInterval(streamInterval);
          setIsStreaming(false);
          resolve();
          return;
        }

        setStreamedContent(content.slice(0, currentIndex + 1));
        currentIndex++;
      }, 25); // Fast character streaming
    });
  };

  // Word-by-word streaming (better for HTML content)
  const streamWordByWord = (content) => {
    return new Promise((resolve) => {
      // Split content into words while preserving HTML tags
      const tokens = content.split(/(\s+|<[^>]*>)/);
      let currentTokenIndex = 0;
      let accumulatedContent = "";
      
      const streamInterval = setInterval(() => {
        if (currentTokenIndex >= tokens.length) {
          clearInterval(streamInterval);
          setIsStreaming(false);
          resolve();
          return;
        }

        accumulatedContent += tokens[currentTokenIndex];
        setStreamedContent(accumulatedContent);
        currentTokenIndex++;
      }, 80); // Adjust speed (lower = faster)
    });
  };

  return (
    <Fragment>
      <div
        style={{
          backgroundColor: THEME.background,
          minHeight: "100vh",
        }}
      >
        <FixedBackButton />

        <Container fluid className="py-3">
          <Row className="g-2">
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
                        onClick={handleAICompare} // Use direct streaming
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

                {/* AI Summary Modal with HTML String Streaming */}
                <Modal
                  show={showAISummary}
                  onHide={() => {
                    setShowAISummary(false);
                    setIsStreaming(false);
                    setStreamedContent("");
                    setTimeout(() => setShowFeedbackModal(true), 300);
                  }}
                  centered
                  size="lg"
                  contentClassName="custom-ai-modal"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>
                      AI Summary Report
                      {isStreaming && (
                        <span 
                          style={{ 
                            marginLeft: "10px", 
                            fontSize: "14px", 
                            color: "#007bff",
                            animation: "pulse 1.5s infinite" 
                          }}
                        >
                          ●
                        </span>
                      )}
                    </Modal.Title>
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
                      <div className="ai-report-container">
                        <div
                          dangerouslySetInnerHTML={{ 
                            __html: streamedContent || aiComparison 
                          }}
                        />
                        {isStreaming && (
                          <span 
                            style={{ 
                              color: "#007bff", 
                              animation: "blink 1s infinite",
                              fontSize: "16px",
                              fontWeight: "bold",
                              marginLeft: "2px"
                            }}
                          >
                            |
                          </span>
                        )}
                      </div>
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

        {/* CSS for animations */}
        <style jsx>{`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </Fragment>
  );
};

export default AssessmentView;
