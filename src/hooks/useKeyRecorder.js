import React, { useRef, useEffect } from "react";
import useTimer from "./useTimer";
import useRecordStore from "../stores/useRecordStore";
import { RECORDER_STATUS } from "../utils/enums/recorder";
import { getRoundedPlaybackTime } from "../utils/playback";


const useKeyRecorder = () => {
  // Store
  const isRecordingKeys = useRecordStore(state => state.isRecordingKeys);
  const recordKey = useRecordStore(state => state.recordKey);
  const startKeyRecord = useRecordStore(state => state.startKeyRecord);
  const stopKeyRecord = useRecordStore(state => state.stopKeyRecord);
  const setRecordTime = useRecordStore(state => state.setRecordTime);

  const recordTick = (time) => {
    setRecordTime(time);
  };

   // Record Timer
   const {
    timeRef: recordTimeRef,
    startTimer: startRecordTimer,
    stopTimer: stopRecordTimer,
  } = useTimer(recordTick);

  const recorderStatus = useRef(RECORDER_STATUS.IDLE);
  const timeRef = useRef(0);

  const startRecording = () => {
    // set global key recording flag in store
    startKeyRecord();
    // start local timer hook
    startRecordTimer();
    // set local recording status
    recorderStatus.current = RECORDER_STATUS.RECORDING;
  };
  const stopRecording = () => {
    stopRecordTimer();
    stopKeyRecord();
    recorderStatus.current = RECORDER_STATUS.STOPPED;
  };

  const recordKeyOnPress = (keyId) => {
    const playbackTime = getRoundedPlaybackTime(timeRef.current);
    if (isRecordingKeys) {
      recordKey(keyId, playbackTime);
    }
  };

  useEffect(() => {
    const recordTimeSubscribe = useRecordStore.subscribe(
      (state) => state.recordTime,
      (recordTime) =>{
        timeRef.current = recordTime;
      },
    );

    return () => {
      recordTimeSubscribe();
    }
  }, []);

  return {
    isRecordingKeys,
    recorderStatus,
    timeRef,
    recordTimeRef,
    startRecording,
    stopRecording,
    recordKeyOnPress,
  }
};

export default useKeyRecorder;