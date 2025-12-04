import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DataSchema, ColumnType, ParsedData } from '@/types/data';

export const parseFile = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      parseCSV(file).then(resolve).catch(reject);
    } else if (extension === 'xlsx' || extension === 'xls') {
      parseExcel(file).then(resolve).catch(reject);
    } else {
      reject(new Error('Unsupported file format. Please upload CSV or Excel files.'));
    }
  });
};

const parseCSV = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message));
          return;
        }
        const data = results.data as Record<string, any>[];
        const columns = results.meta.fields || [];
        const schema = detectSchema(data, columns);
        resolve({ schema, data, columns });
      },
      error: (error) => reject(error),
    });
  });
};

const parseExcel = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];
        
        if (jsonData.length === 0) {
          reject(new Error('The file appears to be empty.'));
          return;
        }
        
        const columns = Object.keys(jsonData[0]);
        const schema = detectSchema(jsonData, columns);
        resolve({ schema, data: jsonData, columns });
      } catch (error) {
        reject(new Error('Failed to parse Excel file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsBinaryString(file);
  });
};

const detectSchema = (data: Record<string, any>[], columns: string[]): DataSchema => {
  const schema: DataSchema = {};
  
  columns.forEach((column) => {
    const sampleValues = data
      .slice(0, Math.min(100, data.length))
      .map((row) => row[column])
      .filter((val) => val !== null && val !== undefined && val !== '');

    schema[column] = detectColumnType(sampleValues);
  });

  return schema;
};

const detectColumnType = (values: any[]): ColumnType => {
  if (values.length === 0) return 'category';

  const numberCount = values.filter((v) => typeof v === 'number' || !isNaN(Number(v))).length;
  const dateCount = values.filter((v) => isValidDate(v)).length;

  const totalValid = values.length;

  if (dateCount / totalValid > 0.7) return 'date';
  if (numberCount / totalValid > 0.7) return 'number';
  return 'category';
};

const isValidDate = (value: any): boolean => {
  if (value instanceof Date) return !isNaN(value.getTime());
  if (typeof value !== 'string') return false;
  
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/,
    /^\d{2}\/\d{2}\/\d{4}$/,
    /^\d{2}-\d{2}-\d{4}$/,
    /^\w{3}\s\d{1,2},?\s\d{4}$/,
  ];
  
  return datePatterns.some((pattern) => pattern.test(value)) || !isNaN(Date.parse(value));
};

export const getUniqueValues = (data: Record<string, any>[], column: string): string[] => {
  const values = new Set<string>();
  data.forEach((row) => {
    if (row[column] !== null && row[column] !== undefined) {
      values.add(String(row[column]));
    }
  });
  return Array.from(values).sort();
};

export const getNumericRange = (data: Record<string, any>[], column: string): { min: number; max: number } => {
  const values = data
    .map((row) => Number(row[column]))
    .filter((v) => !isNaN(v));
  
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
};

export const filterData = (
  data: Record<string, any>[],
  filters: {
    categories: Record<string, string[]>;
    dateRange: { start: Date | null; end: Date | null };
    numericRanges: Record<string, { min: number; max: number }>;
  },
  schema: DataSchema
): Record<string, any>[] => {
  return data.filter((row) => {
    // Category filters
    for (const [column, selectedValues] of Object.entries(filters.categories)) {
      if (selectedValues.length > 0 && !selectedValues.includes(String(row[column]))) {
        return false;
      }
    }

    // Numeric range filters
    for (const [column, range] of Object.entries(filters.numericRanges)) {
      const value = Number(row[column]);
      if (!isNaN(value) && (value < range.min || value > range.max)) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      for (const [column, type] of Object.entries(schema)) {
        if (type === 'date') {
          const dateValue = new Date(row[column]);
          if (!isNaN(dateValue.getTime())) {
            if (filters.dateRange.start && dateValue < filters.dateRange.start) return false;
            if (filters.dateRange.end && dateValue > filters.dateRange.end) return false;
          }
        }
      }
    }

    return true;
  });
};
