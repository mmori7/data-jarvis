
export type DataRow = Record<string, any>;

export type ParsedData = {
  columns: string[];
  rows: DataRow[];
  fileName: string;
  fileType: string;
  rowCount: number;
};

export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'area' 
  | 'scatter' 
  | 'radar'
  | 'column'
  | 'donut';

export type ChartData = {
  id: string;
  title: string;
  description: string;
  type: ChartType;
  data: any;
  config: any;
};

export type DataSummary = {
  numericColumns: string[];
  categoricalColumns: string[];
  dateColumns: string[];
  statistics: Record<string, {
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
    mode?: any;
    uniqueValues?: number;
    completeness?: number;
  }>;
};
