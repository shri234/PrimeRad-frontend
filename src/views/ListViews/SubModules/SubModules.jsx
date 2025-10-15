import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavCategories from "../../MainPages/NavCategories";
import { FaArrowRight, FaArrowLeft, FaFilter } from "react-icons/fa";
import AssessmentView from "./AssessmentView";
import { FixedBackButton } from "../../../utilities/BackButton";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { OpenAI } from "openai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Row,
  Col,
  Container,
  Nav,
  Tab,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Info, BookOpen, Star } from "lucide-react";
import CompareObservationsModal from "./CompareObservationsModal";

import {
  FaFolderOpen,
  FaChalkboardTeacher,
  FaBroadcastTower,
} from "react-icons/fa";

import {
  selectIsAuthenticated,
  selectUser,
} from "../../../store/auth/selectors";
import { useSelector } from "react-redux";
import { GiAtlas } from "react-icons/gi";
import { FaTh, FaTimes } from "react-icons/fa";
import axios from "axios";
import "./SubModules.css";

const modules = [
  { name: "Shoulder", pathologies: 7 },
  { name: "Hip", pathologies: 2 },
];
const THEME = {
  primary: "#1976d2",
  secondary: "#00bfae",
  background: "#f4f8fb",
  card: "#fff",
  accent: "#ffb300",
  text: "#263238",
  border: "#e0e0e0",
};

// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const subModulesData = {
  Hip: [
    {
      name: "Labral Tear",
      pathologies: 2,
      thumbnail: "/assets/images/hip.jpg",
      levels: {
        beginner: [
          {
            title: "Hip Labrum Anatomy",
            type: "lecture",
            description: "Introduction to hip labrum structure and function.",
            thumbnail: "/assets/images/hip1.jpg",
            id: "hip_labrum_vid1",
            vimeoVideoId: "1097623899",
            duration: "12:00",
            startDate: "2024-08-01T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. L. Brown",
          },
          {
            title: "Hip Labrum Case Study 1",
            type: "case",
            description: "Case study on common hip labral tear.",
            thumbnail: "/assets/images/hip2.jpg",
            id: "hip_labrum_case1",
            contentType: "Case",
          },
        ],
        advanced: [
          {
            title: "Advanced Hip Arthroscopy",
            type: "lecture",
            description: "Surgical techniques for complex hip labral repairs.",
            thumbnail: "/assets/images/hip3.jpg",
            id: "hip_labrum_vid2",
            vimeoVideoId: "1102457741",
            duration: "25:00",
            startDate: "2024-08-05T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. M. Green",
          },
          {
            title: "Complex Hip Labrum Case",
            type: "case",
            description: "Detailed analysis of a challenging hip labral case.",
            thumbnail: "/assets/images/hip4.jpg",
            id: "hip_labrum_case2",
            contentType: "Case",
          },
        ],
      },
    },
  ],
};

const getAssessmentForModule = (moduleName) => {
  return {
    moduleName: moduleName,
    assessmentTitle: `${moduleName} Module Assessment`,
    description: `Comprehensive assessment covering all ${moduleName} pathologies`,
    totalQuestions: 20,
    timeLimit: "30 minutes",
    passingScore: 70,
  };
};

function getSessionTypeBadge(type) {
  switch (type?.toLowerCase()) {
    case "dicom":
    case "case":
      return { className: "dicom-badge", label: "Case", icon: "🩻" };
    case "lecture":
    case "vimeo":
      return { className: "vimeo-badge", label: "Lecture", icon: "🎥" };
    case "live":
      return { className: "live-badge", label: "Live", icon: "🔴" };
    default:
      return { className: "default-badge", label: type || "", icon: "" };
  }
}

function formatDate(dateStr, type) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (type === "live") {
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } else {
    return date.toLocaleDateString(undefined, { dateStyle: "medium" });
  }
}

const countTypes = (items = []) => {
  return items.reduce(
    (acc, item) => {
      const type = item.sessionType?.toLowerCase() || item.type?.toLowerCase();
      if (type === "dicom" || type === "case") {
        acc.case = (acc.case || 0) + 1;
      } else if (type === "vimeo" || type === "lecture") {
        acc.lecture = (acc.lecture || 0) + 1;
      } else if (type === "live") {
        acc.live = (acc.live || 0) + 1;
      }
      return acc;
    },
    { lecture: 0, case: 0, live: 0 }
  );
};

const userObs = `
- The lesion appears hyperpigmented.
- Possible diagnosis: Melanocytic nevus.
- Recommend dermoscopy follow-up in 6 months.
`;

const handleSave = () => {
  setSaved(true);
};
const facultyObs = `
- Lesion shows uniform pigmentation.
- Diagnosis: Benign melanocytic nevus.
- Agree with follow-up suggestion.
`;

const countSubmoduleTypes = (sub, apiSessions) => {
  let combinedSessions = [];

  if (sub?.levels?.beginner) {
    combinedSessions.push(...sub.levels.beginner);
  }
  if (sub?.levels?.advanced) {
    combinedSessions.push(...sub.levels.advanced);
  }

  if (apiSessions) {
    combinedSessions.push(...apiSessions);
  }

  return countTypes(combinedSessions);
};

// const countLevelTypes = (levelItems) => countTypes(levelItems);

const moduleIcons = {
  Knee: "",
  Shoulder: "",
  Spine: "",
  Ankle: "",
  Elbow: "",
  Hip: "",
};

const submoduleIcons = {
  ACL: "🦵",
  Meniscus: "🦵",
  "Rotator Cuff": "💪",
  "Tears and Rasions": "🩹",
  Strains: "🩹",
  Labrum: "💪",
  "Tendinitis and Bursitis": "💪",
  "Sprains and Strains": "💪",
  "Dislocations and Separations": "🦴",
  "Shoulder Impingement Syndrome": "💪",
  Arthritis: "🦴",
  "Labral Tear": "🤸",
  Osteoarthritis: "🦴",
};

