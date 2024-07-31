import { useCallback, useEffect, useRef } from 'react';
import useSynthStore from '../../stores/useSynthStore';
import { Box } from '@mui/material';

function WaveAnalyzer(props) {
  /**
   * Refs
   */
  const canvasRef = useRef(null);
  
  /**
   * Store to get analyzer node ref
   */
  const analyzerNode = useSynthStore(state => state.analyzerNode);
  const analyzerData = useSynthStore(state => state.analyzerData);

  const paintWave = useCallback(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    canvasCtx.fillStyle = "rgb(200, 200, 200)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";
  
    const sliceWidth = (WIDTH * 1.0) / analyzerData.bufferLength;
    let x = 0;
  
    canvasCtx.beginPath();
    for (let i = 0; i < analyzerData.bufferLength; i++) {
      const v = analyzerData.dataArray[i] / 128.0;
      const y = (v * HEIGHT) / 2;
  
      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
  
      x += sliceWidth;
    }
  
    canvasCtx.lineTo(WIDTH, HEIGHT / 2);
    canvasCtx.stroke();
  }, [analyzerData]);

  const updateAnalyzer = useCallback(() => {
    analyzerNode.getByteTimeDomainData(analyzerData.dataArray);
  }, [analyzerData, analyzerNode]);

  const updateFrequency = useCallback(() => {
    updateAnalyzer();
    paintWave();

    requestAnimationFrame(updateFrequency);
  }, [updateAnalyzer,paintWave])

  useEffect(() => {
    updateFrequency();
  }, [updateFrequency])

  return (
    <Box height={props.height} width={ props.fullWidth ? '100%' : null} className="analyzer">
      <canvas style={{height: '100%', width: '100%'}} ref={canvasRef} className="analyzer-visual" />
    </Box>
  )
}

export default WaveAnalyzer;
