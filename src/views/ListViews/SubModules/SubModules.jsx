import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import "./SubModules.css";

const modules = [
  { name: "Knee", pathologies: 5 },
  { name: "Shoulder", pathologies: 7 },
  { name: "Spine", pathologies: 2 },
  { name: "Ankle", pathologies: 2 },
  { name: "Elbow", pathologies: 2 },
  { name: "Hip", pathologies: 2 },
];

const subModulesData = {
  Knee: [
    {
      name: "ACL",
      pathologies: 5,
      thumbnail: "/assets/images/knee1.jpg",
      levels: {
        beginner: [
          {
            title: "ACL Basics",
            type: "lecture",
            description: "Introduction to ACL anatomy and function.",
            thumbnail: "/assets/images/knee1.jpg",
            id: "60d0fe4f5b5b2e001c8d0d51",
            vimeoVideoId: "1097623899",
            duration: "10:30",
            startDate: "2024-03-01T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. A. Jones",
          },
          {
            title: "ACL Case 1",
            type: "case",
            description: "Case study: ACL tear in a young athlete.",
            thumbnail: "/assets/images/knee2.jpg",
            id: "60d0fe4f5b5b2e001c8d0d52",
            contentType: "Case",
          },
          {
            title: "ACL Live Q&A",
            type: "live",
            description: "Live Q&A session on ACL reconstruction.",
            thumbnail: "/assets/images/knee3.jpg",
            id: "60d0fe4f5b5b2e001c8d0d53",
            contentType: "Live",
          },
          {
            title: "ACL Imaging Essentials",
            type: "lecture",
            description: "Key imaging findings in ACL injuries.",
            thumbnail: "/assets/images/knee4.jpg",
            id: "60d0fe4f5b5b2e001c8d0d54",
            vimeoVideoId: "1097623899",
            duration: "18:00",
            startDate: "2024-03-05T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. A. Jones",
          },
        ],
        advanced: [
          {
            title: "Advanced ACL Repair",
            type: "lecture",
            description: "Advanced surgical techniques for ACL repair.",
            thumbnail: "/assets/images/knee5.jpg",
            id: "60d0fe4f5b5b2e001c8d0d55",
            vimeoVideoId: "1102457741",
            duration: "28:00",
            startDate: "2024-03-15T10:00:00Z",
            contentType: "Lecture",
            faculty: "Prof. B. Smith",
          },
          {
            title: "Complex ACL Case",
            type: "case",
            description: "Complex ACL injury management and treatment.",
            thumbnail: "/assets/images/knee6.jpg",
            id: "60d0fe4f5b5b2e001c8d0d56",
            contentType: "Case",
          },
          {
            title: "ACL Live Surgery",
            type: "live",
            description: "Live broadcast of ACL surgery.",
            thumbnail: "/assets/images/knee7.jpg",
            id: "60d0fe4f5b5b2e001c8d0d57",
            contentType: "Live",
          },
          {
            title: "ACL Rehabilitation Protocols",
            type: "lecture",
            description: "Rehabilitation after ACL surgery.",
            thumbnail: "/assets/images/knee8.jpg",
            id: "60d0fe4f5b5b2e001c8d0d58",
            vimeoVideoId: "1102457741",
            duration: "22:00",
            startDate: "2024-03-20T10:00:00Z",
            contentType: "Lecture",
            faculty: "Prof. B. Smith",
          },
        ],
      },
    },
    {
      name: "Meniscus",
      pathologies: 7,
      thumbnail: "/assets/images/knee2.jpg",
      levels: {
        beginner: [
          {
            title: "Meniscus Basics",
            type: "lecture",
            description: "Introduction to meniscus anatomy and function.",
            thumbnail: "/assets/images/knee2.jpg",
            id: "60d0fe4f5b5b2e001c8d0d59",
            vimeoVideoId: "1102457741",
            duration: "15:00",
            startDate: "2024-04-01T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. C. Lee",
          },
          {
            title: "Meniscus Case 1",
            type: "case",
            description: "Case study on meniscus repair.",
            thumbnail: "/assets/images/knee3.jpg",
            id: "60d0fe4f5b5b2e001c8d0d60",
            contentType: "Case",
          },
          {
            title: "Meniscus Live Webinar",
            type: "live",
            description: "Live webinar on meniscus injuries.",
            thumbnail: "/assets/images/knee4.jpg",
            id: "60d0fe4f5b5b2e001c8d0d61",
            contentType: "Live",
          },
        ],
        advanced: [
          {
            title: "Advanced Meniscus Repair",
            type: "lecture",
            description: "Advanced techniques for meniscus repair.",
            thumbnail: "/assets/images/knee5.jpg",
            id: "60d0fe4f5b5b2e001c8d0d62",
            vimeoVideoId: "1097623899",
            duration: "20:00",
            startDate: "2024-04-10T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. D. Patel",
          },
          {
            title: "Meniscus Live Q&A",
            type: "live",
            description: "Live Q&A on meniscus injuries.",
            thumbnail: "/assets/images/knee6.jpg",
            id: "60d0fe4f5b5b2e001c8d0d63",
            contentType: "Live",
          },
          {
            title: "Meniscus Case: Elderly Patient",
            type: "case",
            description: "Case: Meniscus tear in an elderly patient.",
            thumbnail: "/assets/images/knee7.jpg",
            id: "60d0fe4f5b5b2e001c8d0d64",
            contentType: "Case",
          },
        ],
      },
    },
  ],
  Shoulder: [
    {
      name: "Rotator Cuff",
      pathologies: 2,
      thumbnail: "/assets/images/rotator-cuff.jpg",
      levels: {
        beginner: [
          {
            title: "Rotator Cuff Anatomy",
            type: "lecture",
            description: "Basic anatomy of the rotator cuff muscles.",
            thumbnail: "/assets/images/rotator-cuff (1).jpg",
            id: "60d0fe4f5b5b2e001c8d0d65",
            vimeoVideoId: "1102457741",
            duration: "12:00",
            startDate: "2024-05-01T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. E. King",
          },
          {
            title: "Rotator Cuff Case",
            type: "case",
            description: "Case study on rotator cuff repair.",
            thumbnail: "/assets/images/rotator-cuff.jpg",
            id: "60d0fe4f5b5b2e001c8d0d66",
            contentType: "Case",
          },
          {
            title: "Rotator Cuff Live Q&A",
            type: "live",
            description: "Live Q&A on rotator cuff injuries.",
            thumbnail: "/assets/images/rotator-cuff.jpg",
            id: "60d0fe4f5b5b2e001c8d0d67",
            contentType: "Live",
          },
        ],
        advanced: [
          {
            title: "Rotator Cuff Live Surgery",
            type: "live",
            description: "Live surgery demonstration.",
            thumbnail: "/assets/images/rotator-cuff.jpg",
            id: "60d0fe4f5b5b2e001c8d0d68",
            contentType: "Live",
          },
          {
            title: "Rotator Cuff Imaging",
            type: "lecture",
            description: "Imaging findings in rotator cuff tears.",
            thumbnail: "/assets/images/rotator-cuff.jpg",
            id: "60d0fe4f5b5b2e001c8d0d69",
            vimeoVideoId: "1097623899",
            duration: "25:00",
            startDate: "2024-05-15T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. F. Grey",
          },
          {
            title: "Rotator Cuff Case: Athlete",
            type: "case",
            description: "Case: Rotator cuff tear in an athlete.",
            thumbnail: "/assets/images/rotator-cuff.jpg",
            id: "60d0fe4f5b5b2e001c8d0d70",
            contentType: "Case",
          },
        ],
      },
    },
    {
      name: "Tears and Rasions",
      pathologies: 2,
      thumbnail: "/assets/images/rotator-cuff.jpg",
      levels: {
        beginner: [
          {
            title: "Tears Basics",
            type: "lecture",
            description:
              "Introduction to different types of tears and abrasions.",
            thumbnail: "/assets/images/rotator-cuff.jpg",
            id: "687f617f001b126d3ebf6364_vid1",
            vimeoVideoId: "1102457741",
            duration: "18:00",
            startDate: "2024-06-01T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. G. White",
          },
        ],
        advanced: [
          {
            title: "Complex Tears Case",
            type: "case",
            description: "Case study: Complex tear in a joint.",
            thumbnail: "/assets/images/rotator-cuff.jpg",
            id: "687f617f001b126d3ebf6364_case1",
            contentType: "Case",
          },
        ],
      },
    },
    {
      name: "Strains",
      pathologies: 2,
      thumbnail: "/assets/images/sprain.jpg",
      levels: {
        beginner: [
          {
            title: "Strains Basics",
            type: "lecture",
            description: "Understanding muscle strains and their causes.",
            thumbnail: "/assets/images/sprain.jpg",
            id: "6881eba97607e55b28d18c16_vid1",
            vimeoVideoId: "1097623899",
            duration: "15:00",
            startDate: "2024-07-01T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. H. Black",
          },
        ],
        advanced: [
          {
            title: "Advanced Strain Management",
            type: "case",
            description: "Case study: Chronic muscle strain in an athlete.",
            thumbnail: "/assets/images/sprain.jpg",
            id: "6881eba97607e55b28d18c16_case1",
            contentType: "Case",
          },
        ],
      },
    },
    {
      name: "Dislocations and Separations",
      pathologies: 2,
      thumbnail: "/assets/images/dislocation.png",
      levels: {
        beginner: [
          {
            title: "Dislocation Basics",
            type: "lecture",
            description: "Basics of shoulder dislocations and separations.",
            thumbnail: "/assets/images/dislocation.png",
            id: "60d0fe4f5b5b2e001c8d0d75",
            vimeoVideoId: "1102457741",
            duration: "17:00",
            startDate: "2024-07-10T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. I. Green",
          },
        ],
        advanced: [
          {
            title: "Dislocation Case",
            type: "case",
            description: "Case study: Shoulder dislocation in a gymnast.",
            thumbnail: "/assets/images/dislocation.png",
            id: "60d0fe4f5b5b2e001c8d0d76",
            contentType: "Case",
          },
        ],
      },
    },
    {
      name: "Shoulder Impingement Syndrome",
      pathologies: 2,
      thumbnail: "/assets/images/rotator-cuff.jpg",
      levels: {
        beginner: [
          {
            title: "Impingement Overview",
            type: "lecture",
            description: "Overview of shoulder impingement syndrome.",
            thumbnail: "/assets/images/rotator-cuff.jpg",
            id: "60d0fe4f5b5b2e001c8d0d77",
            vimeoVideoId: "1097623899",
            duration: "20:00",
            startDate: "2024-07-15T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. J. Brown",
          },
        ],
        advanced: [
          {
            title: "Impingement Case",
            type: "case",
            description: "Case study: Impingement syndrome in a tennis player.",
            thumbnail: "/assets/images/rotator-cuff.jpg",
            id: "60d0fe4f5b5b2e001c8d0d78",
            contentType: "Case",
          },
        ],
      },
    },
    {
      name: "Arthritis",
      pathologies: 2,
      thumbnail: "/assets/images/arthritis.webp",
      levels: {
        beginner: [
          {
            title: "Arthritis Basics",
            type: "lecture",
            description: "Introduction to shoulder arthritis.",
            thumbnail: "/assets/images/arthritis.webp",
            id: "60d0fe4f5b5b2e001c8d0d79",
            vimeoVideoId: "1102457741",
            duration: "16:00",
            startDate: "2024-07-20T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. K. White",
          },
        ],
        advanced: [
          {
            title: "Arthritis Case",
            type: "case",
            description:
              "Case study: Shoulder arthritis in an elderly patient.",
            thumbnail: "/assets/images/arthritis.webp",
            id: "60d0fe4f5b5b2e001c8d0d80",
            contentType: "Case",
          },
        ],
      },
    },
  ],
  Spine: [], // Ensure you populate these with data similar to Knee/Shoulder if they are to be functional
  Ankle: [],
  Elbow: [],
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
    {
      name: "Osteoarthritis",
      pathologies: 3,
      thumbnail: "/assets/images/hip.jpg",
      levels: {
        beginner: [
          {
            title: "Hip OA Basics",
            type: "lecture",
            description: "Understanding osteoarthritis of the hip.",
            thumbnail: "/assets/images/hip5.jpg",
            id: "hip_oa_vid1",
            vimeoVideoId: "1097623899",
            duration: "18:00",
            startDate: "2024-08-10T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. N. White",
          },
        ],
        advanced: [
          {
            title: "Hip Replacement Surgery",
            type: "live",
            description: "Live demonstration of a total hip replacement.",
            thumbnail: "/assets/images/hip6.jpg",
            id: "hip_oa_live1",
            contentType: "Live",
          },
          {
            title: "Hip OA Rehabilitation",
            type: "lecture",
            description: "Post-surgery rehabilitation protocols for hip OA.",
            thumbnail: "/assets/images/hip7.jpg",
            id: "hip_oa_vid2",
            vimeoVideoId: "1102457741",
            duration: "20:00",
            startDate: "2024-08-15T10:00:00Z",
            contentType: "Lecture",
            faculty: "Dr. O. Black",
          },
        ],
      },
    },
  ],
};

