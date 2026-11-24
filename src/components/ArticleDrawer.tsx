import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, BookOpen, ArrowLeft } from 'lucide-react';
import { ArticleNote } from '../types/portfolio';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface ArticleDrawerProps {
  article: ArticleNote | null;
  onClose: () => void;
}

export default function ArticleDrawer({ article, onClose }: ArticleDrawerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useModalAccessibility({
    isOpen: Boolean(article),
    containerRef: drawerRef,
    onClose,
  });

  useEffect(() => {
    setScrollProgress(0);
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [article]);

  if (!article) return null;

  const handleScroll = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) {
      setScrollProgress(100);
      return;
    }
    setScrollProgress(Math.min(100, Math.round((el.scrollTop / max) * 100)));
  };

  const handleCopyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-label={article.title}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs"
        />

        {/* Slide-over Drawer */}
        <motion.div
          ref={drawerRef}
          tabIndex={-1}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl bg-white h-full shadow-2xl border-l border-zinc-200 flex flex-col focus:outline-hidden"
        >
          {/* Reading Progress Indicator */}
          <div className="h-0.5 w-full bg-zinc-100 shrink-0">
            <div
              className="h-full bg-zinc-900 transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* Drawer Header */}
          <div className="px-5 sm:px-8 py-4 border-b border-zinc-200 flex items-center justify-between gap-4 shrink-0 bg-white">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Notes</span>
            </button>

            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
              <span className="hidden sm:inline">{article.readTime}</span>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors"
                aria-label="Close article reader"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Essay Content */}
          <div
            ref={scrollAreaRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-5 sm:px-8 py-8 space-y-8"
          >
            {/* Title & Unboxed Meta */}
            <header className="space-y-3 pb-6 border-b border-zinc-100">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500">
                <span className="inline-flex items-center gap-1.5 text-zinc-700 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                  {article.publication}
                </span>
                <span aria-hidden="true" className="text-zinc-300">·</span>
                <span>{article.date}</span>
                <span aria-hidden="true" className="text-zinc-300">·</span>
                <span>{article.readTime}</span>
                <span aria-hidden="true" className="text-zinc-300">·</span>
                <span>{article.tag}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 text-balance leading-tight">
                {article.title}
              </h1>

              <p className="text-base text-zinc-600 leading-relaxed">
                {article.excerpt}
              </p>
            </header>

            {/* Sections */}
            <div className="space-y-8">
              {article.sections.map((section, idx) => (
                <section key={idx} className="space-y-4">
                  {section.heading && (
                    <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
                      {section.heading}
                    </h2>
                  )}

                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-sm sm:text-[15px] text-zinc-700 leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {section.codeBlock && (
                    <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-950 text-zinc-100">
                      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                        <span>{section.codeBlock.filename || section.codeBlock.language}</span>
                        <button
                          onClick={() =>
                            handleCopyCode(section.codeBlock!.code, `${article.id}-${idx}`)
                          }
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                        >
                          {copiedKey === `${article.id}-${idx}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                        <code>{section.codeBlock.code}</code>
                      </pre>
                    </div>
                  )}

                  {section.takeaway && (
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs sm:text-sm text-zinc-700 leading-relaxed">
                      <span className="font-mono font-semibold text-zinc-900 mr-2">
                        Key takeaway:
                      </span>
                      {section.takeaway}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-8 py-3.5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500 shrink-0">
            <span className="font-mono">
              Press <kbd className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded text-zinc-700">Esc</kbd> to close
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 font-medium text-zinc-800 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Close Reader
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
