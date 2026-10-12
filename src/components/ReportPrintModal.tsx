import React from 'react';
import { X, Printer, ShieldAlert, CheckCircle, FileText } from 'lucide-react';
import { AnalysisResponse, ClinicalNotes } from '../types/dermatology';

interface ReportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResponse;
  imageUrl: string;
  clinicalNotes: ClinicalNotes;
  timestamp?: number;
}

export const ReportPrintModal: React.FC<ReportPrintModalProps> = ({
  isOpen,
  onClose,
  result,
  imageUrl,
  clinicalNotes,
  timestamp = Date.now(),
}) => {
  if (!isOpen || !result.primaryDiagnosis) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Controls Toolbar (Hidden in print) */}
        <div className="px-4 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm sm:text-base">
              Clinical Intake Report Summary
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-4 sm:p-8 lg:p-10 font-sans text-slate-900 bg-white space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b-2 border-teal-700 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-aesthetic text-3xl font-bold tracking-tight text-slate-900">
                  Derma<span className="text-teal-700 italic font-medium">Vision</span>
                </span>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-teal-100 text-teal-900 rounded-md">
                  Experimental Model Output
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Unvalidated HAM10000 research classifier — not a diagnosis
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-600">
              <p className="font-bold">Evaluation Date:</p>
              <p>{formattedDate}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                ID: DERMA-{Math.abs(timestamp % 1000000)}
              </p>
            </div>
          </div>

          {/* Research limitation notice */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Research prototype only — not for clinical use.</strong> This unvalidated classifier reports an uncalibrated model score for one of seven HAM10000 image classes. It cannot diagnose disease or rule out cancer. Checkpoint licensing is ambiguous; non-commercial research use only.
            </div>
          </div>

          {/* Patient History & Lesion Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-start">
            <div className="sm:col-span-1 border border-slate-200 rounded-xl p-2 bg-slate-50">
              <p className="text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                Evaluated Lesion Photograph
              </p>
              <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Lesion record"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-3 min-w-0">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                Patient Reported Context
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Body Location</span>
                  <span className="font-bold text-slate-800">{clinicalNotes.bodyLocation}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Reported Duration</span>
                  <span className="font-bold text-slate-800">{clinicalNotes.duration}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Pruritus / Itch Severity</span>
                  <span className="font-bold text-slate-800">{clinicalNotes.itchLevel}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Reported Evolution</span>
                  <span className="font-bold text-slate-800">{clinicalNotes.evolution || 'None specified'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block text-[11px]">Active Symptoms</span>
                  <span className="font-medium text-slate-800">
                    {clinicalNotes.symptoms.join(', ') || 'None selected'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Primary Classification */}
          <div className="border border-teal-200 bg-teal-50/40 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                  Top model class (unconfirmed)
                </span>
                <h4 className="text-xl font-black text-slate-900">
                  {result.primaryDiagnosis.name}
                </h4>
                <p className="text-xs text-slate-500 italic">
                  {result.primaryDiagnosis.scientificName} • {result.primaryDiagnosis.category}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-2xl font-black text-teal-700">
                  {result.primaryDiagnosis.confidence}%
                </span>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">
                  Uncalibrated model score
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mt-2 pt-2 border-t border-teal-100">
              {result.primaryDiagnosis.summary}
            </p>
          </div>

          {/* ABCDE Matrix Check */}
          {result.abcdeMelanomaCheck?.applicable && (
            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                ABCDE Melanoma Morphological Criteria Check
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold block text-slate-900">A: Asymmetry</span>
                  <span className="text-slate-600 text-[11px]">{result.abcdeMelanomaCheck.asymmetry.status}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold block text-slate-900">B: Border</span>
                  <span className="text-slate-600 text-[11px]">{result.abcdeMelanomaCheck.border.status}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold block text-slate-900">C: Color</span>
                  <span className="text-slate-600 text-[11px]">{result.abcdeMelanomaCheck.color.status}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold block text-slate-900">D: Diameter</span>
                  <span className="text-slate-600 text-[11px]">{result.abcdeMelanomaCheck.diameter.status}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold block text-slate-900">E: Evolving</span>
                  <span className="text-slate-600 text-[11px]">{result.abcdeMelanomaCheck.evolving.status}</span>
                </div>
              </div>
            </div>
          )}

          {/* Differential Diagnoses & Clinical Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Other model classes (unconfirmed)
              </h5>
              <ul className="text-xs space-y-2 text-slate-700">
                {(result.differentialDiagnoses || []).map((diff, idx) => (
                  <li key={idx} className="pb-1.5 border-b border-slate-100 last:border-0">
                    <div className="flex justify-between font-semibold">
                      <span>{diff.name}</span>
                      <span className="text-teal-700 font-mono">{diff.confidence}%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{diff.distinguishingFeature}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Questions Prepared for Doctor
              </h5>
              <ul className="text-xs space-y-1.5 text-slate-700 list-disc pl-4">
                {result.questionsForDoctor?.slice(0, 3).map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Doctor Signature / Clinical Notes Line */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-500">
            <div>
              <p className="font-bold text-slate-700">Dermatologist Clinical Notes & Plan:</p>
              <div className="h-16 border-b border-dashed border-slate-300 mt-2"></div>
            </div>
            <div>
              <p className="font-bold text-slate-700">Physician Signature & Date:</p>
              <div className="h-16 border-b border-dashed border-slate-300 mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
