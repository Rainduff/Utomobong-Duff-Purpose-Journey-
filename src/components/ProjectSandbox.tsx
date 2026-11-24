import { useState } from 'react';
import { Gauge, Languages, Mic, ShieldCheck } from 'lucide-react';

interface ProjectSandboxProps {
  projectId: string;
}

/* 1. Predictive Maintenance & Glass-Box XAI Sandbox */
function PredictiveMaintenanceSandbox() {
  const [vibration, setVibration] = useState(4.2); // mm/s
  const [temperature, setTemperature] = useState(68); // Celsius

  const vibScore = Math.min(100, Math.round((vibration / 10) * 100));
  const tempScore = Math.min(100, Math.round(((temperature - 35) / 75) * 100));
  const risk = Math.min(99, Math.round(vibScore * 0.62 + tempScore * 0.38));

  const statusLabel =
    risk >= 70
      ? 'Preventive Maintenance Recommended'
      : risk >= 45
      ? 'Monitor Bearing & Cooling Trend'
      : 'Normal Operating Envelope';

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-zinc-500">Glass-Box XAI Telemetry Simulator</div>
          <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-zinc-500" />
            <span>Midstream Electric Motor Risk Scorer</span>
          </h4>
        </div>
        <div className="text-xs font-mono text-zinc-800 tabular-nums font-bold">
          Fault Risk: {risk}%
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="p-3.5 bg-white rounded-xl border border-zinc-200 space-y-2 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-600">Vibration RMS</span>
            <span className="font-bold text-zinc-900 tabular-nums">{vibration.toFixed(1)} mm/s</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.1}
            value={vibration}
            onChange={(e) => setVibration(Number(e.target.value))}
            className="w-full accent-zinc-900 cursor-pointer"
          />
        </label>

        <label className="p-3.5 bg-white rounded-xl border border-zinc-200 space-y-2 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-600">Stator Temperature</span>
            <span className="font-bold text-zinc-900 tabular-nums">{temperature} °C</span>
          </div>
          <input
            type="range"
            min={35}
            max={110}
            step={1}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full accent-zinc-900 cursor-pointer"
          />
        </label>
      </div>

      {/* Glass-Box Explanation Output */}
      <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-zinc-900">{statusLabel}</span>
          <span className="text-[11px] font-mono text-zinc-500">
            LSTM + XGBoost Attribution
          </span>
        </div>

        <div className="space-y-2">
          {[
            { name: 'Bearing Vibration Channel', share: vibScore },
            { name: 'Thermal Drift Channel', share: Math.max(8, tempScore) },
          ].map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-zinc-600">
                <span>{item.name}</span>
                <span className="tabular-nums">{item.share}% contribution</span>
              </div>
              <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 transition-all duration-200"
                  style={{ width: `${item.share}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 2. Deep Past Challenge (Old Assyrian NMT) Sandbox */
function DeepPastNmtSandbox() {
  const samples = [
    {
      id: 'tablet-1',
      label: 'Caravan Letter (Kültepe)',
      akkadian: 'um-ma Pu-šu-ke-en6-ma a-na A-šùr-i-mì-tí qí-bi-ma',
      english: 'Thus speaks Pusu-ken: Say to Assur-imitti regarding the caravan dispatch.',
      tokens: 14,
      conf: '91.4%',
    },
    {
      id: 'tablet-2',
      label: 'Silver Ledger Fragment',
      akkadian: '10 ma-na KÙ.BABBAR ṣa-ru-pá-am i-ṣé-er En-nam-A-šùr',
      english: '10 minas of refined silver owed by Ennam-Assur under witness seal.',
      tokens: 12,
      conf: '89.7%',
    },
    {
      id: 'tablet-3',
      label: 'Tin & Textile Contract',
      akkadian: 'a-na ší-im AN.NA ù TÚG.HI.A a-na Kà-ni-iš ú-šé-bi-il5',
      english: 'For the purchase price of tin and textiles sent onward to Kanesh.',
      tokens: 15,
      conf: '88.2%',
    },
  ];
  const [selectedId, setSelectedId] = useState(samples[0].id);
  const [augmented, setAugmented] = useState(true);
  const current = samples.find((s) => s.id === selectedId) || samples[0];

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-zinc-500">NLLB-200 Low-Resource Workbench</div>
          <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-zinc-500" />
            <span>Old Assyrian Cuneiform Translation</span>
          </h4>
        </div>

        <button
          onClick={() => setAugmented(!augmented)}
          className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
            augmented
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white text-zinc-700 border-zinc-200'
          }`}
        >
          {augmented ? 'Augmentation: ON' : 'Augmentation: OFF'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {samples.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              selectedId === s.id
                ? 'bg-white border-zinc-900 text-zinc-900 shadow-xs'
                : 'bg-white/70 border-zinc-200 text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-1.5">
          <div className="text-[11px] font-mono text-zinc-400">Transliterated Cuneiform</div>
          <p className="text-xs font-mono text-zinc-900 leading-relaxed">{current.akkadian}</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-1.5">
          <div className="text-[11px] font-mono text-zinc-400">
            English Output · {augmented ? current.conf : '76.1%'} alignment
          </div>
          <p className="text-xs text-zinc-800 font-medium leading-relaxed">{current.english}</p>
        </div>
      </div>
    </div>
  );
}

/* 3. Nigerian Speech-to-Speech Translator Sandbox */
function SpeechTranslatorSandbox() {
  const [stage, setStage] = useState(0);
  const [pair, setPair] = useState<'ibibio-en' | 'pidgin-en'>('ibibio-en');

  const stages = [
    {
      title: '1. Acoustic Capture',
      detail:
        pair === 'ibibio-en'
          ? 'Captures tonal Ibibio speech waveform ("Mesiere, ndi afo emesana?")'
          : 'Captures Nigerian Pidgin audio stream ("How far, we dey move now")',
    },
    {
      title: '2. Direct Phonetic Alignment',
      detail: 'Extracts prosody & pitch contours without losing tonal meaning across sparse text.',
    },
    {
      title: '3. Target Speech Synthesis',
      detail:
        pair === 'ibibio-en'
          ? 'Synthesizes clear English speech: "Good morning, are you doing well?"'
          : 'Synthesizes clear English speech: "Hello, we are heading out now."',
    },
  ];

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-zinc-500">B.Eng. Research Pipeline</div>
          <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-zinc-500" />
            <span>Direct Speech-to-Speech Prototype</span>
          </h4>
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-zinc-200/70 rounded-lg text-xs">
          <button
            onClick={() => setPair('ibibio-en')}
            className={`px-2.5 py-1 rounded-md font-medium ${
              pair === 'ibibio-en' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600'
            }`}
          >
            Ibibio → English
          </button>
          <button
            onClick={() => setPair('pidgin-en')}
            className={`px-2.5 py-1 rounded-md font-medium ${
              pair === 'pidgin-en' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600'
            }`}
          >
            Pidgin → English
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stages.map((s, idx) => (
          <button
            key={s.title}
            onClick={() => setStage(idx)}
            className={`text-left p-3.5 rounded-xl border transition-all ${
              stage === idx
                ? 'bg-white border-zinc-900 shadow-xs'
                : 'bg-white/70 border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <div className="text-xs font-bold text-zinc-900">{s.title}</div>
            <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">{s.detail}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* 4. Online Transaction Fraud Detection Sandbox */
function FraudDetectionSandbox() {
  const [highVelocity, setHighVelocity] = useState(false);
  const [newDevice, setNewDevice] = useState(true);
  const [geoMismatch, setGeoMismatch] = useState(false);

  const score =
    14 + (highVelocity ? 42 : 0) + (newDevice ? 21 : 0) + (geoMismatch ? 31 : 0);
  const boundedScore = Math.min(98, score);
  const flagged = boundedScore >= 55;

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-zinc-500">Decision Tree &amp; Logistic Regression</div>
          <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-zinc-500" />
            <span>Transaction Fraud Risk Evaluator</span>
          </h4>
        </div>
        <span
          className={`text-xs font-mono font-bold tabular-nums ${
            flagged ? 'text-amber-700' : 'text-emerald-700'
          }`}
        >
          {flagged ? `Flagged (${boundedScore}% risk)` : `Cleared (${boundedScore}% risk)`}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Rapid Burst Velocity', active: highVelocity, toggle: () => setHighVelocity(!highVelocity) },
          { label: 'Unrecognized Device', active: newDevice, toggle: () => setNewDevice(!newDevice) },
          { label: 'Cross-Region IP Jump', active: geoMismatch, toggle: () => setGeoMismatch(!geoMismatch) },
        ].map((sig) => (
          <button
            key={sig.label}
            onClick={sig.toggle}
            className={`p-3 rounded-xl border text-left transition-all ${
              sig.active
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <div className="text-xs font-semibold">{sig.label}</div>
            <div className={`text-[11px] font-mono mt-0.5 ${sig.active ? 'text-zinc-300' : 'text-zinc-400'}`}>
              {sig.active ? 'Signal Active' : 'Normal'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProjectSandbox({ projectId }: ProjectSandboxProps) {
  switch (projectId) {
    case 'predictive-maintenance-xai':
      return <PredictiveMaintenanceSandbox />;
    case 'deep-past-nmt':
      return <DeepPastNmtSandbox />;
    case 'nigerian-speech-translator':
      return <SpeechTranslatorSandbox />;
    case 'fraud-detection-and-media':
      return <FraudDetectionSandbox />;
    default:
      return <PredictiveMaintenanceSandbox />;
  }
}
