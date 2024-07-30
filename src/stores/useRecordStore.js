import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useRecordStore = (set, get) => ({
  keys: {},
  saved: false,
  isRecordingKeys: false,
  isPlayingKeys: false,

  // Only use with subscribe selector, updates every frame when running
  recordTime: 0,
  playTime: 0,
  looping: false,
  
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
        saved: false,
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

  startLoop: () => {
    set(() => ({
      looping: true,
    }));
  },
  stopLoop: () => {
    set(() => ({
      looping: false,
    }));
  },

  setRecordTime: (time) => {
    set(() => {
      return {
        recordTime: time,
      }
    });
  },

  setPlayTime: (time) => {
    set((state) => {
      if(state.looping && state.recordTime) {
        return {
          playTime: time % state.recordTime
        };
      }

      return {
        playTime: time,
      }
    });
  },

  resetRecorder: () => {
    set(() => {
      return {
        keys: {},
        recordTime: 0,
      }
    })
  },

  resetPlayTime: () => {
    set((state) => {
      return {
        playLoopTime: state.playTime,
        playTime: 0,
      }
    })
  },

  saveRecording: () => {
    set((state) => {
      window.localStorage.setItem('key-track-0', JSON.stringify(state.keys))

      return {
        saved: true,
      }
    })
  },

  loadRecording: () => {
    set(() => {
      const previousSave = window.localStorage.getItem('key-track-0');

      if (previousSave) {
        try {
          return {
            keys: JSON.parse(previousSave),
            saved: true,
          }
        } catch {
          return {};
        }
      }

      return {};
    })
  },

  deleteRecording: () => {
    set(() => {
      const previousSave = window.localStorage.getItem('key-track-0');
      
      if (previousSave) {
        window.localStorage.removeItem('key-track-0');
      }
      return {
        keys: {},
        saved: false,
      };
    })
  }
});


export default create(
  subscribeWithSelector(
    useRecordStore
  ),
  {
    name: 'RecordStore'
  }
);