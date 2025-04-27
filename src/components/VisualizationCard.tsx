import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Area, 
  Bar, 
  CartesianGrid, 
  Cell, 
  ComposedChart,
  Legend,
  Line, 
  Pie as PieChart,
  PieChart as PieChartContainer,
  ResponsiveContainer, 
  Scatter,
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { ChartData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  ChartPie, 
  BarChart, 
  LineChart, 
  AreaChart,
  ScatterChart,
  BarChartHorizontal
} from 'lucide-react';

interface VisualizationCardProps {
  chart: ChartData;
}

const COLORS = ['#1EAEDB', '#8B5CF6', '#0FA0CE', '#D946EF', '#F97316', '#0EA5E9', '#EC4899', '#10B981'];

const VisualizationCard: React.FC<VisualizationCardProps> = ({ chart }) => {
  const getChartIcon = () => {
    switch (chart.type) {
      case 'bar':
      case 'column':
        return <BarChart className="h-4 w-4" />;
      case 'line':
        return <LineChart className="h-4 w-4" />;
      case 'pie':
      case 'donut':
        return <ChartPie className="h-4 w-4" />;
      case 'area':
        return <AreaChart className="h-4 w-4" />;
      case 'scatter':
        return <ScatterChart className="h-4 w-4" />;
      default:
        return <BarChart className="h-4 w-4" />;
    }
  };

  const renderChart = () => {
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#A0AEC0', fontSize: 12 }}
                axisLine={{ stroke: '#4A5568' }}
              />
              <YAxis 
                tick={{ fill: '#A0AEC0', fontSize: 12 }}
                axisLine={{ stroke: '#4A5568' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C', 
                  borderColor: '#2D3748',
                  color: '#E2E8F0' 
                }} 
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name={chart.config.yAxis}
                fill="#1EAEDB" 
                radius={[4, 4, 0, 0]}
              >
                {chart.data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'column':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart layout="vertical" data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                type="number"
                tick={{ fill: '#A0AEC0', fontSize: 12 }}
                axisLine={{ stroke: '#4A5568' }}
              />
              <YAxis 
                type="category"
                dataKey="name" 
                tick={{ fill: '#A0AEC0', fontSize: 12 }}
                axisLine={{ stroke: '#4A5568' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C', 
                  borderColor: '#2D3748',
                  color: '#E2E8F0' 
                }} 
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name={chart.config.yAxis}
                fill="#1EAEDB" 
                radius={[0, 4, 4, 0]}
              >
                {chart.data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        );
            
      case 'pie':
      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChartContainer>
              <PieChart
                data={chart.data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={chart.type === 'donut' ? 100 : 80}
                innerRadius={chart.type === 'donut' ? 60 : 0}
                fill="#1EAEDB"
                label={(entry) => `${entry.name}: ${entry.value}`}
                labelLine={false}
              >
                {chart.data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </PieChart>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C', 
                  borderColor: '#2D3748',
                  color: '#E2E8F0' 
                }} 
              />
              <Legend />
            </PieChartContainer>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey={chart.config.xAxis} 
                tick={{ fill: '#A0AEC0', fontSize: 12 }}
                axisLine={{ stroke: '#4A5568' }}
              />
              <YAxis 
                tick={{ fill: '#A0AEC0', fontSize: 12 }}
                axisLine={{ stroke: '#4A5568' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C', 
                  borderColor: '#2D3748',
                  color: '#E2E8F0' 
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name={chart.config.yAxis}
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4, fill: '#1A1F2C' }}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#8B5CF6' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey={chart.config.xAxis} 
                tick={{ fill: '#A0AEC0', fontSize: 12 }}
                axisLine={{ stroke: '#4A5568' }}
              />
              <YAxis 
                tick={{ fill: '#A0AEC0', fontSize: 12 }}
                axisLine={{ stroke: '#4A5568' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C', 
                  borderColor: '#2D3748',
                  color: '#E2E8F0' 
                }} 
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                name={chart.config.yAxis}
                stroke="#1EAEDB"
                fill="url(#colorGradient)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1EAEDB" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="x" 
                name={chart.config.xAxis}
                tick={{ fill: '#A0AEC0', fontSize: 12 }}
                axisLine={{ stroke: '#4A5568' }}
              />
              <YAxis 
                dataKey="y" 
                name={chart.config.yAxis}
                tick={{ fill: '#A0AEC0', fontSize: 12 }}
                axisLine={{ stroke: '#4A5568' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C', 
                  borderColor: '#2D3748',
                  color: '#E2E8F0' 
                }} 
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Legend />
              <Scatter 
                name={`${chart.config.xAxis} vs ${chart.config.yAxis}`} 
                fill="#8B5CF6" 
                shape="circle" 
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <Card className="jarvis-card overflow-hidden">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{chart.title}</CardTitle>
            <CardDescription className="text-xs">{chart.description}</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            {getChartIcon()}
            <span>{chart.type}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default VisualizationCard;
