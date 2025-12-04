export type ColumnType = 'number' | 'category' | 'date';

export interface DataSchema {
  [columnName: string]: ColumnType;
}

export interface ParsedData {
  schema: DataSchema;
  data: Record<string, any>[];
  columns: string[];
}

export interface ChartConfig {
  column: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  dataType: ColumnType;
}

export interface FilterState {
  categories: Record<string, string[]>;
  dateRange: { start: Date | null; end: Date | null };
  numericRanges: Record<string, { min: number; max: number }>;
}

export interface DemoTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  data: Record<string, any>[];
  schema: DataSchema;
}
