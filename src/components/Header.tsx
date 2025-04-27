
import React from 'react';
import { ChartArea, UploadCloud } from 'lucide-react';

interface HeaderProps {
  filename?: string;
}

const Header: React.FC<HeaderProps> = ({ filename }) => {
  return (
    <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between py-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full jarvis-gradient flex items-center justify-center">
          <ChartArea className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">J.A.R.V.I.S.</h1>
          <p className="text-sm text-muted-foreground">
            Just A Rather Very Intelligent System for Data Analysis
          </p>
        </div>
      </div>
      {filename && (
        <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-md">
          <UploadCloud className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{filename}</span>
        </div>
      )}
    </header>
  );
};

export default Header;
