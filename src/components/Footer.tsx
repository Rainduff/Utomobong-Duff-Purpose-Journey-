import { ArrowUp, Download } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { generateResumePDF } from '../utils/pdfGenerator';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 bg-white text-zinc-600 border-t border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-bold text-zinc-900 tracking-tight">
              {PERSONAL_INFO.name}
            </div>
            <p className="text-xs text-zinc-500">
              {PERSONAL_INFO.title} · Port Harcourt, Nigeria
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-zinc-500">
            <a href="#projects" className="hover:text-zinc-900 transition-colors">
              Projects
            </a>
            <a href="#experience" className="hover:text-zinc-900 transition-colors">
              Experience
            </a>
            <a href="#resume" className="hover:text-zinc-900 transition-colors">
              Resume
            </a>
            <button
              onClick={() => generateResumePDF('all')}
              className="hover:text-zinc-900 transition-colors inline-flex items-center gap-1 text-zinc-700"
            >
              <Download className="w-3 h-3" />
              <span>Resume PDF</span>
            </button>
            <a href="#notes" className="hover:text-zinc-900 transition-colors">
              Notes
            </a>
            <a href="#contact" className="hover:text-zinc-900 transition-colors">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">
              © {new Date().getFullYear()} {PERSONAL_INFO.name}
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
              title="Scroll back to top"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
