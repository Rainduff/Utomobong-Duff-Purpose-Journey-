import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Project } from '../types/portfolio';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import ProjectPreviewArt from './ProjectPreviewArt';
import ProjectSandbox from './ProjectSandbox';

interface ProjectLightboxProps {
  project: Project | null;
  allProjects: Project[];
  onClose: () => void;
  onSelectProject: (p: Project) => void;
}

export default function ProjectLightbox({
  project,
  allProjects,
  onClose,
  onSelectProject,
}: ProjectLightboxProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'sandbox' | 'architecture'>('preview');
  const [isZoomed, setIsZoomed] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsZoomed(false);
  }, [project]);

  const navigateProject = useCallback(
    (direction: number) => {
      if (!project) return;
      const currentIndex = allProjects.findIndex((p) => p.id === project.id);
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex + direction + allProjects.length) % allProjects.length;
      onSelectProject(allProjects[nextIndex]);
    },
    [project, allProjects, onSelectProject]
  );

  useModalAccessibility({
    isOpen: Boolean(project),
    containerRef: modalRef,
    onClose,
    onNext: () => navigateProject(1),
    onPrev: () => navigateProject(-1),
  });

  if (!project) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} details`}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/70 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh] z-10 my-auto focus:outline-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 shrink-0">
            <div className="flex items-center gap-3 truncate">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-medium">
                {project.category}
              </span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 truncate">
                {project.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-white text-xs">
                <button
                  onClick={() => navigateProject(-1)}
                  className="p-2 hover:bg-zinc-100 text-zinc-600 transition-colors"
                  title="Previous project (Left arrow)"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-zinc-200" />
                <button
                  onClick={() => navigateProject(1)}
                  className="p-2 hover:bg-zinc-100 text-zinc-600 transition-colors"
                  title="Next project (Right arrow)"
                  aria-label="Next project"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-200 rounded-lg transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-2.5 bg-white border-b border-zinc-100 text-xs">
            <div className="flex items-center gap-1 p-0.5 bg-zinc-100 rounded-lg overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'preview'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                System Overview
              </button>
              <button
                onClick={() => setActiveTab('sandbox')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'sandbox'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Interactive Preview
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'architecture'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Architecture &amp; Specs
              </button>
            </div>

            {project.metricBadge && (
              <span className="text-xs font-mono text-zinc-600 font-medium">
                {project.metricBadge}
              </span>
            )}
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
            {activeTab === 'preview' && (
              <div className="space-y-4">
                <div className="relative rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50">
                  <div
                    className={`aspect-16/9 transition-transform duration-300 ${
                      isZoomed ? 'scale-125 origin-center cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  >
                    <ProjectPreviewArt project={project} />
                  </div>

                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-xs text-xs font-medium text-zinc-800 rounded-lg shadow-sm border border-zinc-200 hover:bg-white transition-colors"
                  >
                    {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                    <span>{isZoomed ? 'Reset Scale' : 'Inspect View'}</span>
                  </button>
                </div>

                <div className="pt-2">
                  <h3 className="text-base font-bold text-zinc-900">{project.tagline}</h3>
                  <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'sandbox' && (
              <div className="space-y-4">
                <ProjectSandbox projectId={project.id} />
                <p className="text-xs text-zinc-500">
                  Interactive browser simulation demonstrating the logic behind {project.title}.
                </p>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    The Problem
                  </h4>
                  <p className="text-sm text-zinc-700 mt-1 leading-relaxed">
                    {project.architectureDetails.problem}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    The Technical Solution
                  </h4>
                  <p className="text-sm text-zinc-700 mt-1 leading-relaxed">
                    {project.architectureDetails.solution}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                    Key Architectural Highlights
                  </h4>
                  <ul className="space-y-2">
                    {project.architectureDetails.highlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Impact Metrics Section */}
            <div className="pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                Outcomes &amp; Verification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {project.impactMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs text-zinc-700 leading-snug"
                  >
                    {metric}
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Unboxed Metadata */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-600">
              <span className="text-zinc-400 flex items-center gap-1 mr-1">
                <Layers className="w-3.5 h-3.5" />
                Stack:
              </span>
              <span>{project.techStack.join(' · ')}</span>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-5 sm:px-6 py-3.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500 shrink-0">
            <span className="font-mono">
              Press <kbd className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded text-zinc-700">Esc</kbd> to close · Use <kbd className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded text-zinc-700">←</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded text-zinc-700">→</kbd> to browse
            </span>

            <button
              onClick={onClose}
              className="px-4 py-1.5 font-medium text-zinc-800 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
