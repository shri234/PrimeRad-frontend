import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { GiAtlas } from "react-icons/gi";
import { FaTh } from "react-icons/fa";
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

  const [viewMode, setViewMode] = useState("list");
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
  const [userProgress, setUserProgress] = useState(null);

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

  const initialView =
    selectedSubModuleId === null &&
    activeModuleId === null &&
    currentView === "submodules";

  return (
    <>
      <div
        className="submodule-wrapper"
        style={{ boxSizing: "border-box", overflowX: "hidden", marginTop: 0 }}
      >
        {currentView !== "assessment" && (
          <>
            <button
              className={`arrow-toggle ${sidebarOpen ? "open" : ""}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
            </button>
            <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
              <div
                style={{
                  padding: "16px",
                  borderBottom: "1px solid #e0e0e0",
                  // marginTop: "70px",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    background: "#f5f5f5",
                    borderRadius: "12px",
                    padding: "4px",
                    gap: "2px",
                  }}
                >
                  <button
                    style={{
                      flex: 1,
                      padding: "8px 8px",
                      backgroundColor: "transparent",
                      color: "#666",
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
                    onClick={() => navigate("/main-page")}
                  >
                    <FaTh size={14} />
                    List
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "8px 8px",
                      backgroundColor:
                        viewMode === "list" ? "darkslategrey" : "transparent",
                      color: viewMode === "list" ? "white" : "#666",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                    onClick={() => setViewMode("atlas")}
                  >
                    <GiAtlas style={{ fontSize: 18 }} />
                    Atlas
                  </button>
                </div>
              </div>
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
                                onClick={() => handleSubModuleClick(pathology)}
                              >
                                <span
                                  className={`chevron ${
                                    selectedSubModuleId === pathology._id
                                      ? "rotated"
                                      : ""
                                  }`}
                                >
                                  ▶
                                </span>
                                {pathology.pathologyName}
                              </div>
                              {selectedSubModuleId === pathology._id && (
                                <div className="sidebar-level-dropdown">
                                  <div
                                    className={`sidebar-level-item ${
                                      selectedLevel === "beginner"
                                        ? "active"
                                        : ""
                                    }`}
                                    onClick={() => handleLevelClick("beginner")}
                                    style={{
                                      marginLeft: "30px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {" "}
                                    Beginner
                                  </div>
                                  <div
                                    className={`sidebar-level-item ${
                                      selectedLevel === "advanced"
                                        ? "active"
                                        : ""
                                    }`}
                                    onClick={() => handleLevelClick("advanced")}
                                    style={{
                                      marginLeft: "30px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {" "}
                                    Advanced
                                  </div>
                                </div>
                              )}
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

                            // Focus States
                            "&:focus": {
                              outline: "2px solid #6366f1",
                              outlineOffset: "2px",
                            },

                            // Active State
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
                          {/* Icon Container */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "24px",
                              height: "24px",
                              flexShrink: 0,
                              borderRadius: "4px",
                              backgroundColor:
                                currentView === "difficulty"
                                  ? "#6366f1"
                                  : "#9ca3af",
                              padding: "2px",
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            <img
                              src="/assets/images/assessment.jpeg"
                              alt="Assessment icon"
                              style={{
                                width: "16px",
                                height: "16px",
                                objectFit: "contain",
                                filter:
                                  currentView === "difficulty"
                                    ? "brightness(0) invert(1)"
                                    : "brightness(0.8)",
                              }}
                            />
                          </div>

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

                          {/* Optional Active Indicator */}
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
                        {/* Add this CSS for the pulse animation */}
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
            {sidebarOpen && (
              <div
                className="overlay"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}
          </>
        )}
        <div
          className="submodule-main-content"
          style={{
            padding: "32px 40px 32px 40px",
            background: "#f8fafc",
            minHeight: "100vh",
            boxSizing: "border-box",
            flex: 1,
            overflowY: "auto",
          }}
          ref={sectionRef}
        >
          {/* Assessment Difficulty Cards - Only shown when currentView === "difficulty" */}

          {currentView === "assessment" ? (
            <div>
              <button
                onClick={() => setCurrentView("submodules")}
                className="back-link"
              >
                ← Back to Modules
              </button>
              <div
                style={{
                  display: "flex",
                  height: "calc(100vh - 64px)",
                  background: "#f4f8fb",
                  borderRadius: 16,
                  overflowY: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  position: "relative",
                }}
              >
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
                    overflowY: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {renderAssessmentHeader()}
                  <div style={{ padding: 32, flex: 1, overflowY: "auto" }}>
                    {renderAssessmentContent()}
                  </div>
                </div>
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
          ) : /* Difficulty Assessment Cards View */
          currentView === "difficulty" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "24px",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                animation: "slideIn 0.3s ease-out",
                margin: "20px",
              }}
            >
              {/* Back Button for Difficulty View */}
              <button
                onClick={() => setCurrentView("main")} // or whatever your default view should be
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "none",
                  border: "none",
                  color: "#6366f1",
                  fontSize: "14px",
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  marginBottom: "16px",
                }}
              >
                ← Back to Pathologies
              </button>

              {/* Assessment Difficulty Selection Title */}
              <div style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#1f2937",
                    margin: 0,
                    marginBottom: "8px",
                  }}
                >
                  Choose Assessment Level
                </h2>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#6b7280",
                    margin: 0,
                  }}
                >
                  Select the difficulty level that matches your expertise in{" "}
                  {activeModuleName} pathologies.
                </p>
              </div>

              {/* Beginner Assessment Card */}
              <div
                className="assessment-card beginner-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "2px solid #10b981",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={() => {
                  handleDifficultySelect("beginner");
                  setCurrentView("assessment"); // Switch to assessment view
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(16, 185, 129, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(16, 185, 129, 0.1)";
                }}
              >
                {/* Background Pattern */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #10b981, #34d399)",
                    borderRadius: "0 12px 0 100%",
                    opacity: 0.1,
                  }}
                />

                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "16px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#10b981",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    🌱
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#065f46",
                        lineHeight: "1.2",
                      }}
                    >
                      Beginner Assessment
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#10b981",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Foundation Level
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#374151",
                    lineHeight: "1.6",
                    marginBottom: "16px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  Perfect for those starting their journey. Covers basic
                  concepts, fundamental skills, and core knowledge areas with
                  guided support.
                </p>

                {/* Features */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "16px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {[
                    "20-30 mins",
                    "Basic concepts",
                    "Guided hints",
                    "Multiple attempts",
                  ].map((feature, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: "11px",
                        padding: "4px 8px",
                        backgroundColor: "#d1fae5",
                        color: "#065f46",
                        borderRadius: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#10b981",
                    color: "white",
                    width: "20%",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative",
                    zIndex: 1,
                  }}
                  onClick={() => handleDifficultyCardClick("Beginner")}
                >
                  Start Beginner Assessment
                </button>
              </div>

              {/* Advanced Assessment Card */}
              <div
                className="assessment-card advanced-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "2px solid #8b5cf6",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={() => {
                  handleDifficultySelect("advanced");
                  setCurrentView("assessment"); // Switch to assessment view
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(139, 92, 246, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(139, 92, 246, 0.1)";
                }}
              >
                {/* Background Pattern */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                    borderRadius: "0 12px 0 100%",
                    opacity: 0.1,
                  }}
                />

                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "16px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#8b5cf6",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    🚀
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#581c87",
                        lineHeight: "1.2",
                      }}
                    >
                      Advanced Assessment
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#8b5cf6",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Expert Level
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#374151",
                    lineHeight: "1.6",
                    marginBottom: "16px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  Designed for experienced learners. Tests deep understanding,
                  complex problem-solving, and advanced application of concepts.
                </p>

                {/* Features */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "16px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {[
                    "45-60 mins",
                    "Complex scenarios",
                    "Detailed analysis",
                    "Single attempt",
                  ].map((feature, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: "11px",
                        padding: "4px 8px",
                        backgroundColor: "#ede9fe",
                        color: "#581c87",
                        borderRadius: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#8b5cf6",
                    color: "white",
                    width: "20%",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative",
                    zIndex: 1,
                  }}
                  onClick={() => handleDifficultyCardClick("Advanced")}
                >
                  Start Advanced Assessment
                </button>
              </div>

              {/* Quick Stats */}
            </div>
          ) : (
            <>
              <div className="header">
                <button
                  onClick={() => {
                    setActiveModuleId(null);
                    setActiveModuleName(null);
                    setSelectedSubModuleId(null);
                    setSelectedLevel(null);
                    {
                      activeModuleId === null
                        ? navigate("/main-page")
                        : navigate("/atlas");
                    }
                  }}
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
                  {activeModuleName
                    ? `${activeModuleName} Pathologies`
                    : "Select a Module"}
                </h2>
              </div>

              {initialView ? (
                <div
                  className={
                    viewMode === "list"
                      ? "submodule-list-right"
                      : "submodule-grid-right"
                  }
                >
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
                      >
                        <img
                          src={mod.imageUrl || getRandomImage()}
                          alt={mod.moduleName}
                          className="module-thumbnail"
                        />
                        <div className="module-info">
                          <h4 className="module-title">{mod.moduleName}</h4>
                          <p className="module-description">
                            {mod.description ||
                              `Explore pathologies of the ${mod.moduleName} joint.`}
                          </p>
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
                  <div className="breadcrumb">
                    <span
                      onClick={() => {
                        setActiveModuleId(null);
                        setActiveModuleName(null);
                        setSelectedSubModuleId(null);
                        setSelectedLevel(null);
                      }}
                      className="breadcrumb-link"
                    >
                      {activeModuleName}
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
                          {selectedSubModule?.pathologyName}{" "}
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
                  </div>
                  <div
                    className={
                      viewMode === "list"
                        ? "submodule-list-right"
                        : "submodule-grid-right"
                    }
                  >
                    <div className="submodule-container">
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
                    ) : (
                      modulePathologiesData.map((pathologyItem) => {
                        const staticSubModuleDataForPathology = subModulesData[
                          activeModuleName
                        ]?.find(
                          (sub) => sub.name === pathologyItem.pathologyName
                        );
                        const isSelected =
                          selectedSubModuleId === pathologyItem._id;
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
                            className="submodule-container"
                          >
                            <div
                              className={`submodule-item ${viewMode}-view ${
                                isSelected ? "selected" : ""
                              }`}
                              onClick={() => {
                                handleSubModuleClick(pathologyItem);
                                setTimeout(() => {
                                  handleScroll();
                                }, 0);
                              }}
                            >
                              <img
                                src={
                                  `https://primerad-backend.onrender.com${pathologyItem.imageUrl}` ||
                                  staticSubModuleDataForPathology?.thumbnail ||
                                  getRandomImage()
                                }
                                alt={pathologyItem.pathologyName}
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
                                  className={`fas fa-angle-right icon-indicator ${
                                    isSelected ? "rotated-down" : ""
                                  }`}
                                  style={{ marginRight: "10px" }}
                                ></i>{" "}
                                {pathologyItem.pathologyName}{" "}
                              </div>
                              <div
                                className="submodule-type-badges"
                                style={{
                                  marginLeft: "10px",
                                }}
                              >
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
                            {isSelected && (
                              <>
                                {pathologyItem.isPlaceholder ? (
                                  <div
                                    style={{
                                      textAlign: "center",
                                      padding: "50px",
                                      fontSize: "1.2rem",
                                      color: "#666",
                                      width: "100%",
                                    }}
                                  >
                                    No video content defined for "
                                    {pathologyItem.pathologyName}" yet.
                                  </div>
                                ) : (
                                  <div
                                    className={
                                      viewMode === "list"
                                        ? "level-list-view"
                                        : "level-grid-view lecture-grid-view"
                                    }
                                  >
                                    <div
                                      ref={
                                        selectedLevel === "beginner"
                                          ? sectionRef
                                          : null
                                      }
                                      className={`level-card ${viewMode} ${
                                        selectedLevel === "beginner"
                                          ? "selected"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleLevelClick("beginner")
                                      }
                                    >
                                      <div className="level-thumbnail">
                                        <div className="level-icon">🎓</div>
                                      </div>
                                      <i
                                        className={`fas fa-angle-right icon-indicator ${
                                          selectedLevel === "beginner"
                                            ? "rotated-down"
                                            : ""
                                        }`}
                                        style={{ marginRight: "10px" }}
                                      ></i>
                                      <div className="level-info">
                                        <h4 className="level-title">
                                          Beginner
                                        </h4>
                                        <p className="level-description">
                                          Basic concepts and fundamental
                                          knowledge for{" "}
                                          {pathologyItem?.pathologyName}
                                        </p>
                                        <div className="level-full-badges">
                                          {(() => {
                                            const staticBeginnerSessions =
                                              staticSubModuleDataForPathology
                                                ?.levels?.beginner || [];
                                            const apiBeginnerSessions =
                                              pathologyItem.sessions?.filter(
                                                (s) =>
                                                  s.difficulty === "Beginner"
                                              ) || [];
                                            const combinedBeginner = [
                                              ...staticBeginnerSessions,
                                              ...apiBeginnerSessions,
                                            ];
                                            const levelCounts =
                                              countTypes(combinedBeginner);
                                            return (
                                              <>
                                                <span className="type-badge badge-lecture">
                                                  Lectures:{" "}
                                                  {levelCounts.lecture}
                                                </span>
                                                <span className="type-badge badge-case">
                                                  Cases: {levelCounts.case}
                                                </span>
                                                <span className="type-badge badge-live">
                                                  Live Programs:{" "}
                                                  {levelCounts.live}
                                                </span>
                                              </>
                                            );
                                          })()}
                                        </div>
                                      </div>
                                    </div>
                                    {selectedLevel === "beginner" && (
                                      <div
                                        className={
                                          viewMode === "list"
                                            ? "lecture-grid-view"
                                            : "lecture-grid-view"
                                        }
                                        style={{}}
                                      >
                                        <div className="polished-filter-bar">
                                          <label className="polished-filter-checkbox">
                                            <input
                                              type="checkbox"
                                              checked={filters.dicom}
                                              onChange={() =>
                                                handleFilterChange("dicom")
                                              }
                                            />
                                            <span className="polished-custom-checkbox" />{" "}
                                            DICOM
                                          </label>
                                          <label className="polished-filter-checkbox">
                                            <input
                                              type="checkbox"
                                              checked={filters.lecture}
                                              onChange={() =>
                                                handleFilterChange("lecture")
                                              }
                                            />
                                            <span className="polished-custom-checkbox" />{" "}
                                            Lectures
                                          </label>
                                          <label className="polished-filter-checkbox live">
                                            <input
                                              type="checkbox"
                                              checked={filters.live}
                                              onChange={() =>
                                                handleFilterChange("live")
                                              }
                                            />
                                            <span className="polished-custom-checkbox" />{" "}
                                            Live Programs
                                          </label>
                                        </div>
                                        <div className="polished-grid-container">
                                          {loadingLevelSessions ? (
                                            <div
                                              className="loading-message"
                                              style={{
                                                textAlign: "center",
                                                padding: "20px",
                                              }}
                                            >
                                              Loading {selectedLevel}{" "}
                                              sessions...
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
                                          ) : levelSessions.length === 0 ? (
                                            <div
                                              className="no-data-message"
                                              style={{
                                                textAlign: "center",
                                                padding: "20px",
                                                color: "#666",
                                              }}
                                            >
                                              No {selectedLevel} sessions found
                                              for this pathology.
                                            </div>
                                          ) : (
                                            levelSessions
                                              .filter((session) => {
                                                const sessionType =
                                                  session.sessionType?.toLowerCase() ||
                                                  session.type?.toLowerCase();
                                                return (
                                                  ((sessionType === "dicom" ||
                                                    sessionType === "case") &&
                                                    filters.dicom) ||
                                                  ((sessionType === "vimeo" ||
                                                    sessionType ===
                                                      "lecture") &&
                                                    filters.lecture) ||
                                                  (sessionType === "live" &&
                                                    filters.live)
                                                );
                                              })
                                              .map((session) => (
                                                <div
                                                  key={
                                                    session._id || session.id
                                                  }
                                                  className={`lecture-card ${
                                                    viewMode === "list"
                                                      ? "polished-grid-view"
                                                      : "polished-grid-view"
                                                  }`}
                                                  onClick={() =>
                                                    handleSessionClick(session)
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      viewMode === "list"
                                                        ? "polished-grid-thumbnail"
                                                        : "polished-grid-thumbnail"
                                                    }
                                                  >
                                                    <img
                                                      src={`https://primerad-backend.onrender.com${
                                                        session.imageUrl_522x760 ||
                                                        session.imageUrl_1920x1080 ||
                                                        session.thumbnail
                                                      }`}
                                                      alt={session.title}
                                                    />
                                                  </div>
                                                  <div
                                                    className={
                                                      viewMode === "list"
                                                        ? "polished-grid-content"
                                                        : "polished-grid-content"
                                                    }
                                                  >
                                                    <div className="title-row">
                                                      <div
                                                        className={
                                                          viewMode === "list"
                                                            ? "polished-grid-title"
                                                            : "polished-grid-title"
                                                        }
                                                        style={{
                                                          whiteSpace: "nowrap",
                                                          overflow: "hidden",
                                                          textOverflow:
                                                            "ellipsis",
                                                        }}
                                                      >
                                                        {session.title}
                                                      </div>
                                                      {viewMode === "grid" && (
                                                        <div className="polished-list-desc">
                                                          {session.description}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>

                                                  {viewMode === "list" && (
                                                    <div
                                                      className={`type-badge ${
                                                        getSessionTypeBadge(
                                                          session.sessionType ||
                                                            session.type
                                                        )?.className || ""
                                                      } polished-grid-badge`}
                                                    >
                                                      {
                                                        getSessionTypeBadge(
                                                          session.sessionType ||
                                                            session.type
                                                        )?.icon
                                                      }{" "}
                                                      {
                                                        getSessionTypeBadge(
                                                          session.sessionType ||
                                                            session.type
                                                        )?.label
                                                      }
                                                    </div>
                                                  )}
                                                </div>
                                              ))
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    <div
                                      ref={
                                        selectedLevel === "advanced"
                                          ? sectionRef
                                          : null
                                      }
                                      className={`level-card ${viewMode} ${
                                        selectedLevel === "advanced"
                                          ? "selected"
                                          : ""
                                      }`}
                                      onClick={() => {
                                        handleLevelClick("advanced");
                                        setTimeout(() => {
                                          handleScroll();
                                        }, 0);
                                      }}
                                    >
                                      <div className="level-thumbnail">
                                        <div className="level-icon">⚡</div>
                                      </div>
                                      <i
                                        className={`fas fa-angle-right icon-indicator ${
                                          selectedLevel === "advanced"
                                            ? "rotated-down"
                                            : ""
                                        }`}
                                        style={{ marginRight: "10px" }}
                                      ></i>
                                      <div className="level-info">
                                        <h4 className="level-title">
                                          Advanced
                                        </h4>
                                        <p className="level-description">
                                          Advanced techniques and complex cases
                                          for {selectedSubModule?.pathologyName}
                                        </p>
                                        <div className="level-full-badges">
                                          {(() => {
                                            const staticAdvancedSessions =
                                              staticSubModuleDataForPathology
                                                ?.levels?.advanced || [];
                                            const apiAdvancedSessions =
                                              selectedSubModule.sessions?.filter(
                                                (s) =>
                                                  s.difficulty === "Advanced"
                                              ) || [];
                                            const combinedAdvanced = [
                                              ...staticAdvancedSessions,
                                              ...apiAdvancedSessions,
                                            ];
                                            const levelCounts =
                                              countTypes(combinedAdvanced);
                                            return (
                                              <>
                                                <span className="type-badge badge-lecture">
                                                  Lectures:{" "}
                                                  {levelCounts.lecture}
                                                </span>
                                                <span className="type-badge badge-case">
                                                  Cases: {levelCounts.case}
                                                </span>
                                                <span className="type-badge badge-live">
                                                  Live Programs:{" "}
                                                  {levelCounts.live}
                                                </span>
                                              </>
                                            );
                                          })()}
                                        </div>
                                      </div>
                                    </div>

                                    {selectedLevel === "advanced" && (
                                      <div
                                        className={
                                          viewMode === "list"
                                            ? "lecture-grid-view"
                                            : "lecture-grid-view"
                                        }
                                        style={{}}
                                      >
                                        <div className="polished-filter-bar">
                                          <label className="polished-filter-checkbox">
                                            <input
                                              type="checkbox"
                                              checked={filters.dicom}
                                              onChange={() =>
                                                handleFilterChange("dicom")
                                              }
                                            />
                                            <span className="polished-custom-checkbox" />
                                            DICOM
                                          </label>
                                          <label className="polished-filter-checkbox">
                                            <input
                                              type="checkbox"
                                              checked={filters.lecture}
                                              onChange={() =>
                                                handleFilterChange("lecture")
                                              }
                                            />
                                            <span className="polished-custom-checkbox" />
                                            Lectures
                                          </label>
                                          <label className="polished-filter-checkbox live">
                                            <input
                                              type="checkbox"
                                              checked={filters.live}
                                              onChange={() =>
                                                handleFilterChange("live")
                                              }
                                            />
                                            <span className="polished-custom-checkbox" />
                                            Live Programs
                                          </label>
                                        </div>
                                        <div
                                          className={
                                            viewMode === "list"
                                              ? "polished-grid-container"
                                              : "polished-grid-container"
                                          }
                                        >
                                          {loadingLevelSessions ? (
                                            <div
                                              className="loading-message"
                                              style={{
                                                textAlign: "center",
                                                padding: "20px",
                                              }}
                                            >
                                              Loading {selectedLevel}{" "}
                                              sessions...
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
                                          ) : levelSessions.length === 0 ? (
                                            <div
                                              className="no-data-message"
                                              style={{
                                                textAlign: "center",
                                                padding: "20px",
                                                color: "#666",
                                              }}
                                            >
                                              No {selectedLevel} sessions found
                                              for this pathology.
                                            </div>
                                          ) : (
                                            levelSessions
                                              .filter((session) => {
                                                const sessionType =
                                                  session.sessionType?.toLowerCase() ||
                                                  session.type?.toLowerCase();
                                                return (
                                                  ((sessionType === "dicom" ||
                                                    sessionType === "case") &&
                                                    filters.dicom) ||
                                                  ((sessionType === "vimeo" ||
                                                    sessionType ===
                                                      "lecture") &&
                                                    filters.lecture) ||
                                                  (sessionType === "live" &&
                                                    filters.live)
                                                );
                                              })
                                              .map((session) => (
                                                <div
                                                  key={
                                                    session._id || session.id
                                                  }
                                                  className={`lecture-card ${
                                                    viewMode === "list"
                                                      ? "polished-grid-view"
                                                      : "polished-grid-view"
                                                  }`}
                                                  onClick={() =>
                                                    handleSessionClick(session)
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      viewMode === "list"
                                                        ? "polished-grid-thumbnail"
                                                        : "polished-grid-thumbnail"
                                                    }
                                                  >
                                                    <img
                                                      src={`https://primerad-backend.onrender.com${
                                                        session.imageUrl_522x760 ||
                                                        session.imageUrl_1920x1080 ||
                                                        session.thumbnail
                                                      }`}
                                                      alt={session.title}
                                                    />
                                                  </div>
                                                  <div
                                                    className={
                                                      viewMode === "list"
                                                        ? "polished-grid-content"
                                                        : "polished-grid-content"
                                                    }
                                                  >
                                                    <div className="title-row">
                                                      <div
                                                        className={
                                                          viewMode === "list"
                                                            ? "polished-grid-title"
                                                            : "polished-grid-title"
                                                        }
                                                        style={{
                                                          whiteSpace: "nowrap",
                                                          overflow: "hidden",
                                                          textOverflow:
                                                            "ellipsis",
                                                        }}
                                                      >
                                                        {session.title}
                                                      </div>
                                                      {viewMode === "grid" && (
                                                        <div className="polished-list-desc">
                                                          {session.description}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>

                                                  {viewMode === "list" && (
                                                    <div
                                                      className={`type-badge ${
                                                        getSessionTypeBadge(
                                                          session.sessionType ||
                                                            session.type
                                                        )?.className || ""
                                                      } polished-grid-badge`}
                                                    >
                                                      {
                                                        getSessionTypeBadge(
                                                          session.sessionType ||
                                                            session.type
                                                        )?.icon
                                                      }{" "}
                                                      {
                                                        getSessionTypeBadge(
                                                          session.sessionType ||
                                                            session.type
                                                        )?.label
                                                      }
                                                    </div>
                                                  )}
                                                </div>
                                              ))
                                          )}{" "}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SubModuleView;
