/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Navbar,
} from './components/Navbar';
import { UploadSection } from './components/UploadSection';
import { AnalysisResults } from './components/AnalysisResults';
import { AbcdeGuideSection } from './components/AbcdeGuideSection';
import { EncyclopediaSection } from './components/EncyclopediaSection';
import { HistorySection } from './components/HistorySection';
import { EmergencyRedFlagsModal } from './components/EmergencyRedFlagsModal';
import {
  AnalysisResponse,
  ClinicalNotes,
  ScanRecord,
} from './types/dermatology';
import {
  Activity,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const ANALYSIS_STAGES = [
  'Preprocessing the dermatoscopic image...',
  'Running local HAM10000 research classifier...',
  'Ranking seven pigmented-lesion model classes...',
  'Preparing experimental, non-diagnostic results...',
  'This CPU-only model may take a little longer on first run...',
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'library' | 'abcde' | 'history'>('scan');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStageIndex, setAnalysisStageIndex] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentNotes, setCurrentNotes] = useState<ClinicalNotes | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isCurrentSaved, setIsCurrentSaved] = useState<boolean>(false);

  // Scan History in localStorage
  const [history, setHistory] = useState<ScanRecord[]>(() => {
    try {
      const saved = localStorage.getItem('dermavision_scan_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history on changes
  useEffect(() => {
    try {
      localStorage.setItem('dermavision_scan_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Animated progress ticker during analysis
  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setAnalysisStageIndex(0);
      interval = setInterval(() => {
        setAnalysisStageIndex((prev) => (prev + 1) % ANALYSIS_STAGES.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Perform AI analysis via backend API
  const handleAnalyze = async (imageDataUrl: string, notes: ClinicalNotes) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setCurrentImage(imageDataUrl);
    setCurrentNotes(notes);
    setIsCurrentSaved(false);

    try {
      const res = await fetch('/api/analyze-lesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageDataUrl,
          clinicalNotes: notes,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || `Server responded with ${res.status}`);
      }

      const data: AnalysisResponse = await res.json();
      setAnalysisResult(data);
      if (data.primaryDiagnosis) {
        const newRecord: ScanRecord = {
          id: `scan-${Date.now()}`,
          timestamp: Date.now(),
          imageUrl: imageDataUrl,
          clinicalNotes: notes,
          result: data,
        };
        setHistory((prev) => [newRecord, ...prev]);
        setIsCurrentSaved(true);
      }
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(
        err.message || 'An unexpected error occurred while analyzing the image. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToHistory = () => {
    if (!analysisResult || !currentImage || !currentNotes || isCurrentSaved) return;
    const newRecord: ScanRecord = {
      id: `scan-${Date.now()}`,
      timestamp: Date.now(),
      imageUrl: currentImage,
      clinicalNotes: currentNotes,
      result: analysisResult,
    };
    setHistory((prev) => [newRecord, ...prev]);
    setIsCurrentSaved(true);
  };

  const handleSelectHistoryRecord = (record: ScanRecord) => {
    setCurrentImage(record.imageUrl);
    setCurrentNotes(record.clinicalNotes);
    setAnalysisResult(record.result);
    setIsCurrentSaved(true);
    setActiveTab('scan');
  };

  const handleDeleteHistoryRecord = (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire scan history?')) {
      setHistory([]);
    }
  };

  const handleNewScan = () => {
    setAnalysisResult(null);
    setCurrentImage(null);
    setCurrentNotes(null);
    setAnalysisError(null);
    setIsCurrentSaved(false);
    setActiveTab('scan');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900 font-sans selection:bg-stone-700 selection:text-stone-50">
      {/* Main Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        scanCount={history.length}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Notification Banner if any */}
        {analysisError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start sm:items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="font-bold text-xs sm:text-sm">Analysis Pipeline Interruption</p>
                <p className="text-xs text-rose-800">{analysisError}</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (currentImage && currentNotes) {
                  handleAnalyze(currentImage, currentNotes);
                } else {
                  setAnalysisError(null);
                }
              }}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto shrink-0 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Analysis</span>
            </button>
          </div>
        )}

        {/* Tab 1: AI Lesion Scan */}
        {activeTab === 'scan' && (
          <div>
            {isAnalyzing ? (
              /* Loading / Processing State */
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-16 text-center max-w-2xl mx-auto shadow-sm my-6 space-y-6">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-stone-200 animate-ping opacity-30"></div>
                  <div className="w-full h-full rounded-full border-4 border-stone-700 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-stone-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                    <Activity className="w-3.5 h-3.5 text-stone-700" />
                    Local HAM10000 Research Classifier
                  </span>
                  <h2 className="font-aesthetic text-2xl sm:text-3xl font-bold text-slate-900">
                    Analyzing Dermatological Image
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-700 font-mono font-medium max-w-md mx-auto min-h-[40px] flex items-center justify-center">
                    {ANALYSIS_STAGES[analysisStageIndex]}
                  </p>
                </div>

                <div className="max-w-md mx-auto bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-stone-700 h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${((analysisStageIndex + 1) / ANALYSIS_STAGES.length) * 100}%`,
                    }}
                  ></div>
                </div>

                <p className="text-xs text-slate-400">
                  Image inference runs locally. The research checkpoint downloads once from Hugging Face during setup; get the subject's consent before using an image.
                </p>
              </div>
            ) : analysisResult && currentImage && currentNotes ? (
              /* Results Dashboard */
              <AnalysisResults
                result={analysisResult}
                imageUrl={currentImage}
                clinicalNotes={currentNotes}
                onSaveToHistory={handleSaveToHistory}
                isSaved={isCurrentSaved}
                onNewScan={handleNewScan}
                onViewEncyclopediaItem={(name) => {
                  setActiveTab('library');
                }}
              />
            ) : (
              /* Upload & Intake Form */
              <UploadSection
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>
        )}

        {/* Tab 2: Disease Library */}
        {activeTab === 'library' && (
          <EncyclopediaSection
            onSelectSampleCase={(name) => {
              setActiveTab('scan');
            }}
          />
        )}

        {/* Tab 3: ABCDE Melanoma Guide */}
        {activeTab === 'abcde' && (
          <AbcdeGuideSection
            onScanNow={() => {
              setActiveTab('scan');
            }}
          />
        )}

        {/* Tab 4: Scan History */}
        {activeTab === 'history' && (
          <HistorySection
            records={history}
            onSelectRecord={handleSelectHistoryRecord}
            onDeleteRecord={handleDeleteHistoryRecord}
            onClearAll={handleClearHistory}
            onStartNewScan={handleNewScan}
          />
        )}
      </main>

      {/* Emergency Red Flags Modal */}
      <EmergencyRedFlagsModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white text-xs text-slate-500 py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-aesthetic font-bold text-slate-900 text-base">
              DermaVision — Skin Disease Detection System
            </p>
            <p className="text-slate-500 text-xs">
              Experimental offline HAM10000 image classifier — not for clinical use
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('abcde')}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              ABCDE Criteria
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('library')}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              Condition Library
            </button>
            <span>•</span>
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
            >
              Emergency Red Flags
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
