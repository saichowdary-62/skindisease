import React from 'react';
import { Stethoscope, BookOpen, Clock, AlertTriangle, Scan, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'scan' | 'library' | 'abcde' | 'history';
  setActiveTab: (tab: 'scan' | 'library' | 'abcde' | 'history') => void;
  onOpenEmergencyModal: () => void;
  scanCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergencyModal,
  scanCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity without logo */}
          <div
            onClick={() => setActiveTab('scan')}
            className="flex flex-col cursor-pointer group select-none"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-brand text-2xl sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
                Derma<span className="text-stone-700 italic font-medium">Vision</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-mono uppercase tracking-widest bg-stone-100 text-stone-600 border border-stone-200">
                Clinical
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase hidden sm:block">
              Skin Condition Analysis
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('scan')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'scan'
                  ? 'bg-stone-100 text-stone-800 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Scan className="w-4 h-4 text-stone-700" />
              <span>Lesion Scan</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-stone-100 text-stone-800 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-stone-700" />
              <span>Disease Library</span>
            </button>

            <button
              onClick={() => setActiveTab('abcde')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'abcde'
                  ? 'bg-stone-100 text-stone-800 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-stone-700" />
              <span>ABCDE Melanoma</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-stone-100 text-stone-800 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Clock className="w-4 h-4 text-stone-700" />
              <span>History & Tracking</span>
              {scanCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center font-bold">
                  {scanCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenEmergencyModal}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="View immediate emergency signs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Emergency Red Flags</span>
              <span className="sm:hidden">Red Flags</span>
            </button>

            <button
              onClick={() => setActiveTab('scan')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between border-t border-slate-100 py-2 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('scan')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'scan' ? 'bg-teal-100 text-teal-900 font-semibold' : 'text-slate-600'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Scan</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'library' ? 'bg-teal-100 text-teal-900 font-semibold' : 'text-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Diseases</span>
          </button>
          <button
            onClick={() => setActiveTab('abcde')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'abcde' ? 'bg-teal-100 text-teal-900 font-semibold' : 'text-slate-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ABCDE</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-teal-100 text-teal-900 font-semibold' : 'text-slate-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History ({scanCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