// Mock assessment data per module (only one assessment per module)
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

// Utility to format date
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
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    },
    { lecture: 0, case: 0, live: 0 }
  );
};

const countSubmoduleTypes = (sub) => {
  if (!sub || !sub.levels) {
    return { lecture: 0, case: 0, live: 0 };
  }
  const beginner = countTypes(sub.levels.beginner);
  const advanced = countTypes(sub.levels.advanced);
  return {
    lecture: beginner.lecture + advanced.lecture,
    case: beginner.case + advanced.case,
    live: beginner.live + advanced.live,
  };
};

const countLevelTypes = (levelItems) => countTypes(levelItems);

const moduleIcons = {
  Knee: "🦵",
  Shoulder: "💪",
  Spine: "🦴",
  Ankle: "🦶",
  Elbow: "💪",
  Hip: "🦵",
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

// Helper to get icon and label for type
const typeIcons = {
  lecture: { icon: "▶️", label: "Video", className: "badge-lecture" },
  case: { icon: "🩺", label: "Dicom", className: "badge-case" },
  live: { icon: "📺", label: "Live", className: "badge-live" },
};

const SubModuleView = () => {
  const { moduleName: urlModuleName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const { moduleId: activeModuleId, moduleName: passedModuleName } =
    location.state || {};
  const activeModuleName =
    passedModuleName ||
    urlModuleName.charAt(0).toUpperCase() +
      urlModuleName.slice(1).toLowerCase();

  const [modulePathologiesData, setModulePathologiesData] = useState([]);
  const [loadingPathologies, setLoadingPathologies] = useState(true);
  const [pathologiesError, setPathologiesError] = useState(null);

  const [viewMode, setViewMode] = useState("list");
  const [selectedSubModule, setSelectedSubModule] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentView, setCurrentView] = useState("submodules");
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState(null);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const QUESTIONS_PER_PAGE = 5;
  const questionsPerBatch = 5; // Adjust as needed
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
  console.log(hasNextBatch);
  const [filters, setFilters] = useState({
    dicom: true,
    lecture: true,
    live: true,
  });

  useEffect(() => {
    if (currentView === "assessment" && selectedDifficulty && activeModuleId) {
      fetchAssessmentQuestions();
    }
  }, [currentView, selectedDifficulty, activeModuleId]);

  // Updated assessment functions with proper flow and state management

  const fetchAssessmentQuestions = async () => {
    try {
      setAssessmentLoading(true);
      setAssessmentError(null);

      const response = await axios.get(
        `http://localhost:5000/api/assessments/getByModule?moduleId=${activeModuleId}&difficulty=${selectedDifficulty.toLowerCase()}`
      );

      if (response.data && Array.isArray(response.data.data)) {
        setAssessmentQuestions(response.data.data);
        setCurrentBatch(0); // Reset to first batch
        setSelectedAnswers({});
        setAssessmentResults(null);
        setUserProgress({ totalPoints: 0 }); // Reset progress
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

  // Function to handle answer selection
  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  };

  // Function to submit all answers and get final results
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

      // Loop through all answers and submit individually
      for (const q of assessmentQuestions) {
        const res = await axios.post(
          "http://localhost:5000/api/assessments/answer",
          {
            userId: getUserId,
            assessmentId: q._id,
            selectedAnswer: selectedAnswers[q._id],
          }
        );

        if (res.data.isCorrect) correctAnswers++;
        totalPoints = res.data.totalPoints; // backend keeps running total
      }

      // Update final results
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

      // Update user progress in state
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

  // Calculate batch navigation

  // Function to handle batch navigation
  const handleNextBatch = () => {
    // Check if current batch questions are answered
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

  // Function to reset assessment
  const resetAssessment = () => {
    setCurrentView("difficulty");
    setAssessmentResults(null);
    setCurrentBatch(0);
    setSelectedAnswers({});
    setAssessmentQuestions([]);
    setUserProgress({ totalPoints: 0 });
  };

  // Updated JSX for the assessment section
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

    // Render questions
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

            <div style={{ marginLeft: "8px" }}>
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

        {/* Navigation buttons */}
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

  // Updated header section for the assessment
  const renderAssessmentHeader = () => (
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
  useEffect(() => {
    const fetchPathologies = async () => {
      if (!activeModuleId) {
        console.warn(
          "Module ID not found in navigation state. Cannot fetch pathologies."
        );
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
          `http://localhost:5000/api/pathologies/getByModule?moduleId=${activeModuleId}`
        );

        if (response.data && Array.isArray(response.data.data)) {
          setModulePathologiesData(response.data.data);
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
      } finally {
        setLoadingPathologies(false);
      }
    };

    fetchPathologies();
  }, [activeModuleId]);

  const handleFilterChange = (type) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSubModuleClick = (pathologyItem) => {
    const staticDataForVideos = subModulesData[activeModuleName]?.find(
      (sub) => sub.name === pathologyItem.pathologyName
    );

    setSelectedSubModule(
      staticDataForVideos || {
        name: pathologyItem.pathologyName,
        levels: { beginner: [], advanced: [] },
        isPlaceholder: true,
      }
    );
    setSelectedLevel(null);
    setSelectedVideo(null);

    if (!staticDataForVideos) {
      console.warn(
        `No static video data found for pathology: ${pathologyItem.pathologyName} under module: ${activeModuleName}. Content might be missing.`
      );
    }
  };

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    setSelectedVideo(null);
  };

  const handleVideoClick = (vid) => {
    setSelectedVideo(vid);
    if (vid.type === "case") {
      navigate(`/case/${vid.id}`);
    } else if (vid.type === "lecture") {
      navigate("/movies-detail", {
        state: {
          id: vid.id,
          vimeoVideoId: vid.vimeoVideoId,
          title: vid.title,
          description: vid.description,
          faculty: vid.faculty || "Expert Faculty",
          module: activeModuleName,
          submodule: selectedSubModule?.name,
          duration: vid.duration,
          startDate: vid.startDate,
          contentType: vid.type,
        },
      });
    } else if (vid.type === "live") {
      navigate("/livepage", {
        state: {
          id: vid.id,
          vimeoVideoId: vid.vimeoVideoId,
          title: vid.title,
          description: vid.description,
          faculty: vid.faculty || "Expert Faculty",
          module: activeModuleName,
          submodule: selectedSubModule?.name,
          duration: vid.duration,
          startDate: vid.startDate,
          contentType: vid.type,
        },
      });
    }
  };

  const resetToLevels = () => {
    setSelectedLevel(null);
    setSelectedVideo(null);
  };

  const resetToVideos = () => {
    setSelectedVideo(null);
  };

  const handleAssessmentClick = () => {
    setCurrentView("difficulty");
    setSelectedSubModule(null);
    setSelectedLevel(null);
    setSelectedVideo(null);
  };

  const handleDifficultyCardClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentView("assessment");
  };

  const resetToSubModules = () => {
    setSelectedSubModule(null);
    setSelectedLevel(null);
    setSelectedVideo(null);
    setCurrentView("submodules");
  };

  return (
    <>
      <div
        className="submodule-wrapper"
        style={{ boxSizing: "border-box", overflowX: "hidden" }}
      >
        {currentView != "assessment" ? (
          <>
            <button
              className={`arrow-toggle ${sidebarOpen ? "open" : ""}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
              {/* <p>Modules nav</p> */}
            </button>
            <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
              <h3>Modules</h3>
              {modules.map((mod, modIdx) => (
                <div key={mod.name}>
                  <div
                    className={`sidebar-item ${
                      mod.name === activeModuleName ? "active" : ""
                    }`}
                    onClick={() => {
                      navigate(`/atlas/${mod.name.toLowerCase()}`);
                      resetToSubModules();
                    }}
                  >
                    <span className="sidebar-number">{modIdx + 1}.</span>
                    <span className="sidebar-icon">
                      {moduleIcons[mod.name]}
                    </span>
                    <span>{mod.name}</span>
                    <span className="count">{mod.pathologies}</span>
                  </div>

                  {activeModuleName === mod.name && (
                    <div className="submodule-list">
                      {loadingPathologies ? (
                        <div className="sidebar-loading">
                          Loading pathologies...
                        </div>
                      ) : pathologiesError ? (
                        <div className="sidebar-error">
                          Error: {pathologiesError}
                        </div>
                      ) : modulePathologiesData.length === 0 ? (
                        <div className="sidebar-empty">
                          No pathologies found for this module.
                        </div>
                      ) : (
                        modulePathologiesData.map((pathologyItem) => {
                          const staticSubModuleDataForPathology =
                            subModulesData[activeModuleName]?.find(
                              (sub) => sub.name === pathologyItem.pathologyName
                            );

                          const counts = countSubmoduleTypes(
                            staticSubModuleDataForPathology
                          );

                          return (
                            <div key={pathologyItem._id}>
                              <div
                                className={`sidebar-subitem${
                                  selectedSubModule?.name ===
                                  pathologyItem.pathologyName
                                    ? " open"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSubModuleClick(pathologyItem)
                                }
                              >
                                <span
                                  className={`chevron${
                                    selectedSubModule?.name ===
                                    pathologyItem.pathologyName
                                      ? " rotated"
                                      : ""
                                  }`}
                                >
                                  ▶
                                </span>
                                <span className="sidebar-sub-icon">
                                  {submoduleIcons[
                                    pathologyItem.pathologyName
                                  ] || "🦴"}
                                </span>
                                {pathologyItem.pathologyName}
                              </div>
                              {selectedSubModule?.name ===
                                pathologyItem.pathologyName && (
                                <div className="sidebar-video-dropdown">
                                  {staticSubModuleDataForPathology ? (
                                    <>
                                      <div
                                        className="sidebar-video-item"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleLevelClick("beginner");
                                        }}
                                      >
                                        <span className="sidebar-video-title">
                                          Beginner (
                                          {counts.lecture +
                                            counts.case +
                                            counts.live}
                                          )
                                        </span>
                                      </div>
                                      <div
                                        className="sidebar-video-item"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleLevelClick("advanced");
                                        }}
                                      >
                                        <span className="sidebar-video-title">
                                          Advanced (
                                          {counts.lecture +
                                            counts.case +
                                            counts.live}
                                          )
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="sidebar-empty-level">
                                      No videos found for this pathology yet.
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}

                      {/* Assessment entry - remains static for now */}
                      <div
                        className="sidebar-assessment-item"
                        onClick={handleAssessmentClick}
                        style={{
                          marginTop: "10px",
                          padding: "10px",
                          backgroundColor:
                            currentView === "difficulty" ||
                            currentView === "assessment"
                              ? "#e3f2fd"
                              : "#f5f5f5",
                          borderRadius: "8px",
                          cursor: "pointer",
                          border:
                            currentView === "difficulty" ||
                            currentView === "assessment"
                              ? "2px solid #2196f3"
                              : "1px solid #ddd",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>📝</span>
                        <span
                          style={{
                            fontWeight: "500",
                            backgroundColor: "lavenderblush",
                          }}
                        >
                          Module Assessment
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>{" "}
            {sidebarOpen && (
              <div
                className="overlay"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}
          </>
        ) : null}

        {/* --- Main Content Area --- */}
        <div className="main-content">
          {currentView === "assessment" ? (
            <div>
              <button
                onClick={() => navigate("/atlas")}
                className="back-link"
                style={{}}
              >
                ← Back to Modules
              </button>

              <div
                style={{
                  display: "flex",
                  height: "calc(100vh - 64px)",
                  // marginTop: 0,
                  background: "#f4f8fb",
                  borderRadius: 16,
                  overflowy: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  position: "relative",
                }}
              >
                {/* Left: Assessment Form */}
                <div
                  style={{
                    flex: 1,
                    borderRight: "1px solid #e0e0e0",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    background: "#fff",
                    borderRadius: "16px 0 0 16px",
                    margin: 24,
                    marginRight: 0,
                    minWidth: 320,
                    maxWidth: 420,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Header */}
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

                    {!assessmentResults?.completed &&
                      assessmentQuestions.length > 0 && (
                        <div
                          style={{
                            fontSize: "14px",
                            opacity: 0.9,
                            marginBottom: "8px",
                          }}
                        >
                          Section {currentBatch + 1} of{" "}
                          {Math.ceil(assessmentQuestions.length / 5)}
                        </div>
                      )}

                    {userProgress && (
                      <div style={{ fontSize: "12px", opacity: 0.8 }}>
                        Progress: {Object.keys(selectedAnswers).length}/
                        {assessmentQuestions.length} answered
                        {userProgress.totalPoints > 0 &&
                          ` • Current Points: ${userProgress.totalPoints}`}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: 32, flex: 1, overflowY: "auto" }}>
                    {assessmentLoading ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "50px",
                          color: "#666",
                        }}
                      >
                        <div style={{ fontSize: "18px", marginBottom: "16px" }}>
                          Loading assessment questions...
                        </div>
                        <div style={{ fontSize: "14px" }}>
                          Please wait while we prepare your assessment
                        </div>
                      </div>
                    ) : assessmentError ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "50px",
                          color: "#d32f2f",
                        }}
                      >
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
                    ) : assessmentResults && assessmentResults.completed ? (
                      // Results View
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                          🎉
                        </div>
                        <h3
                          style={{
                            color: "#4caf50",
                            marginBottom: "24px",
                            fontSize: "24px",
                          }}
                        >
                          Assessment Completed Successfully!
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
                              marginBottom: "16px",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: "12px",
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
                                {assessmentResults.totalQuestions ||
                                  assessmentQuestions.length}
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "12px",
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
                                {assessmentResults.correctAnswers || 0}
                              </div>
                            </div>
                          </div>

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
                                  fontSize: "12px",
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
                                {assessmentResults.totalPoints ||
                                  userProgress?.totalPoints ||
                                  0}
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "12px",
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
                                {assessmentResults.percentage ||
                                  Math.round(
                                    ((assessmentResults.correctAnswers || 0) /
                                      assessmentQuestions.length) *
                                      100
                                  )}
                                %
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() => {
                              setCurrentView("difficulty");
                              setAssessmentResults(null);
                              setCurrentBatch(0);
                              setSelectedAnswers({});
                              setAssessmentQuestions([]);
                              setUserProgress({ totalPoints: 0 });
                            }}
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
                    ) : assessmentQuestions.length > 0 ? (
                      // Questions View
                      <>
                        {assessmentQuestions
                          .slice(
                            currentBatch * 5,
                            Math.min(
                              (currentBatch + 1) * 5,
                              assessmentQuestions.length
                            )
                          )
                          .map((question, index) => (
                            <div
                              key={question._id}
                              style={{ marginBottom: "32px" }}
                            >
                              <h3
                                style={{
                                  color: "#263238",
                                  fontWeight: "600",
                                  fontSize: "18px",
                                  marginBottom: "16px",
                                  lineHeight: "1.4",
                                }}
                              >
                                {currentBatch * 5 + index + 1}.{" "}
                                {question.question}
                              </h3>

                              <div style={{ marginLeft: "8px" }}>
                                {Object.entries(question.options).map(
                                  ([key, value]) => (
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
                                        checked={
                                          selectedAnswers[question._id] === key
                                        }
                                        onChange={(e) =>
                                          handleAnswerSelect(
                                            question._id,
                                            e.target.value
                                          )
                                        }
                                        style={{
                                          marginRight: "12px",
                                          marginTop: "2px",
                                          transform: "scale(1.2)",
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontSize: "16px",
                                          lineHeight: "1.4",
                                        }}
                                      >
                                        <strong>{key.toUpperCase()}.</strong>{" "}
                                        {value}
                                      </span>
                                    </label>
                                  )
                                )}
                              </div>
                            </div>
                          ))}

                        {/* Navigation buttons */}
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
                            onClick={() => setCurrentBatch((prev) => prev - 1)}
                            disabled={currentBatch === 0}
                            style={{
                              background:
                                currentBatch > 0 ? "#6c757d" : "#e0e0e0",
                              color: currentBatch > 0 ? "#fff" : "#999",
                              border: "none",
                              borderRadius: "8px",
                              padding: "12px 24px",
                              fontWeight: "600",
                              cursor:
                                currentBatch > 0 ? "pointer" : "not-allowed",
                              fontSize: "16px",
                            }}
                          >
                            ← Previous
                          </button>

                          {currentBatch <
                          Math.ceil(assessmentQuestions.length / 5) - 1 ? (
                            <button
                              onClick={() => {
                                // Check if current batch questions are answered
                                const currentBatchQuestions =
                                  assessmentQuestions.slice(
                                    currentBatch * 5,
                                    Math.min(
                                      (currentBatch + 1) * 5,
                                      assessmentQuestions.length
                                    )
                                  );
                                const unansweredInBatch =
                                  currentBatchQuestions.filter(
                                    (q) => !selectedAnswers[q._id]
                                  );

                                if (unansweredInBatch.length > 0) {
                                  alert(
                                    "Please answer all questions in this section before proceeding."
                                  );
                                  return;
                                }

                                setCurrentBatch((prev) => prev + 1);
                              }}
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
                                background: submittingAnswer
                                  ? "#ccc"
                                  : "#4caf50",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                padding: "12px 24px",
                                fontWeight: "600",
                                cursor: submittingAnswer
                                  ? "not-allowed"
                                  : "pointer",
                                fontSize: "16px",
                              }}
                            >
                              {submittingAnswer ? "Submitting..." : "🏁 Finish"}
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "50px",
                          color: "#666",
                        }}
                      >
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
                    )}
                  </div>
                </div>

                {/* Right: DICOM Viewer */}
                <div
                  style={{
                    flex: 2,
                    background: "#f4f8fb",
                    borderRadius: "0 16px 16px 0",
                    margin: 24,
                    marginLeft: 0,
                    padding: 32,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <h2
                    style={{
                      color: "#1976d2",
                      fontWeight: 700,
                      fontSize: 22,
                      marginBottom: 1,
                    }}
                  >
                    DICOM Viewer
                  </h2>
                  <iframe
                    className="dicomview sessioniframe"
                    src="https://app.medicai.io/public-study/5e8c1f7e2f8fbf0017b2b1a1"
                    width="100%"
                    height="650px"
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      border: "1px solid #e0e0e0",
                      background: "#fff",
                    }}
                    title="DICOM Viewer"
                  />
                </div>
              </div>
            </div>
          ) : currentView === "difficulty" ? (
            // Difficulty Selection for Assessment
            <div className="difficulty-cards-main">
              <div
                className="difficulty-card-main"
                onClick={() => handleDifficultyCardClick("Beginner")}
              >
                <div className="level-icon">🎓</div>
                <h4 className="level-title">Beginner Assessment</h4>
                <p className="level-description">
                  Basic concepts and fundamental knowledge.
                </p>
              </div>
              <div
                className="difficulty-card-main"
                onClick={() => handleDifficultyCardClick("Advanced")}
              >
                <div className="level-icon">⚡</div>
                <h4 className="level-title">Advanced Assessment</h4>
                <p className="level-description">
                  Advanced techniques and complex cases.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header with Back button and Module Title */}
              <div className="header">
                <button
                  onClick={() => navigate("/atlas")}
                  className="back-link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 1-.5.5H2.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 1 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8z"
                    />
                  </svg>
                  Back
                </button>
                <h2 style={{ color: "darkslategray", fontWeight: "bold" }}>
                  {activeModuleName} Pathologies{" "}
                  {/* Display fetched module name */}
                </h2>

                {/* View Mode Toggles (List/Grid) */}
                {/* For SubModules only */}
                {!selectedSubModule && (
                  <div className="view-toggle">
                    <button
                      className={viewMode === "list" ? "active" : ""}
                      onClick={() => setViewMode("list")}
                    >
                      List View
                    </button>
                    <button
                      className={viewMode === "grid" ? "active" : ""}
                      onClick={() => setViewMode("grid")}
                    >
                      Grid View
                    </button>
                  </div>
                )}

                {/* Toggle for Levels (when a submodule is selected but not a level) */}
                {selectedSubModule && !selectedLevel && (
                  <div className="view-toggle">
                    <button
                      className={viewMode === "list" ? "active" : ""}
                      onClick={() => setViewMode("list")}
                    >
                      List
                    </button>
                    <button
                      className={viewMode === "grid" ? "active" : ""}
                      onClick={() => setViewMode("grid")}
                    >
                      Grid
                    </button>
                  </div>
                )}

                {/* Toggle for Videos (when a level is selected) */}
                {selectedLevel && (
                  <div className="view-toggle">
                    <button
                      className={viewMode === "list" ? "active" : ""}
                      onClick={() => setViewMode("list")}
                    >
                      List
                    </button>
                    <button
                      className={viewMode === "grid" ? "active" : ""}
                      onClick={() => setViewMode("grid")}
                    >
                      Grid
                    </button>
                  </div>
                )}
              </div>

              {/* Breadcrumb Navigation */}
              {selectedSubModule && (
                <div className="breadcrumb">
                  <span onClick={resetToSubModules} className="breadcrumb-link">
                    {activeModuleName}
                  </span>
                  <span className="breadcrumb-separator">/</span>
                  <span onClick={resetToSubModules} className="breadcrumb-link">
                    {selectedSubModule.name}
                  </span>
                  {selectedLevel && (
                    <>
                      <span className="breadcrumb-separator">/</span>
                      <span onClick={resetToLevels} className="breadcrumb-link">
                        {selectedLevel.charAt(0).toUpperCase() +
                          selectedLevel.slice(1)}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Displaying SubModules (Pathologies) or Videos based on selection */}
              {!selectedSubModule ? (
                // Display list/grid of pathologies for the active module
                <div
                  className={
                    viewMode === "list"
                      ? "submodule-list-right"
                      : "submodule-grid-right"
                  }
                >
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
                  ) : (
                    // Map over the fetched modulePathologiesData to display cards
                    modulePathologiesData.map((pathologyItem) => {
                      // <--- Loop directly over fetched data
                      // Find static data for sub-levels/videos (if needed later)
                      const staticSubModuleDataForPathology = subModulesData[
                        activeModuleName
                      ]?.find(
                        (sub) => sub.name === pathologyItem.pathologyName
                      );

                      // counts still relies on static data, so if not found, it will be 0.
                      const counts = countSubmoduleTypes(
                        staticSubModuleDataForPathology
                      );

                      return (
                        <div
                          key={pathologyItem._id} // Use backend _id as the unique key
                          className={`submodule-item ${viewMode}-view`}
                          // Pass the fetched `pathologyItem` to handleSubModuleClick
                          onClick={() => handleSubModuleClick(pathologyItem)}
                        >
                          <img
                            src={
                              `http://localhost:5000${pathologyItem.imageUrl}` ||
                              `http://localhost:5000${staticSubModuleDataForPathology?.thumbnail}` ||
                              "/assets/images/default-thumbnail.jpg" // Fallback thumbnail
                            }
                            alt={pathologyItem.pathologyName}
                            className="submodule-thumbnail"
                          />
                          <div className="submodule-title">
                            ▶ {pathologyItem.pathologyName}
                          </div>
                          <div className="submodule-type-badges">
                            <span className="type-badge badge-lecture">
                              Lectures: {counts.lecture}
                            </span>
                            <span className="type-badge badge-case">
                              Cases: {counts.case}
                            </span>
                            <span className="type-badge badge-live">
                              Live Programs: {counts.live}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : !selectedLevel ? (
                <div
                  className={
                    viewMode === "list"
                      ? "level-list-view"
                      : "level-grid-view lecture-grid-view"
                  }
                >
                  {selectedSubModule?.isPlaceholder ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "50px",
                        fontSize: "1.2rem",
                        color: "#666",
                        width: "100%",
                      }}
                    >
                      No video content defined for "{selectedSubModule.name}"
                      yet.
                    </div>
                  ) : (
                    <>
                      <div
                        className={`level-card ${viewMode}`}
                        onClick={() => handleLevelClick("beginner")}
                      >
                        <div className="level-thumbnail">
                          <div className="level-icon">🎓</div>
                        </div>
                        <div className="level-info">
                          <h4 className="level-title">Beginner</h4>
                          <p className="level-description">
                            Basic concepts and fundamental knowledge for{" "}
                            {selectedSubModule?.name}
                          </p>
                          <div className="level-full-badges">
                            {(() => {
                              const counts = countLevelTypes(
                                selectedSubModule?.levels?.beginner
                              );
                              return (
                                <>
                                  <span className="type-badge badge-lecture">
                                    Lectures: {counts.lecture}
                                  </span>
                                  <span className="type-badge badge-case">
                                    Cases: {counts.case}
                                  </span>
                                  <span className="type-badge badge-live">
                                    Live Programs: {counts.live}
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                          <p className="level-count">
                            {selectedSubModule?.levels?.beginner?.length || 0}{" "}
                            videos
                          </p>
                        </div>
                      </div>
                      <div
                        className={`level-card ${viewMode}`}
                        onClick={() => handleLevelClick("advanced")}
                      >
                        <div className="level-thumbnail">
                          <div className="level-icon">⚡</div>
                        </div>
                        <div className="level-info">
                          <h4 className="level-title">Advanced</h4>
                          <p className="level-description">
                            Advanced techniques and complex cases for{" "}
                            {selectedSubModule?.name}
                          </p>
                          <div className="level-full-badges">
                            {(() => {
                              const counts = countLevelTypes(
                                selectedSubModule?.levels?.advanced
                              );
                              return (
                                <>
                                  <span className="type-badge badge-lecture">
                                    Lectures: {counts.lecture}
                                  </span>
                                  <span className="type-badge badge-case">
                                    Cases: {counts.case}
                                  </span>
                                  <span className="type-badge badge-live">
                                    Live Programs: {counts.live}
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                          <p className="level-count">
                            {selectedSubModule?.levels?.advanced?.length || 0}{" "}
                            videos
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // Display videos for the selected level (Beginner/Advanced)
                <div
                  className={
                    viewMode === "list"
                      ? "lecture-list-view"
                      : "lecture-grid-view"
                  }
                >
                  <div className="polished-filter-bar">
                    <label className="polished-filter-checkbox">
                      <input
                        type="checkbox"
                        checked={filters.dicom}
                        onChange={() => handleFilterChange("dicom")}
                      />
                      <span className="polished-custom-checkbox" />
                      DICOM
                    </label>
                    <label className="polished-filter-checkbox">
                      <input
                        type="checkbox"
                        checked={filters.lecture}
                        onChange={() => handleFilterChange("lecture")}
                      />
                      <span className="polished-custom-checkbox" />
                      Lectures
                    </label>
                    <label className="polished-filter-checkbox live">
                      <input
                        type="checkbox"
                        checked={filters.live}
                        onChange={() => handleFilterChange("live")}
                      />
                      <span className="polished-custom-checkbox" />
                      Live Programs
                    </label>
                  </div>
                  {console.log(viewMode)}
                  <div
                    className={
                      viewMode === "list"
                        ? "polished-list-outer-card"
                        : "polished-grid-container"
                    }
                  >
                    {selectedSubModule.levels[selectedLevel]
                      .filter(
                        (vid) =>
                          (vid.type === "case" && filters.dicom) ||
                          (vid.type === "lecture" && filters.lecture) ||
                          (vid.type === "live" && filters.live)
                      )
                      .map((vid, idx) => (
                        <div
                          key={vid.id || idx}
                          className={
                            viewMode === "list"
                              ? "lecture-card polished-list-view"
                              : "polished-grid-view"
                          }
                          onClick={() => handleVideoClick(vid)}
                        >
                          <div
                            className={
                              viewMode === "list"
                                ? "polished-list-thumbicon"
                                : "polished-grid-thumbnail"
                            }
                          >
                            <img
                              src={
                                vid.thumbnail ||
                                "/assets/images/default-thumbnail.jpg"
                              }
                              alt={vid.title}
                            />
                          </div>
                          <div
                            className={
                              viewMode === "list"
                                ? "polished-list-center"
                                : "polished-grid-content"
                            }
                          >
                            <div className="title-row">
                              <div
                                className={
                                  viewMode === "list"
                                    ? "polished-list-title"
                                    : "polished-grid-title"
                                }
                              >
                                {vid.title}
                              </div>
                              {viewMode === "list" && (
                                <div className="polished-list-desc">
                                  {vid.description}
                                </div>
                              )}
                            </div>
                          </div>
                          {viewMode === "list" && (
                            <div className="polished-list-right">
                              <div
                                className={`type-badge ${
                                  typeIcons[vid.type]?.className || ""
                                }`}
                              >
                                {typeIcons[vid.type]?.icon}{" "}
                                {typeIcons[vid.type]?.label}
                              </div>
                              <div className="polished-list-date">
                                {vid.startDate &&
                                  (vid.type === "live"
                                    ? `Live: ${formatDate(
                                        vid.startDate,
                                        "live"
                                      )}`
                                    : `Uploaded: ${formatDate(
                                        vid.startDate,
                                        vid.type
                                      )}`)}
                              </div>
                            </div>
                          )}

                          {/* Badge (Grid View Only) */}
                          {viewMode === "grid" && (
                            <div
                              className={`type-badge ${
                                typeIcons[vid.type]?.className || ""
                              } polished-grid-badge`}
                            >
                              {typeIcons[vid.type]?.icon}{" "}
                              {typeIcons[vid.type]?.label}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SubModuleView;
