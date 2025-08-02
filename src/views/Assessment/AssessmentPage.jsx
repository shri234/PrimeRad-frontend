import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./AssessmentPage.css";

const AssessmentPage = () => {
  const { moduleName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isStarted, setIsStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const assessment = location.state?.assessment;
  const isPracticeMode = location.pathname.includes("/practice");

  // Mock questions for demonstration
  const questions = [
    {
      id: 1,
      question: "What is the most common cause of shoulder pain in adults?",
      options: [
        "Rotator cuff tear",
        "Shoulder dislocation",
        "Frozen shoulder",
        "Arthritis",
      ],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "Which muscle is NOT part of the rotator cuff?",
      options: ["Supraspinatus", "Infraspinatus", "Teres minor", "Deltoid"],
      correctAnswer: 3,
    },
    {
      id: 3,
      question:
        "What is the typical presentation of shoulder impingement syndrome?",
      options: [
        "Pain with overhead activities",
        "Constant severe pain",
        "Pain only at night",
        "No pain with movement",
      ],
      correctAnswer: 0,
    },
    {
      id: 4,
      question:
        "Which imaging modality is best for evaluating rotator cuff tears?",
      options: ["X-ray", "CT scan", "MRI", "Ultrasound"],
      correctAnswer: 2,
    },
    {
      id: 5,
      question:
        "What is the treatment of choice for a complete rotator cuff tear?",
      options: [
        "Physical therapy only",
        "Surgery",
        "Rest and ice",
        "Corticosteroid injection",
      ],
      correctAnswer: 1,
    },
  ];

  useEffect(() => {
    if (!assessment) {
      navigate("/atlas");
      return;
    }

    let timer;
    if (isStarted && timeLeft > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isStarted, timeLeft, showResults, assessment, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleBack = () => {
    navigate(`/atlas/${moduleName}`);
  };

  if (!assessment) {
    return <div>Loading...</div>;
  }

  if (!isStarted) {
    return (
      <div className="assessment-start-page">
        <div className="assessment-start-container">
          <button onClick={handleBack} className="back-button">
            ← Back to Module
          </button>

          <div className="assessment-start-card">
            <h1>{assessment.assessmentTitle}</h1>
            <p className="assessment-description">{assessment.description}</p>

            <div className="assessment-info">
              <div className="info-item">
                <span className="info-label">Mode:</span>
                <span className="info-value">
                  {isPracticeMode ? "Practice" : "Assessment"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Total Questions:</span>
                <span className="info-value">{questions.length}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Time Limit:</span>
                <span className="info-value">{assessment.timeLimit}</span>
              </div>
              {!isPracticeMode && (
                <div className="info-item">
                  <span className="info-label">Passing Score:</span>
                  <span className="info-value">{assessment.passingScore}%</span>
                </div>
              )}
            </div>

            <div className="assessment-instructions">
              <h3>Instructions:</h3>
              <ul>
                <li>Read each question carefully</li>
                <li>Select the best answer from the options provided</li>
                <li>
                  You can navigate between questions using Previous/Next buttons
                </li>
                <li>Review your answers before submitting</li>
                {!isPracticeMode && (
                  <li>You must achieve {assessment.passingScore}% to pass</li>
                )}
              </ul>
            </div>

            <button onClick={handleStart} className="start-button">
              {isPracticeMode ? "Start Practice" : "Start Assessment"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const isPassed = score >= assessment.passingScore;

    return (
      <div className="assessment-results-page">
        <div className="assessment-results-container">
          <h1>Assessment Results</h1>

          <div className="results-card">
            <div className="score-section">
              <h2>Your Score</h2>
              <div
                className={`score-display ${isPassed ? "passed" : "failed"}`}
              >
                {score}%
              </div>
              <p className={`result-status ${isPassed ? "passed" : "failed"}`}>
                {isPassed ? "PASSED" : "FAILED"}
              </p>
            </div>

            <div className="results-breakdown">
              <h3>Question Breakdown:</h3>
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={`question-result ${
                      isCorrect ? "correct" : "incorrect"
                    }`}
                  >
                    <span className="question-number">Q{index + 1}</span>
                    <span className="question-status">
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="results-actions">
              <button onClick={handleBack} className="back-to-module-btn">
                Back to Module
              </button>
              {!isPassed && !isPracticeMode && (
                <button
                  onClick={() => window.location.reload()}
                  className="retry-btn"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const userAnswer = answers[currentQ.id];

  return (
    <div className="assessment-page">
      <div className="assessment-header">
        <button onClick={handleBack} className="back-button">
          ← Back
        </button>
        <h1>{assessment.assessmentTitle}</h1>
        <div className="assessment-timer">
          Time Remaining: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="assessment-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
        <span className="progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <div className="question-container">
        <div className="question-card">
          <h2 className="question-text">{currentQ.question}</h2>

          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <label
                key={index}
                className={`option-item ${
                  userAnswer === index ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={index}
                  checked={userAnswer === index}
                  onChange={() => handleAnswerSelect(currentQ.id, index)}
                />
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="assessment-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="nav-button prev-button"
        >
          Previous
        </button>

        <div className="question-indicators">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`indicator ${
                index === currentQuestion ? "active" : ""
              } ${
                answers[questions[index].id] !== undefined ? "answered" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <button onClick={handleSubmit} className="nav-button submit-button">
            Submit Assessment
          </button>
        ) : (
          <button onClick={handleNext} className="nav-button next-button">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;
