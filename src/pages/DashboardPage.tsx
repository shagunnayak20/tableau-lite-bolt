import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { Dashboard } from '@/components/Dashboard';
import { DemoTemplates } from '@/components/DemoTemplates';
import { useData } from '@/contexts/DataContext';

const DashboardPage: React.FC = () => {
  const { parsedData } = useData();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            {parsedData ? 'Your Dashboard' : 'Create a Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {parsedData 
              ? `Showing ${parsedData.data.length} rows across ${parsedData.columns.length} columns`
              : 'Upload your data file to generate an interactive dashboard automatically'
            }
          </p>
        </motion.div>

        <FileUpload />

        {parsedData ? (
          <div className="mt-8">
            <Dashboard />
          </div>
        ) : (
          <DemoTemplates />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