const typeIcons = {
  lecture: { icon: "▶️", label: "Lecture", className: "badge-lecture" },
  case: { icon: "🩺", label: "Dicom", className: "badge-case" },
  live: { icon: "📺", label: "Live", className: "badge-live" },
};

const staticThumbnails = [
  "/assets/images/rotator-cuff.jpg",
  "/assets/images/sprain.jpg",
  "/assets/images/tear-rasions.jpg",
  "/assets/images/dislocation.png",
  "/assets/images/01.jpg",
];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * staticThumbnails.length);
  return staticThumbnails[randomIndex];
};

const SubModuleView = () => {
  const sectionRef = useRef(null);
  const { moduleName: urlModuleName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeModuleId, setActiveModuleId] = useState(
    location.state?.moduleId || null
  );
  const [activeModuleName, setActiveModuleName] = useState(
    location.state?.moduleName || urlModuleName
  );

  const [aiComparison, setAiComparison] = useState("");
  // const [loading, setLoading] = useState(false);

  const [viewMode, setViewMode] = useState("list");
  const [view, setView] = useState("atlas");
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [selectedSubModuleId, setSelectedSubModuleId] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  // const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState("");

  const [allModules, setAllModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [modulesError, setModulesError] = useState(null);

  const [modulePathologiesData, setModulePathologiesData] = useState([]);
  const [loadingPathologies, setLoadingPathologies] = useState(true);
  const [pathologiesError, setPathologiesError] = useState(null);

  const [levelSessions, setLevelSessions] = useState([]);
  const [loadingLevelSessions, setLoadingLevelSessions] = useState(false);
  const [levelSessionsError, setLevelSessionsError] = useState(null);

  const [currentView, setCurrentView] = useState("submodules");
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [saved, setSaved] = useState(false);

  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState(null);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const questionsPerBatch = 5;
  const totalBatches = Math.ceil(
    assessmentQuestions.length / questionsPerBatch
  );
  const startIndex = currentBatch * questionsPerBatch;
  const endIndex = Math.min(
    startIndex + questionsPerBatch,
    assessmentQuestions.length
  );
  const currentQuestions = assessmentQuestions.slice(startIndex, endIndex);
  const hasPrevBatch = currentBatch > 0;
  const hasNextBatch = currentBatch < totalBatches - 1;

  const [filters, setFilters] = useState({
    dicom: true,
    lecture: true,
    live: true,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleScroll = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const selectedSubModule = modulePathologiesData.find(
    (item) => item._id === selectedSubModuleId
  );

  const staticSubModuleDataForPathology = selectedSubModule
    ? subModulesData[activeModuleName]?.find(
        (sub) => sub.name === selectedSubModule.pathologyName
      )
    : null;

  const handleSessionClick = (session) => {
    setSelectedVideo(session);

    const sessionType =
      session.sessionType?.toLowerCase() || session.type?.toLowerCase();

    if (sessionType === "dicom" || sessionType === "case") {
      navigate(`/case/${session._id || session.id}`);
    } else if (sessionType === "vimeo" || sessionType === "lecture") {
      navigate("/lecture-detail", {
        state: {
          id: session._id || session.id,
          vimeoVideoId: session.vimeoVideoId,
          title: session.title,
          isFree: session.isFree,
          description: session.description,
          faculty:
            session.faculty?.[0]?.name || session.faculty || "Expert Faculty",
          module: activeModuleName,
          submodule: selectedSubModule?.pathologyName,
          duration: session.sessionDuration || session.duration,
          startDate: session.startDate,
          contentType: "lecture",
        },
      });
    } else if (sessionType === "live") {
      navigate("/livepage", {
        state: {
          id: session._id || session.id,
          title: session.title,
          description: session.description,
          faculty:
            session.faculty?.[0]?.name || session.faculty || "Expert Faculty",
          module: activeModuleName,
          submodule: selectedSubModule?.pathologyName,
          startDate: session.startDate,
          contentType: "live",
          zoomJoinUrl: session.zoomJoinUrl,
          vimeoLiveUrl: session.vimeoLiveUrl,
        },
      });
    }
  };

  const fetchSessionsByPathologyAndLevel = async (pathologyId, level) => {
    try {
      setLoadingLevelSessions(true);
      setLevelSessionsError(null);

      const response = await axios.get(
        `https://primerad-backend.onrender.com/api/sessions/getSessionByDifficulty?pathologyId=${pathologyId}`
      );

      let combinedSessions = [];

      if (staticSubModuleDataForPathology?.levels?.[level.toLowerCase()]) {
        combinedSessions = [
          ...staticSubModuleDataForPathology.levels[level.toLowerCase()],
        ];
      }

      if (response.data && Array.isArray(response.data.data)) {
        combinedSessions = [...combinedSessions, ...response.data.data];
      }

      if (combinedSessions.length > 0) {
        setLevelSessions(combinedSessions);
      } else {
        setLevelSessions([]);
        setLevelSessionsError(`No ${level} sessions found for this pathology.`);
      }
    } catch (err) {
      console.error("Error fetching sessions by pathology and level:", err);
      setLevelSessionsError(
        `Failed to load ${level} sessions. Please try again.`
      );
      setLevelSessions([]);
    } finally {
      setLoadingLevelSessions(false);
    }
  };

  const [showAISummary, setShowAISummary] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setSaved(true);
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoadingModules(true);
        setModulesError(null);
        const response = await axios.get(
          "https://primerad-backend.onrender.com/api/modules/modules-with-pathology-count"
        );

        let combinedModules = [...(response.data.data || response.data)];
        modules.forEach((staticMod) => {
          if (
            !combinedModules.find(
              (apiMod) => apiMod.moduleName === staticMod.name
            )
          ) {
            combinedModules.push({
              _id: `static-${staticMod.name.toLowerCase()}`,
              moduleName: staticMod.name,
              totalPathologiesCount: staticMod.pathologies,
              isPlaceholder: true,
            });
          }
        });

        if (combinedModules.length > 0) {
          setAllModules(combinedModules);
          if (!activeModuleId) {
            setActiveModuleId(null);
            setActiveModuleName(null);
          }
        } else {
          setModulesError("Failed to load modules");
          setAllModules([]);
        }
      } catch (err) {
        console.error("Error fetching modules:", err);
        setModulesError("Failed to load modules. Please try again.");
        setAllModules([]);
      } finally {
        setLoadingModules(false);
      }
    };
    fetchModules();
  }, [activeModuleId]);

  useEffect(() => {
    if (currentView === "assessment" && selectedDifficulty && activeModuleId) {
      fetchAssessmentQuestions();
    }
  }, [currentView, selectedDifficulty, activeModuleId]);

  const fetchAssessmentQuestions = async () => {
    try {
      setAssessmentLoading(true);
      setAssessmentError(null);

      const response = await axios.get(
        `https://primerad-backend.onrender.com/api/assessments/getByModule?moduleId=${activeModuleId}&difficulty=${selectedDifficulty.toLowerCase()}`
      );

      if (response.data && Array.isArray(response.data.data)) {
        setAssessmentQuestions(response.data.data);
        setCurrentBatch(0);
        setSelectedAnswers({});
        setAssessmentResults(null);
        setUserProgress({ totalPoints: 0 });
      } else {
        setAssessmentError("No questions found for this assessment.");
        setAssessmentQuestions([]);
      }
    } catch (err) {
      console.error("Error fetching assessment questions:", err);
      setAssessmentError(
        "Failed to load assessment questions. Please try again."
      );
      setAssessmentQuestions([]);
    } finally {
      setAssessmentLoading(false);
    }
  };

  // const handleAICompare = async () => {
  //   setAiComparison("");
  //   setLoading(true);
  //   setShowAISummary(true);

  //   try {
  //     const response = await axios.post(
  //       "https://primerad-backend.onrender.com/api/sessions/compare-observations",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           userObservations: userObs,
  //           facultyObservations: facultyObs,
  //         }),
  //       }
  //     );

  //     if (!response.ok) throw new Error("Failed to fetch AI report");

  //     const data = await response.json();

  //     setAiComparison(data.report || "<p>No summary generated.</p>");
  //   } catch (err) {
  //     console.error("AI Summary Error:", err);
  //     setAiComparison(
  //       "<p>⚠️ Failed to generate AI report. Please try again later.</p>"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  };

  const handleFinish = async () => {
    try {
      setSubmittingAnswer(true);
      const getUserId = localStorage.getItem("userId");

      const unansweredQuestions = assessmentQuestions.filter(
        (q) => !selectedAnswers[q._id]
      );

      if (unansweredQuestions.length > 0) {
        alert(
          `Please answer all questions before finishing. ${unansweredQuestions.length} questions remaining.`
        );
        setSubmittingAnswer(false);
        return;
      }

      let totalPoints = 0;
      let correctAnswers = 0;

      for (const q of assessmentQuestions) {
        const res = await axios.post(
          "https://primerad-backend.onrender.com/api/assessments/answer",
          {
            userId: getUserId,
            assessmentId: q._id,
            selectedAnswer: selectedAnswers[q._id],
          }
        );

        if (res.data.isCorrect) correctAnswers++;
        totalPoints = res.data.totalPoints;
      }

      setAssessmentResults({
        completed: true,
        totalQuestions: assessmentQuestions.length,
        correctAnswers,
        totalPoints,
        percentage: (
          (correctAnswers / assessmentQuestions.length) *
          100
        ).toFixed(2),
        finalMessage: "Assessment completed successfully!",
      });
      setUserProgress((prev) => ({
        ...prev,
        totalPoints,
        lastAssessmentScore: (
          (correctAnswers / assessmentQuestions.length) *
          100
        ).toFixed(2),
      }));
    } catch (err) {
      console.error("Error submitting assessment:", err);
      setAssessmentError("Failed to submit assessment. Please try again.");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleNextBatch = () => {
    const currentBatchQuestions = assessmentQuestions.slice(
      startIndex,
      endIndex
    );
    const unansweredInBatch = currentBatchQuestions.filter(
      (q) => !selectedAnswers[q._id]
    );

    if (unansweredInBatch.length > 0) {
      alert("Please answer all questions in this section before proceeding.");
      return;
    }
    setCurrentBatch((prev) => prev + 1);
  };

  const handlePrevBatch = () => {
    setCurrentBatch((prev) => prev - 1);
  };

  const resetAssessment = () => {
    setCurrentView("difficulty");
    setAssessmentResults(null);
    setCurrentBatch(0);
    setSelectedAnswers({});
    setAssessmentQuestions([]);
    setUserProgress({ totalPoints: 0 });
  };

  const renderAssessmentContent = () => {
    if (assessmentLoading) {
      return (
        <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
          <div style={{ fontSize: "18px", marginBottom: "16px" }}>
            Loading assessment questions...
          </div>
          <div style={{ fontSize: "14px" }}>
            Please wait while we prepare your assessment
          </div>
        </div>
      );
    }

    if (assessmentError) {
      return (
        <div style={{ textAlign: "center", padding: "50px", color: "#d32f2f" }}>
          <div style={{ fontSize: "18px", marginBottom: "16px" }}>
            ⚠️ {assessmentError}
          </div>
          <button
            onClick={fetchAssessmentQuestions}
            style={{
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Retry Loading Questions
          </button>
        </div>
      );
    }

    if (assessmentQuestions.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
          <div style={{ fontSize: "18px", marginBottom: "16px" }}>
            No questions available for this assessment.
          </div>
          <button
            onClick={() => setCurrentView("difficulty")}
            style={{
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Choose Different Difficulty
          </button>
        </div>
      );
    }

    if (assessmentResults && assessmentResults.completed) {
      return (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
          <h3
            style={{ color: "#4caf50", marginBottom: "24px", fontSize: "24px" }}
          >
            {assessmentResults.finalMessage}
          </h3>
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #e9ecef",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Total Questions
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1976d2",
                  }}
                >
                  {assessmentResults.totalQuestions}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Correct Answers
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#4caf50",
                  }}
                >
                  {assessmentResults.correctAnswers}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Total Points
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#ff9800",
                  }}
                >
                  {assessmentResults.totalPoints}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Score Percentage
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#9c27b0",
                  }}
                >
                  {assessmentResults.percentage}%
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <button
              onClick={resetAssessment}
              style={{
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Take Another Assessment
            </button>
            <button
              onClick={() => setCurrentView("submodules")}
              style={{
                background: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Back to Modules
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {currentQuestions.map((question, index) => (
          <div key={question._id} style={{ marginBottom: "32px" }}>
            <h3
              style={{
                color: "#263238",
                fontWeight: "600",
                fontSize: "18px",
                marginBottom: "16px",
                lineHeight: "1.4",
              }}
            >
              {startIndex + index + 1}. {question.question}
            </h3>

            <div
              style={{
                marginLeft: "8px",
              }}
            >
              {Object.entries(question.options).map(([key, value]) => (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    cursor: "pointer",
                    marginBottom: "12px",
                    padding: "12px",
                    borderRadius: "8px",
                    border:
                      selectedAnswers[question._id] === key
                        ? "2px solid #1976d2"
                        : "1px solid #e0e0e0",
                    background:
                      selectedAnswers[question._id] === key
                        ? "#e3f2fd"
                        : "#fff",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    name={`q${question._id}`}
                    value={key}
                    checked={selectedAnswers[question._id] === key}
                    onChange={(e) =>
                      handleAnswerSelect(question._id, e.target.value)
                    }
                    style={{
                      marginRight: "12px",
                      marginTop: "2px",
                      transform: "scale(1.2)",
                    }}
                  />
                  <span style={{ fontSize: "16px", lineHeight: "1.4" }}>
                    <strong>{key.toUpperCase()}.</strong> {value}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <button
            onClick={handlePrevBatch}
            disabled={!hasPrevBatch}
            style={{
              background: hasPrevBatch ? "#6c757d" : "#e0e0e0",
              color: hasPrevBatch ? "#fff" : "#999",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontWeight: "600",
              cursor: hasPrevBatch ? "pointer" : "not-allowed",
              fontSize: "16px",
            }}
          >
            ← Previous
          </button>

          {hasNextBatch ? (
            <button
              onClick={handleNextBatch}
              style={{
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={submittingAnswer}
              style={{
                background: submittingAnswer ? "#ccc" : "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontWeight: "600",
                cursor: submittingAnswer ? "not-allowed" : "pointer",
                fontSize: "16px",
                position: "relative",
              }}
            >
              {submittingAnswer ? "Submitting..." : "🏁 Finish"}
            </button>
          )}
        </div>
      </>
    );
  };

  const renderAssessmentHeader = () => {
    return (
      <div
        style={{
          background: "#1976d2",
          color: "#fff",
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          borderBottom: "4px solid #ffb300",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "20px",
            letterSpacing: "0.5px",
            marginBottom: "8px",
          }}
        >
          {selectedDifficulty} Assessment
        </div>

        {!assessmentResults?.completed && assessmentQuestions.length > 0 && (
          <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>
            Section {currentBatch + 1} of {totalBatches} • Questions{" "}
            {startIndex + 1}–{endIndex} of {assessmentQuestions.length}
          </div>
        )}

        {userProgress && (
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            Progress: {Object.keys(selectedAnswers).length}/
            {assessmentQuestions.length} answered
            {userProgress.totalPoints > 0 &&
              ` • Points: ${userProgress.totalPoints}`}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchPathologies = async () => {
      if (!activeModuleId) {
        setPathologiesError(
          "Module ID missing. Please navigate from Atlas View."
        );
        setLoadingPathologies(false);
        setModulePathologiesData([]);
        return;
      }
      try {
        setLoadingPathologies(true);
        setPathologiesError(null);
        const response = await axios.get(
          `https://primerad-backend.onrender.com/api/pathologies/getByModule?moduleId=${activeModuleId}`
        );

        let combinedPathologies = response.data.data || [];
        const staticPathologies = subModulesData[activeModuleName] || [];
        staticPathologies.forEach((staticPath) => {
          if (
            !combinedPathologies.find(
              (apiPath) => apiPath.pathologyName === staticPath.name
            )
          ) {
            combinedPathologies.push({
              ...staticPath,
              _id: `static-${staticPath.name.toLowerCase()}`,
              pathologyName: staticPath.name,
              isPlaceholder: true,
            });
          }
        });

        if (combinedPathologies.length > 0) {
          setModulePathologiesData(combinedPathologies);
        } else {
          setModulePathologiesData([]);
          console.warn(
            "API returned unexpected data for pathologies by module:",
            response.data
          );
        }
      } catch (err) {
        console.error("Error fetching pathologies by module:", err);
        setPathologiesError("Failed to load pathologies. Please try again.");
        setModulePathologiesData([]);
        const staticPathologies = subModulesData[activeModuleName] || [];
        if (staticPathologies.length > 0) {
          const staticCombined = staticPathologies.map((sp) => ({
            ...sp,
            _id: `static-${sp.name.toLowerCase()}`,
            pathologyName: sp.name,
            isPlaceholder: false,
            imageUrl: getRandomImage(),
          }));
          setModulePathologiesData(staticCombined);
          setPathologiesError(null);
        }
      } finally {
        setLoadingPathologies(false);
      }
    };
    if (activeModuleId) {
      fetchPathologies();
    }
  }, [activeModuleId, activeModuleName]);

  const handleModuleClick = (module) => {
    setActiveModuleId(module._id);
    setActiveModuleName(module.moduleName);
    setSelectedSubModuleId(null);
    setSelectedLevel(null);
    setSelectedVideo(null);
    setCurrentView("submodules");
  };

  const handleFilterChange = (type) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSubModuleClick = async (pathologyItem) => {
    const newSubModuleId =
      selectedSubModuleId === pathologyItem._id ? null : pathologyItem._id;

    setSelectedSubModuleId(newSubModuleId);
    setSelectedLevel(null);
    setSelectedVideo(null);

    console.log(newSubModuleId, "submoduleId");

    // ✅ Call pathology API immediately when submodule is clicked
    if (newSubModuleId) {
      await fetchSessionsByPathologyAndLevel(newSubModuleId, null); // or pass default level if needed
    }
  };

  const handleLevelClick = async (level) => {
    if (selectedLevel === level) {
      setSelectedLevel(null);
      setLevelSessions([]);
    } else {
      setSelectedLevel(level);
      if (selectedSubModuleId) {
        await fetchSessionsByPathologyAndLevel(selectedSubModuleId, level);
      }
    }
    setSelectedVideo(null);
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileNavOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // const handleWindowScroll = () => {
    //   if (!isMobile) {
    //     const { scrollY } = window;
    //     const { scrollHeight, clientHeight } = document.documentElement;
    //     if (scrollHeight - scrollY <= clientHeight + 200) {
    //       if (hasMore && !isFetchingMore && !initialLoading) {
    //         setPage((prevPage) => prevPage + 1);
    //       }
    //     }
    //   }
    // };

    // if (!isMobile) {
    //   window.addEventListener("scroll", handleWindowScroll);
    // }
    return () => {
      window.removeEventListener("resize", checkMobile);
      if (!isMobile) {
        // window.removeEventListener("scroll", handleWindowScroll);
      }
    };
  }, [isMobile]);

  const handleAssessmentClick = () => {
    setCurrentView("difficulty");
    setSelectedSubModuleId(null);
    setSelectedLevel(null);
    setSelectedVideo(null);
  };

  const handleDifficultyCardClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentView("assessment");
  };
  const iconButtonStyle = {
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "50%",
    padding: "6px",
    cursor: "pointer",
    width: "30%",
    height: "20%",
    color: "navy",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "all 0.2s ease-in-out",
  };

  const resetToSubModules = () => {
    setSelectedSubModuleId(null);
    setSelectedLevel(null);
    setSelectedVideo(null);
    setCurrentView("submodules");
  };

  const initialView =
    selectedSubModuleId === null &&
    activeModuleId === null &&
    currentView === "submodules";

  console.log(currentView, sidebarOpen, view);

  console.log(selectedSubModule, "sessions");

  const allSessions = levelSessions.length > 0 ? levelSessions : [];

  return (
    <>
      <div
        style={{
          display: "flex",

          // flexDirection: "row",
          // height: "100vh",
          // overflow: "hidden",
        }}
      >
        <style>
          {`
       .labell-badge {
  position: absolute;   /* top-right positioning */
  top: 8px;
  
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;

  opacity: 1 !important;
  pointer-events: auto;    /* ensure clickable if needed */
  z-index: 10;

  /* optional colors based on difficulty */
  background: rgba(0, 0, 0, 0.6);
  color: white;
}


        .labell-badge.level-beginner {
          background: #e3f2fd;
          color: #1976d2;
        }
        .labell-badge.level-advanced {
          background: #fde8e8;
          color: #d32f2f;
        }
      `}
        </style>
        {isMobile && (
          <button
            style={{
              position: "fixed",
              top: "68px",
              zIndex: 1001,
              width: "28px",
              height: "28px",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              border: "none",
              borderRadius: "0 12px 12px 0",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
              transition: "all 0.2s ease",
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <FaTimes size={18} />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" />
              </svg>
            )}
          </button>
        )}

        {currentView !== "assessment" && (
          <div
            className={!isMobile ? "desktop-sidebar" : ""}
            style={{
              width: isMobile ? (sidebarOpen ? "250px" : "0") : undefined,
              position: isMobile ? "fixed" : undefined,
              top: isMobile ? (sidebarOpen ? "32px" : "0") : undefined,
              left: isMobile ? "0" : "10px",
              height: isMobile ? "100vh" : undefined,
              overflowY: isMobile ? "auto" : "auto",
              scrollbarWidth: isMobile ? "2px" : "4px",
              background: isMobile ? THEME.card : undefined,
              zIndex: isMobile ? 1000 : undefined,
              transition: isMobile ? "width 0.3s ease" : undefined,
            }}
          >
            <div
              style={{
                padding: "14px",
                // borderBottom: "1px solid #e0e0e0",
                marginTop: isAuthenticated ? "50px" : "40px",
                // background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  // background: "#f5f5f5",
                  borderRadius: "12px",
                  padding: "4px",
                  // marginTop: 90,
                  gap: "2px",
                }}
              >
                <button
                  style={{
                    flex: 1,
                    padding: "8px 8px",
                    backgroundColor: view === "list" ? "	#B0E0E6" : "white",
                    color: view === "list" ? "black" : "black",
                    border: "none",
                    borderRadius: "8px",
                    gap: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    navigate("/main-page");
                  }}
                >
                  <FaTh size={14} />
                  List
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "8px 8px",
                    backgroundColor:
                      view === "atlas" ? "	#B0E0E6" : "transparent",
                    color: view === "atlas" ? "black" : "black",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => {
                    navigate("/atlas");
                  }}
                >
                  <GiAtlas style={{ fontSize: 18 }} />
                  Atlas
                </button>
              </div>
            </div>

            <div className="nav-categories-wrapper">
              <div
                className="nav-categories-container"
                style={{
                  borderRadius: "10px",
                }}
              >
                <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
                  <h3 style={{ marginTop: "20px" }}>Modules</h3>
                  {loadingModules ? (
                    <div className="sidebar-loading">Loading modules...</div>
                  ) : modulesError ? (
                    <div className="sidebar-error">Error: {modulesError}</div>
                  ) : allModules.length === 0 ? (
                    <div className="sidebar-empty">No modules found.</div>
                  ) : (
                    allModules.map((mod, modIdx) => (
                      <div key={mod._id}>
                        <div
                          className={`sidebar-item ${
                            mod.moduleName === activeModuleName ? "active" : ""
                          }`}
                          onClick={() => handleModuleClick(mod)}
                        >
                          <span className="sidebar-number">{modIdx + 1}.</span>
                          <span className="sidebar-icon">
                            {moduleIcons[mod.moduleName]}
                          </span>
                          <span>{mod.moduleName}</span>
                          <span className="count">
                            {mod.totalPathologiesCount || 0}
                          </span>
                        </div>
                        {mod.moduleName === activeModuleName && (
                          <div className="submodule-list">
                            {loadingPathologies ? (
                              <div className="sidebar-loading">
                                Loading pathologies...
                              </div>
                            ) : pathologiesError ? (
                              <div className="sidebar-error">
                                Error: {pathologiesError}
                              </div>
                            ) : (
                              modulePathologiesData.map((pathology) => (
                                <div key={pathology._id}>
                                  <div
                                    className={`sidebar-subitem ${
                                      selectedSubModuleId === pathology._id
                                        ? "open"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleSubModuleClick(pathology)
                                    }
                                  >
                                    <span
                                      className={`chevron ${
                                        selectedSubModuleId === pathology._id
                                          ? "rotated"
                                          : ""
                                      }`}
                                    >
                                      <KeyboardDoubleArrowRightIcon />
                                    </span>
                                    {pathology.pathologyName}
                                  </div>
                                </div>
                              ))
                            )}

                            <div
                              className={`sidebar-subitem assessment-item ${
                                currentView === "difficulty" ? "open" : ""
                              }`}
                              style={{
                                // Layout & Sizing
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 16px",
                                minHeight: "48px",
                                width: "100%",

                                // Background & Colors
                                backgroundColor:
                                  currentView === "difficulty"
                                    ? "#e6e6fa"
                                    : "#f8f9fa",
                                borderLeft:
                                  currentView === "difficulty"
                                    ? "4px solid #6366f1"
                                    : "4px solid transparent",

                                // Typography
                                fontSize: "14px",
                                fontWeight:
                                  currentView === "difficulty" ? "600" : "500",
                                color:
                                  currentView === "difficulty"
                                    ? "#4338ca"
                                    : "#374151",

                                // Interactive States
                                cursor: "pointer",
                                transition: "all 0.2s ease-in-out",
                                borderRadius: "8px",
                                margin: "2px 8px",

                                // Hover Effects
                                "&:hover": {
                                  backgroundColor:
                                    currentView === "difficulty"
                                      ? "#e6e6fa"
                                      : "#f3f4f6",
                                  transform: "translateX(2px)",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                },

                                "&:focus": {
                                  outline: "2px solid #6366f1",
                                  outlineOffset: "2px",
                                },

                                "&:active": {
                                  transform: "translateX(1px)",
                                  backgroundColor:
                                    currentView === "difficulty"
                                      ? "#ddd6fe"
                                      : "#e5e7eb",
                                },
                              }}
                              onClick={() => handleAssessmentClick()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  handleAssessmentClick();
                                }
                              }}
                              tabIndex={0}
                              role="button"
                              aria-pressed={currentView === "difficulty"}
                              aria-label="Assessment menu item"
                            >
                              {/* Text Label */}
                              <span
                                style={{
                                  flex: 1,
                                  lineHeight: "1.4",
                                  letterSpacing: "0.025em",
                                }}
                              >
                                Assessment
                              </span>

                              {currentView === "difficulty" && (
                                <div
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "#6366f1",
                                    flexShrink: 0,
                                    animation: "pulse 2s infinite",
                                  }}
                                />
                              )}
                            </div>
                            <style jsx>{`
                              @keyframes pulse {
                                0%,
                                100% {
                                  opacity: 1;
                                }
                                50% {
                                  opacity: 0.5;
                                }
                              }
                            `}</style>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                {/* {sidebarOpen && (
                  <div
                    className="overlay"
                    onClick={() => setSidebarOpen(false)}
                  ></div>
                )} */}
              </div>
            </div>
          </div>
        )}

        {isMobile && sidebarOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className="submodule-wrapper"
          style={{
            boxSizing: "border-box",
            overflowX: "hidden",
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            className="submodule-main-content"
            style={{
              padding: "32px 40px 32px 40px",
              background: "#f8fafc",
              height: "100%",
              boxSizing: "border-box",
              borderRadius: "10px",
              marginLeft: "0px",
              flex: 1,
              overflowY: "auto",
            }}
            ref={sectionRef}
          >
            {currentView === "assessment" ? (
              //  <style>{tabStyles}</style>
              navigate("/assessment", {
                state: {
                  THEME,
                  selectedDifficulty,
                  userObs,
                  facultyObs,
                  showModal,
                  showAISummary,
                  aiComparison,
                  loading,
                  showFeedbackModal,
                  selectedFeedback,
                },
              })
            ) : currentView === "difficulty" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  padding: "16px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "16px",
                  // border: "1px solid #e5e7eb",
                  // margin: "20px",
                  animation: "slideIn 0.3s ease-out",
                }}
              >
                <div
                  className="d-flex flex-row align-items-center "
                  style={{
                    gap: "24px",
                    width: "100%",
                  }}
                >
                  <button
                    onClick={() => setCurrentView("main")}
                    className="assessment-back-button"
                  >
                    ← Back to Pathologies
                  </button>

                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      margin: 0,
                      color: "#1f2937",
                    }}
                  >
                    Choose Assessment
                  </h3>
                </div>

                <div
                  style={{
                    width: "100%",
                    borderTop: "1px solid lightgray",
                    margin: "0px 0",
                  }}
                ></div>

                <div className="assessment-grid-cards">
                  {[
                    {
                      title: "Beginner Assessment",
                      desc: "Perfect for learners starting out. Focuses on identifying basic findings and patterns.",
                    },
                    {
                      title: "Intermediate Assessment",
                      desc: "Ideal for those with some experience. Includes moderately complex cases for deeper analysis.",
                    },
                    {
                      title: "Advanced Assessment",
                      desc: "Designed for experienced users. Includes complex DICOM cases and multi-system analysis.",
                    },
                    {
                      title: "Expert Challenge",
                      desc: "Test your diagnostic accuracy with rare and high-difficulty pathologies.",
                    },
                    {
                      title: "Case Review Mode",
                      desc: "Review curated real-world cases and compare your findings with expert interpretations.",
                    },
                    {
                      title: "Timed Quiz",
                      desc: "Assess your speed and accuracy under timed conditions across multiple case types.",
                    },
                  ].map((card, i) => (
                    <div key={i} className="assessment-card-content">
                      <h3 className="assessment-card-title">{card.title}</h3>
                      <p className="assessment-card-description">{card.desc}</p>
                      <button
                        className="assessment-card-button"
                        onClick={() => handleDifficultyCardClick(card.title)}
                      >
                        Start Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div
                  className="header"
                  style={{
                    justifyContent: "space-between",
                  }}
                >
                  <h2
                    style={{
                      color: "darkslategray",
                      fontWeight: "bold",
                      marginLeft: "16px",
                      fontSize:
                        isMobile && activeModuleName
                          ? "20px"
                          : isMobile
                          ? "24px"
                          : "28px",
                    }}
                  >
                    {!activeModuleName
                      ? "Select a Module"
                      : selectedSubModuleId
                      ? `${activeModuleName} Sessions`
                      : `${activeModuleName} Pathologies`}
                  </h2>

                  {activeModuleName && (
                    <button
                      onClick={() => {
                        if (selectedSubModuleId) {
                          setSelectedSubModuleId(null);
                          setSelectedLevel(null);
                        } else {
                          setActiveModuleId(null);
                          setActiveModuleName(null);
                          setSelectedLevel(null);
                        }
                      }}
                      className="back-link"
                      style={{
                        marginLeft: isMobile ? "25px" : "",
                      }}
                    >
                      <KeyboardDoubleArrowLeftIcon />
                      {selectedSubModuleId
                        ? `Back to ${activeModuleName} Pathologies`
                        : `Back to Modules`}
                    </button>
                  )}
                </div>

                {initialView ? (
                  <div className="submodule-grid-right">
                    {loadingModules ? (
                      <div className="loading-message">Loading modules...</div>
                    ) : modulesError ? (
                      <div className="error-message">Error: {modulesError}</div>
                    ) : (
                      allModules.map((mod) => (
                        <div
                          key={mod._id}
                          className={`module-card ${viewMode}`}
                          onClick={() => handleModuleClick(mod)}
                          style={{
                            padding: isMobile ? "8px 8px" : "",
                          }}
                        >
                          <img
                            src={mod.imageUrl || getRandomImage()}
                            alt={mod.moduleName}
                            className="module-thumbnail"
                          />
                          <div className="module-info">
                            <h4 className="module-title">{mod.moduleName}</h4>
                            {isMobile ? null : (
                              <p className="module-description" style={{}}>
                                {mod.description ||
                                  `Explore pathologies of the ${mod.moduleName} joint.`}
                              </p>
                            )}
                            <span className="module-pathologies-count">
                              {mod.totalPathologiesCount || 0} pathologies
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <>
                    {/* <div
                      className="breadcrumb"
                      style={{
                        margin: isMobile ? "5px 0 4px 0" : "",
                        fontSize: isMobile ? "12px" : "",
                      }}
                    >
                      <span
                        onClick={() => {
                          setActiveModuleId(null);
                          setActiveModuleName(null);
                          setSelectedSubModuleId(null);
                          setSelectedLevel(null);
                        }}
                        className="breadcrumb-link"
                      >
                        Modules{" "}
                      </span>
                      {selectedSubModuleId && (
                        <>
                          <span className="breadcrumb-separator">/</span>
                          <span
                            onClick={() => {
                              setSelectedSubModuleId(null);
                              setSelectedLevel(null);
                            }}
                            className="breadcrumb-link"
                          >
                            {activeModuleName} Pathologies{" "}
                          </span>
                        </>
                      )}
                      {selectedSubModuleId && selectedLevel && (
                        <>
                          <span className="breadcrumb-separator">/</span>
                          <span
                            onClick={() => setSelectedLevel(null)}
                            className="breadcrumb-link"
                          >
                            {selectedLevel.charAt(0).toUpperCase() +
                              selectedLevel.slice(1)}
                          </span>
                        </>
                      )}
                    </div> */}
                    <div className="submodule-grid-right">
                      {/* <div className="submodule-container"> */}
                      {/* <div
                        className={`submodule-item ${viewMode}-view`}
                        onClick={handleAssessmentClick}
                      >
                        <img
                          src={"/assets/images/assessment-thumbnail.jpg"}
                          alt="Assessment"
                          className="submodule-thumbnail"
                        />
                        <div
                          className="submodule-title"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            fontWeight: "600",
                            fontSize: "18px",
                          }}
                        >
                          <i
                            className="fas fa-angle-right icon-indicator"
                            style={{ marginRight: "10px" }}
                          ></i>
                          Module Assessment
                        </div>
                        <div className="submodule-type-badges">
                          <span className="type-badge badge-assessment">
                            Assessment
                          </span>
                          <span className="type-badge badge-quiz">
                            Questions:{" "}
                            {getAssessmentForModule(activeModuleName)
                              ?.totalQuestions || "N/A"}
                          </span>
                        </div>
                      </div> */}
                    </div>

                    {loadingPathologies ? (
                      <div className="loading-message">
                        Loading pathologies...
                      </div>
                    ) : pathologiesError ? (
                      <div className="error-message">
                        Error: {pathologiesError}
                      </div>
                    ) : modulePathologiesData.length === 0 ? (
                      <div className="no-data-message">
                        No pathologies found for this module.
                      </div>
                    ) : !selectedSubModuleId ? (
                      <div className="submodule-container">
                        {modulePathologiesData.map((pathologyItem) => {
                          const staticSubModuleDataForPathology =
                            subModulesData[activeModuleName]?.find(
                              (sub) => sub.name === pathologyItem.pathologyName
                            );

                          const apiSessionsForPathology =
                            pathologyItem.sessions || [];
                          const staticSessionsForPathology = [
                            ...(staticSubModuleDataForPathology?.levels
                              ?.beginner || []),
                            ...(staticSubModuleDataForPathology?.levels
                              ?.advanced || []),
                          ];
                          const combinedSessionsForCounts = [
                            ...apiSessionsForPathology,
                            ...staticSessionsForPathology,
                          ];

                          const counts = countTypes(combinedSessionsForCounts);

                          return (
                            <div
                              key={pathologyItem._id}
                              className="submodule-item grid-view"
                              onClick={() =>
                                handleSubModuleClick(pathologyItem)
                              }
                            >
                              <img
                                src={
                                  `https://primerad-backend.onrender.com${pathologyItem.imageUrl}` ||
                                  staticSubModuleDataForPathology?.thumbnail ||
                                  getRandomImage()
                                }
                                alt={pathologyItem.pathologyName}
                                className="submodule-thumbnail"
                                style={{
                                  width: isMobile ? "35px" : "",
                                }}
                              />

                              <div
                                className="submodule-title"
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  fontWeight: 600,
                                  fontSize: isMobile ? "14px" : "18px",
                                }}
                              >
                                {/* <i
                                  className="fas fa-angle-right icon-indicator"
                                  style={{
                                    marginRight: isMobile ? "5px" : "10px",
                                  }}
                                /> */}
                                {pathologyItem.pathologyName}
                              </div>

                              <div
                                className="submodule-type-badges"
                                style={{
                                  display: "flex",
                                  gap: "6px",
                                  marginTop: "8px",
                                  marginLeft: isMobile ? "5px" : "10px",
                                }}
                              >
                                <span
                                  className="type-badge badge-lecture"
                                  style={{ fontSize: isMobile ? "9px" : "" }}
                                >
                                  Lectures: {counts.lecture}
                                </span>
                                <span
                                  className="type-badge badge-case"
                                  style={{ fontSize: isMobile ? "9px" : "" }}
                                >
                                  Cases: {counts.case}
                                </span>
                                <span
                                  className="type-badge badge-live"
                                  style={{ fontSize: isMobile ? "9px" : "" }}
                                >
                                  Live: {counts.live}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : selectedSubModuleId ? (
                      <div
                        className={
                          viewMode === "list"
                            ? "lecture-grid-view"
                            : "lecture-grid-view"
                        }
                      >
                        <div
                          className="polished-filter-bar"
                          style={{ gap: isMobile ? "1px" : "" }}
                        >
                          <label className="polished-filter-checkbox">
                            <input
                              type="checkbox"
                              checked={filters.dicom}
                              onChange={() => handleFilterChange("dicom")}
                            />
                            <span
                              className="polished-custom-checkbox"
                              style={{
                                width: isMobile ? "14px" : "18px",
                                height: isMobile ? "14px" : "18px",
                              }}
                            />
                            DICOM
                          </label>
                          <label className="polished-filter-checkbox">
                            <input
                              type="checkbox"
                              checked={filters.lecture}
                              onChange={() => handleFilterChange("lecture")}
                            />
                            <span
                              className="polished-custom-checkbox"
                              style={{
                                width: isMobile ? "14px" : "18px",
                                height: isMobile ? "14px" : "18px",
                              }}
                            />
                            Lectures
                          </label>
                          <label className="polished-filter-checkbox live">
                            <input
                              type="checkbox"
                              checked={filters.live}
                              onChange={() => handleFilterChange("live")}
                            />
                            <span
                              className="polished-custom-checkbox"
                              style={{
                                width: isMobile ? "14px" : "18px",
                                height: isMobile ? "14px" : "18px",
                              }}
                            />
                            Live
                          </label>
                        </div>

                        <div className="polished-grid-container">
                          {loadingLevelSessions ? (
                            <div
                              className="loading-message"
                              style={{ textAlign: "center", padding: "20px" }}
                            >
                              Loading sessions...
                            </div>
                          ) : levelSessionsError ? (
                            <div
                              className="error-message"
                              style={{
                                textAlign: "center",
                                padding: "20px",
                                color: "#d32f2f",
                              }}
                            >
                              {levelSessionsError}
                            </div>
                          ) : allSessions.length === 0 ? (
                            <div
                              className="no-data-message"
                              style={{
                                textAlign: "center",
                                padding: "20px",
                                color: "#666",
                              }}
                            >
                              No sessions found for this pathology.
                            </div>
                          ) : (
                            allSessions
                              .filter((session) => {
                                const sessionType =
                                  session.sessionType?.toLowerCase() ||
                                  session.type?.toLowerCase();
                                return (
                                  ((sessionType === "dicom" ||
                                    sessionType === "case") &&
                                    filters.dicom) ||
                                  ((sessionType === "vimeo" ||
                                    sessionType === "lecture") &&
                                    filters.lecture) ||
                                  (sessionType === "live" && filters.live)
                                );
                              })
                              .map((session) => (
                                <>
                                  <div
                                    key={session._id || session.id}
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "3px",
                                    }}
                                  >
                                    <div
                                      className={`lecture-card polished-grid-view ${
                                        isMobile ? "mobile" : ""
                                      }`}
                                      onClick={() =>
                                        handleSessionClick(session)
                                      }
                                    >
                                      <div className="polished-grid-thumbnail">
                                        <img
                                          src={`https://primerad-backend.onrender.com${
                                            session.imageUrl_522x760 ||
                                            session.imageUrl_1920x1080 ||
                                            session.thumbnail
                                          }`}
                                          alt={session.title}
                                        />
                                      </div>
                                    </div>
                                    <div className="polished-grid-content">
                                      <div className="title-row">
                                        <div className="polished-grid-title">
                                          {session.title}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="group-tags">
                                      <div className="label-tag">
                                        <OndemandVideoIcon
                                          style={{
                                            width: "15px",
                                            height: "20px",
                                            marginRight: 4,
                                          }}
                                        ></OndemandVideoIcon>
                                        {session.sessionType === "Vimeo"
                                          ? "Lecture"
                                          : "Case"}
                                      </div>
                                      <div className="label-tag">
                                        {session.difficulty}
                                      </div>
                                      {/* <div className="label-tag">
                                            {session.sessionType}
                                          </div> */}
                                    </div>
                                  </div>
                                </>
                              ))
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px",
                          color: "#666",
                        }}
                      >
                        Select a pathology to view its sessions.
                      </div>
                    )}
                    {/* </div> */}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubModuleView;
