
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  previousValue: string;
  chartType: 'area' | 'line';
  chartData: any[];
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  previousValue,
  chartData
}) => {
  const isPositiveChange = change >= 0;
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <h3 className="font-medium">{title}</h3>
        <div className="mt-2">
          <p className="text-4xl font-bold">{value}</p>
          <div className="flex items-center mt-1 space-x-1">
            <div className={`flex items-center ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
              {isPositiveChange ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{Math.abs(change)}% vs previous day</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {previousValue}
          </div>
        </div>
      </div>
      
      <div className="h-32 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1EAEDB" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1EAEDB" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#1EAEDB"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default StatCard;
