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
    <ol className="mx-auto mt-6 flex max-w-3xl items-center justify-between gap-6 px-6 text-sm text-white/70">
      {STEPPER_STEPS.map((step: StepperStep) => {
        const isActive = step.number === active;
        const stepClassName = isActive
          ? 'border-blue-400 bg-blue-500/20 text-blue-200'
          : 'border-white/20 bg-white/5 text-white/60';

        return (
          <li key={step.number} className="flex flex-1 items-center gap-3">
            <span
              className={`grid h-8 w-8 place-items-center rounded-full border text-sm ${stepClassName}`}
            >
              {step.number}
            </span>
            <span className={isActive ? 'text-white' : 'text-white/60'}>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
