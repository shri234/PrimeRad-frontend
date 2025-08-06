import React, { useEffect, useState } from "react";
import "./NavCategories.css";
import { useFilter } from "../../context/FilterContext";
import axios from "axios";

const NavCategories = (props) => {
  const { activeFilters, setActiveFilters } = useFilter();
  const [areas, setAreas] = useState([]);
  const [pathologies, setPathologies] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");

  // This useEffect will now only fetch the areas (modules) on mount.
  useEffect(() => {
    axios
      .get("https://primerad-subscription.netlify.app/api/modules/get")
      .then((res) => setAreas(res.data.data || res.data))
      .catch((err) => console.error("Error fetching modules:", err));
  }, []);

  // This NEW useEffect is the key fix. It will run whenever the activeFilters
  // change and will reset the local state if no area is selected.
  useEffect(() => {
    if (activeFilters.area.length > 0) {
      // Find the area ID from the active filter and set the local state
      const areaNameFromContext = activeFilters.area[0];
      const areaObj = areas.find((a) => a.moduleName === areaNameFromContext);
      if (areaObj && selectedAreaId !== areaObj._id) {
        setSelectedAreaId(areaObj._id);
      }
    } else {
      // If the area filter is empty, clear the local state
      setSelectedAreaId("");
    }
  }, [activeFilters.area, areas]);

  // This useEffect will fetch pathologies whenever selectedAreaId changes.
  useEffect(() => {
    if (selectedAreaId) {
      axios
        .get(
          `https://primerad-subscription.netlify.app/api/pathologies/getByModule?moduleId=${selectedAreaId}`
        )
        .then((res) => setPathologies(res.data.data || res.data))
        .catch((err) => console.error("Error fetching pathologies:", err));
    } else {
      // Clear pathologies if no area is selected
      setPathologies([]);
    }
  }, [selectedAreaId]);

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
    type: ["Case", "Video"],
  };

  const categoryColors = {
    area: "#4CAF50",
    pathology: "#FF5722",
    level: "#2196F3",
    status: "#9C27B0",
    type: "#FF9800",
  };

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
                {category === "pathology" && activeFilters.area.length === 0 ? (
                  <div className="disabled-message">
                    Select an Area to see pathologies.
                  </div>
                ) : (
                  items.map((item) => (
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
                  ))
                )}
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
