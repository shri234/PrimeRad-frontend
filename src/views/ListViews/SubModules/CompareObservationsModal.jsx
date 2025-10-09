import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import "./SubModules.css";

const CompareObservationsModal = ({
  show,
  handleClose,
  userObservations,
  facultyObservations,
  onConfirmSave,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
      scrollable
      contentClassName="custom-compare-modal"
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title
          style={{
            fontWeight: "600",
            fontSize: "1.2rem",
            color: "#222",
          }}
        >
          Compare Observations
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="gy-3">
          {/* User Observations */}
          <Col md={6} xs={12}>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                padding: "16px",
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                height: "100%",
              }}
            >
              <h6
                className="fw-semibold mb-2"
                style={{ color: "#333", fontWeight: "600" }}
              >
                Your Observations
              </h6>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  color: "#444",
                  lineHeight: "1.6",
                  minHeight: "100px",
                }}
              >
                {userObservations || "No observations added yet."}
              </div>
            </div>
          </Col>

          {/* Faculty Observations */}
          <Col md={6} xs={12}>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                padding: "16px",
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                height: "100%",
              }}
            >
              <h6
                className="fw-semibold mb-2"
                style={{ color: "#333", fontWeight: "600" }}
              >
                Faculty Observations
              </h6>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  color: "#444",
                  lineHeight: "1.6",
                  minHeight: "100px",
                }}
              >
                {facultyObservations || "No observations available."}
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default CompareObservationsModal;
