import { KEY_EVENT_TYPES } from "./enums/player";

export const getRoundedPlaybackTime = (time) => {
  return Math.round(time / 10);
};

export const simulateKey = (keyInfo, onPress, onRelease) => {
  if (keyInfo?.type === KEY_EVENT_TYPES.PRESS) {
    return onPress(keyInfo.note, keyInfo.octave, true);
  }
  if (keyInfo?.type === KEY_EVENT_TYPES.RELEASE) {    
    return onRelease(keyInfo.note, keyInfo.octave, true);
  }
};
