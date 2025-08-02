import React, { useEffect, useState } from "react";
import "./NavCategories.css";
import { useFilter } from "../../context/FilterContext";
import cardData from "./MainPageCardData";
import axios from "axios";

const getPathologiesForAreas = (areas) => {
  if (!areas || areas.length === 0) {
    return Array.from(new Set(cardData.map((c) => c.type)));
  }
  const pathSet = new Set();
  cardData.forEach((c) => {
    if (areas.includes(c.category)) {
      pathSet.add(c.type);
    }
  });
  return Array.from(pathSet);
};

const NavCategories = (props) => {
  const { activeFilters, setActiveFilters } = useFilter();
  const [areas, setAreas] = useState([]);
  const [pathologies, setPathologies] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");

  const filteredPathologies = selectedAreaId
    ? pathologies.filter((p) => p.moduleId === selectedAreaId)
    : pathologies;

  const handleAreaChange = (e) => {
    const areaName = e.target.value;
    const areaObj = areas.find((a) => a.moduleName === areaName);
    setSelectedAreaId(areaObj ? areaObj._id : "");
    // Optionally update filter context here
    setActiveFilters((prev) => ({ ...prev, area: [areaName] }));
  };

  const handlePathologyChange = (e) => {
    setActiveFilters((prev) => ({ ...prev, pathology: [e.target.value] }));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/modules/get")
      .then((res) => setAreas(res.data.data || res.data))
      .catch((err) => console.error("Error fetching modules:", err));

    // Fetch pathologies
    axios
      .get("http://localhost:5000/api/pathologies/get")
      .then((res) => setPathologies(res.data.data || res.data))
      .catch((err) => console.error("Error fetching pathologies:", err));
  }, []);

  const dynamicPathologies = getPathologiesForAreas(activeFilters.area);
  const filters = {
    area: ["Ankle", "Elbow", "Hip", "Knee"],
    pathology: dynamicPathologies,
    level: ["Beginner", "Advanced"],
    status: ["Free", "Locked"],
    type: ["Case", "Video"],
  };

  const categoryColors = {
    area: "#4CAF50",
    pathology: "#FF5722",
    level: "#2196F3",
    status: "#9C27B0",
    type: "#FF9800",
  };

  const handleFilterClick = (category, value) => {
    setActiveFilters((prev) => {
      const updated = [...prev[category]];
      if (updated.includes(value)) {
        const newFilters = {
          ...prev,
          [category]: updated.filter((item) => item !== value),
        };
        if (category === "area") {
          const validPath = getPathologiesForAreas(newFilters.area);
          newFilters.pathology = newFilters.pathology.filter((p) =>
            validPath.includes(p)
          );
        }
        return newFilters;
      } else {
        const newFilters = {
          ...prev,
          [category]: [...updated, value],
        };
        if (category === "area") {
          const validPath = getPathologiesForAreas(newFilters.area);
          newFilters.pathology = newFilters.pathology.filter((p) =>
            validPath.includes(p)
          );
        }
        return newFilters;
      }
    });
  };

  filters.area = areas.map((a) => a.moduleName);
  filters.pathology = filteredPathologies.map((p) => p.pathologyName);

  return (
    <div className="nav-categories-wrapper">
      <div
        className="nav-categories-container"
        style={{
          borderRadius: "10px",
        }}
      >
        <div className="filter-nav-container">
          {Object.entries(filters).map(([category, items]) => (
            <div key={category} className="filter-group">
              <h3
                className="filter-group-title"
                style={{ color: categoryColors[category] }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {activeFilters[category].length > 0 && (
                  <span className="selection-count">
                    {" "}
                    ({activeFilters[category].length})
                  </span>
                )}
              </h3>
              <div className="filter-items">
                {items.map((item) => (
                  <button
                    key={item}
                    className={`filter-item ${
                      activeFilters[category].includes(item) ? "active" : ""
                    }`}
                    style={{
                      "--category-color": categoryColors[category],
                      "--category-color-light": `${categoryColors[category]}20`,
                    }}
                    onClick={() => handleFilterClick(category, item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="nav-bottom-closure"></div>
      </div>
    </div>
  );
};

export default NavCategories;
