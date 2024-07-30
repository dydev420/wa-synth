import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useRecordStore = (set, get) => ({
  keys: {},
  isRecordingKeys: false,
  isPlayingKeys: false,

  // Only use with subscribe selector, updates every frame when running
  recordTime: 0,
  playTime: 0,
  
  recordKey: (keyId, time) => {
    set((state) => {
      return {
        keys: {
          ...state.keys,
          [time]: [...(state.keys[time] ?? []), keyId],
        }, 
      };
    });
  },

  startKeyRecord: () => {
    set(() => {
      return {
        isRecordingKeys: true,
      }
    })
  },

  stopKeyRecord: () => {
    set(() => {
      return {
        isRecordingKeys: false,
      };
    });
  },

  startKeyPlay: () => {
    set(() => {
      return {
        isPlayingKeys: true,
      }
    })
  },

  stopKeyPlay: () => {
    set(() => {
      return {
        isPlayingKeys: false,
      };
    });
  },

  setRecordTime: (time) => {
    set(() => {
      return {
        recordTime: time,
      }
    });
  },

  setPlayTime: (time) => {
    set(() => {
      return {
        playTime: time,
      }
    });
  },
});


export default create(
  subscribeWithSelector(
    useRecordStore
  ),
  {
    name: 'RecordStore'
  }
);