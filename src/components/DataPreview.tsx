import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ParsedData, DataSummary } from '@/types';
import { BarChartHorizontal, PieChart, ChevronRight, ChevronLeft } from 'lucide-react';

interface DataPreviewProps {
  data: ParsedData;
  summary: DataSummary;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data, summary }) => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  
  const totalPages = useMemo(() => Math.ceil(data.rows.length / pageSize), [data.rows.length]);
  const displayData = useMemo(() => 
    data.rows.slice((page - 1) * pageSize, page * pageSize),
    [data.rows, page]
  );

  const handlePrevPage = () => {
    setPage(p => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setPage(p => Math.min(totalPages, p + 1));
  };

  const renderStatistics = (column: string) => {
    const stats = summary.statistics[column];
    if (!stats) return null;

    return (
      <div className="space-y-1 text-xs">
        {stats.min !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Min:</span>
            <span>{stats.min}</span>
          </div>
        )}
        {stats.max !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max:</span>
            <span>{stats.max}</span>
          </div>
        )}
        {stats.mean !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mean:</span>
            <span>{stats.mean.toFixed(2)}</span>
          </div>
        )}
        {stats.uniqueValues !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Unique Values:</span>
            <span>{stats.uniqueValues}</span>
          </div>
        )}
        {stats.completeness !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Completeness:</span>
            <span>{(stats.completeness * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="jarvis-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Data Preview</CardTitle>
            <CardDescription>
              {data.fileName} · {data.rowCount} rows · {data.columns.length} columns
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="data">
          <TabsList className="mb-4">
            <TabsTrigger value="data" className="flex items-center gap-1">
              <BarChartHorizontal className="h-4 w-4" />
              <span>Data</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-1">
              <PieChart className="h-4 w-4" />
              <span>Summary</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="data" className="p-0">
            <ScrollArea className="h-[300px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {data.columns.map((column) => (
                      <TableHead key={column} className="whitespace-nowrap">
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {data.columns.map((column) => (
                        <TableCell key={`${rowIndex}-${column}`} className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                          {row[column]?.toString() || ''}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, data.rowCount)} of {data.rowCount} rows
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">
                  {page} / {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="summary" className="p-0">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Column Types</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-primary">Numeric ({summary.numericColumns.length})</h5>
                    <ul className="text-xs space-y-1">
                      {summary.numericColumns.map(col => (
                        <li key={col} className="text-muted-foreground">{col}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-accent">Categorical ({summary.categoricalColumns.length})</h5>
                    <ul className="text-xs space-y-1">
                      {summary.categoricalColumns.map(col => (
                        <li key={col} className="text-muted-foreground">{col}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-jarvis-blue">Date ({summary.dateColumns.length})</h5>
                    <ul className="text-xs space-y-1">
                      {summary.dateColumns.map(col => (
                        <li key={col} className="text-muted-foreground">{col}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Column Statistics</h4>
                <ScrollArea className="h-[220px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.columns.map(column => (
                      <Card key={column} className="p-3 border border-border/50">
                        <h5 className="text-xs font-medium mb-2">
                          {column}
                          <span className="ml-1 text-[10px] text-muted-foreground">
                            {summary.numericColumns.includes(column) 
                              ? '(Numeric)' 
                              : summary.dateColumns.includes(column)
                                ? '(Date)'
                                : '(Categorical)'}
                          </span>
                        </h5>
                        {renderStatistics(column)}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataPreview;
