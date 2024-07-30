import React, { useRef, useEffect } from "react";
import useTimer from "./useTimer";
import useRecordStore from "../stores/useRecordStore";
import { PLAYER_STATUS } from "../utils/enums/player";
import { getRoundedPlaybackTime } from "../utils/playback";

const useKeyPlayer = () => {
  const isPlayingKeys = useRecordStore(state => state.isPlayingKeys);
  const startKeyPlay = useRecordStore(state => state.startKeyPlay);
  const stopKeyPlay = useRecordStore(state => state.stopKeyPlay);
  const setPlayTime = useRecordStore(state => state.setPlayTime);

  const playerStatus = useRef(PLAYER_STATUS.IDLE);
  const timeRef = useRef(0);
  const keysRef = useRef([]);

  const playerTick = (time) => {
    setPlayTime(time);
  };

  // Play Timer
  const {
    timeRef: playTimeRef,
    startTimer: startPlayTimer,
    stopTimer: stopPlayTimer,
  } = useTimer(playerTick);

  const setPlayerStatus = (status) => {
    playerStatus.current = status;
  }

  const startPlaying = () => {
    // Update global key playing flag in store
    startKeyPlay();
    // start local useTimer hook
    startPlayTimer();
    // update local playing status
    setPlayerStatus(PLAYER_STATUS.PLAYING);
  };
  const stopPlaying = () => {
    stopPlayTimer();
    stopKeyPlay();
    setPlayerStatus(PLAYER_STATUS.STOPPED);
  };

  const playKeyOnTime = (time) => {
    const playbackTime = getRoundedPlaybackTime(time);
    const foundKeys = keysRef.current?.[playbackTime];

    if(!playerStatus.current === PLAYER_STATUS.PLAYING || !foundKeys) {
      return null;
    }

    return foundKeys;
  }

  // Time state subscribe
  useEffect(() => {
    const playTimeSubscribe = useRecordStore.subscribe(
      (state) => state.playTime,
      (playTime) =>{
        timeRef.current = playTime;
      },
    );

    const keysSubscribe = useRecordStore.subscribe(
      (state) => state.keys,
      (keys) => {
        keysRef.current = {...keys };
      },
    );

    return () => {
      playTimeSubscribe();
      keysSubscribe();
    }
  }, []);

  return {
    isPlayingKeys,
    timeRef,
    playTimeRef,
    startPlaying,
    stopPlaying,
    playKeyOnTime,
  }
};

export default useKeyPlayer;