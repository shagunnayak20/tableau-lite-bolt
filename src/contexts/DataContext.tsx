import React, { createContext, useContext, useState } from 'react';
import { ParsedData, FilterState, DataSchema } from '@/types/data';

interface DataContextType {
  parsedData: ParsedData | null;
  setParsedData: (data: ParsedData | null) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  categories: {},
  dateRange: { start: null, end: null },
  numericRanges: {},
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <DataContext.Provider value={{ parsedData, setParsedData, filters, setFilters, resetFilters }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
