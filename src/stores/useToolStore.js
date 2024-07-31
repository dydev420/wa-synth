import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware';

import { to100Precision } from '../utils/notes';
import Osc from '../classes/Osc';

const actx = new window.AudioContext();
// Pipeline nodes
const mainAudioSource = actx.createOscillator();
const mainVolume = actx.createGain();
// Main Audio Destination Node
const mainBus = actx.createGain();


/**
 * Audio Pipeline
*/
mainAudioSource.connect(mainVolume);

// Set Default volums
mainVolume.gain.value = 0.5;
mainVolume.connect(mainBus);

// Main Destination connection
mainBus.connect(actx.destination);


const defaultEnvConfig = {
  attack: 0.001,
  decay: 0.1,
  sustain: 0.2,
  release: 0.1,
} 

const defaultOscConfig = {
  type: 'sine',
  detune: 0,
};

const defaultTempoConfig = {
  bpm: 120,
  beatsPerMeasure: 4,
  countsPerMeasure: 3,
};

let beatNodes = [];

const useToolStore = (set, get) => ({
  active: true,
  volume: 0.5,
  tempoConfig: {
    ...defaultTempoConfig
  },

  setVolume: (amount) => {
    set(() => {
      mainVolume.gain.value = amount;
      return {
        volume: amount,
      }
    });
  },

  setTempo: (config = {}) => {
    set(state => ({
      tempoConfig: {
        ...state.tempoConfig,
        ...config,
      }
    })); 
  },

  makeBeat: (frequency) => {
    const type = defaultOscConfig.type;
    const detune = defaultOscConfig.detune;
    const envelope = {...defaultEnvConfig };
    let newBeat = new Osc(actx, type, frequency, detune, envelope, mainVolume);
    
    beatNodes.push(newBeat);

    console.log('Make beat', frequency);
  },

  killBeat: (killFrequency) => {
    let newBeatNodes = beatNodes.filter((node) => {
      let beatFreq = to100Precision(node.osc.frequency.value);

      console.log('Kill beat', killFrequency);

      if(beatFreq === killFrequency) {
        node.stop();

        return false;
      }
      return true;
    });

    beatNodes = newBeatNodes;
  },

  killAllBeats: () => {
    beatNodes.forEach((node) => {
      node.stop();
    });
    beatNodes = [];
  },
});

export default create(
  subscribeWithSelector(
    useToolStore
  ),
  {
    name: 'ToolStore'
  }
);
