import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartConfig } from '@/types/data';

const CHART_COLORS = [
  'hsl(187, 85%, 53%)',  // cyan
  'hsl(262, 83%, 58%)',  // violet
  'hsl(330, 80%, 60%)',  // rose
  'hsl(38, 92%, 50%)',   // amber
  'hsl(160, 84%, 39%)',  // emerald
];

interface AutoChartProps {
  config: ChartConfig;
  data: Record<string, any>[];
  index: number;
}

export const AutoChart: React.FC<AutoChartProps> = ({ config, data, index }) => {
  const chartData = useMemo(() => {
    if (config.dataType === 'category') {
      // Aggregate by category
      const counts: Record<string, number> = {};
      data.forEach((row) => {
        const value = String(row[config.column]);
        counts[value] = (counts[value] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    } else if (config.dataType === 'number') {
      // Use raw numeric data
      return data.slice(0, 50).map((row, i) => ({
        index: i + 1,
        value: Number(row[config.column]) || 0,
      }));
    } else if (config.dataType === 'date') {
      // Sort by date and aggregate
      const sorted = [...data].sort(
        (a, b) => new Date(a[config.column]).getTime() - new Date(b[config.column]).getTime()
      );
      return sorted.slice(0, 30).map((row) => ({
        date: new Date(row[config.column]).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        value: 1,
      }));
    }
    return [];
  }, [config, data]);

  const primaryColor = CHART_COLORS[index % CHART_COLORS.length];

  const renderChart = () => {
    switch (config.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(222, 30%, 18%)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
                labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="index" 
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(222, 30%, 18%)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={primaryColor}
                strokeWidth={3}
                dot={{ fill: primaryColor, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: primaryColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{ stroke: 'hsl(215, 20%, 55%)' }}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(222, 30%, 18%)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(222, 30%, 18%)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={primaryColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${index})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-2xl p-5 shadow-card"
    >
      <h4 className="font-display font-semibold text-foreground mb-1">{config.title}</h4>
      <p className="text-xs text-muted-foreground mb-4">
        {config.dataType === 'category' ? 'Distribution' : config.dataType === 'date' ? 'Timeline' : 'Values'}
      </p>
      {renderChart()}
    </motion.div>
  );
};
