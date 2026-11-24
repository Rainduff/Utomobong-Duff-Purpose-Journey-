import { motion } from 'motion/react';
import { CAREER_HISTORY } from '../data/portfolioData';

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="py-16 md:py-24 border-b border-zinc-100 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
            Career Chronology
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            Work Experience & Leadership
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Over a decade of scaling consumer web applications, developer platforms, and distributed systems.
          </p>
        </div>

        {/* Timeline items */}
        <div className="relative pl-6 sm:pl-8 border-l border-zinc-200 space-y-12">
          {CAREER_HISTORY.map((item, index) => (
            <motion.div
              key={`${item.company}-${item.role}`}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="relative group"
            >
              {/* Anchor marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-zinc-900 group-hover:scale-125 transition-transform" />

              {/* Role Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 group-hover:text-zinc-700 transition-colors">
                    {item.role}
                  </h3>
                  <div className="text-sm font-semibold text-zinc-700 flex flex-wrap items-center gap-2 mt-0.5">
                    <span>{item.company}</span>
                    <span aria-hidden="true" className="text-zinc-300">·</span>
                    <span className="text-xs font-mono text-zinc-500 font-normal">{item.location}</span>
                  </div>
                </div>

                <span className="text-xs font-mono text-zinc-500 font-medium tabular-nums shrink-0">
                  {item.period}
                </span>
              </div>

              {/* Summary */}
              <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                {item.summary}
              </p>

              {/* Achievements */}
              <ul className="space-y-2 mb-4">
                {item.achievements.map((ach, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-zinc-600 flex items-start gap-2.5">
                    <span className="text-zinc-400 font-mono mt-0.5">—</span>
                    <span className="leading-normal">{ach.text}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Unboxed */}
              <div className="text-[11px] font-mono text-zinc-500 pt-1">
                {item.technologies.join(' · ')}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
