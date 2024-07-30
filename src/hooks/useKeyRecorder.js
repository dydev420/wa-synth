import React, { useRef, useEffect, useState } from "react";
import useTimer from "./useTimer";
import useRecordStore from "../stores/useRecordStore";
import { RECORDER_STATUS } from "../utils/enums/recorder";
import { getRoundedPlaybackTime } from "../utils/playback";


const useKeyRecorder = () => {
  // Store
  const isRecordingKeys = useRecordStore(state => state.isRecordingKeys);
  const saved = useRecordStore(state => state.saved);
  const recordKey = useRecordStore(state => state.recordKey);
  const startKeyRecord = useRecordStore(state => state.startKeyRecord);
  const stopKeyRecord = useRecordStore(state => state.stopKeyRecord);
  const setRecordTime = useRecordStore(state => state.setRecordTime);
  const resetRecorder = useRecordStore(state => state.resetRecorder);
  const saveRecording = useRecordStore(state => state.saveRecording);
  const loadRecording = useRecordStore(state => state.loadRecording);
  const deleteRecording = useRecordStore(state => state.deleteRecording);

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
    saveRecording();
    recorderStatus.current = RECORDER_STATUS.STOPPED;
  };

  const resetRecording = () => {
    resetRecorder();
    deleteRecording();
    timeRef.current = 0;
  };

  const recordKeyOnPress = (keyId) => {
    const playbackTime = getRoundedPlaybackTime(timeRef.current);
    if (isRecordingKeys) {
      recordKey(keyId, playbackTime);
    }
  };

  useEffect(() => {
    // try to load existing recoding on mount
    loadRecording();

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
    saved,
    startRecording,
    stopRecording,
    resetRecording,
    recordKeyOnPress,
  }
};

export default useKeyRecorder;