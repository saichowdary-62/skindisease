import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Flame,
  Droplet,
  HeartPulse,
  Info,
} from 'lucide-react';
import { DISEASE_ENCYCLOPEDIA } from '../data/diseaseEncyclopedia';
import { DiseaseInfo } from '../types/dermatology';

interface EncyclopediaSectionProps {
  onSelectSampleCase?: (conditionName: string) => void;
}

export const EncyclopediaSection: React.FC<EncyclopediaSectionProps> = ({
  onSelectSampleCase,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null);

  const categories = ['All', 'Inflammatory', 'Neoplastic / Pre-malignant', 'Infectious (Fungal/Bacterial/Viral)', 'Allergic / Contact', 'Pigmentary'];

  const filteredDiseases = useMemo(() => {
    return DISEASE_ENCYCLOPEDIA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.scientificName.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.symptoms.some((s) => s.toLowerCase().includes(query)) ||
        item.causes.some((c) => c.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h1 className="font-aesthetic text-2xl sm:text-3xl font-bold text-slate-900">
              Skin Conditions Clinical Encyclopedia
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Comprehensive dermatological reference library with clinical morphology, symptoms, etiology, and prevention.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search condition, symptom, or cause..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDiseases.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedDisease(item)}
            className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  {item.category}
                </span>

                <div className="flex items-center gap-1.5">
                  {item.contagious && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                      Contagious
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.severity === 'Emergency'
                        ? 'bg-rose-100 text-rose-800'
                        : item.severity === 'Urgent'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 italic font-mono">{item.scientificName}</p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {item.summary}
              </p>

              {/* Hallmark symptoms teaser */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Hallmark Symptoms
                </span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {item.symptoms.slice(0, 2).map((sym, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0"></span>
                      <span className="truncate">{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-bold group-hover:text-teal-800">
              <span>View Clinical Dossier</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {filteredDiseases.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No skin condition matches your query</p>
          <p className="text-xs text-slate-500 mt-1">Try another search keyword or switch the category filter.</p>
        </div>
      )}

      {/* Disease Detail Modal */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 bg-stone-900 text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-stone-700 text-stone-200 rounded border border-stone-600">
                    {selectedDisease.category}
                  </span>
                  {selectedDisease.contagious && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-400/30">
                      Contagious
                    </span>
                  )}
                </div>
                <h2 className="font-aesthetic text-2xl font-bold text-white">{selectedDisease.name}</h2>
                <p className="text-xs text-teal-200 italic font-mono">{selectedDisease.scientificName}</p>
              </div>

              <button
                onClick={() => setSelectedDisease(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-1">
                  Clinical Overview & Pathophysiology
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {selectedDisease.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-2 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                  <span>Key Symptoms & Clinical Presentation</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedDisease.symptoms.map((sym, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5"></span>
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-teal-600" />
                  <span>Causes & Risk Factors</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedDisease.causes.map((c, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Preventive Measures & Skincare Hygiene</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedDisease.prevention.map((prev, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{prev}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-1 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-teal-600" />
                  <span>Standard Clinical Treatment Approach</span>
                </h4>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-700">
                  {selectedDisease.treatmentOverview}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Source: Clinical Dermatology Reference
              </span>
              <button
                onClick={() => setSelectedDisease(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
