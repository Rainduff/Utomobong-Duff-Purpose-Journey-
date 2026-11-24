import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Github,
  ArrowDown,
  Download,
  MapPin,
  ExternalLink,
  Compass,
  Award,
  Star,
} from 'lucide-react';
import {
  PERSONAL_INFO,
  AUTHOR_PORTRAIT,
  PITCH_DAY_CERTIFICATE_PDF,
} from '../data/portfolioData';
import { generateResumePDF } from '../utils/pdfGenerator';
import { GitHubSnapshot } from '../types/portfolio';
import SafeImage from './SafeImage';

interface HeroProps {
  onStartTour: () => void;
}

export default function Hero({ onStartTour }: HeroProps) {
  const [localTime, setLocalTime] = useState('');
  const [githubData, setGithubData] = useState<GitHubSnapshot | null>(null);

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeString = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Africa/Lagos',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date());
        setLocalTime(`${timeString} WAT`);
      } catch {
        setLocalTime('Port Harcourt, NG');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;
    fetch(`/api/github?username=${encodeURIComponent(PERSONAL_INFO.githubHandle)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: GitHubSnapshot | null) => {
        if (active && data && data.source !== 'unavailable') {
          setGithubData(data);
        }
      })
      .catch(() => {
        // Retain baseline metrics if GitHub is unreachable
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main bio & typography (8 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Unboxed Metadata Header */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1.5 text-zinc-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {PERSONAL_INFO.location}
              </span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span className="tabular-nums">{localTime || 'Africa/Lagos'}</span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span className="text-zinc-600">AI Research · Engineering · Digital Media</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 text-balance leading-[1.12]">
              AI researcher, ML engineer &amp; creative technologist.
            </h1>

            {/* Body Copy */}
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl">
              Hi, I&apos;m{' '}
              <span className="font-semibold text-zinc-900">{PERSONAL_INFO.name}</span>.{' '}
              {PERSONAL_INFO.bio}
            </p>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
              >
                <span>View Projects</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <button
                onClick={() => generateResumePDF('all')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/80 rounded-lg transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4 text-zinc-600" />
                <span>Download Resume (PDF)</span>
              </button>

              <button
                onClick={onStartTour}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 border border-transparent hover:border-zinc-200 rounded-lg transition-colors whitespace-nowrap"
              >
                <Compass className="w-4 h-4 text-zinc-500" />
                <span>Take a 20s Tour</span>
              </button>
            </div>

            {/* Secondary Links & Certificate */}
            <div className="pt-2 flex flex-wrap items-center gap-5 text-sm text-zinc-500 font-medium">
              <a
                href={PITCH_DAY_CERTIFICATE_PDF}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-zinc-950 transition-colors"
              >
                <Award className="w-4 h-4 text-zinc-500" />
                <span>Pitch Day 39th Edition Certificate</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
              <a
                href={githubData?.profileUrl || PERSONAL_INFO.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-zinc-900 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            </div>
          </motion.div>

          {/* Author Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4 flex justify-center lg:justify-end"
          >
            <div className="relative group">
              <div className="w-60 h-60 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden border border-zinc-200/90 shadow-sm bg-zinc-50">
                <SafeImage
                  src={AUTHOR_PORTRAIT}
                  alt={PERSONAL_INFO.name}
                  fallbackTitle={PERSONAL_INFO.name}
                  loading="eager"
                  className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500"
                />
              </div>
              <div className="mt-3 text-center lg:text-left">
                <p className="text-xs font-mono text-zinc-600 font-medium">
                  {PERSONAL_INFO.title}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  B.Eng. Engineering · University of Port Harcourt
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-width Metrics Row */}
        <div className="mt-14 pt-8 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {PERSONAL_INFO.stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 tracking-tight tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs font-medium text-zinc-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Live GitHub Repositories Strip (shown when live GitHub repos exist) */}
        {githubData && githubData.topRepos.length > 0 && (
          <div className="mt-8 pt-6 border-t border-zinc-100">
            <div className="flex items-center justify-between gap-4 mb-3 text-xs font-mono text-zinc-500">
              <span>Live GitHub Repositories (@{githubData.username})</span>
              <a
                href={githubData.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-900 transition-colors inline-flex items-center gap-1"
              >
                <span>View profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {githubData.topRepos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl border border-zinc-200/80 hover:border-zinc-300 bg-zinc-50/50 hover:bg-white transition-all flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-mono font-bold text-zinc-900 truncate">
                      {repo.name}
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1">
                      {repo.description || 'Public repository'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                    {repo.language && <span>{repo.language}</span>}
                    {repo.language && <span aria-hidden="true">·</span>}
                    <span className="inline-flex items-center gap-1 tabular-nums text-zinc-700">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {repo.stars}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
