
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { parseCSV, parseJSON } from '@/utils/dataUtils';
import { ParsedData } from '@/types';
import { FileIcon, Upload } from 'lucide-react';

interface DataUploadProps {
  onDataParsed: (data: ParsedData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataParsed, isLoading, setIsLoading }) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    try {
      setIsLoading(true);
      let parsedData: ParsedData;

      if (file.name.endsWith('.csv')) {
        parsedData = await parseCSV(file);
      } else if (file.name.endsWith('.json')) {
        parsedData = await parseJSON(file);
      } else {
        toast({
          title: "Unsupported file format",
          description: "Please upload a CSV or JSON file.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (parsedData.rows.length === 0) {
        toast({
          title: "No data found",
          description: "The file contains no valid data rows.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      onDataParsed(parsedData);
      toast({
        title: "Data uploaded successfully",
        description: `Processed ${parsedData.rowCount} rows from ${file.name}`,
      });
      
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <Card className={`p-6 ${dragActive ? 'border-primary' : 'border-border'} jarvis-card transition-all duration-200`}>
      <div 
        className={`
          flex flex-col items-center justify-center p-8
          border-2 border-dashed rounded-lg 
          ${dragActive ? 'border-primary bg-primary/10' : 'border-muted bg-background/30'} 
          transition-colors duration-200
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            {isLoading ? (
              <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-primary animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-primary" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload Your Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload CSV or JSON files to visualize your data
          </p>
          
          <div className="flex flex-col gap-2 w-full items-center">
            <div className="flex gap-2 items-center">
              <FileIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">CSV, JSON supported</span>
            </div>
            
            <label htmlFor="file-upload">
              <div className="mt-4">
                <Button disabled={isLoading} className="relative jarvis-gradient">
                  {isLoading ? 'Processing...' : 'Choose File'}
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".csv,.json"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </Button>
              </div>
            </label>
            
            <p className="mt-2 text-xs text-muted-foreground">
              or drop files here
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataUpload;
