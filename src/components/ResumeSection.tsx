import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  Printer,
  Copy,
  Check,
  FileText,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  ExternalLink,
  Users,
} from 'lucide-react';
import {
  RESUME_DATA,
  ORIGINAL_CV_PDF,
  PITCH_DAY_CERTIFICATE_PDF,
} from '../data/portfolioData';
import { ResumePreset } from '../types/portfolio';
import { generateResumePDF } from '../utils/pdfGenerator';

const PRESET_OPTIONS: { id: ResumePreset; label: string }[] = [
  { id: 'all', label: 'Complete CV' },
  { id: 'ai-research', label: 'AI & ML Research' },
  { id: 'media-leadership', label: 'Media & Leadership' },
];

export default function ResumeSection() {
  const [preset, setPreset] = useState<ResumePreset>('all');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const visibleSkills = RESUME_DATA.skills.filter(
    (s) => preset === 'all' || s.focus.includes(preset)
  );

  const handleDownload = () => {
    setDownloading(true);
    try {
      generateResumePDF(preset);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
${RESUME_DATA.name.toUpperCase()} - ${RESUME_DATA.title}
${RESUME_DATA.location} | ${RESUME_DATA.email} | ${RESUME_DATA.phones.join(', ')}
Address: ${RESUME_DATA.address}

PROFESSIONAL SUMMARY
${RESUME_DATA.summary[preset]}

CORE SKILLS
${visibleSkills.map((s) => `${s.category}: ${s.items.join(', ')}`).join('\n')}

WORK EXPERIENCE
${RESUME_DATA.experience
  .map((e) => {
    const bullets = e.achievements.filter(
      (a) => preset === 'all' || a.focus.includes(preset)
    );
    const list = bullets.length > 0 ? bullets : e.achievements;
    return `
${e.role} - ${e.company} (${e.period}) - ${e.location}
${list.map((a) => `• ${a.text}`).join('\n')}`;
  })
  .join('\n')}

EDUCATION
${RESUME_DATA.education.map((ed) => `${ed.degree} - ${ed.institution} (${ed.period})`).join('\n')}

CERTIFICATES & TRAINING
${RESUME_DATA.certifications.map((c) => `${c.title} — ${c.issuer} (${c.period})`).join('\n')}

REFEREES
${RESUME_DATA.referees.map((r) => `${r.name} — ${r.organization} (${r.phone})`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="resume" className="py-16 md:py-24 border-b border-zinc-100 bg-zinc-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
              Curriculum Vitae &amp; Credentials
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
              Resume &amp; Certifications
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Download a tailored PDF, inspect your original CV file, or view the Pitch Day certificate.
            </p>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-75 rounded-lg transition-colors shadow-xs whitespace-nowrap"
              title="Download tailored PDF with clickable links"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Preparing PDF...' : 'Download Tailored PDF'}</span>
            </button>

            <a
              href={ORIGINAL_CV_PDF}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-500" />
              <span>Original CV PDF</span>
            </a>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
              title="Print resume or save via browser PDF printer"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-500" />
              <span>Print</span>
            </button>

            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
              title="Copy plain text formatted resume"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Role Preset Segmented Filter */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-1 p-1 bg-zinc-200/70 rounded-xl overflow-x-auto max-w-full">
            {PRESET_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPreset(opt.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  preset === opt.id
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-zinc-500">
            Updated November 2026 · Clickable PDF links enabled
          </span>
        </div>

        {/* Formatted Resume Paper Container */}
        <motion.div
          data-tour-id="tour-resume"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="resume-sheet bg-white border border-zinc-200/90 rounded-2xl shadow-sm p-6 sm:p-10 md:p-12 space-y-10"
        >
          {/* Header */}
          <div className="border-b border-zinc-200 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
                  {RESUME_DATA.name}
                </h1>
                <p className="text-base text-zinc-600 font-medium mt-1">
                  {RESUME_DATA.title}
                </p>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  {RESUME_DATA.nationality} · Languages: {RESUME_DATA.languages}
                </p>
              </div>

              {/* Contact Meta */}
              <div className="text-xs font-mono text-zinc-500 space-y-1 sm:text-right">
                <p>{RESUME_DATA.location}</p>
                <p>{RESUME_DATA.address}</p>
                <p>
                  <a href={`mailto:${RESUME_DATA.email}`} className="text-zinc-800 hover:underline">
                    {RESUME_DATA.email}
                  </a>
                </p>
                <p className="tabular-nums">{RESUME_DATA.phones.join(' · ')}</p>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="mt-6 pt-6 border-t border-zinc-100">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                Professional Summary
              </h2>
              <p className="text-sm text-zinc-700 leading-relaxed max-w-3xl">
                {RESUME_DATA.summary[preset]}
              </p>
            </div>
          </div>

          {/* Core Skills */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
              <Code2 className="w-4 h-4 text-zinc-500" />
              <span>Core Technical &amp; Creative Skills</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visibleSkills.map((skillGroup) => (
                <div key={skillGroup.category} className="p-4 bg-zinc-50/80 rounded-xl border border-zinc-100">
                  <div className="text-xs font-bold text-zinc-900 mb-1.5 font-mono">
                    {skillGroup.category}
                  </div>
                  <div className="text-xs text-zinc-600 leading-relaxed">
                    {skillGroup.items.join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-zinc-500" />
              <span>Work Experience</span>
            </h2>

            <div className="space-y-8">
              {RESUME_DATA.experience.map((job) => {
                const filteredBullets = job.achievements.filter(
                  (a) => preset === 'all' || a.focus.includes(preset)
                );
                const bulletsToDisplay =
                  filteredBullets.length > 0 ? filteredBullets : job.achievements;

                return (
                  <div key={`${job.company}-${job.role}`} className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div>
                        <h3 className="text-base font-bold text-zinc-900">
                          {job.role}
                        </h3>
                        <div className="text-xs font-mono text-zinc-500 mt-0.5">
                          <span className="text-zinc-800 font-semibold">{job.company}</span>
                          <span className="mx-1.5 text-zinc-300">·</span>
                          <span>{job.location}</span>
                          <span className="mx-1.5 text-zinc-300">·</span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-zinc-500 tabular-nums font-medium">
                        {job.period}
                      </span>
                    </div>

                    <ul className="space-y-2 pt-1">
                      {bulletsToDisplay.map((ach, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-zinc-700 flex items-start gap-2">
                          <span className="text-zinc-400 font-mono mt-0.5">—</span>
                          <span className="leading-normal">{ach.text}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-1 text-[11px] font-mono text-zinc-500">
                      <span className="text-zinc-400 mr-1.5">Focus:</span>
                      <span>{job.technologies.join(' · ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificates & Recognition */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-zinc-500" />
              <span>Certificates, Honors &amp; Training</span>
            </h2>

            {/* Featured Pitch Day 39th Edition Certificate Card */}
            <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-zinc-500">
                  Con Valores Incubadora · Valencia · November 18, 2026
                </div>
                <h3 className="text-sm font-bold text-zinc-950">
                  Certificate — Pitch Day 39th Edition (Utomobong Duff)
                </h3>
                <p className="text-xs text-zinc-600">
                  Awarded for sharing ideas with passion, authenticity, and clarity (signed by Co-Founders Melquiades Lozano &amp; Andrea Platero).
                </p>
              </div>
              <a
                href={PITCH_DAY_CERTIFICATE_PDF}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors shrink-0 self-start sm:self-center"
              >
                <span>View Certificate PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {RESUME_DATA.certifications.slice(1).map((cert) => (
                <div key={cert.title} className="p-3.5 bg-zinc-50/70 rounded-xl border border-zinc-100">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs font-bold text-zinc-900">{cert.title}</h4>
                    <span className="text-[11px] font-mono text-zinc-500 tabular-nums shrink-0">
                      {cert.period}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-zinc-500" />
              <span>Education</span>
            </h2>

            <div className="space-y-4">
              {RESUME_DATA.education.map((edu) => (
                <div
                  key={edu.institution}
                  className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs"
                >
                  <div>
                    <h3 className="font-bold text-zinc-900 text-sm">{edu.degree}</h3>
                    <p className="text-zinc-600 mt-0.5">{edu.institution}</p>
                    {edu.notes && <p className="text-zinc-400 font-mono mt-0.5">{edu.notes}</p>}
                  </div>
                  <span className="font-mono text-zinc-500 tabular-nums">{edu.period}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Referees & Hobbies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
            <div className="space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-500" />
                <span>Referees</span>
              </h2>
              <div className="space-y-2.5">
                {RESUME_DATA.referees.map((ref) => (
                  <div key={ref.name} className="text-xs">
                    <div className="font-bold text-zinc-900">{ref.name}</div>
                    <div className="text-zinc-600">{ref.organization}</div>
                    <div className="font-mono text-zinc-500 tabular-nums">{ref.phone}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Interests &amp; Hobbies
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {RESUME_DATA.hobbies.join(' · ')}
              </p>
            </div>
          </div>

          {/* Bottom Download Trigger */}
          <div className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
            <div className="text-xs text-zinc-500 font-mono">
              ATS-friendly layout with clickable email and phone links.
            </div>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download {PRESET_OPTIONS.find((o) => o.id === preset)?.label} PDF</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
