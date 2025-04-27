
import React, { useState } from 'react';
import Header from '@/components/Header';
import DataUpload from '@/components/DataUpload';
import DataPreview from '@/components/DataPreview';
import Visualizations from '@/components/Visualizations';
import { ParsedData, DataSummary, ChartData } from '@/types';
import { generateDataSummary, generateChartConfigurations } from '@/utils/dataUtils';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

const Index = () => {
  const [data, setData] = useState<ParsedData | null>(null);
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDataPreview, setShowDataPreview] = useState(true);

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
                    <Visualizations charts={charts} />
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
