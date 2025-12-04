import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart3, Upload, Zap, LineChart, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Drag & drop CSV or Excel files. We handle the rest.',
    },
    {
      icon: Zap,
      title: 'Auto Detection',
      description: 'AI automatically identifies data types and relationships.',
    },
    {
      icon: LineChart,
      title: 'Smart Charts',
      description: 'Get the right visualizations for your data instantly.',
    },
  ];

  const benefits = [
    'No coding required',
    'Support for CSV & Excel',
    'Interactive filtering',
    'Export dashboards',
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">DataViz</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="gradient">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-16 pb-24">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full border border-primary/10"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-6">
              <Zap className="w-4 h-4 text-primary" />
              AI-Powered Data Visualization
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
              Turn data into
              <span className="text-gradient block">stunning dashboards</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Upload any CSV or Excel file and watch as intelligent algorithms
              automatically generate beautiful, interactive visualizations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="gradient" size="xl">
                  Start for free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl">
                  View demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mt-12"
          >
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Powerful, yet simple
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Everything you need to transform raw data into actionable insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary mx-auto mb-6 flex items-center justify-center shadow-glow">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 md:p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready to visualize your data?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of analysts creating beautiful dashboards in minutes.
            </p>
            <Link to="/register">
              <Button variant="gradient" size="xl">
                Get started now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-foreground">DataViz</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 DataViz. Built for data lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
