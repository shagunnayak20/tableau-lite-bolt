import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Database, Columns } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { AutoChart } from './AutoChart';
import { Filters } from './Filters';
import { ChartConfig } from '@/types/data';
import { filterData } from '@/lib/dataParser';

export const Dashboard: React.FC = () => {
  const { parsedData, filters } = useData();

  const filteredData = useMemo(() => {
    if (!parsedData) return [];
    return filterData(parsedData.data, filters, parsedData.schema);
  }, [parsedData, filters]);

  const chartConfigs = useMemo((): ChartConfig[] => {
    if (!parsedData) return [];

    const configs: ChartConfig[] = [];

    Object.entries(parsedData.schema).forEach(([column, type]) => {
      if (type === 'category') {
        configs.push({
          column,
          type: 'bar',
          title: `${column} Distribution`,
          dataType: 'category',
        });
        // Add a pie chart for first category
        if (configs.filter((c) => c.type === 'pie').length === 0) {
          configs.push({
            column,
            type: 'pie',
            title: `${column} Breakdown`,
            dataType: 'category',
          });
        }
      } else if (type === 'number') {
        configs.push({
          column,
          type: 'line',
          title: `${column} Trend`,
          dataType: 'number',
        });
      } else if (type === 'date') {
        configs.push({
          column,
          type: 'area',
          title: `${column} Timeline`,
          dataType: 'date',
        });
      }
    });

    return configs.slice(0, 8); // Limit to 8 charts
  }, [parsedData]);

  if (!parsedData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]"
    >
      <div className="w-full lg:w-72 shrink-0 overflow-y-auto">
        <Filters />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 pr-2">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-chart-cyan/20 flex items-center justify-center">
                <Database className="w-6 h-6 text-chart-cyan" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {filteredData.length.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Rows</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-chart-violet/20 flex items-center justify-center">
                <Columns className="w-6 h-6 text-chart-violet" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {parsedData.columns.length}
                </p>
                <p className="text-sm text-muted-foreground">Columns</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-chart-rose/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-chart-rose" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {chartConfigs.length}
                </p>
                <p className="text-sm text-muted-foreground">Charts Generated</p>
              </div>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {chartConfigs.map((config, index) => (
              <AutoChart
                key={`${config.column}-${config.type}`}
                config={config}
                data={filteredData}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
