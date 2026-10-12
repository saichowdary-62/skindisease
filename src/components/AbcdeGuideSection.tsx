import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, ArrowRight, Eye } from 'lucide-react';

export const AbcdeGuideSection: React.FC<{ onScanNow: () => void }> = ({ onScanNow }) => {
  const [activeCriterion, setActiveCriterion] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');

  const criteria = [
    {
      key: 'A',
      title: 'Asymmetry',
      sub: 'One half does not match the other',
      benignTitle: 'Symmetric (Normal)',
      benignDesc: 'Common benign moles are typically round or oval. If you draw a line through the middle, the two halves are nearly mirror images.',
      malignantTitle: 'Asymmetrical (Melanoma Suspect)',
      malignantDesc: 'Malignant melanomas frequently lack symmetry. The two halves have distinct outlines, surface contours, or pigment distributions.',
      visualKey: 'asymmetry',
    },
    {
      key: 'B',
      title: 'Border Irregularity',
      sub: 'Edges are notched, scalloped, or blurred',
      benignTitle: 'Smooth & Regular Borders',
      benignDesc: 'Benign nevi have sharp, well-defined margins that transition cleanly into surrounding normal skin.',
      malignantTitle: 'Jagged, Scalloped, or Fading Margins',
      malignantDesc: 'Melanoma edges are often irregular, notched, indented, or fade vaguely into adjacent tissue like spilled ink.',
      visualKey: 'border',
    },
    {
      key: 'C',
      title: 'Color Variation',
      sub: 'Multiple shades within the same lesion',
      benignTitle: 'Uniform Single Shade',
      benignDesc: 'Benign moles generally display a single homogeneous shade of tan, light brown, or dark brown throughout.',
      malignantTitle: 'Variegated Multi-Tone Pigment',
      malignantDesc: 'Malignancy warning signs include a mixture of brown, jet-black, pink, red, white (regression), or slate-blue within one spot.',
      visualKey: 'color',
    },
    {
      key: 'D',
      title: 'Diameter',
      sub: 'Larger than 6 millimeters (pencil eraser)',
      benignTitle: 'Small (< 6 mm)',
      benignDesc: 'Most benign moles remain smaller than 6 mm across (approx. the diameter of a standard pencil eraser).',
      malignantTitle: 'Enlarged (>= 6 mm) or Rapidly Growing',
      malignantDesc: 'Melanomas are often >6mm when identified, although early melanomas can be smaller ("micromelanomas").',
      visualKey: 'diameter',
    },
    {
      key: 'E',
      title: 'Evolving / Elevation',
      sub: 'Any change in size, shape, color, or symptoms',
      benignTitle: 'Stable Over Years',
      benignDesc: 'Normal moles typically stay stable for years once adulthood is reached, without sudden spontaneous changes.',
      malignantTitle: 'Active Evolution / New Symptoms',
      malignantDesc: 'The most sensitive single warning sign: any spot changing in size, shape, elevation, or developing spontaneous bleeding, itching, or crusting.',
      visualKey: 'evolving',
    },
  ];

  const current = criteria.find((c) => c.key === activeCriterion) || criteria[0];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-stone-700 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-700 text-stone-100 border border-stone-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clinical Melanoma Surveillance Standard</span>
          </div>
          <h1 className="font-aesthetic text-3xl sm:text-4xl font-bold tracking-tight text-white">
            The ABCDE Melanoma Screening Rule
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Dermatologists worldwide use the ABCDE criteria to distinguish benign moles from cutaneous melanoma—the most serious form of skin cancer. Early detection prior to deep invasion yields a 99%+ 5-year survival rate.
          </p>
          <div className="pt-2">
            <button
              onClick={onScanNow}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Scan a Suspicious Spot Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ABCDE Step Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {criteria.map((item) => {
          const isSelected = activeCriterion === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveCriterion(item.key as any)}
              className={`p-3 sm:p-4 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center ${
                isSelected
                  ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-sm ring-2 ring-teal-500/20'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm mb-1.5 ${
                  isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-800'
                }`}
              >
                {item.key}
              </span>
              <span className="text-xs font-bold block">{item.title}</span>
              <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5 line-clamp-1">
                {item.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Criterion Interactive Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center">
              {current.key}
            </span>
            <h2 className="font-aesthetic text-xl font-bold text-slate-900">
              {current.title} — <span className="text-slate-500 font-normal">{current.sub}</span>
            </h2>
          </div>
        </div>

        {/* Side-by-Side Comparison: Normal vs Melanoma */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Benign Mole Card */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-bold text-sm">{current.benignTitle}</h3>
            </div>

            {/* Illustrative Graphic */}
            <div className="aspect-16/9 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-4 relative">
              <svg viewBox="0 0 200 120" className="w-full h-full max-h-28">
                {current.key === 'A' && (
                  <g>
                    <ellipse cx="100" cy="60" rx="35" ry="35" fill="#784732" />
                    <line x1="100" y1="15" x2="100" y2="105" stroke="#10b981" stroke-dasharray="3 3" stroke-width="1.5" />
                    <text x="100" y="115" fill="#10b981" font-size="8" text-anchor="middle" font-family="sans-serif">Equal Halves</text>
                  </g>
                )}
                {current.key === 'B' && (
                  <g>
                    <ellipse cx="100" cy="60" rx="38" ry="38" fill="#69392b" stroke="#10b981" stroke-width="1.5" />
                    <text x="100" y="115" fill="#10b981" font-size="8" text-anchor="middle" font-family="sans-serif">Clean, Sharp Border</text>
                  </g>
                )}
                {current.key === 'C' && (
                  <g>
                    <circle cx="100" cy="60" r="35" fill="#6a3e2e" />
                    <text x="100" y="115" fill="#10b981" font-size="8" text-anchor="middle" font-family="sans-serif">Uniform Single Brown</text>
                  </g>
                )}
                {current.key === 'D' && (
                  <g>
                    <circle cx="100" cy="60" r="22" fill="#6a3e2e" />
                    <line x1="78" y1="60" x2="122" y2="60" stroke="#10b981" stroke-width="1.5" />
                    <text x="100" y="115" fill="#10b981" font-size="8" text-anchor="middle" font-family="sans-serif">&lt; 6mm (Small)</text>
                  </g>
                )}
                {current.key === 'E' && (
                  <g>
                    <circle cx="60" cy="60" r="20" fill="#6a3e2e" />
                    <text x="60" y="95" fill="#94a3b8" font-size="7" text-anchor="middle" font-family="sans-serif">Year 1</text>
                    <text x="100" y="63" fill="#10b981" font-size="12" text-anchor="middle" font-family="sans-serif">→</text>
                    <circle cx="140" cy="60" r="20" fill="#6a3e2e" />
                    <text x="140" y="95" fill="#94a3b8" font-size="7" text-anchor="middle" font-family="sans-serif">Year 3 (No Change)</text>
                  </g>
                )}
              </svg>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {current.benignDesc}
            </p>
          </div>

          {/* Malignant Melanoma Card */}
          <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-800">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <h3 className="font-bold text-sm">{current.malignantDesc ? current.malignantTitle : ''}</h3>
            </div>

            {/* Illustrative Graphic */}
            <div className="aspect-16/9 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-4 relative">
              <svg viewBox="0 0 200 120" className="w-full h-full max-h-28">
                {current.key === 'A' && (
                  <g>
                    <path d="M 75 35 C 50 45, 55 85, 80 90 C 110 95, 140 85, 145 65 C 150 45, 120 30, 105 45 C 95 55, 85 30, 75 35 Z" fill="#2d1c16" />
                    <line x1="100" y1="15" x2="100" y2="105" stroke="#f43f5e" stroke-dasharray="3 3" stroke-width="1.5" />
                    <text x="100" y="115" fill="#f43f5e" font-size="8" text-anchor="middle" font-family="sans-serif">Unequal / Asymmetric Halves</text>
                  </g>
                )}
                {current.key === 'B' && (
                  <g>
                    <path d="M 65 50 C 60 70, 75 80, 80 95 C 100 100, 120 90, 135 90 C 145 75, 130 65, 145 50 C 135 35, 115 45, 100 35 C 80 30, 70 40, 65 50 Z" fill="#241712" stroke="#f43f5e" stroke-width="1.5" />
                    <text x="100" y="115" fill="#f43f5e" font-size="8" text-anchor="middle" font-family="sans-serif">Jagged Notched Edges</text>
                  </g>
                )}
                {current.key === 'C' && (
                  <g>
                    <path d="M 70 40 C 60 70, 75 90, 110 95 C 140 90, 140 60, 135 45 C 120 35, 85 30, 70 40 Z" fill="#3a221a" />
                    <circle cx="85" cy="55" r="14" fill="#0d0b0d" />
                    <circle cx="120" cy="70" r="10" fill="#9a3412" />
                    <circle cx="115" cy="50" r="7" fill="#64748b" />
                    <text x="100" y="115" fill="#f43f5e" font-size="8" text-anchor="middle" font-family="sans-serif">Variegated Hues (Black, Red, Tan, Blue)</text>
                  </g>
                )}
                {current.key === 'D' && (
                  <g>
                    <ellipse cx="100" cy="60" rx="46" ry="38" fill="#241712" />
                    <line x1="54" y1="60" x2="146" y2="60" stroke="#f43f5e" stroke-width="1.5" />
                    <text x="100" y="115" fill="#f43f5e" font-size="8" text-anchor="middle" font-family="sans-serif">&gt; 6mm (Pencil Eraser+)</text>
                  </g>
                )}
                {current.key === 'E' && (
                  <g>
                    <circle cx="55" cy="60" r="14" fill="#583124" />
                    <text x="55" y="95" fill="#94a3b8" font-size="7" text-anchor="middle" font-family="sans-serif">Month 1</text>
                    <text x="95" y="63" fill="#f43f5e" font-size="12" text-anchor="middle" font-family="sans-serif">→</text>
                    <path d="M 125 45 C 115 65, 125 80, 150 85 C 165 80, 165 55, 150 45 Z" fill="#140f0e" />
                    <text x="145" y="95" fill="#f43f5e" font-size="7" text-anchor="middle" font-family="sans-serif">Month 3 (Rapid Change)</text>
                  </g>
                )}
              </svg>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {current.malignantDesc}
            </p>
          </div>
        </div>

        {/* The "Ugly Duckling" Sign Box */}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-lg shrink-0 mt-0.5">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                The "Ugly Duckling" Sign (Dermatological Golden Rule)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Most normal moles on an individual's body resemble each other like siblings. If one single spot stands out as visibly discordant from the rest—either in darkness, size, or odd shape—it is an "ugly duckling" and warrants immediate dermoscopic evaluation by a physician regardless of ABCDE scores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
