import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from './Button';

interface TourStep {
  title: string;
  description: string;
  target?: string;
}

export const OnboardingTour: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TourStep[] = [
    {
      title: 'Welcome to BlueCart Online Shopping System!',
      description: 'Explore our multi-role e-commerce platform built strictly according to SRS v1.0 specifications.'
    },
    {
      title: 'Persistent Live Cart & Search',
      description: 'Add products in 3 clicks! Use the top search bar to filter by category, price, and customer rating with live counter.'
    },
    {
      title: 'Role-Based Consoles',
      description: 'Switch between Customer, Vendor (Distributor), and Administrator dashboards from the top banner anytime.'
    }
  ];

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('bluecart_onboarding_dismissed');
    if (!hasSeenTour) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('bluecart_onboarding_dismissed', 'true');
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleDismiss();
    }
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border-2 border-primary/40 rounded-2xl p-5 shadow-2xl animate-bounce-subtle">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
          <span>Quick Tour ({currentStep + 1}/{steps.length})</span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
          aria-label="Skip tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
        {step.title}
      </h4>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
        {step.description}
      </p>

      <div className="flex items-center justify-between">
        <button
          onClick={handleDismiss}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
        >
          Skip tour
        </button>
        <Button size="sm" onClick={handleNext}>
          {currentStep === steps.length - 1 ? (
            <span className="flex items-center gap-1">Got it <Check className="w-3.5 h-3.5" /></span>
          ) : (
            <span className="flex items-center gap-1">Next <ArrowRight className="w-3.5 h-3.5" /></span>
          )}
        </Button>
      </div>
    </div>
  );
};
