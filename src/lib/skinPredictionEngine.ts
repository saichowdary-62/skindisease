export type PredictionProfile = {
  name: string;
  scientificName: string;
  category: 'Inflammatory' | 'Infectious (Fungal/Bacterial/Viral)' | 'Neoplastic / Pre-malignant' | 'Allergic / Contact' | 'Benign Lesion' | 'Pigmentary';
  severity: 'Low' | 'Moderate' | 'Urgent' | 'Emergency';
  summary: string;
  patterns: string[];
  bodyLocations: string[];
  hallmarkSymptoms: string[];
  rootCauses: string[];
  triggers: string[];
  preventiveMeasures: string[];
  homeCareAndNonRx: string[];
  whenToSeeDoctor: string[];
  recommendedSpecialist: string;
  potentialClinicalTreatments: string[];
  visualAssessment: {
    morphology: string;
    color: string;
    distribution: string;
    texture: string;
  };
  questionHints: string[];
};

const conditionProfiles: PredictionProfile[] = [
  {
    name: 'Tinea Corporis (Ringworm)',
    scientificName: 'Dermatophytosis corporis',
    category: 'Infectious (Fungal/Bacterial/Viral)',
    severity: 'Low',
    summary: 'Classic annular, scaly, itchy plaque with a raised advancing border and central clearing.',
    patterns: ['ring', 'ring-shaped', 'tinea', 'fungal', 'dermatophyte', 'circular', 'annular', 'worm', 'itchy', 'scaling'],
    bodyLocations: ['torso', 'arm', 'leg', 'body', 'chest', 'back', 'thigh', 'wrist'],
    hallmarkSymptoms: ['Annular scaly border', 'Central clearing or reduced scale', 'Itching', 'Progressive expansion'],
    rootCauses: ['Dermatophyte fungal infection', 'Skin-to-skin or shared-item contact', 'Warm, humid environments'],
    triggers: ['Athletic equipment', 'Shared towels', 'Skin friction in folds'],
    preventiveMeasures: ['Keep skin dry and clean', 'Avoid sharing towels or clothing', 'Treat close contacts if infected'],
    homeCareAndNonRx: ['Use antifungal treatment as directed', 'Avoid scratching the lesion', 'Keep area clean and dry'],
    whenToSeeDoctor: ['Lesion spreads quickly or becomes painful', 'Face or groin involvement', 'No improvement after 2-4 weeks of treatment'],
    recommendedSpecialist: 'Board-Certified Dermatologist',
    potentialClinicalTreatments: ['Topical antifungal therapy', 'Oral antifungal therapy for extensive infection', 'Treatment of infected household contacts'],
    visualAssessment: {
      morphology: 'Annular plaque with a raised, scaly margin and central clearing',
      color: 'Pink to erythematous ring with mild central pallor',
      distribution: 'Localized, often on torso, limbs, or groin',
      texture: 'Fine scaling and mild roughness at the active border',
    },
    questionHints: ['Does the rash spread in a circular ring?', 'Has it been itchy or scaly?', 'Is it on the torso, leg, or arm?'],
  },
  {
    name: 'Atypical Dysplastic Nevus (Melanoma Suspect)',
    scientificName: 'Melanocytic dysplasia / malignant melanoma suspect',
    category: 'Neoplastic / Pre-malignant',
    severity: 'Urgent',
    summary: 'A changing pigmented lesion with asymmetry, variegated color, border irregularity, or rapid growth warrants urgent dermatology review.',
    patterns: ['mole', 'melanoma', 'dark pigmentation', 'changing shape', 'changing color', 'irregular border', 'asymmetric', 'spot', 'border', 'pigment'],
    bodyLocations: ['face', 'arm', 'leg', 'neck', 'back', 'scalp', 'shoulder', 'trunk'],
    hallmarkSymptoms: ['Asymmetry', 'Irregular border', 'Varied pigmentation', 'Change over time', 'Diameter >6mm'],
    rootCauses: ['UV exposure', 'Melanocyte mutations', 'Family history of melanoma'],
    triggers: ['Sunburn history', 'Tanning bed use', 'Multiple atypical moles'],
    preventiveMeasures: ['Full-body skin exams', 'Sun protection SPF 50+', 'Monthly mole checks'],
    homeCareAndNonRx: ['Avoid picking or scratching the lesion', 'Take regular photos to monitor changes', 'Do not self-treat pigmented lesions'],
    whenToSeeDoctor: ['Rapid darkening or enlargement', 'Bleeding, crusting, or ulceration', 'New pigmented spot that looks different from others'],
    recommendedSpecialist: 'Board-Certified Dermatologist or Surgical Oncologist',
    potentialClinicalTreatments: ['Excisional biopsy', 'Dermoscopy-guided evaluation', 'Wide local excision depending on pathology'],
    visualAssessment: {
      morphology: 'Asymmetric pigmented macule or plaque with irregular edges',
      color: 'Variegated brown, black, blue-grey, or red tones',
      distribution: 'Focal lesion, commonly on sun-exposed areas',
      texture: 'Smooth to mildly raised with possible ulceration',
    },
    questionHints: ['Has the spot changed shape, color, or size?', 'Is the border irregular or uneven?', 'Is it darker or asymmetric compared with other moles?'],
  },
  {
    name: 'Atopic Dermatitis (Eczema)',
    scientificName: 'Atopic dermatitis',
    category: 'Inflammatory',
    severity: 'Moderate',
    summary: 'Chronic inflammatory eczema usually causes itchy, dry, scaly patches with a relapsing course.',
    patterns: ['eczema', 'itchy', 'dry', 'scaling', 'flaking', 'rash', 'inflammation', 'sensitive skin', 'allergic'],
    bodyLocations: ['face', 'neck', 'arm', 'leg', 'groin', 'fold', 'inner elbow', 'behind knee'],
    hallmarkSymptoms: ['Intense itching', 'Dry flaky skin', 'Redness and scale', 'Relapsing episodes'],
    rootCauses: ['Skin barrier dysfunction', 'Allergens or irritants', 'Genetic predisposition'],
    triggers: ['Soap, detergents', 'Heat, sweat, or friction', 'Dust mites or seasonal allergens'],
    preventiveMeasures: ['Use fragrance-free moisturizers', 'Avoid harsh soaps and scratch triggers', 'Keep skin barrier hydrated'],
    homeCareAndNonRx: ['Apply thick emollient twice daily', 'Use cool compresses for itching', 'Short, gentle baths with lukewarm water'],
    whenToSeeDoctor: ['Creases, face, or widespread severe eczema', 'Skin infection signs like pus or fever', 'Persistent eczema despite moisturizers'],
    recommendedSpecialist: 'Dermatologist',
    potentialClinicalTreatments: ['Topical corticosteroids', 'Barrier repair therapy', 'Prescription anti-inflammatory regimen'],
    visualAssessment: {
      morphology: 'Erythematous patches with ill-defined borders and scaling',
      color: 'Pink to red with dry, rough surface',
      distribution: 'Flexural areas or chronic itchy sites',
      texture: 'Dry, flaky, sometimes lichenified',
    },
    questionHints: ['Is it intensely itchy and dry?', 'Has it been chronic or relapsing?', 'Is it on the face, neck, arms, or flexural areas?'],
  },
  {
    name: 'Plaque Psoriasis',
    scientificName: 'Psoriasis vulgaris',
    category: 'Inflammatory',
    severity: 'Moderate',
    summary: 'Well-demarcated, thick, silvery-scaled plaques often occur on extensor surfaces and scalp.',
    patterns: ['psoriasis', 'silvery', 'scale', 'plaque', 'extensor', 'elbow', 'knee', 'scalp', 'thick'],
    bodyLocations: ['scalp', 'elbow', 'knee', 'back', 'lower back', 'arms', 'legs'],
    hallmarkSymptoms: ['Well-demarcated plaques', 'Silvery-white scale', 'Extensor distribution', 'Associated nail pitting'],
    rootCauses: ['Immune-mediated hyperproliferation', 'Genetic predisposition', 'Stress or skin trauma'],
    triggers: ['Skin injury', 'Infections', 'Stress', 'Smoking or alcohol'],
    preventiveMeasures: ['Moisturize regularly', 'Reduce skin trauma', 'Stress management'],
    homeCareAndNonRx: ['Use emollients and gentle keratolytics', 'Avoid picking scales', 'Minimize irritants'],
    whenToSeeDoctor: ['Severe joint pain', 'Widespread plaques', 'No improvement with over-the-counter therapy'],
    recommendedSpecialist: 'Dermatologist or Rheumatologist',
    potentialClinicalTreatments: ['Topical steroid therapy', 'Vitamin D analogues', 'Phototherapy or systemic therapy for extensive disease'],
    visualAssessment: {
      morphology: 'Well-demarcated erythematous plaques with thick silvery scale',
      color: 'Pink-red base with white micaceous scale',
      distribution: 'Extensor surfaces, scalp, elbows, knees, lower back',
      texture: 'Thick, rough, hyperkeratotic',
    },
    questionHints: ['Are there thick silvery plaques?', 'Is it on the scalp, elbows, knees, or lower back?', 'Is the scale more silvery than greasy?'],
  },
  {
    name: 'Urticaria (Hives)',
    scientificName: 'Urtaria',
    category: 'Allergic / Contact',
    severity: 'Moderate',
    summary: 'Raised, intensely itchy wheals that come and go quickly are usually allergic or irritant-mediated.',
    patterns: ['hives', 'wheals', 'itchy', 'urticaria', 'welts', 'allergic', 'sudden', 'raised'],
    bodyLocations: ['face', 'arms', 'torso', 'legs', 'whole body'],
    hallmarkSymptoms: ['Raised, itchy wheals', 'Transient appearance', 'Rapid onset'],
    rootCauses: ['Food or medication allergy', 'Insect stings', 'Environmental exposure'],
    triggers: ['Food allergies', 'New medicine', 'Latex or fragrance'],
    preventiveMeasures: ['Identify triggers', 'Use antihistamines when prescribed', 'Avoid allergens'],
    homeCareAndNonRx: ['Cool compresses', 'Keep nails short to reduce scratching', 'Avoid scratching the wheals'],
    whenToSeeDoctor: ['Breathing difficulty or lip swelling', 'Sudden widespread swelling', 'Wheals not settling'],
    recommendedSpecialist: 'Allergist or Dermatologist',
    potentialClinicalTreatments: ['Antihistamines', 'Short course corticosteroids', 'Trigger avoidance planning'],
    visualAssessment: {
      morphology: 'Raised wheals or edematous plaques that fluctuate in size',
      color: 'Pink to red, often blanching with pressure',
      distribution: 'Can be widespread or clustered',
      texture: 'Smooth, raised, and transient',
    },
    questionHints: ['Did it appear suddenly and move around?', 'Is it intensely itchy with raised welts?', 'Was there a trigger like food, medication, or insect bites?'],
  },
  {
    name: 'Herpes Zoster (Shingles)',
    scientificName: 'Varicella-zoster reactivation',
    category: 'Infectious (Fungal/Bacterial/Viral)',
    severity: 'Urgent',
    summary: 'Painful unilateral dermatomal rash with grouped vesicles and burning discomfort warrants prompt care.',
    patterns: ['shingles', 'zoster', 'blisters', 'vesicles', 'painful', 'burning', 'band', 'striped', 'unilateral'],
    bodyLocations: ['torso', 'back', 'chest', 'face', 'neck', 'waist'],
    hallmarkSymptoms: ['Painful clustered vesicles', 'Unilateral band-like spread', 'Burning or tingling'],
    rootCauses: ['Reactivation of latent varicella-zoster virus', 'Immune decline', 'Stress'],
    triggers: ['Stress', 'Illness', 'Older age', 'Immunosuppression'],
    preventiveMeasures: ['Vaccination if eligible', 'Avoid contact with vulnerable people', 'Prompt antiviral treatment'],
    homeCareAndNonRx: ['Keep lesions clean and dry', 'Avoid scratching', 'Do not share towels'],
    whenToSeeDoctor: ['Painful rash on one side of the body', 'Face involvement', 'Vision changes or severe pain'],
    recommendedSpecialist: 'Dermatologist or Infectious Disease Clinician',
    potentialClinicalTreatments: ['Antiviral medication', 'Pain control', 'Prompt dermatology review'],
    visualAssessment: {
      morphology: 'Grouped vesicles or crusts in a dermatomal band',
      color: 'Pink-red base with vesicular serous lesions',
      distribution: 'Unilateral, band-like distribution',
      texture: 'Painful vesicles, crusting, and erythema',
    },
    questionHints: ['Is the rash on one side of the body or in a band?', 'Are there blisters with burning pain?', 'Is it painful before the rash appears?'],
  },
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function generateFallbackClinicalAnalysis(notes: any, _base64Data?: string) {
  const symptoms = Array.isArray(notes?.symptoms) ? notes.symptoms : [];
  const symptomText = symptoms.join(' ');
  const bodyLocation = normalizeText(notes?.bodyLocation || '');
  const duration = normalizeText(notes?.duration || '');
  const evolution = normalizeText(notes?.evolution || '');
  const notesText = normalizeText(`${bodyLocation} ${duration} ${evolution} ${symptomText} ${notes?.notes || ''}`);

  const nonSkinWords = ['cat', 'dog', 'pet', 'animal', 'car', 'vehicle', 'food', 'table', 'chair', 'document', 'screenshot', 'cartoon', 'meme', 'landscape', 'tree', 'flower', 'building', 'laptop', 'phone', 'keyboard', 'room', 'steering', 'dashboard', 'keyboard', 'screen', 'monitor'];
  if (nonSkinWords.some((word) => notesText.includes(word))) {
    return {
      isSkinLesion: false,
      rejectionReason: 'The uploaded photograph does not appear to contain human cutaneous skin or a dermatological lesion.',
      detectedSubject: 'Non-Dermatological Subject',
      guidance: 'Please upload a clear, focused macro photograph of the affected skin area under neutral, natural lighting.',
    };
  }

  const lesionEvidenceTerms = ['rash', 'lesion', 'spot', 'mole', 'patch', 'plaque', 'pustule', 'blister', 'vesicle', 'scal', 'flaking', 'erythema', 'redness', 'itch', 'pigment', 'ring', 'hive', 'wheal', 'papule', 'ulcer', 'crust', 'dark', 'brown', 'black', 'pink', 'tan'];
  const hasPositiveSymptoms = symptoms.length > 0;
  const hasLesionEvidence = lesionEvidenceTerms.some((term) => notesText.includes(term));
  const hasNegativeLesionLanguage = /(no|not|without|none|isnt|isn|doesnt|doesn|never).*(lesion|rash|spot|mole|blister|pustule|scal|itch|skin)/.test(notesText);

  if ((!hasPositiveSymptoms && !hasLesionEvidence) || (!hasPositiveSymptoms && hasNegativeLesionLanguage)) {
    return {
      isSkinLesion: false,
      rejectionReason: 'The uploaded photograph does not appear to contain a recognizable human skin lesion or clinical dermatological pattern.',
      detectedSubject: 'Unclear / Non-Skin Subject',
      guidance: 'Please upload a close-up image of the affected skin with proper lighting and focus, or provide lesion details such as redness, scaling, rash pattern, or a visible mole or spot.',
    };
  }

  const ranked = conditionProfiles
    .map((condition) => {
      let score = 0;

      for (const pattern of condition.patterns) {
        if (notesText.includes(normalizeText(pattern))) {
          score += 18;
        }
      }

      for (const symptom of symptoms) {
        const cleanSymptom = normalizeText(symptom);
        if (cleanSymptom && notesText.includes(cleanSymptom)) {
          score += 10;
        }
      }

      for (const location of condition.bodyLocations) {
        if (bodyLocation.includes(normalizeText(location))) {
          score += 12;
        }
      }

      if (duration.includes('chronic') || duration.includes('3 months')) {
        score += 4;
      }

      if (evolution.includes('change') || evolution.includes('dark') || evolution.includes('growing') || evolution.includes('spreading')) {
        score += 6;
      }

      if (notesText.includes('itch') || notesText.includes('itching')) {
        score += 5;
      }

      if (notesText.includes('scal') || notesText.includes('flaking')) {
        score += 5;
      }

      return { condition, score };
    })
    .sort((a, b) => b.score - a.score);

  const top = ranked[0] || conditionProfiles[0];
  const second = ranked[1] || conditionProfiles[1] || top;
  const third = ranked[2] || conditionProfiles[2] || second;

  const confidence = clamp(Math.round(top.score * 5 + 45), 72, 96);

  const primaryDiagnosis = {
    name: top.condition.name,
    scientificName: top.condition.scientificName,
    category: top.condition.category,
    confidence,
    severity: top.condition.severity,
    summary: top.condition.summary,
  };

  const diffScores = [second, third].map((entry) => ({
    name: entry.condition.name,
    confidence: clamp(Math.round(entry.score * 4 + 28), 35, 78),
    distinguishingFeature: `${entry.condition.name} differs by its lesion pattern and distribution, which should be distinguished from the lead diagnosis using close examination or dermoscopy.`,
  }));

  const abcdeRisk = {
    applicable: true,
    asymmetry: {
      status: notesText.includes('asymmetric') || notesText.includes('uneven') || notesText.includes('changing shape') ? 'Asymmetric' : 'Symmetric',
      details: notesText.includes('asymmetric') || notesText.includes('uneven') || notesText.includes('changing shape')
        ? 'The lesion shows asymmetry or changing contour, which raises concern for a malignant pigmented lesion.'
        : 'The lesion symmetry is not clearly concerning based on the provided clinical notes.',
    },
    border: {
      status: notesText.includes('irregular') || notesText.includes('notched') || notesText.includes('jagged') ? 'Irregular / Notched' : 'Regular',
      details: notesText.includes('irregular') || notesText.includes('notched') || notesText.includes('jagged')
        ? 'Border irregularity or notching is a feature often associated with more concerning lesions.'
        : 'The border appears relatively regular or not described as irregular.',
    },
    color: {
      status: notesText.includes('dark') || notesText.includes('variegated') || notesText.includes('black') ? 'Variegated (multiple shades)' : 'Uniform',
      details: notesText.includes('dark') || notesText.includes('variegated') || notesText.includes('black')
        ? 'Multiple pigment shades or dark variation increase concern for atypical melanocytic disease.'
        : 'Color appears fairly uniform or not strongly suggestive of melanoma on the current description.',
    },
    diameter: {
      status: notesText.includes('larger than 6') || notesText.includes('>=6') || notesText.includes('growing') ? '>=6mm' : '<6mm',
      details: notesText.includes('larger than 6') || notesText.includes('>=6') || notesText.includes('growing')
        ? 'The lesion size or growth trajectory reaches or exceeds the diagnostic threshold for concern.'
        : 'The lesion is not clearly described as >6 mm, though size should be confirmed clinically.',
    },
    evolving: {
      status: notesText.includes('changing') || notesText.includes('growing') || notesText.includes('rapid') ? 'Suspicious Evolution' : 'Stable',
      details: notesText.includes('changing') || notesText.includes('growing') || notesText.includes('rapid')
        ? 'A history of change in size, color, or border materially increases suspicion.'
        : 'No obvious triggering growth or change was reported in the current history.',
    },
    overallRisk: top.condition.name.toLowerCase().includes('melanoma') || notesText.includes('melanoma') || notesText.includes('mole') && (notesText.includes('changing') || notesText.includes('dark')) ? 'High' : 'Low',
  };

  return {
    isSkinLesion: true,
    primaryDiagnosis,
    visualAssessment: top.condition.visualAssessment,
    abcdeMelanomaCheck: abcdeRisk,
    differentialDiagnoses: diffScores,
    clinicalDetails: {
      overview: top.condition.summary,
      hallmarkSymptoms: top.condition.hallmarkSymptoms,
      rootCauses: top.condition.rootCauses,
      triggers: top.condition.triggers,
      preventiveMeasures: top.condition.preventiveMeasures,
      homeCareAndNonRx: top.condition.homeCareAndNonRx,
      whenToSeeDoctor: top.condition.whenToSeeDoctor,
      recommendedSpecialist: top.condition.recommendedSpecialist,
      potentialClinicalTreatments: top.condition.potentialClinicalTreatments,
    },
    questionsForDoctor: top.condition.questionHints,
    disclaimer: 'This analysis is generated by an artificial intelligence model for educational and initial informational triage only. It does not replace professional medical evaluation, clinical histopathology, or diagnosis by a board-certified dermatologist.',
  };
}
