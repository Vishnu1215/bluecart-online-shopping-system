import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id?: string;
  label: string;
  description?: string;
  completed?: boolean;
  current?: boolean;
}

interface StepperProps {
  steps: StepItem[];
  currentStepIndex?: number;
  currentStep?: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepIndex: explicitIndex,
  currentStep,
  className = ''
}) => {
  const chosenIndex = explicitIndex !== undefined ? explicitIndex : currentStep;
  const currentStepIndex = chosenIndex !== undefined 
    ? chosenIndex 
    : Math.max(0, steps.findIndex(s => s.current) !== -1 ? steps.findIndex(s => s.current) : steps.filter(s => s.completed).length);

  return (
    <div className={`w-full py-4 ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0" />

        {/* Progress track line */}
        <div 
          className="absolute top-4 left-6 h-0.5 bg-primary transition-all duration-500 -z-0"
          style={{
            width: `${Math.min(100, (currentStepIndex / Math.max(1, steps.length - 1)) * 100)}%`
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = step.completed !== undefined ? step.completed : idx < currentStepIndex;
          const isCurrent = step.current !== undefined ? step.current : idx === currentStepIndex;

          return (
            <div key={step.id || `step-${idx}`} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm ${
                  isCompleted
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : isCurrent
                    ? 'bg-primary text-white ring-4 ring-primary/30 scale-110'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-300 dark:border-slate-700'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>

              <div className="mt-2 text-center">
                <p className={`text-xs font-semibold tracking-wide ${
                  isCurrent 
                    ? 'text-primary dark:text-primary-400' 
                    : isCompleted 
                    ? 'text-slate-800 dark:text-slate-200' 
                    : 'text-slate-400'
                }`}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
