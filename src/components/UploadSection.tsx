import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  UploadCloud,
  RefreshCw,
  HelpCircle,
  Activity,
  Layers,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { ClinicalNotes, SampleCase } from '../types/dermatology';
import { SAMPLE_CASES } from '../data/sampleCases';
import { InteractiveMagnifier } from './InteractiveMagnifier';

interface UploadSectionProps {
  onAnalyze: (imageDataUrl: string, notes: ClinicalNotes) => void;
  isAnalyzing: boolean;
  onSelectSample?: (sample: SampleCase) => void;
}

const COMMON_SYMPTOMS = [
  'Severe Itching',
  'Scaling / Flaking',
  'Redness / Erythema',
  'Pain or Tenderness',
  'Blisters / Vesicles',
  'Bleeding or Oozing',
  'Dryness / Cracking',
  'Ring-shaped Pattern',
  'Dark Pigmentation',
  'Changing Shape/Color',
];

const BODY_LOCATIONS = [
  'Face / Neck',
  'Arm / Hand / Wrist',
  'Torso / Chest / Back',
  'Leg / Knee / Foot',
  'Scalp / Hairline',
  'Groin / Skin Fold',
  'Other / Generalized',
];

const DURATIONS = [
  'Less than 1 week',
  '1 to 3 weeks',
  '1 to 3 months',
  'Chronic / Over 3 months',
];

