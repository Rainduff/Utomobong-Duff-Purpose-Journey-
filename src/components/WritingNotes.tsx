import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { ARTICLES_NOTES } from '../data/portfolioData';
import { ArticleNote } from '../types/portfolio';

interface WritingNotesProps {
  onSelectArticle: (article: ArticleNote) => void;
}

export default function WritingNotes({ onSelectArticle }: WritingNotesProps) {
  return (
    <section id="notes" className="py-16 md:py-24 border-b border-zinc-100 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
            Writing & Engineering Notes
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            Articles & Thoughts
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Deep-dive essays on software architecture, client-side libraries, and systems engineering.
          </p>
        </div>

        <div data-tour-id="tour-notes" className="divide-y divide-zinc-100">
          {ARTICLES_NOTES.map((article, idx) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="py-6 first:pt-0 last:pb-0 group"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
                <span>{article.publication}</span>
                <span aria-hidden="true">·</span>
                <span>{article.date}</span>
                <span aria-hidden="true">·</span>
                <span className="text-zinc-500">{article.readTime}</span>
                <span aria-hidden="true">·</span>
                <span className="text-zinc-500">{article.tag}</span>
              </div>

              <button
                type="button"
                onClick={() => onSelectArticle(article)}
                className="w-full text-left flex items-center justify-between gap-4 group/btn focus-visible:outline-hidden"
              >
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 group-hover/btn:text-zinc-600 group-hover/btn:underline transition-colors">
                  {article.title}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover/btn:text-zinc-900 transition-colors shrink-0" />
              </button>

              <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                {article.excerpt}
              </p>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => onSelectArticle(article)}
                  className="text-xs font-semibold text-zinc-800 hover:text-zinc-600 transition-colors"
                >
                  Read full essay →
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
