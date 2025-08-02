// src/context/FilterContext.js
import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [activeFilters, setActiveFilters] = useState({
    area: [],
    pathology: [],
    level: [],
    status: [],
    type: []
  });

  return (
    <FilterContext.Provider value={{ activeFilters, setActiveFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