export const UploadSection: React.FC<UploadSectionProps> = ({
  onAnalyze,
  isAnalyzing,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showClinicalContext, setShowClinicalContext] = useState<boolean>(true);

  // Clinical context form state
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNotes>({
    bodyLocation: 'Arm / Hand / Wrist',
    duration: '1 to 3 weeks',
    symptoms: ['Redness / Erythema', 'Severe Itching'],
    itchLevel: 'Moderate',
    evolution: 'Gradual increase in redness and surface texture',
    notes: '',
  });

  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  // File handling
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, or WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const rawData = event.target.result;
        // Optimize resolution: scale down massive images to max 1280px for swift transfer
        const img = new Image();
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/jpeg', 0.92);
            setSelectedImage(optimized);
          } else {
            setSelectedImage(rawData);
          }
          setActiveSampleId(null);
        };
        img.onerror = () => {
          setSelectedImage(rawData);
          setActiveSampleId(null);
        };
        img.src = rawData;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = (sample: SampleCase) => {
    setSelectedImage(sample.imageUrl);
    setActiveSampleId(sample.id);
    setClinicalNotes(sample.notes);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) {
        console.error('Could not prepare the sample image for upload.');
        return;
      }
      context.drawImage(image, 0, 0);
      setSelectedImage(canvas.toDataURL('image/jpeg', 0.92));
    };
    image.onerror = () => {
      console.error(`Could not load sample image "${sample.name}".`);
    };
    image.src = sample.imageUrl;
  };

  const toggleSymptom = (sym: string) => {
    setClinicalNotes((prev) => {
      const exists = prev.symptoms.includes(sym);
      return {
        ...prev,
        symptoms: exists
          ? prev.symptoms.filter((s) => s !== sym)
          : [...prev.symptoms, sym],
      };
    });
  };

  const handleStartAnalysis = () => {
    if (!selectedImage) return;
    onAnalyze(selectedImage, clinicalNotes);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setActiveSampleId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sample Cases Carousel / Quick Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-aesthetic text-base font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-stone-700" />
              <span>Sample Image Workflow</span>
            </h3>
            <p className="text-xs text-stone-500">
              Synthetic sample illustrations can test the upload flow; they are not clinical photographs or validation data.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200 self-start sm:self-auto">
            6 Sample Images
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SAMPLE_CASES.map((sample) => {
            const isSelected = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSampleClick(sample)}
                className={`relative group p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-stone-700 bg-stone-50 shadow-sm ring-2 ring-stone-500/20'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-900 mb-2 relative">
                  <img
                    src={sample.imageUrl}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-stone-900 text-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-teal-700">
                    {sample.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 font-mono">
                    {sample.category}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual-Column Workspace: Left Upload/Magnifier, Right Clinical Questionnaire */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Visual Lesion Inspection (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-aesthetic text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" />
                  <span>1. Upload or Capture Skin Lesion</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-definition dermatological macro photo under natural illumination
                </p>
              </div>

              {selectedImage && (
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Change Image
                </button>
              )}
            </div>

            {/* If no image selected: Dropzone & Camera Buttons */}
            {!selectedImage ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[300px] ${
                  isDragging
                    ? 'border-teal-500 bg-teal-50/50'
                    : 'border-slate-300 hover:border-teal-500 hover:bg-slate-50/80 bg-slate-50/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-teal-100/70 text-teal-700 flex items-center justify-center mb-3 shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1">
                  Drag & Drop lesion photo here
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mb-4">
                  For the local HAM10000 prototype, use a focused dermatoscopic image of a pigmented skin lesion. It is not validated for ordinary phone photos or other conditions.
                </p>

                <div className="flex items-center justify-center">
                  <span className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2 group-hover:scale-105">
                    <UploadCloud className="w-4 h-4" />
                    <span>Select Skin Photo</span>
                  </span>
                </div>
              </div>
            ) : (
              /* If image is selected: Interactive Magnifier & Inspection Lens */
              <div className="space-y-4">
                <InteractiveMagnifier imageUrl={selectedImage} />

                <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">Image ready — not calibrated</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Imaging Quality Checklist notice */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              This experimental model cannot verify that an image shows skin or detect non-lesion images. Never use its output to diagnose or rule out cancer.
            </span>
          </div>
        </div>

        {/* Right Column: Patient Clinical Questionnaire & Triage Input (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-aesthetic text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <span>2. Clinical Context (Optional)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Optional context to accompany image findings; it cannot replace or verify them.
                </p>
              </div>
            </div>

            {/* Anatomical Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Body Location
              </label>
              <select
                value={clinicalNotes.bodyLocation}
                onChange={(e) =>
                  setClinicalNotes({ ...clinicalNotes, bodyLocation: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {BODY_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration of Condition */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                How long has it been present?
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {DURATIONS.map((dur) => {
                  const isSelected = clinicalNotes.duration === dur;
                  return (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setClinicalNotes({ ...clinicalNotes, duration: dur })}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all text-left cursor-pointer border ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                          : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {dur}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Symptom Tag Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Reported Sensations & Symptoms
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-0.5">
                {COMMON_SYMPTOMS.map((sym) => {
                  const isChecked = clinicalNotes.symptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                        isChecked
                          ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isChecked ? '● ' : '+ '}
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Itch / Discomfort Severity Level */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Pruritus / Itch Level
                </label>
                <span className="text-[11px] font-semibold text-teal-700 font-mono">
                  {clinicalNotes.itchLevel}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {['None', 'Mild', 'Moderate', 'Severe'].map((lvl) => {
                  const isSel = clinicalNotes.itchLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setClinicalNotes({ ...clinicalNotes, itchLevel: lvl })}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        isSel
                          ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Observed Evolution */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Evolution / Recent Changes
              </label>
              <input
                type="text"
                placeholder="e.g. Enlarged recently, darker border, bleeding when rubbed"
                value={clinicalNotes.evolution}
                onChange={(e) =>
                  setClinicalNotes({ ...clinicalNotes, evolution: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={!selectedImage || isAnalyzing || Boolean(activeSampleId)}
              onClick={handleStartAnalysis}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                !selectedImage || activeSampleId
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed shadow-none'
                  : isAnalyzing
                  ? 'bg-stone-800 text-white animate-pulse'
                  : 'bg-stone-900 hover:bg-stone-800 text-white hover:shadow-lg shadow-stone-900/15 active:scale-[0.99]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Running local research classifier...</span>
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  <span>Run HAM10000 Research Classifier</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            {activeSampleId && (
              <p className="mt-2 text-center text-xs text-amber-800">
                Synthetic sample illustrations are not valid inputs for the model. Upload a real dermatoscopic image to continue.
              </p>
            )}

            {!selectedImage && (
              <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
                Please upload a photo or pick a sample case to begin analysis.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
