import React, { useEffect, useState } from "react";
import "./NavCategories.css";
import { useFilter } from "../../context/FilterContext";
import axios from "axios";

const NavCategories = (props) => {
  const { activeFilters, setActiveFilters } = useFilter();
  const [areas, setAreas] = useState([]);
  const [pathologies, setPathologies] = useState([]);
  const [selectedAreaIds, setSelectedAreaIds] = useState([]); // Changed to an array

  // This useEffect will now only fetch the areas (modules) on mount.
  useEffect(() => {
    axios
      .get("https://primerad-backend.onrender.com/api/modules/get")
      .then((res) => setAreas(res.data.data || res.data))
      .catch((err) => console.error("Error fetching modules:", err));
  }, []);

  // This useEffect will run whenever activeFilters.area or areas change.
  // It will update the selectedAreaIds array with the IDs of all selected areas.
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
      setSelectedAreaIds([]);
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

      // This logic is crucial for handling multiple selections.
      // We no longer clear pathologies for every area selection, as multiple can be active.
      // Pathologies will now be filtered based on the combined selection.
      // You might want to adjust this logic depending on desired behavior.
      if (category === "area") {
        // If a new area is selected, we should re-evaluate which pathologies are relevant.
        // It's generally best to clear the pathology filter to avoid showing stale selections.
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
                    Select one or more Areas to see pathologies.
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
