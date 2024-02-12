class OscFactory {
  constructor(
    actx,
    type,
    frequency,
    detune,
    envelope,
    connection
  ) {
    this.actx = actx;
    
    this.envelope = envelope || {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.6,
      release: 0.1,
    };
    this.easing = 0.005;

    this.osc = actx.createOscillator();
    this.osc.frequency.value = frequency;
    this.osc.detune.value = detune;
    this.osc.type = type;
    
    this.gateGain = actx.createGain();
    this.gateGain.gain.value = 0;
    
    this.osc.connect(this.gateGain);
    this.gateGain.connect(connection);

    this.osc.start();
    this.start();
  }

  start() {
    let { currentTime } = this.actx;

    let easeEnd = currentTime + this.easing;
    let attackEnd = easeEnd + this.envelope.attack;
    let decayEnd = attackEnd + this.envelope.decay;

    this.gateGain.gain.cancelScheduledValues(currentTime);
    this.gateGain.gain.setValueAtTime(0, easeEnd);
    this.gateGain.gain.linearRampToValueAtTime(1, attackEnd);
    this.gateGain.gain.linearRampToValueAtTime(
      this.envelope.sustain,
      decayEnd
    );

  }

  stop() {
    let { currentTime } = this.actx;
    let releaseEnd =  this.easing + this.envelope.release;

    this.gateGain.gain.cancelScheduledValues(currentTime);
    this.gateGain.gain.setTargetAtTime(0, currentTime, releaseEnd);

    // Destroy Oscillator after 5sec
    setTimeout(() => {
      this.osc.disconnect();
    }, 5000);
  }
}

export default OscFactory;