
import React, { useState } from 'react';
import Header from '@/components/Header';
import DataUpload from '@/components/DataUpload';
import DataPreview from '@/components/DataPreview';
import Visualizations from '@/components/Visualizations';
import StatCard from '@/components/StatCard';
import { ParsedData, DataSummary, ChartData } from '@/types';
import { generateDataSummary, generateChartConfigurations } from '@/utils/dataUtils';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const Index = () => {
  const [data, setData] = useState<ParsedData | null>(null);
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDataPreview, setShowDataPreview] = useState(true);
  const [cumulativeType, setCumulativeType] = useState('new');
  const [dataType, setDataType] = useState('positive');

  const handleDataParsed = (parsedData: ParsedData) => {
    setData(parsedData);
    const dataSummary = generateDataSummary(parsedData);
    setSummary(dataSummary);
    const generatedCharts = generateChartConfigurations(parsedData, dataSummary);
    setCharts(generatedCharts);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-7xl mx-auto px-4">
        <Header filename={data?.fileName} />
        
        <main className="py-8 space-y-8">
          {!data ? (
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight">Data Whisperer Insights</h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Upload your data and let J.A.R.V.I.S. analyze it to reveal patterns, trends, and insights
                  </p>
                </div>
                
                <DataUpload 
                  onDataParsed={handleDataParsed} 
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {summary && (
                <>
                  {/* Dashboard Controls */}
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="w-full md:w-1/2">
                      <label className="block text-sm font-medium mb-1">Cumulative or New</label>
                      <Select 
                        value={cumulativeType} 
                        onValueChange={setCumulativeType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="cumulative">Cumulative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full md:w-1/2">
                      <label className="block text-sm font-medium mb-1">Positive Cases or Deaths</label>
                      <Select 
                        value={dataType} 
                        onValueChange={setDataType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select data" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="positive">Positive Cases</SelectItem>
                          <SelectItem value="deaths">Deaths</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Stat Cards & Chart Dashboard */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left Column - Stat Card with Area Chart */}
                    <div>
                      <StatCard 
                        title={`New ${dataType === 'positive' ? 'Positive Cases' : 'Deaths'}`}
                        value={summary.numericColumns.length > 0 ? "631,675" : "N/A"}
                        change={-13.0}
                        previousValue="725,664"
                        chartType="area"
                        chartData={charts.find(c => c.type === 'area')?.data || []}
                      />
                    </div>
                    
                    {/* Middle Column - Bar Chart */}
                    <div className="lg:col-span-1">
                      <div className="bg-background border rounded-lg shadow-sm overflow-hidden h-full">
                        <div className="p-4">
                          <h3 className="font-medium">New Positive Cases</h3>
                          <p className="text-sm text-muted-foreground">Select a Country to see more details</p>
                        </div>
                        <div className="p-4">
                          {charts.find(c => c.type === 'column') && (
                            <Visualizations 
                              charts={[charts.find(c => c.type === 'column')!]} 
                              horizontal={true} 
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Bar Chart */}
                    <div>
                      <div className="bg-background border rounded-lg shadow-sm overflow-hidden h-full">
                        <div className="p-4">
                          <h3 className="font-medium">New Positive Cases</h3>
                          <p className="text-sm text-muted-foreground">Select a Country to see more details</p>
                        </div>
                        <div className="p-4">
                          {charts.find(c => c.type === 'column') && (
                            <Visualizations 
                              charts={[charts.find(c => c.type === 'column')!]} 
                              horizontal={true} 
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Preview Section - can be toggled */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">Data Overview</h2>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowDataPreview(!showDataPreview)}
                        className="flex items-center gap-1"
                      >
                        {showDataPreview ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            <span>Hide Data Preview</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            <span>Show Data Preview</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {showDataPreview && <DataPreview data={data} summary={summary} />}
                    
                    <div className="pt-4">
                      <Visualizations charts={charts.filter(c => !['column', 'area'].includes(c.type))} />
                    </div>
                    
                    <div className="flex justify-center pt-8">
                      <Button 
                        onClick={() => {
                          setData(null);
                          setSummary(null);
                          setCharts([]);
                        }}
                        variant="outline"
                      >
                        Upload New Data
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
        
        <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/30">
          <p>JARVIS Data Insights System &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
