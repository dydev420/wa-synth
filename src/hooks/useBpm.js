import React, { useRef, useEffect, useState } from "react";
import useTimer from "./useTimer";
import useToolStore from "../stores/useToolStore";

const BEAT_NOTES = {
  0: 440,
  1: 523.251, // crossed
  2: 498.883, // crossed
  3: 587.330,
}

const MAX_VALUES = {
  bpm: 200,
};

const MIN_VALUES = {
  bpm: 20,
}

const useBpm = (callback, count = 4) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const stepRef = useRef(0);
  const lastBeatRef = useRef(1);
  const bpmRef = useRef(120);

  const volume = useToolStore((state) => state.volume);
  const setVolume = useToolStore((state) => state.setVolume);
  const tempoConfig = useToolStore((state) => state.tempoConfig);
  const setTempo = useToolStore((state) => state.setTempo);
  const makeBeat = useToolStore((state) => state.makeBeat);
  const killAllBeats = useToolStore((state) => state.killAllBeats);
  // const killBeat = useToolStore((state) => state.killBeat);

  const { timeRef, startTimer, stopTimer } = useTimer((time) => {
    // skip for 0 bpm
    if(bpmRef.current === 0) {
      killAllBeats();
      return;
    }
    const interval = 60000 / bpmRef.current;

    console.log('#### bpm', bpmRef.current);
    if (lastBeatRef.current && (time - lastBeatRef.current >= interval)) {
      console.log('Beat!');
      lastBeatRef.current = time;
      
      if (stepRef?.current >= count - 1) {
        stepRef.current = 0;
      } else {
        stepRef.current += 1;
      }
      
      console.log('Beat!' , stepRef.current, isPlaying);
      killAllBeats();
      makeBeat(BEAT_NOTES[stepRef.current]);
    }    
    callback(time, stepRef.current);
  });

  const resetBpm = () => {
    stepRef.current = 0;
    lastBeatRef.current = 1;
  }

  const startBpm = () => {
    setIsPlaying(true);
    startTimer();
    resetBpm()
  }

  const stopBpm = () => {
    setIsPlaying(false);
    stopTimer();
    killAllBeats();
  }

  const configureTempo = (config) => {
    setTempo(config);
  }

  const increaseBpm = (amount = 1) => {
    if(tempoConfig.bpm < MAX_VALUES.bpm) {
      setTempo({
        ...tempoConfig,
        bpm: tempoConfig.bpm + amount
      });
    }
  }

  const decreaseBpm = (amount = 1) => {
    if(tempoConfig.bpm > MIN_VALUES.bpm) {
      setTempo({
        ...tempoConfig,
        bpm: tempoConfig.bpm - amount
      });
    }
  }

  const setBpm = (amount = 100) => {
    let newBpm = amount;
    if(amount < MIN_VALUES.bpm && amount.bpm < 100) {
      newBpm = MIN_VALUES.bpm;
    }

    if (amount > MAX_VALUES.bpm && amount.bpm > 100) {
      newBpm = MAX_VALUES.bpm;
    }

    setTempo({
      ...tempoConfig,
      bpm: newBpm,
    });
  }

  useEffect(() => {
    const bpmSubscribe = useToolStore.subscribe(
      (state) => state.tempoConfig.bpm,
      (bpm) => {
        bpmRef.current = bpm;
      }
    )

    return () => {
      bpmSubscribe();
    }
  });

  return {
    timeRef,
    stepRef,
    tempoConfig,
    volume,
    setVolume,
    configureTempo,
    increaseBpm,
    decreaseBpm,
    setBpm,
    startBpm,
    stopBpm,
  };
};

export default useBpm;
