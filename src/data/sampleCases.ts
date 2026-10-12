import { SampleCase } from '../types/dermatology';

// Utility to create high-resolution realistic dermatological lesion SVGs as base64 data URLs
function createLesionSvgDataUrl(svgContent: string): string {
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <!-- Base healthy skin layer -->
    <defs>
      <radialGradient id="skinBase" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#f8ded1" />
        <stop offset="60%" stop-color="#edd1c4" />
        <stop offset="100%" stop-color="#dfbeaf" />
      </radialGradient>
      <filter id="skinTexture" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" result="noise" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" />
        <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
      </filter>
      <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
        <stop offset="70%" stop-color="transparent" />
        <stop offset="100%" stop-color="rgba(0,0,0,0.18)" />
      </radialGradient>
    </defs>
    <rect width="600" height="600" fill="url(#skinBase)" />
    <!-- Fine skin pore texture -->
    <rect width="600" height="600" fill="#eed5c8" filter="url(#skinTexture)" opacity="0.35" />
    ${svgContent}
    <!-- Macro lens vignette and scale -->
    <rect width="600" height="600" fill="url(#vignette)" pointer-events="none" />
    <g transform="translate(20, 560)">
      <rect x="0" y="0" width="120" height="24" rx="4" fill="rgba(0,0,0,0.6)" />
      <line x1="10" y1="12" x2="110" y2="12" stroke="#ffffff" stroke-width="2" />
      <line x1="10" y1="7" x2="10" y2="17" stroke="#ffffff" stroke-width="2" />
      <line x1="60" y1="9" x2="60" y2="15" stroke="#ffffff" stroke-width="1.5" />
      <line x1="110" y1="7" x2="110" y2="17" stroke="#ffffff" stroke-width="2" />
      <text x="60" y="21" fill="#ffffff" font-size="8" font-family="sans-serif" text-anchor="middle">10 mm</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;
}

// 1. Plaque Psoriasis SVG
const psoriasisSvg = `
  <!-- Erythematous inflammatory base -->
  <path d="M 220 200 C 150 240, 140 340, 190 410 C 250 480, 380 470, 430 390 C 470 320, 450 220, 370 180 C 310 150, 260 170, 220 200 Z" fill="#cf3f4d" opacity="0.78" filter="blur(8px)" />
  <path d="M 230 220 C 170 260, 180 340, 220 390 C 270 450, 360 430, 400 370 C 440 310, 410 240, 350 200 C 290 170, 270 190, 230 220 Z" fill="#b92b3a" opacity="0.85" />
  
  <!-- Micaceous silvery scaly clusters -->
  <g fill="#f4edea" opacity="0.88">
    <ellipse cx="280" cy="270" rx="35" ry="25" transform="rotate(-15 280 270)" />
    <ellipse cx="340" cy="290" rx="42" ry="30" transform="rotate(20 340 290)" />
    <ellipse cx="260" cy="330" rx="38" ry="22" transform="rotate(10 260 330)" />
    <ellipse cx="320" cy="360" rx="45" ry="26" transform="rotate(-10 320 360)" />
    <ellipse cx="360" cy="240" rx="28" ry="18" transform="rotate(30 360 240)" />
    <ellipse cx="230" cy="280" rx="25" ry="16" />
    <ellipse cx="370" cy="340" rx="30" ry="20" transform="rotate(15 370 340)" />
  </g>
  <!-- Scale fissures and micaceous flaking -->
  <g stroke="#ffffff" stroke-width="1.8" fill="none" opacity="0.95">
    <path d="M 250 260 Q 280 275 310 265 T 350 280" />
    <path d="M 270 310 Q 300 325 330 315 T 380 330" />
    <path d="M 240 340 Q 280 355 320 345 T 360 370" />
    <path d="M 300 240 Q 330 255 370 245" />
  </g>
  <!-- Auspitz pinpoint spots -->
  <circle cx="275" cy="285" r="2.5" fill="#800b17" />
  <circle cx="335" cy="335" r="2" fill="#800b17" />
  <circle cx="310" cy="300" r="1.8" fill="#800b17" />
`;

