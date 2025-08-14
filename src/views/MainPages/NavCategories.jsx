import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import "./NavCategories.css";
import { FaTh, FaArrowRight } from "react-icons/fa";

import { GiAtlas } from "react-icons/gi";
import { useFilter } from "../../context/FilterContext";
import { selectIsAuthenticated, selectUser } from "../../store/auth/selectors";
import axios from "axios";

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
      thumbnail: "/assets/images/rotator-cuff.jpg",
      levels: {
        beginner: [
          {
            title: "ACL Basics",
            type: "lecture",
            description: "Introduction to ACL anatomy and function.",
            thumbnail: "/assets/images/rotator-cuff.jpg",
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
            thumbnail: "/assets/images/dislocation.png",
            id: "60d0fe4f5b5b2e001c8d0d52",
            contentType: "Case",
          },
          {
            title: "ACL Live Q&A",
            type: "live",
            description: "Live Q&A session on ACL reconstruction.",
            thumbnail: "/assets/images/tear-rasions.jpg",
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
      thumbnail: "/assets/images/rotator-cuff(1).jpg",
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
  Spine: [],
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
  ],
};

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

const countLevelTypes = (levelItems) => countTypes(levelItems);

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

const NavCategories = (props) => {
  const { moduleName: urlModuleName } = useParams();
  const [viewMode, setViewMode] = useState("list");
  const sectionRef = useRef(null);

  const { activeFilters, setActiveFilters } = useFilter();
  const navigate = useNavigate();
  const [activeModuleId, setActiveModuleId] = useState(
    location.state?.moduleId || null
  );
  const [activeModuleName, setActiveModuleName] = useState(
    location.state?.moduleName || urlModuleName
  );
  const [areas, setAreas] = useState([]);
  const [pathologies, setPathologies] = useState([]);
  const [view, setView] = useState(props.view);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [selectedAreaIds, setSelectedAreaIds] = useState([]);
  const [selectedSubModuleId, setSelectedSubModuleId] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState(null);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [userProgress, setUserProgress] = useState(null); // Changed to an array
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
        `https://primerad-backend.onrender.com/api/sessions/getSessionByDifficulty?difficulty=${level.toLowerCase()}&pathologyId=${pathologyId}`
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

  const handleSubModuleClick = (pathologyItem) => {
    if (selectedSubModuleId === pathologyItem._id) {
      setSelectedSubModuleId(null);
      setSelectedLevel(null);
      setSelectedVideo(null);
    } else {
      setSelectedSubModuleId(pathologyItem._id);
      setSelectedLevel(null);
      setSelectedVideo(null);
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

  const resetToSubModules = () => {
    setSelectedSubModuleId(null);
    setSelectedLevel(null);
    setSelectedVideo(null);
    setCurrentView("submodules");
  };
  useEffect(() => {
    axios
      .get("https://primerad-backend.onrender.com/api/modules/get")
      .then((res) => setAreas(res.data.data || res.data))
      .catch((err) => console.error("Error fetching modules:", err));
  }, []);

  useEffect(() => {
    if (activeFilters.area.length > 0) {
      const areaIdsFromContext = activeFilters.area
        .map((areaName) => {
          const areaObj = areas.find((a) => a.moduleName === areaName);
          return areaObj ? areaObj._id : null;
        })
        .filter(Boolean); // Filter out any null values

      // Only update state if the array of IDs has changed to avoid unnecessary re-renders
      if (
        JSON.stringify(selectedAreaIds) !== JSON.stringify(areaIdsFromContext)
      ) {
        setSelectedAreaIds(areaIdsFromContext);
      }
    } else {
      // If the area filter is empty, clear the local state
      // setSelectedAreaIds([]);
    }
  }, [activeFilters.area, areas, selectedAreaIds]);

  // This useEffect will fetch pathologies whenever selectedAreaIds changes.
  useEffect(() => {
    if (selectedAreaIds.length > 0) {
      // Construct the query string with multiple moduleIds
      const queryParams = selectedAreaIds
        .map((id) => `moduleId=${id}`)
        .join("&");

      axios
        .get(
          `https://primerad-backend.onrender.com/api/pathologies/getByModule?${queryParams}`
        )
        .then((res) => setPathologies(res.data.data || res.data))
        .catch((err) => console.error("Error fetching pathologies:", err));
    } else {
      // Clear pathologies if no area is selected
      setPathologies([]);
    }
  }, [selectedAreaIds]);

  const handleFilterClick = (category, value) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      const updatedCategory = new Set(newFilters[category]);
      if (updatedCategory.has(value)) {
        updatedCategory.delete(value);
      } else {
        updatedCategory.add(value);
      }
      newFilters[category] = Array.from(updatedCategory);

      if (category === "area") {
        newFilters.pathology = [];
      }

      return newFilters;
    });
  };

  const filters = {
    area: areas.map((a) => a.moduleName),
    pathology: pathologies.map((p) => p.pathologyName),
    level: ["Beginner", "Advanced"],
    status: ["Free", "Locked"],
    type: ["Case", "Lectures", "Live"],
  };

  const categoryColors = {
    area: "darkslategrey",
    pathology: "#FF5722",
    level: "#2196F3",
    status: "#9C27B0",
    type: "#FF9800",
  };

  const initialView =
    selectedSubModuleId === null &&
    activeModuleId === null &&
    currentView === "submodules";
  return (
    <>
      <div className="nav-categories-wrapper">
        <div
          className="nav-categories-container"
          style={{
            borderRadius: "10px",
          }}
        >
          {view === "list" ? null : (
            <div className="filter-nav-container">
              {Object.entries(filters).map(([category, items]) => (
                <div
                  key={category}
                  className={`filter-group ${
                    category === "pathology" && activeFilters.area.length === 0
                      ? "disabled"
                      : ""
                  }`}
                >
                  <h3
                    className="filter-group-title"
                    style={{ color: categoryColors[category] }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    {activeFilters[category].length > 0 && (
                      <span className="selection-count">
                        ({activeFilters[category].length})
                      </span>
                    )}
                  </h3>
                  <div className="filter-items">
                    {category === "pathology" &&
                    activeFilters.area.length === 0 ? (
                      <div className="disabled-message">
                        Select one or more Areas to see pathologies.
                      </div>
                    ) : (
                      items.map((item) => (
                        <button
                          key={item}
                          className={`filter-item ${
                            activeFilters[category].includes(item)
                              ? "active"
                              : ""
                          }`}
                          style={{
                            "--category-color": categoryColors[category],
                            "--category-color-light": `${categoryColors[category]}20`,
                          }}
                          onClick={() => handleFilterClick(category, item)}
                        >
                          {item}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="nav-bottom-closure"></div>
        </div>
      </div>
    </>
  );
};

export default NavCategories;
