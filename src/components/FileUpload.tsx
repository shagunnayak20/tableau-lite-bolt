import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseFile } from '@/lib/dataParser';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';

export const FileUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { setParsedData, resetFilters } = useData();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);

    try {
      const data = await parseFile(file);
      setParsedData(data);
      resetFilters();
      toast({
        title: 'Data loaded successfully!',
        description: `Loaded ${data.data.length} rows with ${data.columns.length} columns.`,
      });
    } catch (error) {
      toast({
        title: 'Error processing file',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      setFileName(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setParsedData(null);
    resetFilters();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? 'border-primary bg-primary/10 scale-[1.02]' 
            : 'border-border hover:border-muted-foreground/50 bg-card/50'
          }
        `}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-glow opacity-50 pointer-events-none" />

        <div className="relative p-8 md:p-12">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-lg font-medium text-foreground">Processing your data...</p>
                <p className="text-sm text-muted-foreground mt-1">{fileName}</p>
              </motion.div>
            ) : fileName ? (
              <motion.div
                key="uploaded"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground">{fileName}</p>
                    <p className="text-sm text-muted-foreground">File loaded successfully</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFile}
                  className="mt-2"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear and upload new file
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
                  <Upload className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  Upload your data file
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Drag and drop your CSV or Excel file here, or click to browse.
                  We'll automatically detect your data types and generate charts.
                </p>
                <label htmlFor="file-upload">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button variant="gradient" size="lg" asChild>
                    <span className="cursor-pointer">
                      <FileSpreadsheet className="w-5 h-5 mr-2" />
                      Browse Files
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: CSV, XLSX, XLS
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
