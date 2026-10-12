import test from 'node:test';
import assert from 'node:assert/strict';
import { generateFallbackClinicalAnalysis } from '../src/lib/skinPredictionEngine.ts';

test('detects ringworm pattern from ring-shaped itchy rash', () => {
  const result = generateFallbackClinicalAnalysis({
    bodyLocation: 'Arm / Hand / Wrist',
    duration: '1 to 3 weeks',
    symptoms: ['Ring-shaped Pattern', 'Scaling / Flaking', 'Severe Itching'],
    itchLevel: 'Moderate',
    evolution: 'Expanding circular rash',
    notes: 'Annular itchy lesion with central clearing',
  });

  assert.equal(result.primaryDiagnosis.name.includes('Tinea'), true);
  assert.ok(result.primaryDiagnosis.confidence >= 70);
});

test('detects melanoma suspicion from changing dark mole features', () => {
  const result = generateFallbackClinicalAnalysis({
    bodyLocation: 'Face / Neck',
    duration: '2 to 4 weeks',
    symptoms: ['Changing Shape/Color', 'Dark Pigmentation'],
    itchLevel: 'Moderate',
    evolution: 'Slowly darkening and growing',
    notes: 'Irregular asymmetric pigmented spot with jagged border',
  });

  assert.equal(result.primaryDiagnosis.name.includes('Atypical'), true);
  assert.equal(result.primaryDiagnosis.severity, 'Urgent');
});

test('rejects irrelevant non-skin images that do not contain lesion evidence', () => {
  const result = generateFallbackClinicalAnalysis({
    bodyLocation: 'Other / Generalized',
    duration: 'Less than 1 week',
    symptoms: [],
    itchLevel: 'None',
    evolution: '',
    notes: 'Photo of a car dashboard and steering wheel',
  });

  assert.equal(result.isSkinLesion, false);
  assert.equal(result.rejectionReason.includes('does not appear to contain human cutaneous skin'), true);
});

test('rejects generic object photos with no lesion descriptors', () => {
  const result = generateFallbackClinicalAnalysis({
    bodyLocation: 'Arm / Hand / Wrist',
    duration: 'Less than 1 week',
    symptoms: [],
    itchLevel: 'None',
    evolution: '',
    notes: 'random object photo with no visible skin lesion',
  });

  assert.equal(result.isSkinLesion, false);
});
