import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useData } from '@/contexts/DataContext';
import { getUniqueValues, getNumericRange } from '@/lib/dataParser';

export const Filters: React.FC = () => {
  const { parsedData, filters, setFilters, resetFilters } = useData();

  const filterConfig = useMemo(() => {
    if (!parsedData) return { categories: [], numbers: [] };

    const categories: { column: string; values: string[] }[] = [];
    const numbers: { column: string; min: number; max: number }[] = [];

    Object.entries(parsedData.schema).forEach(([column, type]) => {
      if (type === 'category') {
        const values = getUniqueValues(parsedData.data, column);
        if (values.length > 0 && values.length <= 50) {
          categories.push({ column, values });
        }
      } else if (type === 'number') {
        const range = getNumericRange(parsedData.data, column);
        if (isFinite(range.min) && isFinite(range.max) && range.min !== range.max) {
          numbers.push({ column, ...range });
        }
      }
    });

    return { categories, numbers };
  }, [parsedData]);

  const handleCategoryChange = (column: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [column]: value === 'all' ? [] : [value],
      },
    }));
  };

  const handleNumericChange = (column: string, values: number[]) => {
    setFilters((prev) => ({
      ...prev,
      numericRanges: {
        ...prev.numericRanges,
        [column]: { min: values[0], max: values[1] },
      },
    }));
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    Object.values(filters.categories).forEach((vals) => {
      if (vals.length > 0) count++;
    });
    Object.keys(filters.numericRanges).forEach(() => count++);
    if (filters.dateRange.start || filters.dateRange.end) count++;
    return count;
  }, [filters]);

  if (!parsedData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full"
    >
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <Filter className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground">Filters</h3>
          </div>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {/* Category Filters */}
          {filterConfig.categories.map((cat, idx) => (
            <Collapsible key={cat.column} defaultOpen={idx < 3}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                {cat.column}
                <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <Select
                  value={filters.categories[cat.column]?.[0] || 'all'}
                  onValueChange={(value) => handleCategoryChange(cat.column, value)}
                >
                  <SelectTrigger className="w-full bg-muted/50 border-border">
                    <SelectValue placeholder="All values" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all">All values</SelectItem>
                    {cat.values.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CollapsibleContent>
            </Collapsible>
          ))}

          {/* Numeric Filters */}
          {filterConfig.numbers.map((num) => {
            const currentRange = filters.numericRanges[num.column] || {
              min: num.min,
              max: num.max,
            };
            return (
              <Collapsible key={num.column} defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {num.column}
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-3">
                  <Slider
                    min={num.min}
                    max={num.max}
                    step={(num.max - num.min) / 100}
                    value={[currentRange.min, currentRange.max]}
                    onValueChange={(values) => handleNumericChange(num.column, values)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{currentRange.min.toLocaleString()}</span>
                    <span>{currentRange.max.toLocaleString()}</span>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="w-full mt-6 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset all filters
          </Button>
        )}
      </div>
    </motion.div>
  );
};
