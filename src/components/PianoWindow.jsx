// import '../styles/scroll-piano.scss';

import { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes  from 'prop-types';
import { Box, Typography } from '@mui/material';
import { getFreqForOctaveAtStep } from '../utils/notes';
import { REFERENCE_OCTAVE } from '../utils/constants';
import { simulateKey } from '../utils/playback';
import useSynthStore from '../stores/useSynthStore';
import useKeyRecorder from '../hooks/useKeyRecorder';
import useKeyPlayer from '../hooks/useKeyPlayer';
import useAnimationFrame from '../hooks/useAnimationFrame';

const notes = [
  'C',
  'D',
  'E',
  'F',
  'G',
  'A',
  'B'
];

const octaves = [
  // 0,
  // 1,
  2,
  3,
  4,
  5,
  6,
  // 7,
  // 8
];

const pianoNoteMap = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30 ,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88
};

const noteStepMap = {
  'C': -9,
  'C#': -8,
  'D': -7,
  'D#': -6,
  'E': -5,
  'F': -4,
  'F#': -3,
  'G': -2,
  'G#': -1 ,
  'A': 0,
  'A#': 1,
  'B': 2
};

const pianoKeyboardMap = {
 'KeyQ': 'C',
 'KeyW': 'C#',
 'KeyE': 'D',
 'KeyR': 'D#',
 'KeyT': 'E',
 'KeyY': 'F',
 'KeyU': 'F#',
 'KeyI': 'G',
 'KeyO': 'G#',
 'KeyP': 'A',
 'BracketLeft': 'A#',
 'BracketRight': 'B'
};

