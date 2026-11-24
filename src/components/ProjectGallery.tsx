import { useState } from 'react';
import { motion } from 'motion/react';
import { Maximize2, Award } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types/portfolio';
import ProjectPreviewArt from './ProjectPreviewArt';

interface ProjectGalleryProps {
  onSelectProject: (project: Project) => void;
}

export default function ProjectGallery({ onSelectProject }: ProjectGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'AI & ML', 'Research', 'Creative Media'];

  const filteredProjects =
    activeCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-16 md:py-24 border-b border-zinc-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
              Portfolio &amp; Selected Research
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
              Projects, AI Systems &amp; Creative Work
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 mt-1 max-w-xl">
              High-resolution previews, interactive model sandboxes, and technical breakdowns across industrial ML, low-resource NLP, and digital media.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === cat
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div
          data-tour-id="tour-projects"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group flex flex-col bg-white border border-zinc-200/90 rounded-2xl overflow-hidden hover:border-zinc-300 hover:shadow-lg transition-all duration-300"
            >
              {/* Domain-Accurate Preview Container */}
              <button
                type="button"
                onClick={() => onSelectProject(project)}
                className="relative aspect-16/9 w-full bg-zinc-50 overflow-hidden cursor-pointer text-left border-b border-zinc-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-zinc-900"
                aria-label={`Inspect ${project.title} preview and interactive sandbox`}
              >
                <ProjectPreviewArt project={project} />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-zinc-950/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-xs text-xs font-semibold text-zinc-900 rounded-lg shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Inspect System &amp; Sandbox</span>
                  </div>
                </div>

                <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-md text-[11px] font-mono font-medium text-zinc-800 shadow-xs border border-zinc-200/60">
                  {project.category}
                </div>
              </button>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                {/* Unboxed Metadata line */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500 mb-2">
                  <span>{project.year}</span>
                  {project.metricBadge && (
                    <>
                      <span aria-hidden="true" className="text-zinc-300">·</span>
                      <span className="inline-flex items-center gap-1 text-zinc-800 font-semibold">
                        <Award className="w-3 h-3 text-zinc-500" />
                        <span>{project.metricBadge}</span>
                      </span>
                    </>
                  )}
                  {project.scopeBadge && (
                    <>
                      <span aria-hidden="true" className="text-zinc-300">·</span>
                      <span className="text-zinc-500">{project.scopeBadge}</span>
                    </>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-lg font-bold text-zinc-950 group-hover:text-zinc-700 transition-colors">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="text-left hover:underline focus-visible:outline-hidden"
                  >
                    {project.title}
                  </button>
                </h3>

                {/* Tagline */}
                <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed flex-1">
                  {project.tagline}
                </p>

                {/* Tech Stack Unboxed Text */}
                <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] font-mono text-zinc-500">
                  {project.techStack.slice(0, 4).join(' · ')}
                  {project.techStack.length > 4 && ` · +${project.techStack.length - 4} more`}
                </div>

                {/* Actions row */}
                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1.5 py-1 transition-colors"
                  >
                    <span>Breakdown &amp; Interactive Sandbox</span>
                    <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
