
import { DataRow, ParsedData, DataSummary } from '../types';
import Papa from 'papaparse';

// Parse CSV data
export const parseCSV = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const columns = results.meta.fields || [];
        const rows = results.data as DataRow[];
        
        resolve({
          columns,
          rows: rows.filter(row => Object.keys(row).length > 0 && !Object.values(row).every(val => val === "")),
          fileName: file.name,
          fileType: 'csv',
          rowCount: rows.length
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Parse JSON data
export const parseJSON = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const data = JSON.parse(result);
        
        // Handle array of objects
        if (Array.isArray(data) && data.length > 0) {
          const columns = Object.keys(data[0]);
          
          resolve({
            columns,
            rows: data,
            fileName: file.name,
            fileType: 'json',
            rowCount: data.length
          });
        } 
        // Handle object with arrays
        else if (data && typeof data === 'object') {
          let extractedData: DataRow[] = [];
          let extractedColumns: string[] = [];
          
          // Try to find an array in the object
          for (const key in data) {
            if (Array.isArray(data[key]) && data[key].length > 0) {
              extractedData = data[key];
              extractedColumns = Object.keys(data[key][0]);
              break;
            }
          }
          
          if (extractedData.length > 0) {
            resolve({
              columns: extractedColumns,
              rows: extractedData,
              fileName: file.name,
              fileType: 'json',
              rowCount: extractedData.length
            });
          } else {
            reject(new Error('Could not extract tabular data from JSON'));
          }
        } else {
          reject(new Error('Invalid JSON format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

// Check if value is numeric
export const isNumeric = (value: any): boolean => {
  if (typeof value === 'number') return true;
  if (typeof value !== 'string') return false;
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
};

// Check if value is a date
export const isDate = (value: any): boolean => {
  if (value instanceof Date) return true;
  if (typeof value !== 'string') return false;
  
  // Check for common date formats
  const dateRegex = /^\d{1,4}[-/]\d{1,2}[-/]\d{1,4}([ T]\d{1,2}:\d{1,2}(:\d{1,2})?)?$/;
  return dateRegex.test(value) && !isNaN(Date.parse(value));
};

// Generate basic statistics for the data
export const generateDataSummary = (data: ParsedData): DataSummary => {
  if (!data.rows || data.rows.length === 0) {
    return {
      numericColumns: [],
      categoricalColumns: [],
      dateColumns: [],
      statistics: {}
    };
  }

  const numericColumns: string[] = [];
  const categoricalColumns: string[] = [];
  const dateColumns: string[] = [];
  const statistics: DataSummary['statistics'] = {};
  
  // Sample first 100 rows for column type detection
  const sampleSize = Math.min(100, data.rows.length);
  const sample = data.rows.slice(0, sampleSize);
  
  data.columns.forEach(column => {
    // Count numeric, date, and non-numeric values
    let numericCount = 0;
    let dateCount = 0;
    let nonEmptyCount = 0;
    const values: any[] = [];
    
    sample.forEach(row => {
      const value = row[column];
      if (value !== null && value !== undefined && value !== '') {
        nonEmptyCount++;
        if (isNumeric(value)) numericCount++;
        if (isDate(value)) dateCount++;
        values.push(value);
      }
    });
    
    // Determine column type based on majority
    if (numericCount > sampleSize * 0.7) {
      numericColumns.push(column);
    } else if (dateCount > sampleSize * 0.7) {
      dateColumns.push(column);
    } else {
      categoricalColumns.push(column);
    }
    
    // Generate statistics
    statistics[column] = {
      completeness: nonEmptyCount / sampleSize
    };
    
    // For numeric columns, calculate additional statistics
    if (numericColumns.includes(column)) {
      const numericValues = values
        .filter(v => isNumeric(v))
        .map(v => typeof v === 'string' ? parseFloat(v) : v);
      
      if (numericValues.length > 0) {
        const min = Math.min(...numericValues);
        const max = Math.max(...numericValues);
        const sum = numericValues.reduce((a, b) => a + b, 0);
        const mean = sum / numericValues.length;
        
        statistics[column] = {
          ...statistics[column],
          min,
          max,
          mean
        };
      }
    }
    
    // For categorical columns, count unique values
    if (categoricalColumns.includes(column)) {
      const uniqueValues = new Set(values).size;
      statistics[column] = {
        ...statistics[column],
        uniqueValues
      };
    }
  });
  
  return {
    numericColumns,
    categoricalColumns,
    dateColumns,
    statistics
  };
};

// Generate default chart configurations based on data types
export const generateChartConfigurations = (data: ParsedData, summary: DataSummary) => {
  const charts = [];
  
  // If we have numeric columns, create visualizations
  if (summary.numericColumns.length > 0) {
    // Bar chart for the first numeric column by category
    if (summary.categoricalColumns.length > 0) {
      const categoryCol = summary.categoricalColumns[0];
      const numericCol = summary.numericColumns[0];
      
      // Group by category and sum numeric values
      const groupedData: Record<string, number> = {};
      data.rows.forEach(row => {
        const category = String(row[categoryCol] || 'Unknown');
        const value = isNumeric(row[numericCol]) ? parseFloat(row[numericCol]) : 0;
        
        if (!groupedData[category]) {
          groupedData[category] = 0;
        }
        groupedData[category] += value;
      });
      
      // Convert to array format for chart
      const chartData = Object.keys(groupedData).map(key => ({
        name: key,
        value: groupedData[key]
      }));
      
      charts.push({
        id: 'bar-chart-1',
        title: `${numericCol} by ${categoryCol}`,
        description: `Bar chart showing ${numericCol} values grouped by ${categoryCol}`,
        type: 'bar',
        data: chartData,
        config: {
          xAxis: categoryCol,
          yAxis: numericCol
        }
      });
      
      // Also add a pie chart
      charts.push({
        id: 'pie-chart-1',
        title: `Distribution of ${numericCol} by ${categoryCol}`,
        description: `Pie chart showing distribution of ${numericCol} across ${categoryCol} categories`,
        type: 'pie',
        data: chartData,
        config: {
          nameKey: 'name',
          valueKey: 'value'
        }
      });
    }
    
    // Line chart if we have a date column and numeric column
    if (summary.dateColumns.length > 0) {
      const dateCol = summary.dateColumns[0];
      const numericCol = summary.numericColumns[0];
      
      // Group by date and average numeric values
      const dateData: Record<string, {sum: number, count: number}> = {};
      data.rows.forEach(row => {
        if (!row[dateCol]) return;
        
        const dateStr = new Date(row[dateCol]).toISOString().split('T')[0];
        const value = isNumeric(row[numericCol]) ? parseFloat(row[numericCol]) : 0;
        
        if (!dateData[dateStr]) {
          dateData[dateStr] = { sum: 0, count: 0 };
        }
        dateData[dateStr].sum += value;
        dateData[dateStr].count += 1;
      });
      
      // Convert to array format for chart, calculate average
      const chartData = Object.keys(dateData)
        .sort()
        .map(key => ({
          date: key,
          value: dateData[key].sum / dateData[key].count
        }));
      
      if (chartData.length > 0) {
        charts.push({
          id: 'line-chart-1',
          title: `${numericCol} Trends Over Time`,
          description: `Line chart showing ${numericCol} trends by ${dateCol}`,
          type: 'line',
          data: chartData,
          config: {
            xAxis: 'date',
            yAxis: 'value'
          }
        });
        
        // Also add an area chart
        charts.push({
          id: 'area-chart-1',
          title: `${numericCol} Area Over Time`,
          description: `Area chart showing ${numericCol} changes over time`,
          type: 'area',
          data: chartData,
          config: {
            xAxis: 'date',
            yAxis: 'value'
          }
        });
      }
    }
    
    // Scatter plot if we have at least 2 numeric columns
    if (summary.numericColumns.length >= 2) {
      const xCol = summary.numericColumns[0];
      const yCol = summary.numericColumns[1];
      
      const scatterData = data.rows
        .filter(row => isNumeric(row[xCol]) && isNumeric(row[yCol]))
        .map(row => ({
          x: parseFloat(row[xCol]),
          y: parseFloat(row[yCol])
        }));
      
      if (scatterData.length > 0) {
        charts.push({
          id: 'scatter-plot-1',
          title: `${xCol} vs ${yCol}`,
          description: `Scatter plot showing relationship between ${xCol} and ${yCol}`,
          type: 'scatter',
          data: scatterData,
          config: {
            xAxis: xCol,
            yAxis: yCol
          }
        });
      }
    }
  }
  
  // If we have only categorical data, create a column chart of frequencies
  if (summary.numericColumns.length === 0 && summary.categoricalColumns.length > 0) {
    const categoryCol = summary.categoricalColumns[0];
    
    // Count frequencies
    const frequencies: Record<string, number> = {};
    data.rows.forEach(row => {
      const category = String(row[categoryCol] || 'Unknown');
      
      if (!frequencies[category]) {
        frequencies[category] = 0;
      }
      frequencies[category] += 1;
    });
    
    // Convert to array format for chart
    const chartData = Object.keys(frequencies).map(key => ({
      name: key,
      value: frequencies[key]
    }));
    
    charts.push({
      id: 'column-chart-1',
      title: `Frequency of ${categoryCol}`,
      description: `Column chart showing counts of each ${categoryCol} category`,
      type: 'column',
      data: chartData,
      config: {
        xAxis: 'name',
        yAxis: 'value'
      }
    });
    
    // Also add a donut chart
    charts.push({
      id: 'donut-chart-1',
      title: `Distribution of ${categoryCol}`,
      description: `Donut chart showing distribution of ${categoryCol} categories`,
      type: 'donut',
      data: chartData,
      config: {
        nameKey: 'name',
        valueKey: 'value'
      }
    });
  }
  
  return charts;
};
