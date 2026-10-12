import React from 'react';
import { AlertTriangle, X, PhoneCall, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface EmergencyRedFlagsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyRedFlagsModal: React.FC<EmergencyRedFlagsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const redFlags = [
    {
      title: 'Stevens-Johnson Syndrome (SJS) / TEN',
      sign: 'Targetoid lesions or painful blisters spreading rapidly with detachment of skin and mucosal involvement (lips, mouth, eyes, genitals), frequently within weeks of initiating a new medication.',
      urgency: 'Medical Emergency (Call 911 / ER immediately)',
    },
    {
      title: 'Necrotizing Soft Tissue Infection / Fasciitis',
      sign: 'Severe, agonizing pain out of proportion to visual redness, rapidly spreading edema, wooden-hard skin induration, crepitus (crackling under skin), or skin turning dusky purple/black.',
      urgency: 'Surgical Emergency',
    },
    {
      title: 'Meningococcemia / Purpura Fulminans',
      sign: 'Non-blanching dark purple or petechial rash (does not fade when pressed with a glass tumbler) accompanied by high fever, confusion, severe headache, or neck stiffness.',
      urgency: 'Immediate ICU Triage',
    },
    {
      title: 'Severe Anaphylactic Urticaria',
      sign: 'Sudden widespread hives and facial/lip angioedema accompanied by shortness of breath, wheezing, throat tightness, or lightheadedness.',
      urgency: 'Administer Epinephrine & Call 911',
    },
    {
      title: 'Acute Rapid Cellulitis with Sepsis',
      sign: 'Rapidly spreading erythema with distinct red streaks traveling up a limb toward lymph nodes, accompanied by high fever, rigors, or rapid heartbeat.',
      urgency: 'Immediate Same-Day Clinical Attention',
    },
    {
      title: 'Eczema Herpeticum',
      sign: 'Sudden eruption of widespread, painful, punched-out clustered vesicles on top of existing eczema, especially on the face, accompanied by fever.',
      urgency: 'Urgent Dermatologist / ER Care',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-rose-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-700 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-stone-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Dermatological Emergency Red Flags
              </h2>
              <p className="text-xs text-rose-200">
                Conditions requiring immediate emergency department evaluation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-300 hover:text-white hover:bg-rose-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="p-4 bg-rose-50 border-b border-rose-100 text-xs text-rose-950 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            If you or someone in your care displays any of these symptoms, <strong>do NOT wait</strong> for an outpatient dermatologist appointment or rely on smartphone apps. Proceed immediately to the nearest Emergency Room.
          </p>
        </div>

        {/* List of Critical Symptoms */}
        <div className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
          {redFlags.map((flag, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  {flag.title}
                </h4>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full">
                  {flag.urgency}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-3.5">
                {flag.sign}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <PhoneCall className="w-4 h-4 text-rose-600" />
            <span>Emergency Services: <strong>911</strong> (US) or local emergency number</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
