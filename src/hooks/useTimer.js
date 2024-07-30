import React, { useRef, useState, useEffect } from "react";

const useTimer = callback => {
  const [start, setStart] = useState(false);
  const startTimeRef = useRef(false);
  const prevTimeRef = useRef(null);
  const timeRef = useRef(null);
  const intervalRef = useRef(null);

  const setTimer = () => {
    console.log('Setting timer');
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      let deltaTime = 16.6666666667; // default 60fps to avoid 0 delta value issues
      const nowTime = Date.now();
      if(prevTimeRef.current !== undefined) {
        deltaTime = nowTime - prevTimeRef.current;
        timeRef.current = ((prevTimeRef.current + deltaTime) - startTimeRef.current);
        callback(timeRef.current, deltaTime);
      }
      prevTimeRef.current = nowTime;
    }, 10);
  }

  const removeTimer = () => {
    if (intervalRef.current) {
      console.log('Removing timer');
      clearInterval(intervalRef.current);
    }
    intervalRef.current = null;
  }

  const stopTimer = () => {
    setStart(false);
  }

  const startTimer = () => {
    setStart(true);
  }


  useEffect(() => {
    if (start) {
      setTimer();
    }
    if (!start && intervalRef.current) {
      removeTimer();
    }
  }, [start]);

  return {
    timeRef,
    startTimer,
    stopTimer,
  }
};

export default useTimer;