// 2. Eczema (Atopic Dermatitis) SVG
const eczemaSvg = `
  <!-- Diffuse ill-defined erythema -->
  <radialGradient id="eczemaRedness" cx="48%" cy="48%" r="45%">
    <stop offset="0%" stop-color="#df4354" stop-opacity="0.75" />
    <stop offset="45%" stop-color="#e96b79" stop-opacity="0.55" />
    <stop offset="75%" stop-color="#f09fa8" stop-opacity="0.3" />
    <stop offset="100%" stop-color="#f8ded1" stop-opacity="0" />
  </radialGradient>
  <circle cx="290" cy="290" r="180" fill="url(#eczemaRedness)" />

  <!-- Multiple clustered micro-papules and vesicular patches -->
  <g fill="#b92d3c" opacity="0.6">
    <circle cx="240" cy="240" r="7" />
    <circle cx="260" cy="230" r="5" />
    <circle cx="275" cy="255" r="6" />
    <circle cx="225" cy="265" r="6" />
    <circle cx="250" cy="285" r="8" />
    <circle cx="290" cy="245" r="6" />
    <circle cx="315" cy="260" r="7" />
    <circle cx="330" cy="290" r="6" />
    <circle cx="305" cy="315" r="8" />
    <circle cx="270" cy="330" r="7" />
    <circle cx="240" cy="310" r="5" />
    <circle cx="340" cy="330" r="6" />
    <circle cx="310" cy="350" r="5" />
    <circle cx="280" cy="370" r="6" />
    <circle cx="355" cy="275" r="5" />
  </g>
  <!-- Scratch excoriations / linear marks -->
  <g stroke="#931a26" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.8">
    <path d="M 230 220 Q 255 240 280 250" />
    <path d="M 260 270 Q 295 285 330 295" />
    <path d="M 250 320 Q 285 335 320 340" />
    <path d="M 290 310 Q 320 325 350 320" />
  </g>
  <!-- Lichenification / skin creasing -->
  <g stroke="#e2b4aa" stroke-width="1.2" fill="none" opacity="0.7">
    <path d="M 210 280 Q 300 295 380 275" />
    <path d="M 215 300 Q 295 315 375 295" />
    <path d="M 225 320 Q 305 335 365 315" />
  </g>
`;

// 3. Melanoma / Atypical Lesion SVG
const melanomaSvg = `
  <!-- Atypical asymmetric dark pigmented lesion with notched scalloped borders and color variegation -->
  <defs>
    <radialGradient id="melanomaCore" cx="42%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#141113" />
      <stop offset="40%" stop-color="#34221d" />
      <stop offset="70%" stop-color="#69392b" />
      <stop offset="90%" stop-color="#9a523e" />
      <stop offset="100%" stop-color="#b86950" />
    </radialGradient>
  </defs>

  <!-- Surrounding mild erythema -->
  <ellipse cx="300" cy="300" rx="140" ry="120" fill="#d96a75" opacity="0.25" filter="blur(15px)" />

  <!-- Asymmetric notched lesion body -->
  <path d="M 240 180 C 180 200, 160 270, 190 340 C 210 390, 230 420, 290 430 C 350 440, 390 380, 420 340 C 450 300, 460 230, 410 190 C 370 160, 320 210, 290 190 C 270 170, 250 170, 240 180 Z" fill="url(#melanomaCore)" />
  
  <!-- Jet black focal satellite / nodule -->
  <path d="M 250 230 C 230 250, 220 280, 240 310 C 270 330, 300 320, 310 280 C 320 240, 290 220, 250 230 Z" fill="#0d0b0d" />
  
  <!-- Hypopigmented regression zone / slate-blue area -->
  <path d="M 330 300 C 310 320, 320 350, 350 360 C 370 370, 390 350, 380 320 C 370 290, 350 290, 330 300 Z" fill="#4a5568" opacity="0.75" />

  <!-- Brown-tan notched expansion lobule -->
  <path d="M 380 210 C 400 230, 425 240, 420 270 C 410 290, 380 270, 370 240 Z" fill="#8c5039" />
  <circle cx="210" cy="360" r="14" fill="#69392b" />
`;

