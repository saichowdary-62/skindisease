import React, { useState } from 'react';
import {
  Clock,
  Trash2,
  Columns,
  Eye,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Download,
} from 'lucide-react';
import { AnalysisResponse, PrimaryDiagnosis, ScanRecord } from '../types/dermatology';
import { InteractiveMagnifier } from './InteractiveMagnifier';

interface HistorySectionProps {
  records: ScanRecord[];
  onSelectRecord: (record: ScanRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onStartNewScan: () => void;
}

type DiagnosedScanRecord = ScanRecord & {
  result: AnalysisResponse & { primaryDiagnosis: PrimaryDiagnosis };
};

export const HistorySection: React.FC<HistorySectionProps> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  onClearAll,
  onStartNewScan,
}) => {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const diagnosedRecords = records.filter(
    (record): record is DiagnosedScanRecord => Boolean(record.result.primaryDiagnosis),
  );

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((item) => item !== id));
    } else {
      if (compareIds.length >= 2) {
        setCompareIds([compareIds[1], id]);
      } else {
        setCompareIds([...compareIds, id]);
      }
    }
  };

  const recordA = diagnosedRecords.find((r) => r.id === compareIds[0]);
  const recordB = diagnosedRecords.find((r) => r.id === compareIds[1]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-teal-600" />
            <h1 className="font-aesthetic text-2xl sm:text-3xl font-bold text-slate-900">
              Skin Lesion Tracking History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor mole changes, spot evolution, and treatment progression across dates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {diagnosedRecords.length >= 2 && (
            <button
              onClick={() => setIsComparing(!isComparing)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isComparing
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span>{isComparing ? 'Close Side-by-Side' : 'Compare 2 Scans'}</span>
            </button>
          )}

          {diagnosedRecords.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-3 py-2 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Workspace */}
      {isComparing && (
        <div className="bg-white rounded-2xl border-2 border-teal-500/50 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Columns className="w-4 h-4 text-teal-600" />
                <span>Side-by-Side Spot Evolution Monitor</span>
              </h3>
              <p className="text-xs text-slate-500">
                Compare baseline vs follow-up photo to identify evolution in border regularity, diameter, or pigmentation.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Selected: {compareIds.length} / 2
            </span>
          </div>

          {compareIds.length < 2 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-xs font-bold text-slate-700 mb-1">
                Please select 2 scan records from the list below to compare
              </p>
              <p className="text-[11px] text-slate-500">
                Click "Select for Compare" on any two past scans.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scan A */}
              {recordA && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      Baseline Scan
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(recordA.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden">
                    <img
                      src={recordA.imageUrl}
                      alt="Baseline scan"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      {recordA.result.primaryDiagnosis.name}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Model score: <strong>{recordA.result.primaryDiagnosis.confidence}%</strong> • Location:{' '}
                      {recordA.clinicalNotes.bodyLocation}
                    </p>
                  </div>
                </div>
              )}

              {/* Scan B */}
              {recordB && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      Follow-up Scan
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(recordB.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden">
                    <img
                      src={recordB.imageUrl}
                      alt="Follow up scan"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      {recordB.result.primaryDiagnosis.name}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Model score: <strong>{recordB.result.primaryDiagnosis.confidence}%</strong> • Location:{' '}
                      {recordB.clinicalNotes.bodyLocation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Records Timeline List */}
      {diagnosedRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Scan Records Saved Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Analyze a skin lesion on the AI Lesion Scan tab and click "Save to History" to monitor changes over time.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartNewScan}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Perform First Lesion Scan</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diagnosedRecords.map((record) => {
            const isSelectedForCompare = compareIds.includes(record.id);
            return (
              <div
                key={record.id}
                className={`bg-white rounded-2xl border transition-all p-4 flex flex-col justify-between shadow-xs ${
                  isSelectedForCompare
                    ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(record.timestamp).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        record.result.primaryDiagnosis.severity === 'Emergency'
                          ? 'bg-rose-100 text-rose-800'
                          : record.result.primaryDiagnosis.severity === 'Urgent'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {record.result.primaryDiagnosis.severity}
                    </span>
                  </div>

                  <div className="aspect-16/9 bg-slate-900 rounded-xl overflow-hidden relative group">
                    <img
                      src={record.imageUrl}
                      alt={record.result.primaryDiagnosis.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 right-2 bg-slate-900/90 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {record.result.primaryDiagnosis.confidence}% Model score
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {record.result.primaryDiagnosis.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Location: {record.clinicalNotes.bodyLocation}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectRecord(record)}
                      className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>

                    {isComparing && (
                      <button
                        onClick={() => toggleCompare(record.id)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer ${
                          isSelectedForCompare
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelectedForCompare ? 'Selected' : '+ Compare'}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteRecord(record.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
