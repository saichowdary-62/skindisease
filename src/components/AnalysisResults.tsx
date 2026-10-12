import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  HelpCircle,
  Eye,
  Info,
  ShieldCheck,
  HeartPulse,
  Flame,
  Droplet,
  ChevronRight,
  ExternalLink,
  Sliders,
  Calendar,
  Search,
} from 'lucide-react';
import { AnalysisResponse, ClinicalNotes, SeverityLevel } from '../types/dermatology';
import { InteractiveMagnifier } from './InteractiveMagnifier';
import { ReportPrintModal } from './ReportPrintModal';

interface AnalysisResultsProps {
  result: AnalysisResponse;
  imageUrl: string;
  clinicalNotes: ClinicalNotes;
  onSaveToHistory: () => void;
  isSaved: boolean;
  onNewScan: () => void;
  onViewEncyclopediaItem?: (conditionName: string) => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  imageUrl,
  clinicalNotes,
  onSaveToHistory,
  isSaved,
  onNewScan,
  onViewEncyclopediaItem,
}) => {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'causes' | 'prevention' | 'treatments' | 'redflags'>('symptoms');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showMagnifierModal, setShowMagnifierModal] = useState<boolean>(false);

  if (result.isSkinLesion === false || !result.primaryDiagnosis) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">Image could not be assessed as a skin lesion</h2>
            <p className="text-sm text-slate-700">
              {result.rejectionReason || 'The image analysis did not return a usable lesion assessment.'}
            </p>
            {result.detectedSubject && (
              <p className="text-sm text-slate-600">Detected subject: {result.detectedSubject}</p>
            )}
            <p className="text-sm text-slate-600">
              {result.guidance || 'Try a clear, well-lit close-up image of the affected skin.'}
            </p>
            <button
              type="button"
              onClick={onNewScan}
              className="mt-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
            >
              Try another image
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'Emergency':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          dot: 'bg-rose-600 animate-pulse',
          label: 'Emergency Evaluation Needed',
        };
      case 'Urgent':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-600',
          label: 'Urgent Dermatologist Review',
        };
      case 'Moderate':
        return {
          bg: 'bg-sky-100 text-sky-900 border-sky-300',
          dot: 'bg-sky-600',
          label: 'Moderate Severity / Monitor',
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600',
          label: 'Low Severity / Routine Care',
        };
    }
  };

  const severityBadge = getSeverityBadge(result.primaryDiagnosis.severity);

  return (
    <div className="space-y-6">
      {result.analysisSource === 'local-ham10000-research' && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-amber-950">
          <p className="text-sm font-black uppercase tracking-wide">Experimental research model — not a diagnosis</p>
          <p className="mt-1 text-sm leading-relaxed">
            {result.modelNotes || result.disclaimer}
          </p>
        </div>
      )}

      {/* Top Banner: Primary Suspected Diagnosis & Confidence */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-stone-900 p-6 sm:p-8 text-white relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-stone-700/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  Top model class (unconfirmed)
                </span>
                {result.analysisSource === 'local-ham10000-research' ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-amber-300 bg-amber-100 text-amber-900">
                    Clinical urgency not assessed
                  </span>
                ) : (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${severityBadge.bg}`}>
                    <span className={`w-2 h-2 rounded-full ${severityBadge.dot}`}></span>
                    {severityBadge.label}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-white/10 text-slate-300 border border-white/10">
                  {result.primaryDiagnosis.category}
                </span>
              </div>

              <h1 className="font-aesthetic text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                {result.primaryDiagnosis.name}
              </h1>

              <p className="text-sm text-teal-200 font-mono italic">
                {result.primaryDiagnosis.scientificName}
              </p>

              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed pt-1">
                {result.primaryDiagnosis.summary}
              </p>
            </div>

            {/* Confidence Score Circle */}
            <div className="shrink-0 flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-2xl">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-teal-400 transition-all duration-1000 ease-out"
                    strokeDasharray={`${result.primaryDiagnosis.confidence}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
                    {result.primaryDiagnosis.confidence}%
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-teal-300 font-bold mt-0.5">
                    Uncalibrated score
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-white">Uncalibrated model score</p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Experimental class score only; not a probability of disease
                </p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSaveToHistory}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  <span>Saved to Scan History</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-slate-600" />
                  <span>Save to History</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Intake Report</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNewScan}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Another Lesion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Image & Visual Assessment), Right Column (ABCDE & Differentials) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Lesion Assessment with Magnifier (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-600" />
                <span>Visual Lesion Inspection</span>
              </h3>
              <span className="text-[11px] text-slate-500">Interactive Macro Lens</span>
            </div>

            <InteractiveMagnifier imageUrl={imageUrl} altText={result.primaryDiagnosis.name} />

            {/* Visual Observations Grid */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Observed Cutaneous Morphology
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Morphology
                  </span>
                  <span className="font-semibold text-slate-800">
                    {result.visualAssessment?.morphology || 'Papular / Plaque'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Color Profile
                  </span>
                  <span className="font-semibold text-slate-800">
                    {result.visualAssessment?.color || 'Erythematous'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Distribution
                  </span>
                  <span className="font-semibold text-slate-800">
                    {result.visualAssessment?.distribution || clinicalNotes.bodyLocation}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Surface Texture
                  </span>
                  <span className="font-semibold text-slate-800">
                    {result.visualAssessment?.texture || 'Hyperkeratotic'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Differential Diagnoses Comparison */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-600" />
                <span>Other model classes (unconfirmed)</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Experimental output only</span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              These are model output scores, not clinical differentials:
            </p>

            <div className="space-y-3">
              {result.differentialDiagnoses?.map((diff, index) => (
                <div
                  key={index}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">
                      {diff.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {diff.confidence}%
                    </span>
                  </div>

                  {/* Relative bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-teal-600 h-full rounded-full"
                      style={{ width: `${diff.confidence}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    <strong className="text-slate-700">Differentiating factor:</strong> {diff.distinguishingFeature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: ABCDE Check & Deep Clinical Dossier Tabs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* ABCDE Melanoma Matrix Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-aesthetic text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <span>ABCDE Screening Criteria</span>
                </h3>
                <p className="text-xs text-slate-500">
                  The classifier does not assess these criteria or estimate clinical risk.
                </p>
              </div>

              <div className="self-start sm:self-auto">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${
                    !result.abcdeMelanomaCheck?.applicable
                      ? 'bg-slate-100 text-slate-700 border-slate-300'
                      : result.abcdeMelanomaCheck.overallRisk === 'High'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : result.abcdeMelanomaCheck.overallRisk === 'Moderate'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {result.abcdeMelanomaCheck?.applicable
                    ? `Risk Index: ${result.abcdeMelanomaCheck.overallRisk}`
                    : 'Not assessed'}
                </span>
              </div>
            </div>

            {/* ABCDE 5-Box Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {/* A */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-800 text-xs font-black flex items-center justify-center">
                    A
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Symmetry</span>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1">
                  {result.abcdeMelanomaCheck?.asymmetry?.status || 'Symmetric'}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight mt-1 line-clamp-3">
                  {result.abcdeMelanomaCheck?.asymmetry?.details}
                </p>
              </div>

              {/* B */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-800 text-xs font-black flex items-center justify-center">
                    B
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Border</span>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1">
                  {result.abcdeMelanomaCheck?.border?.status || 'Regular'}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight mt-1 line-clamp-3">
                  {result.abcdeMelanomaCheck?.border?.details}
                </p>
              </div>

              {/* C */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-800 text-xs font-black flex items-center justify-center">
                    C
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Color</span>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1">
                  {result.abcdeMelanomaCheck?.color?.status || 'Uniform'}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight mt-1 line-clamp-3">
                  {result.abcdeMelanomaCheck?.color?.details}
                </p>
              </div>

              {/* D */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-800 text-xs font-black flex items-center justify-center">
                    D
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Diameter</span>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1">
                  {result.abcdeMelanomaCheck?.diameter?.status || '<6mm'}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight mt-1 line-clamp-3">
                  {result.abcdeMelanomaCheck?.diameter?.details}
                </p>
              </div>

              {/* E */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-800 text-xs font-black flex items-center justify-center">
                    E
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Evolving</span>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1">
                  {result.abcdeMelanomaCheck?.evolving?.status || 'Stable'}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight mt-1 line-clamp-3">
                  {result.abcdeMelanomaCheck?.evolving?.details}
                </p>
              </div>
            </div>
            </div>
          </div>

          {/* Deep Clinical Details Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Tabs Header */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('symptoms')}
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'symptoms'
                    ? 'border-teal-600 text-teal-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                <span>Symptoms & Signs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('causes')}
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'causes'
                    ? 'border-teal-600 text-teal-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-teal-600" />
                <span>Causes & Triggers</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('prevention')}
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'prevention'
                    ? 'border-teal-600 text-teal-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Prevention & Care</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('treatments')}
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'treatments'
                    ? 'border-teal-600 text-teal-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Droplet className="w-3.5 h-3.5 text-teal-600" />
                <span>Clinical Treatments</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('redflags')}
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'redflags'
                    ? 'border-rose-600 text-rose-900 bg-white'
                    : 'border-transparent text-rose-700 hover:text-rose-900 hover:bg-rose-50/60'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Doctor Red Flags</span>
              </button>
            </div>

            {/* Tab Body Content */}
            <div className="p-6">
              {/* Tab 1: Symptoms */}
              {activeTab === 'symptoms' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Clinical Pathology & Overview
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {result.clinicalDetails?.overview}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Hallmark Cutaneous Symptoms
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.clinicalDetails?.hallmarkSymptoms?.map((sym, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-800"
                        >
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{sym}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Causes & Triggers */}
              {activeTab === 'causes' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Primary Biological & Genetic Root Causes
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {result.clinicalDetails?.rootCauses?.map((cause, idx) => (
                        <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5"></span>
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Common Environmental & Lifestyle Triggers
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.clinicalDetails?.triggers?.map((trig, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-medium"
                        >
                          {trig}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Prevention & Home Care */}
              {activeTab === 'prevention' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Evidence-Based Preventive Protocols
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {result.clinicalDetails?.preventiveMeasures?.map((prev, idx) => (
                        <li key={idx} className="flex items-start gap-2 p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl">
                          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{prev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Non-Pharmacological Daily Home Care
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {result.clinicalDetails?.homeCareAndNonRx?.map((care, idx) => (
                        <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                          <Droplet className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{care}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 4: Clinical Treatments */}
              {activeTab === 'treatments' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Recommended Specialist:</span>{' '}
                      {result.clinicalDetails?.recommendedSpecialist || 'Board-Certified Dermatologist'}
                    </div>
                    <span className="text-[11px] font-semibold text-teal-700">Prescription Required</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Standard Clinical Dermatological Interventions
                    </h4>
                    <div className="space-y-2">
                      {result.clinicalDetails?.potentialClinicalTreatments?.map((tx, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 font-medium"
                        >
                          {tx}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Doctor Red Flags */}
              {activeTab === 'redflags' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                    <p className="font-bold mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      When to seek urgent clinical evaluation:
                    </p>
                    <p className="text-[11px] text-rose-800">
                      If you observe any of the following warning signs, do not rely on topical home remedies.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {result.clinicalDetails?.whenToSeeDoctor?.map((rf, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-rose-50/60 border border-rose-200/70 rounded-xl flex items-start gap-2 text-xs text-rose-950 font-medium"
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                        <span>{rf}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Doctor Consultation Prep Questions Card */}
          {result.questionsForDoctor && result.questionsForDoctor.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                <span>Questions to Ask Your Dermatologist</span>
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                Bring these prepared clinical questions to your doctor's appointment:
              </p>
              <div className="space-y-2">
                {result.questionsForDoctor.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print Intake Report Modal */}
      <ReportPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        result={result}
        imageUrl={imageUrl}
        clinicalNotes={clinicalNotes}
      />
    </div>
  );
};