// 4. Tinea Corporis (Ringworm) SVG
const tineaSvg = `
  <!-- Annular erythematous ring with active scaly border and central clearing -->
  <defs>
    <radialGradient id="ringClearing" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#eed8cc" />
      <stop offset="65%" stop-color="#eec7bc" />
      <stop offset="85%" stop-color="#d6515f" />
      <stop offset="100%" stop-color="#eed8cc" />
    </radialGradient>
  </defs>

  <!-- Diffuse circular background -->
  <ellipse cx="300" cy="300" rx="150" ry="140" fill="url(#ringClearing)" />
  
  <!-- Active advancing raised scaly annular rim -->
  <ellipse cx="300" cy="300" rx="140" ry="130" fill="none" stroke="#ba2b3b" stroke-width="26" opacity="0.8" stroke-dasharray="12 4" />
  <ellipse cx="300" cy="300" rx="142" ry="132" fill="none" stroke="#d84858" stroke-width="14" opacity="0.9" />

  <!-- Tiny papules and scales along the advancing margin -->
  <g fill="#f8ede8" opacity="0.9">
    <circle cx="160" cy="300" r="4" />
    <circle cx="170" cy="250" r="4.5" />
    <circle cx="210" cy="190" r="5" />
    <circle cx="270" cy="165" r="4" />
    <circle cx="340" cy="165" r="4.5" />
    <circle cx="400" cy="195" r="5" />
    <circle cx="440" cy="260" r="4" />
    <circle cx="445" cy="330" r="4.5" />
    <circle cx="420" cy="390" r="5" />
    <circle cx="360" cy="430" r="4" />
    <circle cx="290" cy="435" r="4.5" />
    <circle cx="220" cy="410" r="5" />
    <circle cx="175" cy="360" r="4" />
  </g>
  <!-- Central clearing faint scales -->
  <g fill="#ba3342" opacity="0.35">
    <circle cx="280" cy="280" r="3" />
    <circle cx="320" cy="290" r="2.5" />
    <circle cx="300" cy="320" r="3" />
  </g>
`;

// 5. Acne Vulgaris SVG
const acneSvg = `
  <!-- Erythematous inflammatory papules, open comedones (blackheads), and pustules -->
  <!-- Regional erythema -->
  <ellipse cx="300" cy="300" rx="160" ry="150" fill="#df6b77" opacity="0.35" filter="blur(20px)" />

  <!-- Major inflammatory papulopustules -->
  <!-- Papule 1 -->
  <circle cx="240" cy="240" r="28" fill="#c92a3a" opacity="0.85" />
  <circle cx="240" cy="240" r="14" fill="#e04655" />
  <circle cx="240" cy="238" r="7" fill="#fff7d6" /> <!-- Pustular core -->

  <!-- Papule 2 -->
  <circle cx="360" cy="270" r="26" fill="#c92a3a" opacity="0.85" />
  <circle cx="360" cy="270" r="12" fill="#e04655" />
  <circle cx="360" cy="268" r="6" fill="#fff9de" />

  <!-- Papule 3 -->
  <circle cx="280" cy="340" r="32" fill="#ba2333" opacity="0.9" />
  <circle cx="280" cy="340" r="16" fill="#da3e4e" />
  <circle cx="278" cy="338" r="9" fill="#fff4c2" />

  <!-- Smaller erythematous papules -->
  <circle cx="190" cy="320" r="16" fill="#d94151" opacity="0.75" />
  <circle cx="330" cy="380" r="18" fill="#d94151" opacity="0.75" />
  <circle cx="380" cy="350" r="15" fill="#d94151" opacity="0.75" />
  <circle cx="220" cy="180" r="14" fill="#d94151" opacity="0.75" />
  <circle cx="300" cy="210" r="16" fill="#d94151" opacity="0.75" />

  <!-- Comedones (blackheads and whiteheads) -->
  <circle cx="210" cy="270" r="2.8" fill="#2d2522" />
  <circle cx="260" cy="290" r="3" fill="#2d2522" />
  <circle cx="310" cy="260" r="2.5" fill="#2d2522" />
  <circle cx="350" cy="210" r="2.7" fill="#2d2522" />
  <circle cx="260" cy="380" r="3.2" fill="#fffae8" />
  <circle cx="320" cy="320" r="3.5" fill="#fffae8" />
`;

