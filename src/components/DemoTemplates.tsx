import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { demoTemplates } from '@/lib/demoData';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';

export const DemoTemplates: React.FC = () => {
  const { setParsedData, resetFilters } = useData();

  const loadTemplate = (templateId: string) => {
    const template = demoTemplates.find((t) => t.id === templateId);
    if (!template) return;

    setParsedData({
      schema: template.schema,
      data: template.data,
      columns: Object.keys(template.schema),
    });
    resetFilters();

    toast({
      title: 'Demo template loaded!',
      description: `Loaded "${template.name}" with ${template.data.length} rows.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-12"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Or try a demo template
        </h2>
        <p className="text-muted-foreground">
          Explore pre-built dashboards with sample data
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="glass rounded-xl p-5 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
            onClick={() => loadTemplate(template.id)}
          >
            <div className="text-4xl mb-4">{template.icon}</div>
            <h3 className="font-display font-semibold text-foreground mb-1">
              {template.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {template.description}
            </p>
            <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Load template
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
