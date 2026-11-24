import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-projects',
    title: 'AI Systems, Research & Media Gallery',
    description:
      'Explore high-resolution previews and interactive sandboxes for Oil & Gas Predictive Maintenance XAI, Old Assyrian NMT, and Nigerian Speech AI.',
  },
  {
    targetId: 'tour-resume',
    title: 'Tailored CV, Original PDF & Certificate',
    description:
      'Switch between Complete CV, AI & ML Research, or Media & Leadership views, download the tailored PDF, or inspect the Pitch Day 39th Edition certificate.',
  },
  {
    targetId: 'tour-notes',
    title: 'Research & Engineering Essays',
    description:
      'Open any article to read deep-dive notes on Glass-Box XAI, low-resource NLP, and visual storytelling with copyable Python snippets.',
  },
  {
    targetId: 'tour-contact',
    title: 'Direct Server-Backed Inbox',
    description:
      'Send collaboration or hiring inquiries directly through the validated contact form or copy my email with one click.',
  },
];

interface SpotlightTourProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RectState {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function SpotlightTour({ isOpen, onClose }: SpotlightTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<RectState | null>(null);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentStep = TOUR_STEPS[stepIndex];

  const handleNext = useCallback(() => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      onClose();
    }
  }, [stepIndex, onClose]);

  const handlePrev = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  }, [stepIndex]);

  useModalAccessibility({
    isOpen,
    containerRef: popoverRef,
    onClose,
    onNext: handleNext,
    onPrev: handlePrev,
  });

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      return;
    }

    const el = document.querySelector(`[data-tour-id="${currentStep.targetId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen, stepIndex, currentStep.targetId]);

  useEffect(() => {
    if (!isOpen) return;

    const measure = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      const el = document.querySelector(`[data-tour-id="${currentStep.targetId}"]`);
      if (!el) {
        setTargetRect(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      const pad = 10;
      setTargetRect({
        top: Math.max(8, rect.top - pad),
        left: Math.max(8, rect.left - pad),
        width: Math.min(window.innerWidth - 16, rect.width + pad * 2),
        height: Math.min(window.innerHeight - 16, rect.height + pad * 2),
      });
    };

    measure();
    const timer = window.setTimeout(measure, 350);
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', measure, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [isOpen, stepIndex, currentStep.targetId]);

  if (!isOpen) return null;

  // Position popover safely inside viewport
  const isMobile = viewport.width < 640;
  let popoverStyle: React.CSSProperties = {};

  if (isMobile || !targetRect) {
    popoverStyle = {
      left: '16px',
      right: '16px',
      bottom: '16px',
    };
  } else {
    const popoverWidth = 360;
    const spaceBelow = viewport.height - (targetRect.top + targetRect.height);
    const placeBelow = spaceBelow > 210;
    const leftPos = Math.min(
      Math.max(16, targetRect.left),
      viewport.width - popoverWidth - 16
    );
    popoverStyle = {
      width: `${popoverWidth}px`,
      left: `${leftPos}px`,
      top: placeBelow
        ? `${Math.min(viewport.height - 210, targetRect.top + targetRect.height + 14)}px`
        : `${Math.max(16, targetRect.top - 196)}px`,
    };
  }

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Portfolio Tour"
    >
      {/* SVG Cutout Scrim (Spotlight.js-style mask) */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-auto"
        onClick={onClose}
        aria-hidden="true"
      >
        <defs>
          <mask id="portfolio-spotlight-mask">
            <rect x="0" y="0" width={viewport.width} height={viewport.height} fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="14"
                fill="black"
                className="transition-all duration-300 ease-out"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width={viewport.width}
          height={viewport.height}
          fill="rgba(9, 9, 11, 0.68)"
          mask="url(#portfolio-spotlight-mask)"
        />
        {targetRect && (
          <rect
            x={targetRect.left}
            y={targetRect.top}
            width={targetRect.width}
            height={targetRect.height}
            rx="14"
            fill="none"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2"
            className="transition-all duration-300 ease-out pointer-events-none"
          />
        )}
      </svg>

      {/* Popover Card */}
      <div
        ref={popoverRef}
        tabIndex={-1}
        style={popoverStyle}
        className="fixed z-10 bg-white rounded-2xl shadow-2xl border border-zinc-200 p-5 space-y-3 focus:outline-hidden"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
            Step {stepIndex + 1} of {TOUR_STEPS.length} · Spotlight Tour
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
            aria-label="Close tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-zinc-950">{currentStep.title}</h3>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Skip tour
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <span>{stepIndex === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}</span>
              {stepIndex < TOUR_STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