function PianoWindow() {
  /**
   * State
   */
  const [activeOctave, setActiveOctave] = useState(REFERENCE_OCTAVE);
  const [activeHover, setActiveHover] = useState(null);

  const keysDomRef = useRef(null);
  const pressedKeys = useRef([]);

  /**
   * Synth Store
   */
  const makeOsc = useSynthStore(state => state.makeOsc);
  const killOsc = useSynthStore(state => state.killOsc);

  /**
   * Keys Recorder & Player hooks
   */
  const { recordKeyOnPress } = useKeyRecorder();
  const { timeRef: playerTimeRef, playKeyOnTime } = useKeyPlayer();

  /**
   * Methods
   */

  /**
   * Scrolls C4 key into view on load with B4 as padding
   */
  const scrollToB4 = () => {
    const keyElement = keysDomRef.current.querySelector(`[data-note=\'B\'][data-octave=\'4\']`);

    keyElement.scrollIntoView();
  }

  /**
   * Update piano key style on piano key press/release
   */
  const updateKeyStyle = (note, octave, isPressed) => {
    const keyElement = keysDomRef.current.querySelector(`[data-note=\'${note}\'][data-octave=\'${octave}\']`);
    const isSharp = note.includes('#');
    
    if(isPressed) {
      keyElement.style.background = isSharp ? '#777': '#555';
    } else {
      keyElement.style.background = isSharp ? '#000': '#CCC';
    }
  }

  const handleKeyPress = (note, octave, isSimulated) => {
    const octaveFreq = getFreqForOctaveAtStep(octave, noteStepMap[note]);

    updateKeyStyle(note, octave, true);

    makeOsc(octaveFreq);

    // Update last Active Octave
    if(octave !== activeOctave) {
      setActiveOctave(octave);
    }

    if(activeHover !== `${note}${octave}`) {
      setActiveHover(`${note}${octave}`)
    }

    // record key
    if(!isSimulated) {
      recordKeyOnPress({ note, octave, type: 'press' });
    }
  }

  
  const handleKeyRelease = (note, octave, isSimulated = false) => {
    const octaveFreq = getFreqForOctaveAtStep(octave, noteStepMap[note]);

    updateKeyStyle(note, octave, false);

    killOsc(octaveFreq);

    // record key
    if(!isSimulated) {
      recordKeyOnPress({ note, octave, type: 'release' });
    }
  }

  const handleKeyHover = (event) => {
    event.stopPropagation();    

    if(event.buttons === 1 ||  event.buttons === 2) {
      const note = event.target.getAttribute('data-note');
      const octave = Number(event.target.getAttribute('data-octave'));

      if(activeHover !== `${note}${octave}`) {
        handleKeyPress(note, octave); 
      }
    }
  }

  /**
   * Keyboard input keydown is buggy for holding pressed keys
   * 
   * Stores pressed keys in ref array
   */
  const handleKeyboardInputDown = useCallback((event) => {
    const code = event.code;

    const isHolding = !!pressedKeys.current.find(key => key === code);

    if(isHolding) {
      console.log('HOLDING ', code);

      return;
    } else {
      const note = pianoKeyboardMap[code];

      pressedKeys.current.push(code)
  
      if(note) {
        handleKeyPress(note, activeOctave);
      }
    }
    
  }, []);

  /**
   * Keyboard input keydown is buggy for holding pressed keys
   * 
   * Removes released keys from ref array
   */
  const handleKeyboardInputUp = useCallback((event) => {
    const code = event.code;

    pressedKeys.current = pressedKeys.current.filter(key => key !== code);

    const note = pianoKeyboardMap[code];

    if(note) {
      handleKeyRelease(note, activeOctave);
    }
  }, []);

  useEffect(() => {
    scrollToB4();

    window.addEventListener('keydown', handleKeyboardInputDown);
    window.addEventListener('keyup', handleKeyboardInputUp);

    return () => {
      window.removeEventListener('keydown', handleKeyboardInputDown)
      window.removeEventListener('keyup', handleKeyboardInputUp);
    }
  }, [handleKeyboardInputDown, handleKeyboardInputUp]);


  // Check recorded keys every frame to simulate keys playback
  useAnimationFrame(() => {
    const keyToPlay = playKeyOnTime(playerTimeRef.current);
    if (keyToPlay) {
      simulateKey(keyToPlay, handleKeyPress, handleKeyRelease);
    }
  });

  return (
    <Box
      ref={keysDomRef}
      className="scroll-piano scroll-piano--snaps-inline"
      // direction="row"
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: '95%',
        overflowX: 'auto',
        outline: '2px solid black',
        overscrollBehaviorInline: 'contain'
      }}
      onMouseOut={() => { setActiveHover(null); }}
    >
      {
        octaves.map((octave) => {
          return (
            <Box
              key={octave}
              className="scroll-piano__octave"
              direction="row"
              width="100%"
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                gridAutoColumns: '1fr'
              }}
            >
              {
                notes.map((note) => {
                  const hasSharp = note !== 'E' && note !== 'B';
                  const sharpNote = `${note}#`;
                  const octNote = `${note}${octave}`;
                  const octSharpNote = `${note}${octave}#`;
        
                  return(
                    <Box
                      draggable={false}
                      key={note}
                      data-note={note}
                      data-octave={octave}
                      className="scroll-piano__key"
                      onMouseDown={(event) => {
                        event.stopPropagation();
                        handleKeyPress(note, octave);
                      }}
                      onMouseUp={() => { handleKeyRelease(note, octave); }}
                      onMouseOut={() => { handleKeyRelease(note, octave); }}
                      onMouseOver={handleKeyHover}
                      onTouchStart={(event) => {
                        event.stopPropagation();
                        handleKeyPress(note, octave);
                      }}
                      onTouchEnd={() => { handleKeyRelease(note, octave); }}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                        height: '100%',
                        background: '#cccccc',
                        outline: '1px solid black',
                        userSelect: 'none',
                      }}
                    >
                      {
                        octNote.startsWith('C') && (    
                          <Typography
                            width="100%"
                            textAlign="center"
                            fontWeight="bold"
                            // fontSize="small"
                            color='primary.dark'
                            alignSelf="flex-end"
                          >
                            {octNote}
                          </Typography>
                        )
                      }
                      {
                        hasSharp &&
                          <Box
                            key={sharpNote}
                            data-note={sharpNote}
                            data-octave={octave}
                            className="scroll-piano__key--black"
                            onMouseDown={(event) => {
                              event.stopPropagation();
                              handleKeyPress(sharpNote, octave);
                            }}
                            onMouseUp={() => { handleKeyRelease(sharpNote, octave); }}
                            onMouseLeave={() => { handleKeyRelease(sharpNote, octave); }}
                            // onMouseMoveCapture={handleKeyHover}
                            onMouseOver={handleKeyHover}

                            onTouchStart={(event) => {
                              event.stopPropagation();
                              handleKeyPress(sharpNote, octave);
                            }}
                            onTouchEnd={() => { handleKeyRelease(sharpNote, octave); }}
                            sx={{
                              position: 'absolute',
                              height: '60%',
                              width: '60%',
                              transform: 'translateX(50%)',
                              background: 'black',
                              color: 'white',
                              textAlign: 'center',
                              zIndex: 10,
                              userSelect: 'none',
                              borderBottomRightRadius: '8px',
                              borderBottomLeftRadius: '8px',
                            }}
                          >
                            {/* <Typography
                              // fontWeight="bold"
                              textAlign="center"
                              fontSize="small"
                              color='primary.light'
                            >
                              {octSharpNote}
                            </Typography> */}
                          </Box>
                      }
                    </Box>
                  )
                })
              }
            </Box>
          )
        })
      }
    </Box>
  )
}

PianoWindow.propTypes = {
  onFrequencyChange: PropTypes.func,
}

export default PianoWindow;