// 6. Contact Dermatitis SVG
const contactDermatitisSvg = `
  <!-- Linear / demarcated vesicular erythema from contact allergen (e.g. watch strap, nickel, or plant) -->
  <defs>
    <linearGradient id="bandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#df3e4e" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#ef6170" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#df3e4e" stop-opacity="0.8" />
    </linearGradient>
  </defs>

  <!-- Clear geometric band of erythema -->
  <rect x="140" y="220" width="320" height="150" rx="20" fill="url(#bandGradient)" transform="rotate(-8 300 295)" />
  
  <!-- Clustered microvesicles (tiny fluid-filled blisters) -->
  <g fill="#fffae6" opacity="0.85" stroke="#ba2b3b" stroke-width="0.8">
    <circle cx="220" cy="260" r="5" />
    <circle cx="235" cy="255" r="4.5" />
    <circle cx="230" cy="275" r="5" />
    <circle cx="248" cy="268" r="4" />
    <circle cx="270" cy="270" r="5.5" />
    <circle cx="290" cy="265" r="6" />
    <circle cx="310" cy="280" r="5" />
    <circle cx="330" cy="275" r="4.8" />
    <circle cx="345" cy="290" r="5.2" />
    <circle cx="365" cy="285" r="5.5" />
    <circle cx="380" cy="300" r="4.5" />
    <circle cx="260" cy="300" r="5" />
    <circle cx="280" cy="315" r="5.2" />
    <circle cx="305" cy="310" r="4.8" />
    <circle cx="335" cy="320" r="5" />
  </g>
  <!-- Excoriation scratch line across lesion -->
  <path d="M 210 290 Q 280 300 360 310" stroke="#8b1420" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8" />
`;

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'psoriasis-sample',
    name: 'Plaque Psoriasis',
    scientificName: 'Psoriasis vulgaris',
    category: 'Autoimmune / Inflammatory',
    description: 'Well-demarcated salmon-pink plaque with prominent silvery-white micaceous scales on an extensor skin surface.',
    imageUrl: createLesionSvgDataUrl(psoriasisSvg),
    notes: {
      bodyLocation: 'Elbow / Extensor Forearm',
      duration: 'Several months (relapsing)',
      symptoms: ['Scaling / Flaking', 'Dryness / Cracking', 'Mild Itching'],
      itchLevel: 'Mild to Moderate',
      evolution: 'Gradually thickening with silvery crust',
      notes: 'Noticed first after winter dry weather; scales shed when clothing rubs.',
    },
  },
  {
    id: 'eczema-sample',
    name: 'Atopic Dermatitis (Eczema)',
    scientificName: 'Dermatitis atopica',
    category: 'Allergic / Barrier Dysfunction',
    description: 'Ill-defined erythematous patches with superficial excoriation, cutaneous xerosis, and pruritic micro-papules.',
    imageUrl: createLesionSvgDataUrl(eczemaSvg),
    notes: {
      bodyLocation: 'Flexor Crease / Antecubital Fossa',
      duration: '3-4 weeks',
      symptoms: ['Severe Itching', 'Redness / Erythema', 'Dryness / Cracking'],
      itchLevel: 'Severe (worse at night)',
      evolution: 'Intense pruritus leading to repeated scratching and skin redness',
      notes: 'History of seasonal allergic rhinitis; worsens with scented soap.',
    },
  },
  {
    id: 'melanoma-sample',
    name: 'Atypical Dysplastic Mole (Melanoma Suspect)',
    scientificName: 'Melanocytic dysplasia / Malignant melanoma suspect',
    category: 'Neoplastic / Pigmentary',
    description: 'Asymmetric pigmented cutaneous macule with irregular scalloped borders, multi-toned brown-black variegation, and >6mm diameter.',
    imageUrl: createLesionSvgDataUrl(melanomaSvg),
    notes: {
      bodyLocation: 'Upper Back / Scapula',
      duration: 'Noticed change over past 2 months',
      symptoms: ['Changing Shape/Color', 'Dark Pigmentation'],
      itchLevel: 'None / Asymptomatic',
      evolution: 'Partner noticed the spot became darker and developed an irregular jagged edge',
      notes: 'Fair skin with significant childhood sun exposure history; family history of melanoma.',
    },
  },
  {
    id: 'tinea-sample',
    name: 'Tinea Corporis (Ringworm)',
    scientificName: 'Dermatophytosis (Tinea corporis)',
    category: 'Infectious (Fungal)',
    description: 'Characteristic annular erythematous ring with active scaly advancing perimeter and central hypopigmented clearing.',
    imageUrl: createLesionSvgDataUrl(tineaSvg),
    notes: {
      bodyLocation: 'Torso / Chest',
      duration: '10-14 days',
      symptoms: ['Ring-shaped Pattern', 'Itching', 'Scaling / Flaking'],
      itchLevel: 'Moderate',
      evolution: 'Started as a small red bump that expanded outward with a distinct circular raised edge',
      notes: 'Plays contact sports (wrestling) and adopted a rescue puppy last month.',
    },
  },
  {
    id: 'acne-sample',
    name: 'Acne Vulgaris (Papulopustular)',
    scientificName: 'Acne vulgaris',
    category: 'Follicular / Inflammatory',
    description: 'Erythematous follicular papules and pustules interspersed with open and closed comedones on oily facial dermis.',
    imageUrl: createLesionSvgDataUrl(acneSvg),
    notes: {
      bodyLocation: 'Cheek / Jawline',
      duration: 'Chronic (fluctuating)',
      symptoms: ['Pimples / Pustules', 'Pain or Tenderness', 'Redness / Erythema'],
      itchLevel: 'Mild tenderness when touched',
      evolution: 'Clogged pores leading to inflamed red bumps and pustular centers',
      notes: 'Flares correlate with stress, humid weather, and menstrual cycle.',
    },
  },
  {
    id: 'contact-dermatitis-sample',
    name: 'Allergic Contact Dermatitis',
    scientificName: 'Dermatitis contacta allergica',
    category: 'Allergic / Type IV Hypersensitivity',
    description: 'Well-demarcated geometric band of intense erythema with clustered microvesicles and superficial scratch excoriation.',
    imageUrl: createLesionSvgDataUrl(contactDermatitisSvg),
    notes: {
      bodyLocation: 'Wrist / Distal Forearm',
      duration: '48-72 hours',
      symptoms: ['Severe Itching', 'Redness / Erythema', 'Blisters / Vesicles', 'Burning Sensation'],
      itchLevel: 'Severe burning pruritus',
      evolution: 'Sudden onset 1 day after wearing a new metallic wristwatch band',
      notes: 'Suspected nickel contact allergy; previously had earlobe reaction to costume jewelry.',
    },
  },
];
