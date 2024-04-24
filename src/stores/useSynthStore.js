import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// import Osc from '../classes/Osc';
import { to100Precision } from '../utils/notes';
import Osc from '../classes/Osc';

// WebAudio Context
const actx = new window.AudioContext();

// Pipeline nodes
const osc1 = actx.createOscillator();
const gain1 = actx.createGain();
const filter1 = actx.createBiquadFilter();
const compressor1 = actx.createDynamicsCompressor();
const analyzer1 = actx.createAnalyser();
analyzer1.fftSize = 2048;

/**
 * Equalizer nodes
 */
// In/Out
const inEQ = actx.createGain();
const outEQ = actx.createGain();

// Low
const lowshelfEQ = actx.createBiquadFilter(); 
lowshelfEQ.type = 'lowshelf';
lowshelfEQ.frequency.value = 100;

// Mid
const midEQ = actx.createBiquadFilter(); 
midEQ.type = 'peaking';
midEQ.frequency.value = 800;
midEQ.Q.value = 3;

// High
const highshelfEQ = actx.createBiquadFilter(); 
highshelfEQ.type = 'highshelf';
highshelfEQ.frequency.value = 1600;

// EQ connection
inEQ.connect(lowshelfEQ);
lowshelfEQ.connect(midEQ);
midEQ.connect(highshelfEQ);
highshelfEQ.connect(outEQ);

/**
 * Main Audio Line Node
 */
const mainBus = actx.createGain();

/**
 * Analyzer code
 */
const bufferLength = analyzer1.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);

/**
 * Pipeline Connections
 */
// Base oscillator (Not used by UI now)
osc1.connect(gain1);

// Gain node
gain1.connect(filter1);

// Filter
filter1.connect(compressor1);

// Compressor
// compressor1.connect(analyzer1);

// EQ
compressor1.connect(inEQ);
outEQ.connect(analyzer1);

// Analyzer to main
analyzer1.connect(mainBus);

// Main Destination connection
mainBus.connect(actx.destination);

const defaultEnvelope = {
  attack: 0.005,
  decay: 0.1,
  sustain: 0.6,
  release: 0.1,
} 

const defaultOscConfig = {
  type: 'sawtooth',
  detune: 0,
};

const defaultEQConfig = {
  low: 3,
  mid: 5,
  high: 4,
};

let oscNodes = [];

const useSynthStore = (set, get) => ({
  analyzerNode: analyzer1,
  analyzerData: {
    dataArray,
    bufferLength
  },

  oscSettings: {
    frequency: 0,
    detune: 0,
    type: '',
  },
  filterSettings: {
    frequency: 0,
    detune: 0,
    gain: 0,
    Q: 0,
    type: '',
  },

  osc1Config: {
    // frequency: osc1.frequency.value,
    detune: defaultOscConfig.detune,
    type: defaultOscConfig.type,
  },
  filter1Config: {
    frequency: filter1.frequency.value,
    detune: filter1.detune.value,
    Q: filter1.Q.value,
    gain: filter1.gain.value,
    type: filter1.type,
  },
  envelopeConfig: {
    ...defaultEnvelope
  },

  makeOsc: (frequency) => {
    const type = get().osc1Config.type;
    const detune = get().osc1Config.detune;
    const envelope = get().envelopeConfig;
    let newOsc = new Osc(actx, type, frequency, detune, envelope, gain1);
    
    oscNodes.push(newOsc);

    console.log('Make osc', frequency);
  },

  killOsc: (killFrequency) => {
    let newNodes = oscNodes.filter((node) => {
      let nodeValue = to100Precision(node.osc.frequency.value);

      console.log('Kill Osc', killFrequency);

      if(nodeValue === killFrequency) {
        node.stop();

        return false;
      }
      return true;
    });

    oscNodes = newNodes;
  },

  setOscSettings: (settings) => {
    set(() => {
      return {
        oscSettings: settings
      };
    });
  },

  /**
   * Start Playing Osc1
   */
  startOsc1: () => {
    osc1.start();
  },

  stopOsc1: () => {
    osc1.stop();
  },

  changeOsc1Config: (id, value) => {
    set((state) => {
      osc1[id].value = value

      return {
        osc1Config: {
          ...state.osc1Config,
          [id]: Number(value)
        }
      };
    });
  },

  changeOsc1Type: (value) => {
    set((state) => {
      osc1.type = value;

      return {
        osc1Config: {
          ...state.osc1Config,
          type: value
        }
      };
    });
  },

  changeFilter1Config: (id, value) => {
    set((state) => {
      filter1[id].value = value

      return {
        filter1Config: {
          ...state.filter1Config,
          [id]: Number(value)
        }
      };
    });
  },

  changeFilter1Type: (value) => {
    set((state) => {
      filter1.type = value;

      return {
        filter1Config: {
          ...state.filter1Config,
          type: value
        }
      };
    });
  },

  changeEnvelopeConfig: (id, value) => {
    set((state) => {
      return {
        envelopeConfig: {
          ...state.envelopeConfig,
          [id]: Number(value)
        }
      };
    });
  },

  setOscNote: (note) => {
    set((state) => {
      return {
        oscSettings: {
          ...state.oscSettings,
          frequency: note
        }
      }
    })
  },

  setFilterSettings: (settings) => {
    set(() => {
      return {
        filterSettings: settings
      };
    });
  },
});

export default create(
  subscribeWithSelector(
    useSynthStore
  ),
  {
    name: 'SynthStore'
  }
);
