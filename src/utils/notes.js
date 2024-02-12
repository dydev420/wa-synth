import { A, NOTES_COUNT, REFERENCE_NOTE, REFERENCE_OCTAVE } from "./constants";


export const to100Precision = (num) => {
  return Math.round(num * 100) / 100;
}

export const getFreqAtStep = (step, refFreq = REFERENCE_NOTE) => {
  const result = refFreq * Math.pow(A, step);
  return to100Precision(result);
}

export const getFreqForOctaveAtStep = (octave, step, refFreq = REFERENCE_NOTE) => {
  const oct = octave - REFERENCE_OCTAVE;
  const result = refFreq * Math.pow(A, (NOTES_COUNT * oct) + step);
  return to100Precision(result);
}
