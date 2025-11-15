import { CheckCircle2 } from 'lucide-react';
import { STEPPER_STEPS } from '@/lib/constants';
import type { StepperStep } from '@/types';

interface StepperProps {
  active: number;
}

/**
 * Stepper component to show progress through the analysis steps
 */
export default function Stepper({ active }: StepperProps) {
  return (
    <div className="flex justify-center mt-6 w-full">
      <ol className="flex items-center gap-4 text-sm text-white/70">
        {STEPPER_STEPS.map((step: StepperStep, index: number) => {
          const isActive = step.number === active;
          const isCompleted = step.number < active;
          const isLast = index === STEPPER_STEPS.length - 1;

          let stepClassName = 'border-white/20 bg-white/5 text-white/60';
          if (isCompleted) {
            stepClassName = 'border-green-400 bg-green-500/20 text-green-300';
          } else if (isActive) {
            stepClassName = 'border-blue-400 bg-blue-500/20 text-blue-200';
          }

          return (
            <li key={step.number} className="flex items-center">
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full border-2 text-sm font-medium ${stepClassName}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </span>
                  <span className={`mt-2 text-xs text-center whitespace-nowrap ${isActive ? 'text-white' : 'text-white/60'}`}>
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={`mx-6 h-0.5 w-24 ${
                      isCompleted ? 'bg-green-400' : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
