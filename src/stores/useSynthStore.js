import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// import Osc from '../classes/Osc';
import { to100Precision } from '../utils/notes';
import Osc from '../classes/Osc';

const actx = new window.AudioContext();

const osc1 = actx.createOscillator();
const gain1 = actx.createGain();
const filter1 = actx.createBiquadFilter();
const analyzer1 = actx.createAnalyser();

analyzer1.fftSize = 2048;

/**
 * Analyzer code
 */
const bufferLength = analyzer1.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);


osc1.connect(gain1);
gain1.connect(filter1);
// gain1.connect(analyzer1);
filter1.connect(analyzer1);
analyzer1.connect(actx.destination);

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
