import { Project } from '../types/portfolio';

interface ProjectPreviewArtProps {
  project: Project;
}

export default function ProjectPreviewArt({ project }: ProjectPreviewArtProps) {
  if (project.id === 'predictive-maintenance-xai') {
    return (
      <div className="w-full h-full bg-zinc-50 p-5 sm:p-6 flex flex-col justify-between select-none text-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Midstream Pump Station · Unit M-04
            </div>
            <div className="text-sm font-bold text-zinc-900">
              IoT Telemetry & Glass-Box XAI Monitor
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-zinc-500">Model Precision</div>
            <div className="text-sm font-mono font-bold text-emerald-700 tabular-nums">100.0%</div>
          </div>
        </div>

        {/* Simulated Vibration Waveform + XAI Driver Bars */}
        <div className="grid grid-cols-12 gap-4 my-auto py-3 items-center">
          <div className="col-span-7 bg-white border border-zinc-200 rounded-xl p-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-2">
              <span>Vibration RMS (mm/s)</span>
              <span className="text-zinc-900 font-semibold tabular-nums">4.82 mm/s</span>
            </div>
            <svg viewBox="0 0 220 64" className="w-full h-14 overflow-visible">
              <line x1="0" y1="18" x2="220" y2="18" stroke="#e4e4e7" strokeDasharray="3 3" />
              <line x1="0" y1="46" x2="220" y2="46" stroke="#e4e4e7" strokeDasharray="3 3" />
              <polyline
                fill="none"
                stroke="#18181b"
                strokeWidth="2"
                points="0,42 18,38 35,44 52,32 70,40 88,26 105,35 124,14 142,29 160,18 178,24 196,12 220,20"
              />
              <circle cx="196" cy="12" r="3.5" fill="#d97706" />
            </svg>
          </div>

          <div className="col-span-5 bg-white border border-zinc-200 rounded-xl p-3 space-y-2">
            <div className="text-[10px] font-mono text-zinc-500">XAI Attribution</div>
            {[
              { label: 'Bearing Vib', pct: 86 },
              { label: 'Stator Temp', pct: 64 },
              { label: 'Shaft Load', pct: 38 },
            ].map((bar) => (
              <div key={bar.label} className="space-y-0.5">
                <div className="flex justify-between text-[10px] font-mono text-zinc-700">
                  <span>{bar.label}</span>
                  <span className="tabular-nums">{bar.pct}%</span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${bar.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-200">
          <span>LSTM + XGBoost + VAE Ensemble</span>
          <span className="tabular-nums">60 Hz Sensor Stream</span>
        </div>
      </div>
    );
  }

  if (project.id === 'deep-past-nmt') {
    return (
      <div className="w-full h-full bg-zinc-50 p-5 sm:p-6 flex flex-col justify-between select-none text-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Kaggle · Extreme Low-Resource NLP
            </div>
            <div className="text-sm font-bold text-zinc-900">
              Old Assyrian Cuneiform → English NMT
            </div>
          </div>
          <span className="text-[11px] font-mono font-semibold text-zinc-700 bg-white border border-zinc-200 px-2 py-0.5 rounded">
            NLLB-200
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-auto py-3">
          <div className="bg-white border border-zinc-200 rounded-xl p-3 space-y-1.5">
            <div className="text-[10px] font-mono text-zinc-400">Source Transliteration</div>
            <p className="text-xs font-mono text-zinc-800 leading-relaxed">
              um-ma Pu-šu-ke-en6-ma a-na A-šùr-i-mì-tí qí-bi-ma
            </p>
            <div className="text-[10px] font-mono text-zinc-400 pt-1">Augmented Token Window</div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-3 space-y-1.5">
            <div className="text-[10px] font-mono text-zinc-400">Decoded Translation</div>
            <p className="text-xs text-zinc-800 font-medium leading-relaxed">
              &ldquo;Thus says Pusu-ken: Speak to Assur-imitti concerning the silver caravan.&rdquo;
            </p>
            <div className="text-[10px] font-mono text-emerald-700 pt-1">
              Transfer Alignment Verified
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-200">
          <span>Transfer Learning · Back-Translation</span>
          <span>PyTorch Pipeline</span>
        </div>
      </div>
    );
  }

  if (project.id === 'nigerian-speech-translator') {
    return (
      <div className="w-full h-full bg-zinc-50 p-5 sm:p-6 flex flex-col justify-between select-none text-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              B.Eng. Research · University of Port Harcourt
            </div>
            <div className="text-sm font-bold text-zinc-900">
              Direct Speech-to-Speech Translation System
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-600">2024</span>
        </div>

        <div className="my-auto py-3 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { step: '01', title: 'Voice Input', sub: 'Ibibio / Pidgin' },
              { step: '02', title: 'Phoneme Map', sub: 'Tonal Encoder' },
              { step: '03', title: 'Speech Out', sub: 'English Audio' },
            ].map((node) => (
              <div key={node.step} className="bg-white border border-zinc-200 rounded-xl p-3">
                <div className="text-[10px] font-mono text-zinc-400 tabular-nums">{node.step}</div>
                <div className="text-xs font-bold text-zinc-900 mt-0.5">{node.title}</div>
                <div className="text-[10px] font-mono text-zinc-500 mt-0.5">{node.sub}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl px-3 py-2 flex items-center gap-1.5">
            {[18, 36, 52, 28, 64, 42, 74, 34, 58, 44, 68, 30, 48, 22, 60, 38, 26, 46].map(
              (h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-zinc-800 rounded-full"
                  style={{ height: `${Math.max(6, Math.round(h * 0.35))}px` }}
                />
              )
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-200">
          <span>Low-Resource Acoustic Architecture</span>
          <span>Blockchain Dataset Feasibility</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-50 p-5 sm:p-6 flex flex-col justify-between select-none text-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Applied ML & Visual Direction
          </div>
          <div className="text-sm font-bold text-zinc-900">
            Fraud Classification & Digital Media Production
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold text-emerald-700 tabular-nums">
          92% Acc
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 my-auto py-3">
        <div className="bg-white border border-zinc-200 rounded-xl p-3 space-y-2">
          <div className="text-[10px] font-mono text-zinc-500">Fraud Classifier Metrics</div>
          <div className="text-xl font-bold font-mono text-zinc-950 tabular-nums">92.0%</div>
          <div className="text-[11px] text-zinc-600">
            Decision Tree & Logistic Regression scoring pipeline
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3 space-y-2">
          <div className="text-[10px] font-mono text-zinc-500">Media Campaigns</div>
          <div className="text-xl font-bold font-mono text-zinc-950 tabular-nums">10+ Reels</div>
          <div className="text-[11px] text-zinc-600">
            Premiere Pro, CapCut & brand photography direction
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-200">
        <span>Scikit-learn · Pandas</span>
        <span>Premiere Pro · Photoshop · CapCut</span>
      </div>
    </div>
  );
}
